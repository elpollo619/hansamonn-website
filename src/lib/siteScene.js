/**
 * siteScene — the surroundings of a plan model as a round model board:
 * land cover from the official survey (roads, walks, gardens …), neighbouring
 * buildings as massing (height from the building register) and trees found in
 * SWISSIMAGE. Data: src/data/models/<id>-site.json (model-local metres).
 */

const GROUND = {
  field: { color: 0xa3b47d, y: 0.004 },
  garden: { color: 0x88a268, y: 0.008 },
  wood: { color: 0x6f8c58, y: 0.01 },
  green: { color: 0x97ad7c, y: 0.012 },
  water: { color: 0x7fa9c4, y: 0.012 },
  paved: { color: 0xb3ac9f, y: 0.016 },
  walk: { color: 0xc6c0b4, y: 0.02 },
  road: { color: 0x858a90, y: 0.024 },
  rail: { color: 0x7a7268, y: 0.028 },
};
const CROWNS = [0x6f8f55, 0x5f7f49, 0x80a062];

export function buildSite(THREE, mergeGeometries, site, { scale = 0.4 } = {}) {
  const disposables = [];
  const keep = (x) => { disposables.push(x); return x; };
  const group = new THREE.Group();
  group.scale.setScalar(scale);

  const shapeOf = (p) => {
    const s = new THREE.Shape(p.o.map(([x, z]) => new THREE.Vector2(x, -z)));
    (p.h || []).forEach((h) => s.holes.push(new THREE.Path(h.map(([x, z]) => new THREE.Vector2(x, -z)))));
    return s;
  };
  const merged = (geos) => {
    if (!geos.length) return null;
    const m = mergeGeometries(geos.map((g) => (g.index ? g.toNonIndexed() : g)), false);
    geos.forEach((g) => g.dispose());
    return keep(m);
  };

  // Model board
  const R = site.radius;
  const board = new THREE.Mesh(
    keep(new THREE.CylinderGeometry(R, R, 0.9, 96)),
    keep(new THREE.MeshStandardMaterial({ color: 0xd8d2c6, roughness: 1 })),
  );
  board.position.y = -0.46;
  board.receiveShadow = true;
  group.add(board);

  // Land cover
  Object.entries(site.ground || {}).forEach(([cls, polys]) => {
    const def = GROUND[cls];
    if (!def || !polys.length) return;
    const geo = merged(polys.map((p) => {
      const g = new THREE.ShapeGeometry(shapeOf(p), 1);
      g.rotateX(-Math.PI / 2);
      g.translate(0, def.y, 0);
      return g;
    }));
    const mesh = new THREE.Mesh(geo, keep(new THREE.MeshStandardMaterial({ color: def.color, roughness: 1, metalness: 0 })));
    mesh.receiveShadow = true;
    group.add(mesh);
  });

  // Neighbouring buildings (massing) — one mesh each so they can fade when they hide the model
  const lineMat = keep(new THREE.LineBasicMaterial({ color: 0x2b3440, transparent: true, opacity: 0.16 }));
  const blocks = [];
  (site.buildings || []).forEach((b) => {
    const geo = keep(new THREE.ExtrudeGeometry(shapeOf(b), { depth: b.y, bevelEnabled: false, curveSegments: 1 }));
    geo.rotateX(-Math.PI / 2);
    geo.computeBoundingSphere();
    const mat = keep(new THREE.MeshStandardMaterial({ color: b.own ? 0xe9e5de : 0xd3cec5, roughness: 0.95, transparent: true, opacity: 1 }));
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const edges = new THREE.LineSegments(keep(new THREE.EdgesGeometry(geo, 30)), lineMat);
    group.add(mesh, edges);
    const c = geo.boundingSphere.center.clone().multiplyScalar(scale);
    blocks.push({ mesh, mat, edges, center: c, radius: geo.boundingSphere.radius * scale, fade: 1 });
  });

  // Fade buildings standing between the camera and the model (x-ray)
  const toCam = new THREE.Vector3();
  const rel = new THREE.Vector3();
  const updateOcclusion = (camera, target, modelRadius, dt = 0.016) => {
    toCam.subVectors(camera.position, target);
    const L = toCam.length();
    toCam.divideScalar(L);
    blocks.forEach((b) => {
      rel.subVectors(b.center, target);
      const t = rel.dot(toCam);
      const off = rel.addScaledVector(toCam, -t).length();
      const hides = t > 0 && t < L && off < b.radius * 0.8 + modelRadius * 0.6;
      const near = b.center.distanceTo(camera.position) < L * 0.6;
      const want = hides ? 0.18 : near ? 0.4 : 1;
      b.fade += (want - b.fade) * Math.min(1, dt * 6);
      b.mat.opacity = b.fade;
      b.mat.depthWrite = b.fade > 0.95;
      b.mesh.castShadow = b.fade > 0.5;
      b.edges.visible = b.fade > 0.4;
    });
  };

  // Trees (instanced trunks + low-poly crowns)
  const trees = site.trees || [];
  if (trees.length) {
    const trunkGeo = keep(new THREE.CylinderGeometry(0.1, 0.16, 1, 6));
    trunkGeo.translate(0, 0.5, 0);
    const crownGeo = keep(new THREE.IcosahedronGeometry(1, 1));
    const trunks = new THREE.InstancedMesh(trunkGeo, keep(new THREE.MeshStandardMaterial({ color: 0x7a6a58, roughness: 1 })), trees.length);
    const crowns = new THREE.InstancedMesh(crownGeo, keep(new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true })), trees.length);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const c = new THREE.Color();
    trees.forEach(([x, z, r, h, shade], i) => {
      const trunkH = Math.max(1.2, h - r * 1.7);
      m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(1, trunkH, 1));
      trunks.setMatrixAt(i, m);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (i * 1.7) % 6.28);
      m.compose(new THREE.Vector3(x, trunkH + r * 0.8, z), q, new THREE.Vector3(r, r * 1.08, r));
      crowns.setMatrixAt(i, m);
      q.identity();
      crowns.setColorAt(i, c.setHex(CROWNS[shade % CROWNS.length]));
    });
    trunks.castShadow = true;
    crowns.castShadow = true;
    crowns.receiveShadow = true;
    group.add(trunks, crowns);
  }

  // Most open viewing direction: least neighbour mass in a ±30° wedge (azimuth in radians, 0 = +x)
  const bestAzimuth = (preferred = 0) => {
    let best = preferred, bestCost = Infinity;
    for (let k = 0; k < 24; k++) {
      const az = preferred + (k * Math.PI) / 12;
      let cost = 0;
      (site.buildings || []).forEach((b) => {
        let cx = 0, cz = 0;
        b.o.forEach(([x, z]) => { cx += x; cz += z; });
        cx /= b.o.length; cz /= b.o.length;
        const d = Math.hypot(cx, cz);
        if (d < 4 || d > 55) return;
        let da = Math.abs(Math.atan2(cz, cx) - az) % (2 * Math.PI);
        if (da > Math.PI) da = 2 * Math.PI - da;
        if (da < Math.PI / 6) cost += (b.y * b.o.length) / d;
      });
      cost += k === 0 ? 0 : 0.5; // mild preference for the default view
      if (cost < bestCost) { bestCost = cost; best = az; }
    }
    return best;
  };

  return {
    group,
    bestAzimuth,
    updateOcclusion,
    radius: R * scale,
    dispose: () => disposables.forEach((d) => d.dispose?.()),
  };
}
