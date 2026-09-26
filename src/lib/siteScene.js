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
  const fadeMats = [];
  const fadeable = (m) => { m.transparent = true; fadeMats.push(m); return keep(m); };
  // model board cut like a soil sample: earth on the side, deep enough for basements
  const D = 3.6;
  const board = new THREE.Mesh(keep(new THREE.CylinderGeometry(R, R, D, 96)), [
    fadeable(new THREE.MeshStandardMaterial({ color: 0xa8957a, roughness: 1 })),
    fadeable(new THREE.MeshStandardMaterial({ color: 0xd8d2c6, roughness: 1 })),
    fadeable(new THREE.MeshStandardMaterial({ color: 0x8f7d65, roughness: 1 })),
  ]);
  const base = site.base ?? 0;          // lowest terrain layer (river, lower garden) when the site has relief
  board.position.y = base - D / 2 - 0.01;
  board.receiveShadow = true;
  group.add(board);
  // thin topsoil line on the cut edge
  const soil = new THREE.Mesh(keep(new THREE.CylinderGeometry(R + 0.02, R + 0.02, 0.35, 96, 1, true)),
    fadeable(new THREE.MeshStandardMaterial({ color: 0x6f7f4f, roughness: 1 })));
  soil.position.y = base - 0.18;
  group.add(soil);

  // Relief (swissALTI3D): stacked contour layers like a cardboard site model
  if (site.bands?.length) {
    const layerGeos = [];
    let prevY = base;
    site.bands.forEach((b) => {
      const dh = b.y - prevY;
      if (dh > 0.001) b.polys.forEach((p) => {
        const g = new THREE.ExtrudeGeometry(shapeOf(p), { depth: dh, bevelEnabled: false, curveSegments: 1 });
        g.rotateX(-Math.PI / 2);
        g.translate(0, prevY, 0);
        layerGeos.push(g);
      });
      prevY = b.y;
    });
    const lg = merged(layerGeos);
    if (lg) {
      const m = new THREE.Mesh(lg, fadeable(new THREE.MeshStandardMaterial({ color: 0xd9ccb2, roughness: 1 })));
      m.receiveShadow = true;
      m.castShadow = true;
      group.add(m);
    }
  }

  // Land cover
  Object.entries(site.ground || {}).forEach(([cls, polys]) => {
    const def = GROUND[cls];
    if (!def || !polys.length) return;
    const geo = merged(polys.map((p) => {
      const g = new THREE.ShapeGeometry(shapeOf(p), 1);
      g.rotateX(-Math.PI / 2);
      g.translate(0, (p.y ?? 0) + def.y, 0);
      return g;
    }));
    const mesh = new THREE.Mesh(geo, fadeable(new THREE.MeshStandardMaterial({ color: def.color, roughness: 1, metalness: 0 })));
    mesh.receiveShadow = true;
    group.add(mesh);
  });

  // Railway (swissTLM3D centre lines): two rails on sleepers, overhead-line masts and contact wire
  const railGeos = [], sleeperGeos = [], mastGeos = [];
  const wirePts = [];
  (site.tracks || []).forEach((pts) => {
    let run = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, z1] = pts[i], [x2, z2] = pts[i + 1];
      const L = Math.hypot(x2 - x1, z2 - z1);
      if (L < 0.05) continue;
      const ang = Math.atan2(z2 - z1, x2 - x1);
      const nx = -Math.sin(ang), nz = Math.cos(ang);
      [-0.7175, 0.7175].forEach((o) => {
        const r = new THREE.BoxGeometry(L + 0.02, 0.16, 0.07);
        r.rotateY(-ang);
        r.translate((x1 + x2) / 2 + nx * o, 0.2, (z1 + z2) / 2 + nz * o);
        railGeos.push(r);
      });
      for (let u = (0.6 - (run % 0.6)); u < L; u += 0.6) {
        const s = new THREE.BoxGeometry(0.24, 0.1, 2.5);
        s.rotateY(-ang);
        s.translate(x1 + Math.cos(ang) * u, 0.09, z1 + Math.sin(ang) * u);
        sleeperGeos.push(s);
      }
      for (let u = (48 - (run % 48)) % 48; u < L; u += 48) {
        const mx = x1 + Math.cos(ang) * u + nx * 3.2, mz = z1 + Math.sin(ang) * u + nz * 3.2;
        const m = new THREE.BoxGeometry(0.28, 7.2, 0.28);
        m.translate(mx, 3.6, mz);
        mastGeos.push(m);
        const arm = new THREE.BoxGeometry(0.1, 0.1, 3.6);
        arm.rotateY(-ang);
        arm.translate(mx - nx * 1.7, 6.6, mz - nz * 1.7);
        mastGeos.push(arm);
      }
      run += L;
      wirePts.push(x1, 6.1, z1, x2, 6.1, z2);
    }
  });
  const railMat = keep(new THREE.MeshStandardMaterial({ color: 0x7c7f83, roughness: 0.35, metalness: 0.8 }));
  const sleeperMat = keep(new THREE.MeshStandardMaterial({ color: 0x8a847a, roughness: 1 }));
  [[railGeos, railMat], [sleeperGeos, sleeperMat], [mastGeos, railMat]].forEach(([geos, mat]) => {
    const g = merged(geos);
    if (!g) return;
    const m = new THREE.Mesh(g, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  });
  if (wirePts.length) {
    const wg = keep(new THREE.BufferGeometry());
    wg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(wirePts), 3));
    group.add(new THREE.LineSegments(wg, keep(new THREE.LineBasicMaterial({ color: 0x3b4046, transparent: true, opacity: 0.6 }))));
  }

  // Neighbouring buildings (massing) — one mesh each so they can fade when they hide the model
  const lineMat = keep(new THREE.LineBasicMaterial({ color: 0x2b3440, transparent: true, opacity: 0.16 }));
  const blocks = [];
  const pip = (x, z, pts) => {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, zi] = pts[i], [xj, zj] = pts[j];
      if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
    }
    return inside;
  };
  const dense = (ring, step = 0.8) => {
    const out = [];
    ring.forEach((a, i) => {
      const b = ring[(i + 1) % ring.length];
      const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
      for (let k = 0; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
    });
    return out;
  };
  (site.buildings || []).forEach((b) => {
    const y0 = b.y0 ?? 0;
    const roof = b.roof;
    const roofTop = roof ? (x, z) => Math.min(...roof.planes.map(([a, bb, c]) => a * x + bb * z + c)) : null;
    const topY = roof ? roof.ridge : b.y;
    const outline = roof ? { o: dense(b.o), h: (b.h || []).map((r) => dense(r)) } : b;
    const geo = keep(new THREE.ExtrudeGeometry(shapeOf(outline), { depth: topY - y0, bevelEnabled: false, curveSegments: 1 }));
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, y0, 0);
    if (roof) {
      // walls rise into the gables: clamp to the underside of the roof planes
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const lim = roofTop(pos.getX(i), pos.getZ(i)) - 0.05;
        if (pos.getY(i) > lim) pos.setY(i, lim);
      }
      geo.computeVertexNormals();
    }
    geo.computeBoundingSphere();
    const wallCol = b.own ? 0xe9e5de : 0xe3ddd3;
    const mat = keep(new THREE.MeshStandardMaterial({ color: wallCol, roughness: 0.95, transparent: true, opacity: 1 }));
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const mats = [mat];
    const parts = [mesh];
    const edges = new THREE.LineSegments(keep(new THREE.EdgesGeometry(geo, 30)), lineMat);
    group.add(mesh, edges);
    const roofCol = b.own ? 0xd6d0c6 : 0xcbc5bb;          // neighbours stay neutral massing, only the form of the roof
    if (roof) {
      // pitched roof: each face extruded and sheared onto its plane, coloured from the aerial photo
      const rg = [];
      roof.faces.forEach(({ pts, plane }) => {
        const [a, bb, c] = roof.planes[plane];
        const g = new THREE.ExtrudeGeometry(shapeOf({ o: pts, h: [] }), { depth: 0.22, bevelEnabled: false, curveSegments: 1 });
        g.rotateX(-Math.PI / 2);
        const p2 = g.attributes.position;
        for (let i = 0; i < p2.count; i++) p2.setY(i, a * p2.getX(i) + bb * p2.getZ(i) + c - 0.12 + p2.getY(i));
        g.computeVertexNormals();
        rg.push(g);
      });
      const g = merged(rg);
      if (g) {
        const rm = keep(new THREE.MeshStandardMaterial({ color: roofCol, roughness: 0.85, transparent: true, opacity: 1 }));
        const m = new THREE.Mesh(g, rm);
        m.castShadow = true;
        group.add(m);
        mats.push(rm); parts.push(m);
      }
    }
    const c = geo.boundingSphere.center.clone().multiplyScalar(scale);
    blocks.push({ mesh, mat, mats, parts, edges, center: c, radius: geo.boundingSphere.radius * scale, fade: 1 });
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
      b.mats.forEach((m) => { m.opacity = b.fade; m.depthWrite = b.fade > 0.95; });
      b.parts.forEach((m) => { m.castShadow = b.fade > 0.5; });
      b.edges.visible = b.fade > 0.4;
    });
    treeObjs.forEach((t) => {
      rel.subVectors(t.center, target);
      const tt = rel.dot(toCam);
      const off = rel.addScaledVector(toCam, -tt).length();
      const hides = tt > 0 && tt < L && off < t.radius * 0.9 + modelRadius * 0.55;
      const want = hides ? 0 : 1;
      if (Math.abs(want - t.fade) < 0.002) return;
      t.fade += (want - t.fade) * Math.min(1, dt * 6);
      t.mats.forEach((m) => { m.opacity = t.fade * (m.userData.groundO ?? 1); m.depthWrite = t.fade > 0.95; });
      t.trunk.castShadow = t.crown.castShadow = t.fade > 0.5;
      t.trunk.visible = t.crown.visible = t.fade > 0.03;
    });
  };

  // Trees: low-poly crowns on trunks, one mesh each so trees in front of the model can fade out
  const trees = site.trees || [];
  const treeObjs = [];
  if (trees.length) {
    const trunkGeo = keep(new THREE.CylinderGeometry(0.1, 0.16, 1, 6));
    trunkGeo.translate(0, 0.5, 0);
    const crownGeo = keep(new THREE.IcosahedronGeometry(1, 1));
    const trunkBase = fadeable(new THREE.MeshStandardMaterial({ color: 0x7a6a58, roughness: 1 }));
    const crownBase = CROWNS.map((c) => fadeable(new THREE.MeshStandardMaterial({ color: c, roughness: 1, flatShading: true })));
    trees.forEach(([x, z, r, h, shade, ty = 0], i) => {
      const trunkH = Math.max(1.2, h - r * 1.7);
      const tm = keep(trunkBase.clone()), cm = keep(crownBase[shade % CROWNS.length].clone());
      const trunk = new THREE.Mesh(trunkGeo, tm);
      trunk.position.set(x, ty, z);
      trunk.scale.set(1, trunkH, 1);
      const crown = new THREE.Mesh(crownGeo, cm);
      crown.position.set(x, ty + trunkH + r * 0.8, z);
      crown.scale.set(r, r * 1.08, r);
      crown.rotation.y = (i * 1.7) % 6.28;
      [trunk, crown].forEach((m) => { m.castShadow = true; m.receiveShadow = true; group.add(m); });
      crown.receiveShadow = true;
      treeObjs.push({ trunk, crown, mats: [tm, cm], center: new THREE.Vector3(x, ty + trunkH, z).multiplyScalar(scale), radius: Math.max(r, h / 2) * scale, fade: 1 });
    });
    fadeMats.push(...treeObjs.flatMap((t) => t.mats));
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

  // Fade the ground (to look into basements)
  const treeMats = new Set(treeObjs.flatMap((t) => t.mats));
  const setGroundOpacity = (o) => fadeMats.forEach((m) => {
    if (treeMats.has(m)) { m.userData.groundO = o; m.opacity = o * (treeObjs.find((t) => t.mats.includes(m))?.fade ?? 1); }
    else m.opacity = o;
    m.depthWrite = m.opacity > 0.95;
  });

  // Terrain height under a world point (for keeping the camera above the relief)
  const hg = site.hgrid;
  const groundAt = hg ? (wx, wz) => {
    const x = wx / scale, z = wz / scale;
    const fx = (x - hg.x0) / hg.step, fz = (z - hg.x0) / hg.step;
    const i = Math.max(0, Math.min(hg.n - 2, Math.floor(fz))), j = Math.max(0, Math.min(hg.n - 2, Math.floor(fx)));
    const tz = Math.max(0, Math.min(1, fz - i)), tx = Math.max(0, Math.min(1, fx - j));
    const h = (a, b) => hg.h[a * hg.n + b];
    const v = (h(i, j) * (1 - tx) + h(i, j + 1) * tx) * (1 - tz) + (h(i + 1, j) * (1 - tx) + h(i + 1, j + 1) * tx) * tz;
    return v * scale;
  } : null;

  return {
    group,
    groundAt,
    setGroundOpacity,
    bestAzimuth,
    updateOcclusion,
    radius: R * scale,
    dispose: () => disposables.forEach((d) => d.dispose?.()),
  };
}
