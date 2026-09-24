import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Rotate3d } from 'lucide-react';
import a14Model from '@/data/a14Model';
import { buildBuilding } from '@/lib/buildingScene';

/**
 * BuildingViewer3D — interactive white architectural model of a real project.
 * Drag to orbit (auto-rotates until touched), switch floors to look inside.
 * three.js + OrbitControls are loaded lazily.
 */
export default function BuildingViewer3D({ model = a14Model, className = '' }) {
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const [level, setLevel] = useState('all');
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    Promise.all([
      import('three'),
      import('three/examples/jsm/controls/OrbitControls.js'),
      import('three/examples/jsm/utils/BufferGeometryUtils.js'),
    ]).then(([THREE, { OrbitControls }, { mergeGeometries }]) => {
      if (disposed || !mountRef.current) return;
      const el = mountRef.current;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setFailed(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      el.appendChild(renderer.domElement);
      renderer.domElement.style.touchAction = 'pan-y';

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, el.clientWidth / el.clientHeight, 0.1, 400);

      scene.add(new THREE.HemisphereLight(0xffffff, 0xe7e1d5, 2.4));
      const sun = new THREE.DirectionalLight(0xffffff, 2.2);
      sun.position.set(-14, 24, 12);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 80 });
      sun.shadow.bias = -0.0005;
      scene.add(sun);

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(120, 120),
        new THREE.ShadowMaterial({ opacity: 0.14 }),
      );
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const bld = buildBuilding(THREE, model, { style: 'model', scale: 0.42, mergeGeometries });
      bld.root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      scene.add(bld.root);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = 0.25;
      controls.maxPolarAngle = Math.PI / 2.15;
      controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      controls.autoRotateSpeed = 0.6;
      controls.target.set(0, bld.height * 0.35, 0);
      const stop = () => { controls.autoRotate = false; };
      controls.addEventListener('start', stop);

      const fit = () => {
        const narrow = el.clientWidth < 640;
        const d = narrow ? 46 : 27;
        camera.position.set(d * 0.72, d * 0.62, d * 0.72);
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      fit();
      const ro = new ResizeObserver(() => {
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      });
      ro.observe(el);

      let visible = true;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '120px' });
      io.observe(el);

      // Floor switching: show everything up to the chosen level, open its ceiling
      apiRef.current = (sel) => {
        bld.levels.forEach((lv, i) => {
          const show = sel === 'all' || i <= sel;
          lv.walls.visible = show;
          lv.slabs.forEach((s) => {
            const isOwnCeiling = sel !== 'all' && i === sel;
            s.visible = show && !isOwnCeiling;
          });
        });
        bld.plan.mat.opacity = sel === 'all' ? 0.35 : 0.6;
      };
      apiRef.current('all');

      let raf;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        controls.update();
        renderer.render(scene, camera);
      };
      tick();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        controls.dispose();
        bld.dispose();
        ground.geometry.dispose();
        ground.material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => setFailed(true));

    return () => { disposed = true; cleanup(); };
  }, [model]);

  useEffect(() => { apiRef.current?.(level); }, [level, ready]);

  const buttons = [
    { key: 'all', label: 'Gesamt' },
    ...model.levels.map((lv, i) => ({ key: i, label: lv.label, sub: lv.rooms ? `Zimmer ${lv.rooms}` : null })),
  ];

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mountRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        role="img"
        aria-label={`Interaktives 3D-Modell ${model.name}, ${model.address}`}
      />
      {!ready && !failed && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <Loader2 className="animate-spin" size={26} />
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
          3D-Modell konnte nicht geladen werden
        </div>
      )}

      {/* Floor switcher */}
      <div className="absolute left-3 top-3 md:left-5 md:top-5 flex flex-wrap gap-1.5 max-w-[calc(100%-1.5rem)]">
        {buttons.map((b) => (
          <button
            key={b.key}
            type="button"
            onClick={() => setLevel(b.key)}
            aria-pressed={level === b.key}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors ${
              level === b.key
                ? 'bg-[#0F1B2D] text-white border-[#0F1B2D]'
                : 'bg-white/90 text-gray-700 border-gray-200 hover:border-gray-400'
            }`}
          >
            {b.label}
            {b.sub && <span className="hidden sm:inline font-normal normal-case tracking-normal text-[11px] opacity-70"> · {b.sub}</span>}
          </button>
        ))}
      </div>

      <div className="pointer-events-none absolute left-3 bottom-3 md:left-5 md:bottom-5 inline-flex items-center gap-2 text-[11px] text-gray-500 bg-white/80 px-3 py-1.5">
        <Rotate3d size={14} /> Ziehen zum Drehen
      </div>
      <div className="pointer-events-none absolute right-3 bottom-3 md:right-5 md:bottom-5 font-mono text-[10px] md:text-[11px] text-gray-500 text-right leading-relaxed">
        AMONN ARCHITEKTUR<br />{model.address}
      </div>
    </div>
  );
}
