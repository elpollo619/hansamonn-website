import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Rotate3d, Layers3, Plus, Minus, Maximize2 } from 'lucide-react';
import { BUILDING_MODELS } from '@/data/models';
import { buildModel } from '@/lib/modelScene';
import { buildSite } from '@/lib/siteScene';

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
  const [active, setActive] = useState(false); // viewer has focus: wheel / pinch zoom and pan enabled
  const meta = BUILDING_MODELS[modelId];

  useEffect(() => { stateRef.current.level = level; }, [level]);
  useEffect(() => { stateRef.current.explode = explode; }, [explode]);
  const wrapRef = useRef(null);
  // Zoom + pan only while the viewer is "active" (after a click/tap inside), so page scrolling keeps working
  useEffect(() => { apiRef.current?.interactive(active); }, [active, status]);
  useEffect(() => {
    const down = (e) => { if (!wrapRef.current?.contains(e.target)) setActive(false); };
    const key = (e) => { if (e.key === 'Escape') setActive(false); };
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, []);

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
      meta.site ? meta.site().catch(() => null) : null,
    ]).then(([THREE, { OrbitControls }, { mergeGeometries }, { RoomEnvironment }, data, siteData]) => {
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
      renderer.toneMappingExposure = siteData ? 0.9 : 1.05;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.style.touchAction = 'pan-y';
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(32, el.clientWidth / el.clientHeight, 0.1, 500);

      scene.add(new THREE.HemisphereLight(0xffffff, 0xe9e2d4, siteData ? 0.6 : 0.9));
      const sun = new THREE.DirectionalLight(0xfff6ea, siteData ? 2.0 : 2.2);
      sun.position.set(-16, 26, 14);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      const sh = siteData ? 34 : 20;
      if (siteData) sun.position.set(-24, 40, 21);
      Object.assign(sun.shadow.camera, { left: -sh, right: sh, top: sh, bottom: -sh, near: 1, far: 130 });
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.02;
      scene.add(sun);

      const ground = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.ShadowMaterial({ opacity: 0.16 }));
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      // Surroundings (survey land cover, neighbours, trees) replace the plain shadow ground
      const site = siteData ? buildSite(THREE, mergeGeometries, siteData, { scale: 0.4 }) : null;
      if (site) scene.add(site.group);
      else scene.add(ground);

      const bld = buildModel(THREE, mergeGeometries, data, { style: 'model', scale: 0.4 });
      scene.add(bld.root);
      bld.plan.mat.opacity = 0; // plan lines only in cutaway mode (when no plan images exist)
      const hasPlanImages = bld.levels.some((l) => l.plan);
      setLevels(bld.levels.map((l) => ({ label: l.label, rooms: l.rooms })));

      // Real CAD floor plans as floor images, loaded when a floor is first opened
      const texLoader = new THREE.TextureLoader();
      const planMeshes = bld.levels.map((lv) => {
        if (!lv.plan) return null;
        const [x0, z0, x1, z1] = lv.plan.box;
        const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0);
        geo.rotateX(-Math.PI / 2);
        geo.translate((x0 + x1) / 2, 0.06, (z0 + z1) / 2);
        const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.visible = false;
        mesh.renderOrder = 2;
        lv.group.add(mesh);
        return { mesh, mat, geo, loaded: false, src: lv.plan.src };
      });
      const loadPlan = (pm) => {
        if (!pm || pm.loaded) return;
        pm.loaded = true;
        texLoader.load(pm.src, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          pm.mat.map = tex;
          pm.mat.needsUpdate = true;
        });
      };

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.screenSpacePanning = false;
      controls.zoomSpeed = 0.8;
      controls.minDistance = bld.extent * 0.3;
      controls.maxDistance = bld.extent * 3.4;
      controls.minPolarAngle = 0.2;
      controls.maxPolarAngle = Math.PI / 2.1;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      controls.autoRotate = !reduce;
      controls.autoRotateSpeed = 0.5;
      controls.addEventListener('start', () => { controls.autoRotate = false; });
      controls.target.set(0, bld.height * 0.32, 0);
      const homeTarget = controls.target.clone();
      // keep panning on the model board
      controls.addEventListener('change', () => {
        const r = bld.extent * 0.8;
        const t = controls.target;
        const l = Math.hypot(t.x, t.z);
        if (l > r) { t.x *= r / l; t.z *= r / l; }
        t.y = Math.min(Math.max(t.y, -1.2), bld.height);
      });
      // zoom / reset animation goals (buttons)
      let goalDist = null;
      let resetting = false;
      // a drag takes over from the reset / intro camera moves
      controls.addEventListener('start', () => { resetting = false; introDone = true; });
      if (import.meta.env.VITE_MV_DEBUG) window.__mv = { camera, controls, root: bld.root, scene, THREE };
      const offset = new THREE.Vector3();
      const dist = () => (el.clientWidth < 640 ? (site ? 2.6 : 2.35) : site ? 1.7 : 1.3) * bld.extent;
      const finalPos = new THREE.Vector3();
      // default view from +x/+z; with surroundings, turn to the most open side
      const az = site ? site.bestAzimuth(Math.atan2(0.72, 0.66)) : Math.atan2(0.72, 0.66);
      const setFinal = () => {
        const d = dist();
        const hr = Math.hypot(0.66, 0.72);
        finalPos.set(d * hr * Math.cos(az), d * (site ? 0.85 : 0.52), d * hr * Math.sin(az));
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
      bld.levels.forEach((lv) => { lv.content.scale.y = 0.001; lv.shown = 0; lv.yOff = 0; lv.cutS = 1; });
      let groundO = 1;
      let lastSel = 'all';
      let focusUntil = 0;
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

        const selUnder = sel !== 'all' && bld.levels[sel]?.underground;
        if (sel !== lastSel) { lastSel = sel; focusUntil = performance.now() + 1400; }
        bld.levels.forEach((lv, i) => {
          // intro: floors rise one after another
          const grow = reduce ? 1 : Math.min(1, Math.max(0, (t - 0.25 - i * 0.45) / 0.7));
          const easeG = 1 - Math.pow(1 - grow, 3);
          // section cut: the opened floor is cut at ~1.2 m so its plan and doors can be read
          const cut = sel !== 'all' && i === sel ? Math.min(1, 1.25 / lv.height) : 1;
          lv.cutS += (cut - lv.cutS) * Math.min(1, dt * 5);
          lv.content.scale.y = Math.max(0.001, easeG * lv.cutS);
          if (lv.slab) lv.slab.visible = grow > 0.02;
          const pm = planMeshes[i];
          if (pm) {
            const on = sel === i;
            if (on) loadPlan(pm);
            pm.mat.opacity += ((on && pm.mat.map ? 1 : 0) - pm.mat.opacity) * Math.min(1, dt * 5);
            pm.mesh.visible = pm.mat.opacity > 0.02;
          }
          const wanted = lv.underground
            ? (sel === i || (ex && sel === 'all') ? 1 : 0)
            : (sel === 'all' || (i <= sel && !selUnder) ? 1 : 0);
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
        bld.plan.mat.opacity += ((sel === 'all' || hasPlanImages ? 0 : 0.45) - bld.plan.mat.opacity) * Math.min(1, dt * 6);
        bld.extras.visible = !selUnder;
        // ground becomes see-through to look into the basement
        const gWant = selUnder || (ex && bld.levels.some((l) => l.underground)) ? 0.14 : 1;
        if (site && Math.abs(gWant - groundO) > 0.002) {
          groundO += (gWant - groundO) * Math.min(1, dt * 5);
          site.setGroundOpacity(groundO);
        }
        // camera: zoom buttons, reset, and a gentle focus on the opened floor
        if (goalDist !== null) {
          offset.subVectors(camera.position, controls.target);
          const d = offset.length();
          const nd = d + (goalDist - d) * Math.min(1, dt * 6);
          camera.position.copy(controls.target).add(offset.setLength(nd));
          if (Math.abs(nd - goalDist) < 0.01) goalDist = null;
        }
        if (resetting) {
          camera.position.lerp(finalPos, Math.min(1, dt * 4));
          controls.target.lerp(homeTarget, Math.min(1, dt * 4));
          if (camera.position.distanceTo(finalPos) < 0.05) resetting = false;
        }
        if (performance.now() < focusUntil) {
          const lvSel = sel === 'all' ? null : bld.levels[sel];
          const fy = lvSel ? (lvSel.base + lvSel.yOff + 0.6) * 0.4 : homeTarget.y;
          controls.target.y += (fy - controls.target.y) * Math.min(1, dt * 4);
        }

        if (!introDone) {
          const k = Math.min(1, t / 2.6);
          const e = 1 - Math.pow(1 - k, 3);
          camera.position.lerp(finalPos, e * 0.08 + 0.01);
          if (k >= 1) introDone = true;
        }
        controls.update();
        // never let the camera dig into the relief (hillside sites)
        if (site?.groundAt) {
          const gy = site.groundAt(camera.position.x, camera.position.z) + 1.2;
          if (camera.position.y < gy) camera.position.y = gy;
        }
        site?.updateOcclusion(camera, controls.target, bld.extent * 0.5, dt);
        renderer.render(scene, camera);
      };
      tick();
      setStatus('ready');

      apiRef.current = {
        zoom: (f) => {
          resetting = false;
          const d = camera.position.distanceTo(controls.target) * f;
          goalDist = Math.min(controls.maxDistance, Math.max(controls.minDistance, d));
          controls.autoRotate = false;
        },
        reset: () => { goalDist = null; resetting = true; },
        interactive: (on) => {
          controls.enableZoom = on;
          controls.enablePan = on;
          renderer.domElement.style.touchAction = on ? 'none' : 'pan-y';
        },
      };

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        controls.dispose();
        bld.dispose();
        site?.dispose();
        envTex.dispose();
        pmrem.dispose();
        planMeshes.forEach((pm) => { if (pm) { pm.geo.dispose(); pm.mat.map?.dispose(); pm.mat.dispose(); } });
        apiRef.current = null;
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
    <div ref={wrapRef} className={`relative ${className}`}>
      <div
        ref={mountRef}
        onPointerDown={() => setActive(true)}
        className={`absolute inset-0 cursor-grab active:cursor-grabbing transition-shadow ${active ? 'ring-2 ring-inset ring-[#1D3D78]/40' : ''}`}
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
              {l.rooms && <span className="hidden md:inline font-normal normal-case tracking-normal opacity-70"> · {/^\d/.test(l.rooms) ? `Zimmer ${l.rooms}` : l.rooms}</span>}
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

      {/* Zoom */}
      <div className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 flex flex-col border border-gray-200 bg-white/95 shadow-sm">
        <button type="button" onClick={() => apiRef.current?.zoom(0.72)} className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100" aria-label="Hineinzoomen"><Plus size={16} /></button>
        <button type="button" onClick={() => apiRef.current?.zoom(1.38)} className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 border-t border-gray-200" aria-label="Herauszoomen"><Minus size={16} /></button>
        <button type="button" onClick={() => apiRef.current?.reset()} className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 border-t border-gray-200" aria-label="Ansicht zurücksetzen"><Maximize2 size={14} /></button>
      </div>

      <div className="pointer-events-none absolute left-3 bottom-3 md:left-5 md:bottom-5 inline-flex items-center gap-2 text-[11px] text-gray-500 bg-white/85 px-3 py-1.5 max-w-[60%]">
        <Rotate3d size={14} className="shrink-0" />
        {active ? 'Zoom & Verschieben aktiv · Esc oder daneben klicken beendet' : 'Ziehen zum Drehen · klicken, dann scrollen oder mit zwei Fingern zoomen'}
      </div>
      <div className="pointer-events-none absolute right-3 bottom-3 md:right-5 md:bottom-5 font-mono text-[10px] md:text-[11px] text-gray-500 text-right leading-relaxed">
        AMONN ARCHITEKTUR · {meta.source}<br />{meta.address}
        {meta.site && <><br />{meta.siteNote ?? 'Umgebung: Amtliche Vermessung · GWR (BFS) · © swisstopo'}</>}
      </div>
    </div>
  );
}
