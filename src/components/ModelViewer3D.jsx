import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Rotate3d, Layers3 } from 'lucide-react';
import { BUILDING_MODELS } from '@/data/models';
import { buildModel } from '@/lib/modelScene';

/**
 * ModelViewer3D — interactive architectural model generated from CAD plans.
 *  • project switch (when several model ids are given)
 *  • floor cutaway (Gesamt / EG / 1. OG …) and exploded view
 *  • build-up animation when it first comes into view, soft shadows, PBR light
 */
export default function ModelViewer3D({ ids = ['a14'], className = '' }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ level: 'all', explode: false });
  const apiRef = useRef(null);
  const [modelId, setModelId] = useState(ids[0]);
  const [level, setLevel] = useState('all');
  const [explode, setExplode] = useState(false);
  const [levels, setLevels] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | failed
  const meta = BUILDING_MODELS[modelId];

  useEffect(() => { stateRef.current.level = level; }, [level]);
  useEffect(() => { stateRef.current.explode = explode; }, [explode]);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    setStatus('loading');
    setLevel('all');
    setExplode(false);

    Promise.all([
      import('three'),
      import('three/examples/jsm/controls/OrbitControls.js'),
      import('three/examples/jsm/utils/BufferGeometryUtils.js'),
      import('three/examples/jsm/environments/RoomEnvironment.js'),
      meta.load(),
    ]).then(([THREE, { OrbitControls }, { mergeGeometries }, { RoomEnvironment }, data]) => {
      if (disposed || !mountRef.current) return;
      const el = mountRef.current;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setStatus('failed');
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.style.touchAction = 'pan-y';
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(32, el.clientWidth / el.clientHeight, 0.1, 500);

      scene.add(new THREE.HemisphereLight(0xffffff, 0xe9e2d4, 0.9));
      const sun = new THREE.DirectionalLight(0xfff6ea, 2.2);
      sun.position.set(-16, 26, 14);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 90 });
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.02;
      scene.add(sun);

      const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.ShadowMaterial({ opacity: 0.16 }));
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const bld = buildModel(THREE, mergeGeometries, data, { style: 'model', scale: 0.4 });
      scene.add(bld.root);
      bld.plan.mat.opacity = 0; // plan lines only in cutaway mode
      setLevels(bld.levels.map((l) => ({ label: l.label, rooms: l.rooms })));

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = 0.2;
      controls.maxPolarAngle = Math.PI / 2.1;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      controls.autoRotate = !reduce;
      controls.autoRotateSpeed = 0.5;
      controls.addEventListener('start', () => { controls.autoRotate = false; });
      controls.target.set(0, bld.height * 0.32, 0);

      const dist = () => (el.clientWidth < 640 ? 2.35 : 1.75) * bld.extent;
      const finalPos = new THREE.Vector3();
      const setFinal = () => {
        const d = dist();
        finalPos.set(d * 0.66, d * 0.52, d * 0.72);
      };
      setFinal();
      camera.position.copy(finalPos).multiplyScalar(1.6).add(new THREE.Vector3(0, bld.extent * 0.6, 0));

      const ro = new ResizeObserver(() => {
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
        setFinal();
      });
      ro.observe(el);

      let visible = false;
      let started = false;
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !started) started = true;
      }, { rootMargin: '80px' });
      io.observe(el);

      // Animation state per level
      bld.levels.forEach((lv) => { lv.content.scale.y = 0.001; lv.shown = 0; lv.yOff = 0; });
      bld.roof.visible = false;
      let t0 = null;
      let introDone = reduce;
      const GAP = 2.6;
      const clock = new THREE.Clock();

      let raf;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        if (started && t0 === null) t0 = performance.now();
        const t = t0 === null ? 0 : (performance.now() - t0) / 1000;
        const { level: sel, explode: ex } = stateRef.current;
        const n = bld.levels.length;

        bld.levels.forEach((lv, i) => {
          // intro: floors rise one after another
          const grow = reduce ? 1 : Math.min(1, Math.max(0, (t - 0.25 - i * 0.45) / 0.7));
          const easeG = 1 - Math.pow(1 - grow, 3);
          lv.content.scale.y = Math.max(0.001, easeG);
          if (lv.slab) lv.slab.visible = grow > 0.02;
          const wanted = sel === 'all' || i <= sel ? 1 : 0;
          lv.shown += (wanted - lv.shown) * Math.min(1, dt * 7);
          const off = (ex ? i * GAP : 0) + (1 - lv.shown) * 3;
          lv.yOff += (off - lv.yOff) * Math.min(1, dt * 6);
          lv.group.position.y = lv.base + lv.yOff;
          lv.group.visible = lv.shown > 0.03;
        });
        const roofGrow = reduce ? 1 : Math.min(1, Math.max(0, (t - 0.25 - n * 0.45) / 0.6));
        const roofWanted = sel === 'all' ? 1 : 0;
        bld.roof.userData.shown = (bld.roof.userData.shown ?? 0) + (roofWanted * roofGrow - (bld.roof.userData.shown ?? 0)) * Math.min(1, dt * 7);
        const top = bld.levels[n - 1];
        bld.roof.visible = bld.roof.userData.shown > 0.03;
        bld.roof.position.y = top.base + top.height + top.yOff + (1 - bld.roof.userData.shown) * 3 + (ex ? GAP * 0.5 : 0);
        bld.plan.mat.opacity += ((sel === 'all' ? 0 : 0.45) - bld.plan.mat.opacity) * Math.min(1, dt * 6);

        if (!introDone) {
          const k = Math.min(1, t / 2.6);
          const e = 1 - Math.pow(1 - k, 3);
          camera.position.lerp(finalPos, e * 0.08 + 0.01);
          if (k >= 1) introDone = true;
        }
        controls.update();
        renderer.render(scene, camera);
      };
      tick();
      setStatus('ready');

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        controls.dispose();
        bld.dispose();
        envTex.dispose();
        pmrem.dispose();
        ground.geometry.dispose();
        ground.material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => setStatus('failed'));

    return () => { disposed = true; cleanup(); };
  }, [modelId]); // eslint-disable-line react-hooks/exhaustive-deps

  const chip = (active) =>
    `px-3 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors ${
      active ? 'bg-[#0F1B2D] text-white border-[#0F1B2D]' : 'bg-white/90 text-gray-700 border-gray-200 hover:border-gray-400'
    }`;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mountRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        role="img"
        aria-label={`Interaktives 3D-Modell ${meta.name}, ${meta.address}`}
      />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <Loader2 className="animate-spin" size={26} />
        </div>
      )}
      {status === 'failed' && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
          3D-Modell konnte nicht geladen werden
        </div>
      )}

      {/* Controls */}
      <div className="absolute left-3 top-3 right-3 md:left-5 md:top-5 md:right-5 flex flex-col gap-2 items-start">
        {ids.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {ids.map((id) => (
              <button key={id} type="button" onClick={() => setModelId(id)} aria-pressed={modelId === id} className={chip(modelId === id)}>
                {BUILDING_MODELS[id].short} · <span className="normal-case tracking-normal font-medium">{BUILDING_MODELS[id].name}</span>
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => setLevel('all')} aria-pressed={level === 'all'} className={chip(level === 'all')}>Gesamt</button>
          {levels.map((l, i) => (
            <button key={l.label} type="button" onClick={() => setLevel(i)} aria-pressed={level === i} className={chip(level === i)}>
              {l.label}
              {l.rooms && <span className="hidden md:inline font-normal normal-case tracking-normal opacity-70"> · Zimmer {l.rooms}</span>}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setExplode((v) => !v)}
            aria-pressed={explode}
            className={`${chip(explode)} inline-flex items-center gap-1.5`}
          >
            <Layers3 size={13} /> Explosion
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute left-3 bottom-3 md:left-5 md:bottom-5 inline-flex items-center gap-2 text-[11px] text-gray-500 bg-white/80 px-3 py-1.5">
        <Rotate3d size={14} /> Ziehen zum Drehen
      </div>
      <div className="pointer-events-none absolute right-3 bottom-3 md:right-5 md:bottom-5 font-mono text-[10px] md:text-[11px] text-gray-500 text-right leading-relaxed">
        AMONN ARCHITEKTUR · {meta.source}<br />{meta.address}
      </div>
    </div>
  );
}
