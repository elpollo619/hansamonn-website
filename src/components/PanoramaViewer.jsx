import React, { useEffect, useRef, useState } from 'react';
import { Move3d, Loader2, ImageOff } from 'lucide-react';

/**
 * PanoramaViewer – drag-to-look 360° viewer for equirectangular photos.
 * three.js is imported lazily so it only loads when a panorama is shown.
 *
 * Props:
 *   src      {string}  equirectangular image (2:1)
 *   alt      {string}  accessible label
 *   autoRotate {boolean} slowly rotate until the user interacts
 *   initialLon {number}  start heading in degrees (0 = left edge of the photo)
 *   fallback   {string}  flat preview shown if WebGL or the panorama fails
 */
const PanoramaViewer = ({ src, alt = '360° Ansicht', autoRotate = true, initialLon = 0, fallback, className = '' }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [hint, setHint] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    import('three').then((THREE) => {
      if (disposed || !mountRef.current) return;
      const el = mountRef.current;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true });
      } catch {
        setFailed(true); setLoading(false);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(el.clientWidth, el.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, el.clientWidth / el.clientHeight, 1, 1100);

      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);
      // Dark until the photo arrives, so there is no white flash while loading.
      const material = new THREE.MeshBasicMaterial({ color: 0x0b1220 });
      scene.add(new THREE.Mesh(geometry, material));

      new THREE.TextureLoader().load(src, (texture) => {
        if (disposed) { texture.dispose(); return; }
        texture.colorSpace = THREE.SRGBColorSpace;
        material.map = texture;
        material.color.set(0xffffff);
        material.needsUpdate = true;
        setLoading(false);
      }, undefined, () => {
        if (disposed) return;
        setFailed(true); setLoading(false);
      });

      let lon = initialLon, lat = 0, fov = 75;
      let dragging = false, interacted = false;
      let startX = 0, startY = 0, startLon = 0, startLat = 0;

      const onDown = (e) => {
        dragging = true; interacted = true; setHint(false);
        startX = e.clientX; startY = e.clientY; startLon = lon; startLat = lat;
        el.setPointerCapture?.(e.pointerId);
      };
      const onMove = (e) => {
        if (!dragging) return;
        lon = (startX - e.clientX) * 0.12 + startLon;
        lat = (e.clientY - startY) * 0.12 + startLat;
      };
      const onUp = () => { dragging = false; };
      const onWheel = (e) => {
        e.preventDefault();
        fov = THREE.MathUtils.clamp(fov + e.deltaY * 0.04, 40, 90);
        camera.fov = fov;
        camera.updateProjectionMatrix();
      };

      el.addEventListener('pointerdown', onDown);
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp);
      el.addEventListener('pointerleave', onUp);
      el.addEventListener('wheel', onWheel, { passive: false });

      const onResize = () => {
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(el.clientWidth, el.clientHeight);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(el);

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let raf;
      const target = new THREE.Vector3();
      const tick = () => {
        if (autoRotate && !interacted && !reduceMotion) lon += 0.04;
        lat = Math.max(-85, Math.min(85, lat));
        const phi = THREE.MathUtils.degToRad(90 - lat);
        const theta = THREE.MathUtils.degToRad(lon);
        target.set(
          500 * Math.sin(phi) * Math.cos(theta),
          500 * Math.cos(phi),
          500 * Math.sin(phi) * Math.sin(theta),
        );
        camera.lookAt(target);
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        el.removeEventListener('pointerdown', onDown);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
        el.removeEventListener('pointerleave', onUp);
        el.removeEventListener('wheel', onWheel);
        material.map?.dispose();
        material.dispose();
        geometry.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => {
      if (!disposed) { setFailed(true); setLoading(false); }
    });

    return () => { disposed = true; cleanup(); };
  }, [src, autoRotate, initialLon]);

  return (
    <div
      ref={mountRef}
      role="img"
      aria-label={alt}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing touch-none select-none bg-[#0B1220] ${className}`}
    >
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/70 text-sm">
          {fallback && <img src={fallback} alt={alt} className="absolute inset-0 w-full h-full object-cover opacity-60" />}
          <span className="relative inline-flex items-center gap-2 bg-black/55 px-4 py-2">
            <ImageOff size={15} /> 360° Ansicht konnte nicht geladen werden
          </span>
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center text-white/70">
          <Loader2 className="animate-spin" size={28} />
        </div>
      )}
      {!loading && !failed && hint && (
        <div className="pointer-events-none absolute left-1/2 bottom-5 -translate-x-1/2 inline-flex items-center gap-2 whitespace-nowrap bg-black/55 backdrop-blur px-4 py-2 text-xs text-white tracking-wide">
          <Move3d size={15} /> Ziehen zum Umsehen
        </div>
      )}
    </div>
  );
};

export default PanoramaViewer;
