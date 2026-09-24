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
        metal: keep(new THREE.MeshBasicMaterial({ color: 0xe6efff, transparent: true, opacity: 0.18, depthWrite: false })),
        blind: keep(new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide })),
        pv: keep(new THREE.MeshBasicMaterial({ color: 0xbfd6ff, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide })),
        wood: keep(new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: 0.08, depthWrite: false, side: THREE.DoubleSide })),
        shutter: keep(new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide })),
        beam: keep(new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: 0.12, depthWrite: false })),
        stone: keep(new THREE.MeshBasicMaterial({ color: 0x9cc0ff, transparent: true, opacity: 0.08, depthWrite: false })),
        line: keep(new THREE.LineBasicMaterial({ color: 0xe6efff, transparent: true, opacity: 0.8 })),
        lineSoft: keep(new THREE.LineBasicMaterial({ color: 0xe6efff, transparent: true, opacity: 0.35 })),
      }
    : {
        wall: keep(new THREE.MeshStandardMaterial({ color: 0xf5f3ee, roughness: 0.92, metalness: 0 })),
        part: keep(new THREE.MeshStandardMaterial({ color: 0xebe6dc, roughness: 0.95, metalness: 0 })),
        slab: keep(new THREE.MeshStandardMaterial({ color: 0xdcd5c8, roughness: 0.9, metalness: 0, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })),
        glass: keep(new THREE.MeshPhysicalMaterial({ color: 0x5d7a90, roughness: 0.06, metalness: 0.2, transparent: true, opacity: 0.72, envMapIntensity: 1.6 })),
        hall: keep(new THREE.MeshStandardMaterial({ color: 0xd7dadd, roughness: 0.6, metalness: 0.25 })),
        frame: keep(new THREE.MeshStandardMaterial({ color: 0x3a4048, roughness: 0.5, metalness: 0.4 })),
        door: keep(new THREE.MeshStandardMaterial({ color: 0xc4c9ce, roughness: 0.45, metalness: 0.35 })),
        // extensive green roof (sedum) — reddish brown in summer, as in the drone photos
        green: keep(new THREE.MeshStandardMaterial({ color: 0x8c5b45, roughness: 1, metalness: 0 })),
        metal: keep(new THREE.MeshStandardMaterial({ color: 0xbfc4c9, roughness: 0.35, metalness: 0.55 })),
        blind: keep(new THREE.MeshStandardMaterial({ color: 0x8f969d, roughness: 0.55, metalness: 0.3, side: THREE.DoubleSide })),
        pv: keep(new THREE.MeshStandardMaterial({ color: 0x7d858c, roughness: 0.4, metalness: 0.7 })),
        // weathered timber (cladding, Laube) and painted window shutters (Jalousieläden)
        wood: keep(new THREE.MeshStandardMaterial({ color: 0x9a7a5a, roughness: 0.9, metalness: 0 })),
        shutter: keep(new THREE.MeshStandardMaterial({ color: 0x5f7466, roughness: 0.7, metalness: 0 })),
        // dark oak of the half-timbering / verge boards, sandstone of quoins and plinth
        beam: keep(new THREE.MeshStandardMaterial({ color: 0x5e4533, roughness: 0.85, metalness: 0 })),
        stone: keep(new THREE.MeshStandardMaterial({ color: 0xd4cbb8, roughness: 0.95, metalness: 0 })),
        line: keep(new THREE.LineBasicMaterial({ color: 0x2b3440, transparent: true, opacity: 0.28 })),
        lineSoft: keep(new THREE.LineBasicMaterial({ color: 0x2b3440, transparent: true, opacity: 0.16 })),
      };

  if (!blueprint && data.frameColor != null) mats.frame.color.setHex(data.frameColor);

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
  const door = (seg, sill, head, w, panels, glassRow = -1, glass = null) => {
    const n = Math.max(2, Math.round((head - sill) / 0.55));
    for (let i = 0; i < n; i++) {
      const y0 = sill + ((head - sill) * i) / n;
      const target = i === glassRow && glass ? glass : panels;
      target.push(segBox(seg, 0, seg.L, y0 + 0.01, y0 + (head - sill) / n - 0.01, w - 0.04, w + 0.04));
    }
  };
  // point on a facade segment (u along, y up, w outward)
  const segPt = (seg, u, y, w) => [seg.x1 + Math.cos(seg.ang) * u + seg.nx * w, y, seg.z1 + Math.sin(seg.ang) * u + seg.nz * w];
  const hash = (a, b, c) => { const v = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453; return v - Math.floor(v); };
  const clean = (arr) => arr.filter(Boolean);

  // Pitched roofs: top surface y = min over planes (a·x + b·z + c); walls are cut to its underside
  const pitched = data.roof?.pitched || null;
  const roofTop = pitched ? (x, z) => Math.min(...pitched.planes.map(([a, b, c]) => a * x + b * z + c)) : null;
  const cutToRoof = (obj, base) => {
    if (!pitched) return;
    const under = pitched.thick ?? 0.3;
    obj.traverse((o) => {
      const pos = o.geometry?.attributes?.position;
      if (!pos) return;
      for (let i = 0; i < pos.count; i++) {
        const lim = roofTop(pos.getX(i), pos.getZ(i)) - under - base;
        if (pos.getY(i) > lim) pos.setY(i, lim);
      }
      pos.needsUpdate = true;
      o.geometry.computeVertexNormals?.();
      o.geometry.computeBoundingSphere?.();
    });
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
    const edge = blueprint ? mats.line : null;
    content.add(meshWithEdges(merged(extrude(lv.walls, h)), mats.wall, edge));
    content.add(meshWithEdges(merged(extrude(lv.partitions, h - 0.05)), mats.part, mats.lineSoft));

    // Openings: sill + lintel (wall), framed glass pane with transom, half a wall inwards
    const T = 0.3;
    const sill0 = lv.sill ?? 0.85;
    const head0 = Math.min(lv.head ?? 2.35, h - 0.1);
    const solid = [];
    const glass = [];
    const frame = [];
    const panels = [];
    const blinds = [];
    const slats = [];
    const shutters = [];
    lv.openings.forEach((o) => {
      const seg = segment(o, lv.footprint);
      if (seg.L < 0.3) return;
      const sill = o[4] ?? sill0;        // optional per-opening sill / head (doors vs windows)
      const head = Math.min(o[5] ?? head0, h - 0.1);
      const w = -T / 2; // negative = inwards
      // external venetian blinds (Raffstoren), some lowered — as on the hotel photos
      if (!blueprint && data.blinds !== false && lv.base > 0.1 && seg.L <= 3.2) {
        const r = hash(o[0], o[1], lv.base);
        if (r < 0.45) {
          const f = [0.3, 0.55, 1, 0.8, 1][Math.floor(r * 11) % 5];
          const yb = head - f * (head - sill);
          blinds.push(segBox(seg, 0.03, seg.L - 0.03, yb, head, -0.075, -0.05));
          for (let y = head - 0.08; y > yb + 0.02; y -= 0.085) {
            slats.push(...segPt(seg, 0.03, y, -0.045), ...segPt(seg, seg.L - 0.03, y, -0.045));
          }
        }
      }
      if (o[6] && !blueprint) {
        // folding shutters open against the wall on both sides, with louvre lines
        const sw = seg.L / 2;
        [[-sw - 0.04, -0.04], [seg.L + 0.04, seg.L + sw + 0.04]].forEach(([u0, u1]) => {
          shutters.push(segBox(seg, u0, u1, sill, head, 0.01, 0.05));
          for (let y = sill + 0.08; y < head - 0.04; y += 0.07) slats.push(...segPt(seg, u0 + 0.03, y, 0.055), ...segPt(seg, u1 - 0.03, y, 0.055));
        });
      }
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
    const head = head0;
    (lv.curtains || []).forEach(([x1, z1, x2, z2, cs = 0, ch = h - 0.4]) => {
      const seg = segment([x1, z1, x2, z2], lv.footprint);
      solid.push(segBox(seg, 0, seg.L, ch, h, -T, 0));
      curtain(seg, cs, ch, -0.08, glass, frame);
    });
    (lv.doors || []).forEach(([x1, z1, x2, z2, ds = 0, dh = 3, glassRow = -1]) => {
      const seg = segment([x1, z1, x2, z2], lv.footprint);
      solid.push(segBox(seg, 0, seg.L, dh, h, -T, 0));
      door(seg, ds, dh, -0.1, panels, glassRow, glass);
    });
    // Vertical board cladding (Ökonomieteil): 14 cm boards with open joints, left out at the openings
    const boards = [];
    (lv.cladding || []).forEach(([x1, z1, x2, z2, y0 = 0, y1 = h, dirH = 0]) => {
      const seg = segment([x1, z1, x2, z2], lv.footprint);
      const dx = Math.cos(seg.ang), dz = Math.sin(seg.ang);
      const holes = [];
      lv.openings.forEach((o) => {
        const off = (px, pz) => Math.abs((px - x1) * -dz + (pz - z1) * dx);
        if (off(o[0], o[1]) > 0.35 || off(o[2], o[3]) > 0.35) return;
        const ua = (o[0] - x1) * dx + (o[1] - z1) * dz, ub = (o[2] - x1) * dx + (o[3] - z1) * dz;
        holes.push([Math.min(ua, ub) - 0.08, Math.max(ua, ub) + 0.08, (o[4] ?? sill0) - 0.08, Math.min(o[5] ?? head0, h - 0.1) + 0.08]);
      });
      if (dirH) {
        // horizontal boards (Stülpschalung look): courses of 16 cm, cut around the openings
        for (let y = y0; y < y1 - 0.02; y += 0.16) {
          const ye = Math.min(y1, y + 0.145), ym = (y + ye) / 2;
          let us = [[0, seg.L]];
          holes.filter(([, , hy0, hy1]) => ym > hy0 && ym < hy1).forEach(([a, b]) => {
            us = us.flatMap(([p, q]) => [[p, Math.min(q, a)], [Math.max(p, b), q]]).filter(([p, q]) => q - p > 0.03);
          });
          us.forEach(([p, q]) => boards.push(segBox(seg, p, q, y, ye, 0.0, 0.035)));
        }
        return;
      }
      for (let u = 0; u < seg.L - 0.02; u += 0.14) {
        const ue = Math.min(seg.L, u + 0.128), um = (u + ue) / 2;
        let ys = [[y0, y1]];
        holes.filter(([a, b]) => um > a && um < b).forEach(([, , hy0, hy1]) => {
          ys = ys.flatMap(([p, q]) => [[p, Math.min(q, hy0)], [Math.max(p, hy1), q]]).filter(([p, q]) => q - p > 0.03);
        });
        ys.forEach(([p, q]) => boards.push(segBox(seg, u, ue, p, q, 0.0, 0.035)));
      }
    });
    const boardGeo = merged(clean(boards));
    if (boardGeo) {
      const bm = new THREE.Mesh(boardGeo, mats.wood);
      bm.castShadow = !blueprint;
      bm.receiveShadow = !blueprint;
      content.add(bm);
    }
    content.add(meshWithEdges(merged(clean(solid)), mats.wall, edge));
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
    const blindGeo = merged(clean(blinds));
    if (blindGeo) {
      const bm = new THREE.Mesh(blindGeo, mats.blind);
      bm.castShadow = true;
      content.add(bm);
    }
    const shutterGeo = merged(clean(shutters));
    if (shutterGeo) {
      const sm = new THREE.Mesh(shutterGeo, mats.shutter);
      sm.castShadow = true;
      content.add(sm);
    }
    if (slats.length) {
      const sg = keep(new THREE.BufferGeometry());
      sg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(slats), 3));
      content.add(new THREE.LineSegments(sg, mats.lineSoft));
    }
    // Canopies on this level (e.g. entrance roof with planting)
    (data.canopies || []).filter((c) => Math.abs((c.level ?? 0) - lv.base) < 0.01).forEach((c) => {
      content.add(meshWithEdges(merged(extrude([{ o: c.o, h: [] }], c.t ?? 0.3, c.y - (c.t ?? 0.3))), mats.slab, mats.line, 30));
      if (c.green && !blueprint) {
        const inset = c.o;
        const gm = new THREE.Mesh(merged(extrude([{ o: inset, h: [] }], 0.08, c.y)), mats.green);
        gm.receiveShadow = true;
        content.add(gm);
      }
      (c.posts || []).forEach(([px, pz]) => {
        const g = new THREE.BoxGeometry(0.25, c.y - (c.t ?? 0.3), 0.25);
        g.translate(px, (c.y - (c.t ?? 0.3)) / 2, pz);
        content.add(meshWithEdges(keep(g), mats.slab, mats.lineSoft));
      });
    });

    // Balconies: slab at floor level with glass railing on the free edges
    const bals = Array.isArray(data.balconies) ? data.balconies : data.balconies ? [data.balconies] : [];
    bals.filter((bal) => bal.levels.some((b) => Math.abs(b - lv.base) < 0.01)).forEach((bal) => {
      content.add(meshWithEdges(merged(extrude(bal.slabs.map((o) => ({ o, h: [] })), 0.22, -0.22)), mats.slab, mats.line, 30));
      const pane = [], rail = [], board = [];
      const rh = bal.rail ?? 1.0;
      bal.rails.forEach(([x1, z1, x2, z2]) => {
        const L = Math.hypot(x2 - x1, z2 - z1);
        const seg = { x1, z1, L, ang: Math.atan2(z2 - z1, x2 - x1), nx: 0, nz: 0 };
        if (bal.style === 'bars') {
          // metal bar railing (vertical balusters)
          for (let u = 0.06; u < L - 0.03; u += 0.12) rail.push(segBox(seg, u - 0.012, u + 0.012, 0.05, rh - 0.04, -0.012, 0.012));
          rail.push(segBox(seg, 0, L, 0.04, 0.08, -0.02, 0.02));
        } else if (bal.style === 'balusters') {
          // turned wooden balusters between a bottom and a top rail
          for (let u = 0.08; u < L - 0.05; u += 0.15) board.push(segBox(seg, u - 0.03, u + 0.03, 0.08, rh - 0.05, -0.03, 0.03));
          board.push(segBox(seg, 0, L, 0.02, 0.1, -0.05, 0.05));
        } else if (bal.style === 'boards') {
          // timber Laube parapet: vertical boards with joints
          for (let u = 0.02; u < L - 0.02; u += 0.13) board.push(segBox(seg, u, Math.min(L - 0.02, u + 0.118), 0.04, rh - 0.06, -0.02, 0.02));
        } else {
          pane.push(segBox(seg, 0.05, L - 0.05, 0.05, rh - 0.05, -0.012, 0.012));
        }
        rail.push(segBox(seg, 0, L, rh - 0.05, rh, -0.03, 0.03));
        for (let u = 0; u <= L + 0.01; u += Math.max(1.2, L / Math.max(1, Math.round(L / 1.5)))) {
          rail.push(segBox(seg, Math.max(0, u - 0.025), Math.min(L, u + 0.025), 0, rh, -0.025, 0.025));
        }
      });
      const pg = merged(clean(pane));
      if (pg) content.add(new THREE.Mesh(pg, mats.glass));
      const rg = merged(clean(rail));
      if (rg) content.add(new THREE.Mesh(rg, bal.style === 'boards' || bal.style === 'balusters' ? mats.wood : mats.frame));
      const bg = merged(clean(board));
      if (bg) { const m = new THREE.Mesh(bg, mats.wood); m.castShadow = !blueprint; content.add(m); }
    });
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

    cutToRoof(content, lv.base);

    // Floor slab (not on the ground floor)
    let slab = null;
    if (Math.abs(lv.base) > 0.01) {
      slab = meshWithEdges(merged(extrude([{ o: lv.footprint, h: [] }], 0.3, -0.3)), mats.slab, blueprint ? mats.line : null, 30);
      group.add(slab);
    }
    root.add(group);
    return { ...lv, group, content, slab };
  });

  // Roof + parapet on the top level
  const top = levels[levels.length - 1];
  const roof = new THREE.Group();
  roof.position.y = top.base + top.height;
  const roofY = roof.position.y;
  let roofMat = mats.slab;
  if (pitched) {
    // roof faces: extruded plan polygon sheared onto its plane, with tile courses
    const th = pitched.thick ?? 0.3;
    const tileMat = blueprint ? mats.slab : keep(new THREE.MeshStandardMaterial({ color: pitched.color ?? 0x7b6a5e, roughness: 0.85, metalness: 0.05 }));
    roofMat = tileMat;
    const faceGeos = [];
    const courses = [];
    pitched.faces.forEach(({ pts, plane }) => {
      const [a, b, c] = pitched.planes[plane];
      const g = new THREE.ExtrudeGeometry(shapeOf({ o: pts, h: [] }), { depth: th, bevelEnabled: false, curveSegments: 1 });
      g.rotateX(-Math.PI / 2);
      const pos = g.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), z = pos.getZ(i);
        pos.setY(i, a * x + b * z + c - th + pos.getY(i) - roofY);
      }
      g.computeVertexNormals();
      faceGeos.push(g);
      // tile courses: lines along the contour direction every 0.33 m up the slope
      const slope = Math.hypot(a, b);
      if (slope > 1e-3 && !blueprint) {
        const ux = -b / slope, uz = a / slope;          // along contour
        const dx = a / slope, dz = b / slope;           // up the slope (plan)
        const xs = pts.map((q) => q[0] * dx + q[1] * dz);
        const lo = Math.min(...xs), hi = Math.max(...xs);
        const us = pts.map((q) => q[0] * ux + q[1] * uz);
        const step = 0.33 * Math.cos(Math.atan(slope));
        for (let s = lo + step; s < hi - 0.02; s += step) {
          // clip the course to the face: crossings of the outline, paired inside-out
          const cuts = [];
          for (let i = 0; i < pts.length; i++) {
            const j = (i + 1) % pts.length;
            const si = xs[i] - s, sj = xs[j] - s;
            if ((si < 0) !== (sj < 0)) cuts.push(us[i] + (us[j] - us[i]) * (si / (si - sj)));
          }
          cuts.sort((p, q) => p - q);
          for (let k = 0; k + 1 < cuts.length; k += 2) {
            [cuts[k], cuts[k + 1]].forEach((u) => {
              const x = ux * u + dx * s, z = uz * u + dz * s;
              courses.push(x, a * x + b * z + c + 0.01 - roofY, z);
            });
          }
        }
      }
    });
    const rg = merged(faceGeos);
    if (rg) {
      const m = new THREE.Mesh(rg, tileMat);
      m.castShadow = !blueprint;
      m.receiveShadow = !blueprint;
      roof.add(m);
      if (blueprint) roof.add(new THREE.LineSegments(keep(new THREE.EdgesGeometry(rg, 30)), mats.line));
    }
    if (courses.length) {
      const cg = keep(new THREE.BufferGeometry());
      cg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(courses), 3));
      roof.add(new THREE.LineSegments(cg, keep(new THREE.LineBasicMaterial({ color: 0x3e342d, transparent: true, opacity: 0.35 }))));
    }
  } else {
  roof.add(meshWithEdges(merged(extrude([{ o: top.footprint, h: [] }], 0.35)), mats.slab, blueprint ? mats.line : null, 30));
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
  const caps = [];
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
    const cap = new THREE.BoxGeometry(L + 0.4, 0.06, 0.42);
    cap.rotateY(-ang);
    cap.translate((x1 + x2) / 2, 0.35 + 0.8 + 0.03, (z1 + z2) / 2);
    caps.push(cap);
  }
  roof.add(meshWithEdges(merged(par), mats.wall, blueprint ? mats.line : null));
  const capGeo = merged(caps);
  if (capGeo) roof.add(new THREE.Mesh(capGeo, mats.metal));
  }
  // Rooftop: PV rows, ventilation ducts, technical boxes
  const rd = data.roofDetails || {};
  const ducts = [], boxes = [];
  // Eisregister (unglazed metal absorbers for the ice-storage heat pump): framed fin panels on low stands
  const regs = [], fins = [];
  (rd.absorbers || []).forEach(([x1, z1, x2, z2]) => {
    const L = Math.hypot(x2 - x1, z2 - z1), ang = Math.atan2(z2 - z1, x2 - x1);
    const n = Math.max(1, Math.floor(L / 2.1));
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) * (L / n);
      const cx = x1 + Math.cos(ang) * u, cz = z1 + Math.sin(ang) * u;
      const frame = new THREE.BoxGeometry(2.0, 0.08, 1.2);
      frame.rotateX(0.35);
      frame.rotateY(-ang);
      frame.translate(cx, 0.95, cz);
      regs.push(frame);
      for (let k = -4; k <= 4; k++) {           // absorber fins across the panel
        const f = new THREE.BoxGeometry(0.035, 0.1, 1.16);
        f.rotateX(0.35);
        f.translate(k * 0.22, 0, 0);
        f.rotateY(-ang);
        f.translate(cx, 1.0, cz);
        fins.push(f);
      }
      [-0.9, 0.9].forEach((o) => {               // stands
        const st = new THREE.BoxGeometry(0.06, 0.55, 0.06);
        st.translate(o, 0, 0);
        st.rotateY(-ang);
        st.translate(cx, 0.68, cz);
        regs.push(st);
      });
    }
  });
  (rd.ducts || []).forEach(([x1, z1, x2, z2, r = 0.28]) => {
    const L = Math.hypot(x2 - x1, z2 - z1), ang = Math.atan2(z2 - z1, x2 - x1);
    const g = new THREE.CylinderGeometry(r, r, L + r, 12);
    g.rotateZ(Math.PI / 2);
    g.rotateY(-ang);
    g.translate((x1 + x2) / 2, 0.45 + r + 0.25, (z1 + z2) / 2);
    ducts.push(g);
  });
  (rd.boxes || []).forEach(([x, z, w, d, hh]) => {
    const g = new THREE.BoxGeometry(w, hh, d);
    g.translate(x, 0.45 + hh / 2, z);
    boxes.push(g);
  });
  const regGeo = merged(regs);
  if (regGeo) { const m = new THREE.Mesh(regGeo, mats.metal); m.castShadow = !blueprint; roof.add(m); }
  const finGeo = merged(fins);
  if (finGeo) { const m = new THREE.Mesh(finGeo, mats.pv); m.castShadow = !blueprint; roof.add(m); }
  const dGeo = merged(ducts);
  if (dGeo) { const m = new THREE.Mesh(dGeo, mats.metal); m.castShadow = !blueprint; roof.add(m); }
  roof.add(meshWithEdges(merged(boxes), mats.metal, mats.lineSoft));
  root.add(roof);

  // Extra volumes (e.g. steel hall) and site walls
  const extras = new THREE.Group();
  (data.volumes || []).forEach((v) => {
    extras.add(meshWithEdges(merged(extrude([{ o: v.footprint, h: [] }], v.height)), mats.hall, mats.line, 30));
    const glass = [], frame = [], panels = [];
    (v.curtains || []).forEach(([x1, z1, x2, z2, cs = 0, ch = v.height - 0.4, bay = 1.2, rows = 4]) => {
      curtain(segment([x1, z1, x2, z2], v.footprint), cs, ch, 0.04, glass, frame, bay, rows);
    });
    (v.doors || []).forEach(([x1, z1, x2, z2, ds = 0, dh = 3.8, glassRow = -1]) => {
      door(segment([x1, z1, x2, z2], v.footprint), ds, dh, 0.04, panels, glassRow, glass);
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
  const matOf = (k) => mats[k] || mats.wall;
  // a timber (or stone) member between two absolute points, lying in a facade with outward normal n
  const beamGeo = (a, b, w, t, n = [0, 1]) => {
    const A = new THREE.Vector3(a[0], a[1] - roofY, a[2]), B = new THREE.Vector3(b[0], b[1] - roofY, b[2]);
    const L = A.distanceTo(B);
    if (L < 0.01) return null;
    const xa = B.clone().sub(A).normalize();
    let za = new THREE.Vector3(n[0], 0, n[1]).normalize();
    if (Math.abs(xa.dot(za)) > 0.95) za = new THREE.Vector3(0, 1, 0);
    const ya = new THREE.Vector3().crossVectors(za, xa).normalize();
    za = new THREE.Vector3().crossVectors(xa, ya).normalize();
    const g = new THREE.BoxGeometry(L, w, t);
    g.applyMatrix4(new THREE.Matrix4().makeBasis(xa, ya, za));
    g.translate((A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2);
    return g;
  };
  const byMat = {};
  // facade details belong to the storey they sit on (so they hide / explode with it); roof details stay on the roof
  const levelAt = (y) => {
    const i = levels.findIndex((l) => !l.underground && y >= l.base - 0.01 && y < l.base + l.height);
    return i >= 0 ? i : levels.length - 1;
  };
  const addTo = (k, g, y = null) => {
    if (!g) return;
    const key = y === null ? k : `${levelAt(y)}|${k}`;
    (byMat[key] = byMat[key] || []).push(g);
  };
  (data.details || []).forEach((d) => {
    if (d.kind === 'beam') { addTo(d.mat || 'beam', beamGeo(d.a, d.b, d.w ?? 0.14, d.t ?? 0.05, d.n), d.roof ? null : (d.a[1] + d.b[1]) / 2); return; }
    if (d.kind === 'block') {
      // box with absolute heights (quoins, plinth, brackets)
      const g = new THREE.BoxGeometry(d.w, d.y1 - d.y0, d.d);
      g.translate(d.x, (d.y0 + d.y1) / 2 - roofY, d.z);
      addTo(d.mat || 'stone', g, (d.y0 + d.y1) / 2);
      return;
    }
    if (d.kind === 'stair') {
      // straight timber stair: treads between two stringers, rising from x0 (at y0) to x1 (at y1)
      const n = Math.max(2, Math.round((d.y1 - d.y0) / 0.18));
      const run = (d.x1 - d.x0) / n, rise = (d.y1 - d.y0) / n;
      for (let i = 0; i < n; i++) {
        const g = new THREE.BoxGeometry(Math.abs(run) + 0.03, 0.05, Math.abs(d.z1 - d.z0) - 0.1);
        g.translate(d.x0 + run * (i + 0.5), d.y0 + rise * (i + 1) - 0.025 - roofY, (d.z0 + d.z1) / 2);
        addTo('wood', g, d.y0 + 0.5);
      }
      [d.z0, d.z1].forEach((z) => addTo('wood', beamGeo([d.x0, d.y0 + 0.1, z], [d.x1, d.y1 + 0.1, z], 0.28, 0.06, [0, 1]), d.y0 + 0.5));
      return;
    }
    if (d.kind === 'skylight' && pitched) {
      // roof window lying in its roof plane: frame + glass
      const [a, b, c] = pitched.planes[d.plane];
      [[0.07, 'frame', 0.06], [0, 'glass', 0.1]].forEach(([grow, mk, lift]) => {
        const xs = d.pts.map((q) => q[0]), zs = d.pts.map((q) => q[1]);
        const cx = xs.reduce((p, q) => p + q, 0) / xs.length, cz = zs.reduce((p, q) => p + q, 0) / zs.length;
        const pts = d.pts.map(([x, z]) => [x + Math.sign(x - cx) * grow, z + Math.sign(z - cz) * grow]);
        const g = new THREE.ExtrudeGeometry(shapeOf({ o: pts, h: [] }), { depth: 0.05, bevelEnabled: false, curveSegments: 1 });
        g.rotateX(-Math.PI / 2);
        const pos = g.attributes.position;
        for (let i = 0; i < pos.count; i++) pos.setY(i, a * pos.getX(i) + b * pos.getZ(i) + c + lift - 0.05 + pos.getY(i) - roofY);
        g.computeVertexNormals();
        addTo(mk, g);
      });
      return;
    }
    if (d.kind === 'dormer' && d.gable) {
      // gabled dormer: pentagon front extruded back into the roof, two small roof slabs
      const { x0, x1, zf, zb, yb, yt, yr } = d;
      const dir = Math.sign(zf - zb), xm = (x0 + x1) / 2;
      const along = (pts, z0, z1) => {
        const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y - roofY))), { depth: Math.abs(z1 - z0), bevelEnabled: false, curveSegments: 1 });
        g.translate(0, 0, Math.min(z0, z1));
        return g;
      };
      addTo('wall', along([[x0, yb], [x1, yb], [x1, yt], [xm, yr], [x0, yt]], zf, zb));
      const o = 0.3, t = 0.12, k = (yr - yt) / (xm - x0);
      [[x0 - o, xm], [x1 + o, xm]].forEach(([xe, xr]) => {
        const ye = yt - k * o;
        addTo('roof', along([[xe, ye], [xr, yr + 0.03], [xr, yr + 0.03 + t], [xe, ye + t]], zf + dir * o, zb));
      });
      // verge boards on the front gable
      addTo('beam', beamGeo([x0 - o, yt - k * o - 0.02, zf + dir * (o + 0.02)], [xm, yr, zf + dir * (o + 0.02)], 0.2, 0.04, [0, dir]));
      addTo('beam', beamGeo([x1 + o, yt - k * o - 0.02, zf + dir * (o + 0.02)], [xm, yr, zf + dir * (o + 0.02)], 0.2, 0.04, [0, dir]));
      (d.win || []).forEach(([wa, wb, wy0, wy1]) => {
        const g = new THREE.BoxGeometry(wb - wa, wy1 - wy0, 0.04);
        g.translate((wa + wb) / 2, (wy0 + wy1) / 2 - roofY, zf + dir * 0.02);
        addTo('glass', g);
        const n = Math.max(1, Math.round((wb - wa) / 0.5));
        for (let i = 0; i <= n; i++) {
          const f = new THREE.BoxGeometry(0.06, wy1 - wy0, 0.08);
          f.translate(wa + ((wb - wa) * i) / n, (wy0 + wy1) / 2 - roofY, zf + dir * 0.04);
          addTo('frame', f);
        }
        [wy0, wy1].forEach((y) => {
          const f = new THREE.BoxGeometry(wb - wa, 0.06, 0.08);
          f.translate((wa + wb) / 2, y - roofY, zf + dir * 0.04);
          addTo('frame', f);
        });
      });
      return;
    }
    if (d.kind === 'dormer') {
      // shed dormer (Schleppgaube): front wall at zf, its roof rising back into the main roof at zb.
      // Heights are absolute: yb = foot of the front (buried in the roof), yt = front top, ytb = roof line at zb.
      const { x0, x1, zf, zb, yb, yt, ytb } = d;
      const dir = Math.sign(zf - zb);
      const prof = (pts) => {
        // profile in (z, y) extruded along x from x0 to x1 (shape u = -z so the rotation maps it back to +z)
        const sh = new THREE.Shape(pts.map(([z, y]) => new THREE.Vector2(-z, y - roofY)));
        const g = new THREE.ExtrudeGeometry(sh, { depth: 1, bevelEnabled: false, curveSegments: 1 });
        g.rotateY(Math.PI / 2);
        return g;
      };
      const body = prof([[zf, yb], [zf, yt], [zb, ytb], [zb, yb]]);
      body.scale(x1 - x0, 1, 1);
      body.translate(x0, 0, 0);
      roof.add(meshWithEdges(keep(body), mats.wall, blueprint ? mats.line : null, 30));
      const o = 0.35, t = 0.14, k = (ytb - yt) / (zb - zf);
      const cap = prof([[zf + dir * o, yt - k * dir * o + 0.02], [zb, ytb + 0.02], [zb, ytb + 0.02 + t], [zf + dir * o, yt - k * dir * o + 0.02 + t]]);
      cap.scale(x1 - x0 + 0.5, 1, 1);
      cap.translate(x0 - 0.25, 0, 0);
      const cm = new THREE.Mesh(keep(cap), roofMat);
      cm.castShadow = !blueprint;
      roof.add(cm);
      // window band on the front
      const gl = [], fr = [];
      (d.win || []).forEach(([wa, wb, wy0, wy1]) => {
        const g = new THREE.BoxGeometry(wb - wa, wy1 - wy0, 0.04);
        g.translate((wa + wb) / 2, (wy0 + wy1) / 2 - roofY, zf + dir * 0.02);
        gl.push(g);
        const n = Math.max(1, Math.round((wb - wa) / 0.5));
        for (let i = 0; i <= n; i++) {
          const f = new THREE.BoxGeometry(0.06, wy1 - wy0, 0.08);
          f.translate(wa + ((wb - wa) * i) / n, (wy0 + wy1) / 2 - roofY, zf + dir * 0.04);
          fr.push(f);
        }
        [wy0, wy1].forEach((y) => {
          const f = new THREE.BoxGeometry(wb - wa, 0.06, 0.08);
          f.translate((wa + wb) / 2, y - roofY, zf + dir * 0.04);
          fr.push(f);
        });
      });
      const gg = merged(gl);
      if (gg) roof.add(new THREE.Mesh(gg, mats.glass));
      const fg = merged(fr);
      if (fg) roof.add(new THREE.Mesh(fg, mats.frame));
      return;
    }
    const g = new THREE.BoxGeometry(d.w, d.y1 - d.y0, d.d);
    g.translate(d.x, (d.y0 + d.y1) / 2, d.z);
    roof.add(meshWithEdges(keep(g), d.kind === 'post' ? mats.wood : mats.wall, d.kind === 'post' ? null : mats.line));
    if (d.cap) {
      const c = new THREE.BoxGeometry(d.w + 0.12, 0.12, d.d + 0.12);
      c.translate(d.x, d.y1 + 0.06, d.z);
      roof.add(meshWithEdges(keep(c), mats.frame, null));
    }
  });
  Object.entries(byMat).forEach(([key, geos]) => {
    const g = merged(geos);
    if (!g) return;
    const [li, k] = key.includes('|') ? key.split('|') : [null, key];
    const parent = li === null ? roof : levels[+li].content;
    if (li !== null) g.translate(0, roofY - levels[+li].base, 0);
    const m = new THREE.Mesh(g, k === 'roof' ? roofMat : matOf(k));
    m.castShadow = !blueprint && k !== 'glass';
    m.receiveShadow = !blueprint;
    parent.add(m);
    if (k === 'wall' && blueprint) parent.add(new THREE.LineSegments(keep(new THREE.EdgesGeometry(g, 30)), mats.line));
  });
  (data.site || []).forEach((s) => {
    if (s.kind === 'terrain') {
      // sloped ground / embankment: earth body with a grass top
      const earth = keep(new THREE.MeshStandardMaterial({ color: 0xa8957a, roughness: 1 }));
      const grass = keep(new THREE.MeshStandardMaterial({ color: 0x8aa46a, roughness: 1 }));
      const g = merged(extrude(s.polys, s.height - 0.08));
      if (g) { const m = new THREE.Mesh(g, blueprint ? mats.hall : earth); m.receiveShadow = true; m.castShadow = true; extras.add(m); }
      const t = merged(extrude(s.polys, 0.08, s.height - 0.08));
      if (t) { const m = new THREE.Mesh(t, blueprint ? mats.hall : grass); m.receiveShadow = true; extras.add(m); }
      return;
    }
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
