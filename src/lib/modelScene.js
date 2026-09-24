/**
 * modelScene — builds a detailed three.js building from plan-extracted JSON
 * (see src/data/models). Per level: extruded wall polygons, partitions,
 * window openings (sill + lintel + glass), floor slab; roof with parapet;
 * extra volumes (halls) and site walls.
 *
 * style: 'model' (white architectural model, lit) | 'blueprint' (lines on blue)
 */

const pointInPoly = (x, z, pts) => {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, zi] = pts[i];
    const [xj, zj] = pts[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
};

export function buildModel(THREE, mergeGeometries, data, { style = 'model', scale = 0.4 } = {}) {
  const blueprint = style === 'blueprint';
  const disposables = [];
  const keep = (x) => { disposables.push(x); return x; };

  const mats = blueprint
    ? {
        wall: keep(new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: 0.08, depthWrite: false, side: THREE.DoubleSide })),
        part: keep(new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: 0.05, depthWrite: false, side: THREE.DoubleSide })),
        slab: keep(new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: 0.06, depthWrite: false, side: THREE.DoubleSide })),
        glass: keep(new THREE.MeshBasicMaterial({ color: 0xbfd6ff, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide })),
        hall: keep(new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: 0.05, depthWrite: false, side: THREE.DoubleSide })),
        line: keep(new THREE.LineBasicMaterial({ color: 0xe6efff, transparent: true, opacity: 0.8 })),
        lineSoft: keep(new THREE.LineBasicMaterial({ color: 0xe6efff, transparent: true, opacity: 0.35 })),
      }
    : {
        wall: keep(new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.92, metalness: 0 })),
        part: keep(new THREE.MeshStandardMaterial({ color: 0xebe6dc, roughness: 0.95, metalness: 0 })),
        slab: keep(new THREE.MeshStandardMaterial({ color: 0xdcd5c8, roughness: 0.9, metalness: 0 })),
        glass: keep(new THREE.MeshPhysicalMaterial({ color: 0x5d7a90, roughness: 0.06, metalness: 0.2, transparent: true, opacity: 0.72, envMapIntensity: 1.6 })),
        hall: keep(new THREE.MeshStandardMaterial({ color: 0xd7dadd, roughness: 0.6, metalness: 0.25 })),
        line: keep(new THREE.LineBasicMaterial({ color: 0x2b3440, transparent: true, opacity: 0.28 })),
        lineSoft: keep(new THREE.LineBasicMaterial({ color: 0x2b3440, transparent: true, opacity: 0.16 })),
      };

  const shapeOf = (p) => {
    const s = new THREE.Shape(p.o.map(([x, z]) => new THREE.Vector2(x, -z)));
    (p.h || []).forEach((h) => s.holes.push(new THREE.Path(h.map(([x, z]) => new THREE.Vector2(x, -z)))));
    return s;
  };
  const extrude = (polys, depth, y = 0) => {
    const geos = polys.map((p) => {
      const g = new THREE.ExtrudeGeometry(shapeOf(p), { depth, bevelEnabled: false, curveSegments: 1 });
      g.rotateX(-Math.PI / 2);
      g.translate(0, y, 0);
      return g;
    });
    return geos;
  };
  const merged = (geos) => {
    if (!geos.length) return null;
    const m = mergeGeometries(geos.map((g) => (g.index ? g.toNonIndexed() : g)), false);
    geos.forEach((g) => g.dispose());
    return keep(m);
  };
  const meshWithEdges = (geo, mat, lineMat, angle = 25) => {
    const g = new THREE.Group();
    if (!geo) return g;
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = !blueprint;
    mesh.receiveShadow = !blueprint;
    g.add(mesh);
    if (lineMat) g.add(new THREE.LineSegments(keep(new THREE.EdgesGeometry(geo, angle)), lineMat));
    return g;
  };

  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const levels = data.levels.map((lv) => {
    const group = new THREE.Group();
    group.position.y = lv.base;
    const content = new THREE.Group(); // scaled for the build-up animation
    group.add(content);
    const h = lv.height;

    // Walls + partitions
    content.add(meshWithEdges(merged(extrude(lv.walls, h)), mats.wall, mats.line));
    content.add(meshWithEdges(merged(extrude(lv.partitions, h - 0.05)), mats.part, mats.lineSoft));

    // Openings: sill + lintel (wall) and glass pane, pushed half a wall inwards
    const T = 0.3;
    const sill = lv.sill ?? 0.85;
    const head = Math.min(lv.head ?? 2.35, h - 0.1);
    const solid = [];
    const glass = [];
    lv.openings.forEach(([x1, z1, x2, z2]) => {
      const L = Math.hypot(x2 - x1, z2 - z1);
      if (L < 0.3) return;
      const ang = Math.atan2(z2 - z1, x2 - x1);
      let nx = -Math.sin(ang), nz = Math.cos(ang);
      const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
      if (!pointInPoly(cx + nx * 0.4, cz + nz * 0.4, lv.footprint)) { nx = -nx; nz = -nz; }
      const px = cx + nx * T / 2, pz = cz + nz * T / 2;
      const place = (g, y) => { g.rotateY(-ang); g.translate(px, y, pz); return g; };
      if (sill > 0.02) solid.push(place(new THREE.BoxGeometry(L, sill, T), sill / 2));
      solid.push(place(new THREE.BoxGeometry(L, h - head, T), head + (h - head) / 2));
      glass.push(place(new THREE.BoxGeometry(L, head - sill, 0.04), sill + (head - sill) / 2));
    });
    content.add(meshWithEdges(merged(solid), mats.wall, mats.line));
    const glassGeo = merged(glass);
    if (glassGeo) {
      const gm = new THREE.Mesh(glassGeo, mats.glass);
      content.add(gm);
      content.add(new THREE.LineSegments(keep(new THREE.EdgesGeometry(glassGeo, 25)), mats.lineSoft));
    }

    // Floor slab (not on the ground floor)
    let slab = null;
    if (lv.base > 0.01) {
      slab = meshWithEdges(merged(extrude([{ o: lv.footprint, h: [] }], 0.3, -0.3)), mats.slab, mats.line, 30);
      group.add(slab);
    }
    root.add(group);
    return { ...lv, group, content, slab };
  });

  // Roof + parapet on the top level
  const top = levels[levels.length - 1];
  const roof = new THREE.Group();
  roof.position.y = top.base + top.height;
  roof.add(meshWithEdges(merged(extrude([{ o: top.footprint, h: [] }], 0.35)), mats.slab, mats.line, 30));
  // parapet: thin wall along the footprint
  const par = [];
  const fp = top.footprint;
  for (let i = 0; i < fp.length; i++) {
    const [x1, z1] = fp[i];
    const [x2, z2] = fp[(i + 1) % fp.length];
    const L = Math.hypot(x2 - x1, z2 - z1);
    if (L < 0.2) continue;
    const ang = Math.atan2(z2 - z1, x2 - x1);
    const g = new THREE.BoxGeometry(L + 0.25, 0.8, 0.25);
    g.rotateY(-ang);
    g.translate((x1 + x2) / 2, 0.35 + 0.4, (z1 + z2) / 2);
    par.push(g);
  }
  roof.add(meshWithEdges(merged(par), mats.wall, mats.line));
  root.add(roof);

  // Extra volumes (e.g. steel hall) and site walls
  const extras = new THREE.Group();
  (data.volumes || []).forEach((v) => {
    extras.add(meshWithEdges(merged(extrude([{ o: v.footprint, h: [] }], v.height)), mats.hall, mats.line, 30));
  });
  (data.site || []).forEach((s) => {
    extras.add(meshWithEdges(merged(extrude(s.polys, s.height)), mats.wall, mats.lineSoft));
  });
  root.add(extras);

  // 2D ground plan of the EG (for the blueprint drawing animation)
  const segs = [];
  // Draw the richest floor (most walls + partitions) — usually the typical upper floor
  const planLevel = data.levels.reduce((best, l) =>
    (l.walls.length + l.partitions.length > best.walls.length + best.partitions.length ? l : best), data.levels[0]);
  [...planLevel.walls, ...planLevel.partitions].forEach((p) => {
    [p.o, ...(p.h || [])].forEach((ring) => {
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length];
        segs.push(a[0], 0.03, a[1], b[0], 0.03, b[1]);
      }
    });
  });
  (data.volumes || []).forEach((v) => {
    v.footprint.forEach((a, i) => {
      const b = v.footprint[(i + 1) % v.footprint.length];
      segs.push(a[0], 0.03, a[1], b[0], 0.03, b[1]);
    });
  });
  const planGeo = keep(new THREE.BufferGeometry());
  planGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segs), 3));
  const planMat = keep(new THREE.LineBasicMaterial({ color: blueprint ? 0xe6efff : 0x2b3440, transparent: true, opacity: blueprint ? 1 : 0.4 }));
  const plan = new THREE.LineSegments(planGeo, planMat);
  root.add(plan);

  return {
    root,
    levels,
    roof,
    extras,
    plan: { geo: planGeo, mat: planMat, count: segs.length / 3, label: planLevel.label },
    height: (top.base + top.height + 1.2) * scale,
    extent: data.extent * scale,
    dispose: () => disposables.forEach((d) => d.dispose?.()),
  };
}
