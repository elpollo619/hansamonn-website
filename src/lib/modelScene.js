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
        frame: keep(new THREE.MeshBasicMaterial({ color: 0xe6efff, transparent: true, opacity: 0.22, depthWrite: false })),
        door: keep(new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: 0.08, depthWrite: false, side: THREE.DoubleSide })),
        green: keep(new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: 0.06, depthWrite: false })),
        line: keep(new THREE.LineBasicMaterial({ color: 0xe6efff, transparent: true, opacity: 0.8 })),
        lineSoft: keep(new THREE.LineBasicMaterial({ color: 0xe6efff, transparent: true, opacity: 0.35 })),
      }
    : {
        wall: keep(new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.92, metalness: 0 })),
        part: keep(new THREE.MeshStandardMaterial({ color: 0xebe6dc, roughness: 0.95, metalness: 0 })),
        slab: keep(new THREE.MeshStandardMaterial({ color: 0xdcd5c8, roughness: 0.9, metalness: 0 })),
        glass: keep(new THREE.MeshPhysicalMaterial({ color: 0x5d7a90, roughness: 0.06, metalness: 0.2, transparent: true, opacity: 0.72, envMapIntensity: 1.6 })),
        hall: keep(new THREE.MeshStandardMaterial({ color: 0xd7dadd, roughness: 0.6, metalness: 0.25 })),
        frame: keep(new THREE.MeshStandardMaterial({ color: 0x3a4048, roughness: 0.5, metalness: 0.4 })),
        door: keep(new THREE.MeshStandardMaterial({ color: 0xc4c9ce, roughness: 0.45, metalness: 0.35 })),
        green: keep(new THREE.MeshStandardMaterial({ color: 0x8e9c6a, roughness: 1, metalness: 0 })),
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

  // Oriented box along a facade segment: u = along, v = height, w = depth (+ outward)
  const segBox = (seg, u0, u1, y0, y1, w0, w1) => {
    const { x1, z1, ang, nx, nz } = seg;
    const L = u1 - u0, H = y1 - y0, D = w1 - w0;
    if (L <= 0.001 || H <= 0.001 || D <= 0.001) return null;
    const g = new THREE.BoxGeometry(L, H, D);
    g.rotateY(-ang);
    const u = (u0 + u1) / 2, w = (w0 + w1) / 2;
    g.translate(x1 + Math.cos(ang) * u + nx * w, (y0 + y1) / 2, z1 + Math.sin(ang) * u + nz * w);
    return g;
  };
  // Facade segment with its outward normal (away from the footprint)
  const segment = ([x1, z1, x2, z2], footprint) => {
    const L = Math.hypot(x2 - x1, z2 - z1);
    const ang = Math.atan2(z2 - z1, x2 - x1);
    let nx = -Math.sin(ang), nz = Math.cos(ang);
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
    if (pointInPoly(cx + nx * 0.4, cz + nz * 0.4, footprint)) { nx = -nx; nz = -nz; }
    return { x1, z1, L, ang, nx, nz };
  };
  // Glass curtain wall with mullion grid (w = offset of the glass plane)
  const curtain = (seg, sill, head, w, glass, frame, bay = 1.2, rows = 4) => {
    const n = Math.max(1, Math.round(seg.L / bay));
    glass.push(segBox(seg, 0, seg.L, sill, head, w - 0.02, w + 0.02));
    const f = 0.07;
    for (let i = 0; i <= n; i++) {
      const u = (seg.L * i) / n;
      frame.push(segBox(seg, Math.max(0, u - f / 2), Math.min(seg.L, u + f / 2), sill, head, w - 0.05, w + 0.05));
    }
    for (let j = 0; j <= rows; j++) {
      const y = sill + ((head - sill) * j) / rows;
      frame.push(segBox(seg, 0, seg.L, Math.max(sill, y - f / 2), Math.min(head, y + f / 2), w - 0.05, w + 0.05));
    }
  };
  // Sectional door: stacked panels (edges read as panel joints)
  const door = (seg, sill, head, w, panels) => {
    const n = Math.max(2, Math.round((head - sill) / 0.55));
    for (let i = 0; i < n; i++) {
      const y0 = sill + ((head - sill) * i) / n;
      panels.push(segBox(seg, 0, seg.L, y0 + 0.01, y0 + (head - sill) / n - 0.01, w - 0.04, w + 0.04));
    }
  };
  const clean = (arr) => arr.filter(Boolean);

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

    // Openings: sill + lintel (wall), framed glass pane with transom, half a wall inwards
    const T = 0.3;
    const sill = lv.sill ?? 0.85;
    const head = Math.min(lv.head ?? 2.35, h - 0.1);
    const solid = [];
    const glass = [];
    const frame = [];
    const panels = [];
    lv.openings.forEach((o) => {
      const seg = segment(o, lv.footprint);
      if (seg.L < 0.3) return;
      const w = -T / 2; // negative = inwards
      if (sill > 0.02) solid.push(segBox(seg, 0, seg.L, 0, sill, -T, 0));
      solid.push(segBox(seg, 0, seg.L, head, h, -T, 0));
      glass.push(segBox(seg, 0, seg.L, sill, head, w - 0.02, w + 0.02));
      if (seg.L <= 3.2) {
        const f = 0.06;
        frame.push(segBox(seg, 0, f, sill, head, w - 0.04, w + 0.04));
        frame.push(segBox(seg, seg.L - f, seg.L, sill, head, w - 0.04, w + 0.04));
        frame.push(segBox(seg, 0, seg.L, head - f, head, w - 0.04, w + 0.04));
        frame.push(segBox(seg, 0, seg.L, sill, sill + f, w - 0.04, w + 0.04));
        if (head - sill > 1.6) {
          const y = sill + (head - sill) * 0.36;
          frame.push(segBox(seg, 0, seg.L, y - f / 2, y + f / 2, w - 0.04, w + 0.04));
        }
      }
    });
    (lv.curtains || []).forEach(([x1, z1, x2, z2, cs = 0, ch = h - 0.4]) => {
      const seg = segment([x1, z1, x2, z2], lv.footprint);
      solid.push(segBox(seg, 0, seg.L, ch, h, -T, 0));
      curtain(seg, cs, ch, -0.08, glass, frame);
    });
    (lv.doors || []).forEach(([x1, z1, x2, z2, ds = 0, dh = 3]) => {
      const seg = segment([x1, z1, x2, z2], lv.footprint);
      solid.push(segBox(seg, 0, seg.L, dh, h, -T, 0));
      door(seg, ds, dh, -0.1, panels);
    });
    content.add(meshWithEdges(merged(clean(solid)), mats.wall, mats.line));
    const glassGeo = merged(clean(glass));
    if (glassGeo) {
      const gm = new THREE.Mesh(glassGeo, mats.glass);
      content.add(gm);
      if (blueprint) content.add(new THREE.LineSegments(keep(new THREE.EdgesGeometry(glassGeo, 25)), mats.lineSoft));
    }
    const frameGeo = merged(clean(frame));
    if (frameGeo) {
      const fm = new THREE.Mesh(frameGeo, mats.frame);
      fm.castShadow = !blueprint;
      content.add(fm);
    }
    content.add(meshWithEdges(merged(clean(panels)), mats.door, mats.lineSoft));

    // Balconies: slab at floor level with glass railing on the free edges
    const bal = data.balconies;
    if (bal && bal.levels.some((b) => Math.abs(b - lv.base) < 0.01)) {
      content.add(meshWithEdges(merged(extrude(bal.slabs.map((o) => ({ o, h: [] })), 0.22, -0.22)), mats.slab, mats.line, 30));
      const pane = [], rail = [];
      const rh = bal.rail ?? 1.0;
      bal.rails.forEach(([x1, z1, x2, z2]) => {
        const L = Math.hypot(x2 - x1, z2 - z1);
        const seg = { x1, z1, L, ang: Math.atan2(z2 - z1, x2 - x1), nx: 0, nz: 0 };
        pane.push(segBox(seg, 0.05, L - 0.05, 0.05, rh - 0.05, -0.012, 0.012));
        rail.push(segBox(seg, 0, L, rh - 0.05, rh, -0.03, 0.03));
        for (let u = 0; u <= L + 0.01; u += Math.max(1.2, L / Math.max(1, Math.round(L / 1.5)))) {
          rail.push(segBox(seg, Math.max(0, u - 0.025), Math.min(L, u + 0.025), 0, rh, -0.025, 0.025));
        }
      });
      const pg = merged(clean(pane));
      if (pg) content.add(new THREE.Mesh(pg, mats.glass));
      const rg = merged(clean(rail));
      if (rg) content.add(new THREE.Mesh(rg, mats.frame));
    }
    // Louvred towers (Reduit) running through the levels
    (data.louvres || []).forEach((l) => {
      const y1 = Math.min(h, l.y1 - lv.base);
      if (y1 <= 0.05 || l.y0 > lv.base + h) return;
      const xs = l.o.map((q) => q[0]), zs = l.o.map((q) => q[1]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
      const core = new THREE.BoxGeometry(x1 - x0 - 0.1, y1, z1 - z0 - 0.1);
      core.translate((x0 + x1) / 2, y1 / 2, (z0 + z1) / 2);
      content.add(new THREE.Mesh(keep(core), mats.door));
      const slats = [];
      for (let y = 0.12; y < y1 - 0.02; y += 0.24) {
        const g = new THREE.BoxGeometry(x1 - x0, 0.035, z1 - z0);
        g.translate((x0 + x1) / 2, y, (z0 + z1) / 2);
        slats.push(g);
      }
      const sg = merged(slats);
      if (sg) content.add(new THREE.Mesh(sg, mats.frame));
    });

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
  if (data.roof?.extra?.length) {
    roof.add(meshWithEdges(merged(extrude(data.roof.extra, 0.3, 0.05)), mats.slab, mats.line, 30));
  }
  if (data.roof?.green) {
    const gm = new THREE.Mesh(merged(extrude([{ o: top.footprint, h: [] }], 0.1, 0.35)), mats.green);
    gm.receiveShadow = !blueprint;
    roof.add(gm);
  }
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
    const glass = [], frame = [], panels = [];
    (v.curtains || []).forEach(([x1, z1, x2, z2, cs = 0, ch = v.height - 0.4, bay = 1.2, rows = 4]) => {
      curtain(segment([x1, z1, x2, z2], v.footprint), cs, ch, 0.04, glass, frame, bay, rows);
    });
    (v.doors || []).forEach(([x1, z1, x2, z2, ds = 0, dh = 3.8]) => {
      door(segment([x1, z1, x2, z2], v.footprint), ds, dh, 0.04, panels);
    });
    const gGeo = merged(clean(glass));
    if (gGeo) extras.add(new THREE.Mesh(gGeo, mats.glass));
    const fGeo = merged(clean(frame));
    if (fGeo) { const fm = new THREE.Mesh(fGeo, mats.frame); fm.castShadow = !blueprint; extras.add(fm); }
    extras.add(meshWithEdges(merged(clean(panels)), mats.door, mats.lineSoft));
    if (v.roof) {
      // flat roof slab with overhang on the free sides, optional green layer
      const xs = v.footprint.map((p) => p[0]), zs = v.footprint.map((p) => p[1]);
      const [ox0, ox1, oz0, oz1] = v.roof.overhang || [0.3, 0.3, 0.3, 0.3];
      const x0 = Math.min(...xs) - ox0, x1 = Math.max(...xs) + ox1;
      const z0 = Math.min(...zs) - oz0, z1 = Math.max(...zs) + oz1;
      const slab = new THREE.BoxGeometry(x1 - x0, 0.32, z1 - z0);
      slab.translate((x0 + x1) / 2, v.height + 0.16, (z0 + z1) / 2);
      extras.add(meshWithEdges(keep(slab), mats.slab, mats.line, 30));
      if (v.roof.green) {
        const gg = new THREE.BoxGeometry(x1 - x0 - 0.4, 0.1, z1 - z0 - 0.4);
        gg.translate((x0 + x1) / 2, v.height + 0.37, (z0 + z1) / 2);
        const gm = new THREE.Mesh(keep(gg), mats.green);
        gm.receiveShadow = !blueprint;
        extras.add(gm);
      }
    }
  });
  (data.details || []).forEach((d) => {
    const g = new THREE.BoxGeometry(d.w, d.y1 - d.y0, d.d);
    g.translate(d.x, (d.y0 + d.y1) / 2, d.z);
    roof.add(meshWithEdges(keep(g), mats.wall, mats.line));
    if (d.cap) {
      const c = new THREE.BoxGeometry(d.w + 0.12, 0.12, d.d + 0.12);
      c.translate(d.x, d.y1 + 0.06, d.z);
      roof.add(meshWithEdges(keep(c), mats.frame, null));
    }
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
