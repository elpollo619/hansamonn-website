/**
 * buildBuilding — turns a plan model (see src/data/a14Model.js) into three.js
 * objects: 2D plan lines, per-level wall groups (with windows) and slabs.
 *
 * style:
 *   'blueprint' → translucent faces + light lines (for dark blue backgrounds)
 *   'model'     → solid white architectural model with dark edges (needs lights)
 */
export function buildBuilding(THREE, model, { style = 'blueprint', scale = 0.42, mergeGeometries } = {}) {
  const disposables = [];
  const track = (...objs) => { disposables.push(...objs); return objs[0]; };

  const blueprint = style === 'blueprint';
  const lineMat = (opacity = 0.95) =>
    track(new THREE.LineBasicMaterial({ color: blueprint ? 0xe6efff : 0x1f2937, transparent: true, opacity: blueprint ? opacity : opacity * 0.55 }));
  const faceMat = (opacity) =>
    track(
      blueprint
        ? new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: opacity ?? 0.07, depthWrite: false, side: THREE.DoubleSide })
        : new THREE.MeshStandardMaterial({ color: 0xf7f5f0, roughness: 0.9, metalness: 0 }),
    );

  const { minX, maxX, minZ, maxZ } = model.bounds;
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;

  const root = new THREE.Group();
  root.scale.setScalar(scale);
  root.position.set(-cx * scale, 0, -cz * scale);

  // ── 2D plan (drawn on the ground)
  const segs = model.plan;
  const pos = new Float32Array(segs.length * 6);
  segs.forEach(([x1, z1, x2, z2], i) => pos.set([x1, 0.03, z1, x2, 0.03, z2], i * 6));
  const planGeo = track(new THREE.BufferGeometry());
  planGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const planMat = lineMat(1);
  const plan = new THREE.LineSegments(planGeo, planMat);
  root.add(plan);

  // ── Walls
  const wall = (x1, z1, x2, z2, h, t = 0.25) => {
    const len = Math.hypot(x2 - x1, z2 - z1);
    const geo = track(new THREE.BoxGeometry(len + t, h, t));
    geo.translate(0, h / 2, 0);
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, faceMat()));
    g.add(new THREE.LineSegments(track(new THREE.EdgesGeometry(geo)), lineMat()));
    g.position.set((x1 + x2) / 2, 0, (z1 + z2) / 2);
    g.rotation.y = -Math.atan2(z2 - z1, x2 - x1);
    return g;
  };

  const midZ = (minZ + maxZ) / 2;
  const windows = (list) => {
    if (!list.length) return null;
    const pts = [];
    list.forEach(({ x, z }) => {
      const off = z < midZ ? -0.16 : 0.16;
      const zz = z + off, y = 0.9, w = 1.2, h = 1.4;
      pts.push(
        x - w / 2, y, zz, x + w / 2, y, zz,
        x + w / 2, y, zz, x + w / 2, y + h, zz,
        x + w / 2, y + h, zz, x - w / 2, y + h, zz,
        x - w / 2, y + h, zz, x - w / 2, y, zz,
      );
    });
    const geo = track(new THREE.BufferGeometry());
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
    return new THREE.LineSegments(geo, lineMat(0.9));
  };

  const slab = (outline, thickness) => {
    const shape = new THREE.Shape(outline.map(([x, z]) => new THREE.Vector2(x, -z)));
    const geo = track(new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false }));
    geo.rotateX(-Math.PI / 2);
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, faceMat(blueprint ? 0.12 : undefined)));
    g.add(new THREE.LineSegments(track(new THREE.EdgesGeometry(geo, 30)), lineMat()));
    return g;
  };

  // Many axis-aligned wall pieces (from a CAD plan) → one merged mesh + edges
  const rectWalls = (rects, h) => {
    const geos = rects.map(([x0, z0, x1, z1]) => {
      const g = new THREE.BoxGeometry(Math.max(0.04, x1 - x0), h, Math.max(0.04, z1 - z0));
      g.translate((x0 + x1) / 2, h / 2, (z0 + z1) / 2);
      return g;
    });
    const merged = track(mergeGeometries(geos, false));
    geos.forEach((g) => g.dispose());
    const grp = new THREE.Group();
    grp.add(new THREE.Mesh(merged, faceMat(blueprint ? 0.05 : undefined)));
    grp.add(new THREE.LineSegments(track(new THREE.EdgesGeometry(merged, 30)), lineMat(blueprint ? 0.42 : 0.9)));
    return grp;
  };

  const levels = model.levels.map((lv) => {
    const walls = new THREE.Group();
    lv.walls.forEach(([x1, z1, x2, z2, h]) => walls.add(wall(x1, z1, x2, z2, h ?? lv.height)));
    if (lv.rects?.length && mergeGeometries) walls.add(rectWalls(lv.rects, lv.height));
    const win = windows(lv.windows || []);
    if (win) walls.add(win);
    walls.position.y = lv.base;
    root.add(walls);
    return { ...lv, walls, slabs: [] };
  });

  model.slabs.forEach((s) => {
    const lv = levels[s.level];
    const g = slab(s.outline, s.thickness);
    g.userData.baseY = s.y ?? lv.base + lv.height;
    g.position.y = g.userData.baseY;
    root.add(g);
    lv.slabs.push(g);
  });

  const topY = Math.max(...levels.map((l) => l.base + l.height)) + 0.4;

  return {
    root,
    plan: { geo: planGeo, mat: planMat, count: segs.length * 2 },
    levels,
    height: topY * scale,
    size: Math.max(maxX - minX, maxZ - minZ) * scale,
    dispose: () => disposables.forEach((d) => d.dispose?.()),
  };
}

/** Set opacity on every material inside a group (faces keep their base ratio). */
export function setGroupOpacity(group, t, faceBase = 0.07) {
  group.traverse((o) => {
    if (!o.material) return;
    const isLine = o.isLineSegments;
    if (o.material.isMeshStandardMaterial) o.material.opacity = t;
    else o.material.opacity = isLine ? 0.95 * t : faceBase * t;
  });
}
