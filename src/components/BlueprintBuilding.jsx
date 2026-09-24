import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import a14Model from '@/data/a14Model';
import { buildBuilding, setGroupOpacity } from '@/lib/buildingScene';

/**
 * BlueprintBuilding — scroll-driven "vom Plan zum Gebäude" story.
 * A floor plan draws itself (top view), the camera tilts and the walls rise,
 * then the upper floors, windows and roof stack up while the model rotates.
 * The geometry comes from a real project plan (default: A14 / N's Hotel,
 * traced from the Baueingabepläne). three.js is loaded lazily.
 */

const STEPS = [
  {
    no: '01',
    title: 'Grundriss',
    sheet: 'Grundriss EG',
    text: 'Jedes Projekt beginnt mit einem klaren Plan: Raumprogramm, Lichtführung und Wege — präzise gezeichnet, bevor der erste Stein gesetzt wird.',
  },
  {
    no: '02',
    title: '3D-Modell',
    sheet: 'Modell',
    text: 'Aus dem Plan entsteht ein räumliches Modell. So sehen Bauherren früh, wie Räume wirken — und Entscheidungen fallen sicherer.',
  },
  {
    no: '03',
    title: 'Realisierung',
    sheet: 'Ansicht',
    text: 'Wir begleiten den Bau bis zur Schlüsselübergabe — mit Kosten, Terminen und Qualität im Blick.',
  },
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function BlueprintBuilding({ model = a14Model }) {
  const sectionRef = useRef(null);
  const mountRef = useRef(null);
  const progressRef = useRef(0);
  const [step, setStep] = useState(0);
  const [showDims, setShowDims] = useState(true);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progressRef.current = v;
    setStep(v < 0.3 ? 0 : v < 0.62 ? 1 : 2);
    setShowDims(v < 0.34);
  });

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    Promise.all([import('three'), import('three/examples/jsm/utils/BufferGeometryUtils.js')]).then(([THREE, { mergeGeometries }]) => {
      if (disposed || !mountRef.current) return;
      const el = mountRef.current;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return; // no WebGL: the blueprint background + texts still tell the story
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, el.clientWidth / el.clientHeight, 0.1, 200);

      // Ground grid
      const grid = new THREE.GridHelper(60, 60, 0x6f93d6, 0x3d5f9e);
      grid.material.transparent = true;
      grid.material.opacity = 0.25;
      grid.position.y = -0.01;
      scene.add(grid);

      // Building from plan data
      const bld = buildBuilding(THREE, model, { style: 'blueprint', scale: 0.42, mergeGeometries });
      scene.add(bld.root);
      bld.levels.forEach((lv) => {
        lv.walls.visible = false;
        lv.walls.scale.y = 0.0001;
        lv.slabs.forEach((sl) => { sl.visible = false; });
      });
      const LEVELS = bld.levels.length;

      // Pointer parallax
      let mx = 0, my = 0;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const onResize = () => {
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(el);

      // Only render while the section is on screen
      let visible = true;
      const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: '100px' });
      io.observe(el);

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const narrow = () => el.clientWidth < 700;
      let p = 0, spin = 0, pmx = 0, pmy = 0, raf;
      const target = new THREE.Vector3();

      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        p += (progressRef.current - p) * 0.08;
        pmx += (mx - pmx) * 0.05;
        pmy += (my - pmy) * 0.05;

        const s1 = clamp01(p / 0.28);
        const s2 = ease(clamp01((p - 0.26) / 0.34));
        const s3 = clamp01((p - 0.58) / 0.36);

        bld.plan.geo.setDrawRange(0, Math.floor(bld.plan.count * s1) & ~1);
        bld.plan.mat.opacity = 1 - 0.55 * s3;

        bld.levels.forEach((lv, l) => {
          const t = l === 0 ? s2 : ease(clamp01(s3 * LEVELS - (l - 1)));
          lv.walls.visible = t > 0.001;
          lv.walls.scale.y = Math.max(0.0001, t);
          const topT = l === 0 ? ease(clamp01(s3 * LEVELS)) : ease(clamp01(s3 * LEVELS - l + 0.3));
          lv.slabs.forEach((sl) => {
            sl.visible = topT > 0.02;
            sl.position.y = sl.userData.baseY + (1 - topT) * 2;
            setGroupOpacity(sl, topT, 0.12);
          });
        });

        if (!reduceMotion) spin += s2 > 0.5 ? 0.0016 : 0;
        const elev = THREE.MathUtils.degToRad(89 - 57 * s2 + pmy * 4 * s2);
        const azim = THREE.MathUtils.degToRad(35 * s2) + spin + pmx * 0.12 * s2;
        const radius = narrow() ? 54 - 2 * s2 : 30 + 2 * s2;
        // On phones the copy sits in the lower half, so aim below the model to lift it up
        target.set(0, (bld.height / 2) * s3 - (narrow() ? 7 : 0), narrow() ? 6 * (1 - s2) : 0);
        camera.position.set(
          target.x + radius * Math.cos(elev) * Math.sin(azim),
          target.y + radius * Math.sin(elev),
          target.z + radius * Math.cos(elev) * Math.cos(azim),
        );
        camera.lookAt(target);
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener('pointermove', onMove);
        bld.dispose();
        grid.geometry.dispose();
        grid.material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => {});

    return () => { disposed = true; cleanup(); };
  }, []);

  const current = STEPS[step];

  return (
    <section ref={sectionRef} className="relative h-[280vh] md:h-[320vh] bg-[#0E2350]">
      <div className="sticky top-0 h-[100svh] overflow-hidden text-white">
        {/* Blueprint paper: fine + major grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#0E2350',
            backgroundImage:
              'linear-gradient(rgba(160,190,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(160,190,255,0.10) 1px, transparent 1px), linear-gradient(rgba(160,190,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(160,190,255,0.05) 1px, transparent 1px)',
            backgroundSize: '120px 120px, 120px 120px, 24px 24px, 24px 24px',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,20,48,0.7)_100%)]" aria-hidden="true" />

        {/* 3D canvas */}
        <div
          ref={mountRef}
          className="absolute inset-0 md:left-[34%]"
          role="img"
          aria-label="Animiertes 3D-Modell: vom Grundriss zum fertigen Gebäude"
        />

        {/* Dimension labels (plan stage) */}
        <AnimatePresence>
          {showDims && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute right-6 top-24 md:top-28 font-mono text-[11px] tracking-widest text-blue-100/70 space-y-1 text-right"
            >
              {model.facts.map((f) => (
                <p key={f.label}>{f.label}: {f.value}</p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Copy + steps */}
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-end md:justify-center pb-28 md:pb-0 pointer-events-none">
          <div className="max-w-sm pointer-events-auto">
            <p className="text-[11px] font-semibold tracking-hairline uppercase text-blue-100/70 mb-1">Vom Plan zum Gebäude</p>
            <p className="font-mono text-[11px] text-blue-100/50 mb-4">Projekt: {model.name}, {model.address}</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.no}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="bg-[#0E2350]/70 md:bg-transparent backdrop-blur-sm md:backdrop-blur-0 p-4 -m-4 md:p-0 md:m-0"
              >
                <p className="font-mono text-sm text-blue-100/60 mb-2">{current.no} / 03</p>
                <h2 className="font-display uppercase text-5xl md:text-6xl font-semibold leading-none mb-4">{current.title}</h2>
                <p className="text-blue-50/80 leading-relaxed">{current.text}</p>
              </motion.div>
            </AnimatePresence>

            <div className="hidden md:flex gap-2 mt-10">
              {STEPS.map((s, i) => (
                <span key={s.no} className="h-[3px] w-12 bg-white/20 overflow-hidden">
                  <motion.span
                    className="block h-full bg-white"
                    animate={{ width: i <= step ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Architectural title block */}
        <div className="absolute right-4 bottom-4 md:right-6 md:bottom-6 border border-blue-100/40 font-mono text-[10px] md:text-[11px] text-blue-50/80 bg-[#0E2350]/60 backdrop-blur-sm">
          <div className="px-3 py-2 border-b border-blue-100/30 font-sans font-semibold tracking-[0.2em]">AMONN ARCHITEKTUR</div>
          <div className="px-3 py-1.5 border-b border-blue-100/30">{model.name} · {model.address.split(',')[0]}</div>
          <div className="grid grid-cols-2">
            <div className="px-3 py-1.5 border-r border-blue-100/30">Plan: {current.sheet}</div>
            <div className="px-3 py-1.5">{model.scale}</div>
            <div className="px-3 py-1.5 border-r border-t border-blue-100/30">Blatt {current.no}/03</div>
            <div className="px-3 py-1.5 border-t border-blue-100/30">{model.address.split(',')[1]?.trim() || model.address}</div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.p
          className="absolute left-1/2 -translate-x-1/2 bottom-6 hidden md:block text-[11px] tracking-hairline uppercase text-blue-100/50"
          animate={{ opacity: step === 2 ? 0 : 1 }}
        >
          Scrollen
        </motion.p>
      </div>
    </section>
  );
}
