import * as THREE from "three";
import type { SolidKind } from "@/lib/step-scene";

/**
 * 手順の立体表示(three.js)。6種類の「型」を作る関数をここに集める。
 * どれも `SceneBuild` を返し、Scene3D 側が描画ループ・カメラ・ドラッグ回転・ラベルの重ね合わせを受け持つ。
 *
 * 色の役割は平面と同じ: 青=現在 / 緑=完了 / 薄い灰=未到達(グローは現在の1点だけ)。
 * 立体は「手順の進み具合」を形で見せる概念図で、実際の寸法や数値を表すものではない。
 */
export interface Palette {
  blue: THREE.Color;
  green: THREE.Color;
  amber: THREE.Color;
  muted: THREE.Color;
  text: THREE.Color;
  surface: THREE.Color;
  light: boolean;
}

export interface FixedLabel {
  text: string;
  object: THREE.Object3D;
}

export interface SceneBuild {
  /** ドラッグ・自動回転の対象 */
  root: THREE.Group;
  /** ステップ番号ごとのラベル位置(順番は steps と同じ)。空なら番号ラベルは出さない */
  anchors: THREE.Object3D[];
  /** 常時表示の小さな注記(RGBの軸名など) */
  fixedLabels: FixedLabel[];
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
  setStep(index: number): void;
  /** instant=true(動きを減らす設定)のときは補間せず即座に目標へ */
  update(
    dt: number,
    time: number,
    instant: boolean,
    camera: THREE.Camera,
  ): void;
  dispose(): void;
}

export interface BuildOptions {
  count: number;
  palette: Palette;
}

const UP = new THREE.Vector3(0, 1, 0);

/** 指数補間。dt に依らず同じ手触りで目標に近づく。instant なら即座に到達 */
function damp(
  current: number,
  target: number,
  rate: number,
  dt: number,
  instant: boolean,
): number {
  if (instant) return target;
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

function dampColor(
  color: THREE.Color,
  target: THREE.Color,
  rate: number,
  dt: number,
  instant: boolean,
) {
  if (instant) color.copy(target);
  else color.lerp(target, 1 - Math.exp(-rate * dt));
}

function disposeTree(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) material.forEach((m) => m.dispose());
    else material?.dispose();
  });
}

function stateOf(index: number, current: number): "done" | "current" | "todo" {
  return index < current ? "done" : index === current ? "current" : "todo";
}

/** 2点を結ぶ細い円柱(WebGLの線は太さを変えられないため) */
function makeRod(radius: number, material: THREE.Material): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, 1, 8, 1, true),
    material,
  );
}

function placeRod(rod: THREE.Mesh, from: THREE.Vector3, to: THREE.Vector3) {
  const direction = new THREE.Vector3().subVectors(to, from);
  const length = direction.length();
  rod.position.copy(from).addScaledVector(direction, 0.5);
  rod.scale.set(1, Math.max(length, 0.0001), 1);
  rod.quaternion.setFromUnitVectors(UP, direction.normalize());
}

/* ------------------------------------------------------------------ stack */

/** 層の分解図: 手順=1枚の層。現在の層だけが手前へ引き出され、その上の層は持ち上がって隙間が開く */
function buildStack({ count, palette }: BuildOptions): SceneBuild {
  const root = new THREE.Group();
  const gap = Math.min(0.46, 2.7 / count);
  const lift = 0.62;
  const slabGeometry = new THREE.BoxGeometry(3.3, 0.18, 2.2);
  const edgeGeometry = new THREE.EdgesGeometry(slabGeometry);

  const slabs = Array.from({ length: count }, (_, index) => {
    const material = new THREE.MeshStandardMaterial({
      color: palette.muted.clone(),
      emissive: palette.blue.clone(),
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.3,
      roughness: 0.55,
      metalness: 0.05,
    });
    const mesh = new THREE.Mesh(slabGeometry, material);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: palette.muted.clone(),
      transparent: true,
      opacity: 0.5,
    });
    mesh.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
    const anchor = new THREE.Object3D();
    anchor.position.set(1.8, 0, 0.9);
    mesh.add(anchor);
    root.add(mesh);
    return {
      mesh,
      material,
      edgeMaterial,
      anchor,
      baseY: (index - (count - 1) / 2) * gap,
      y: 0,
      x: 0,
      opacity: 0.3,
      glow: 0,
    };
  });
  slabs.forEach((slab) => (slab.y = slab.baseY));

  let current = 0;
  const target = new THREE.Color();

  return {
    root,
    anchors: slabs.map((slab) => slab.anchor),
    fixedLabels: [],
    cameraPosition: new THREE.Vector3(4.6, 3.2, 5.6),
    cameraTarget: new THREE.Vector3(0.2, 0, 0),
    setStep(index) {
      current = index;
    },
    update(dt, _time, instant) {
      slabs.forEach((slab, index) => {
        const state = stateOf(index, current);
        const goalY = slab.baseY + (index > current ? lift : 0);
        const goalX = state === "current" ? 0.55 : 0;
        slab.y = damp(slab.y, goalY, 7, dt, instant);
        slab.x = damp(slab.x, goalX, 7, dt, instant);
        slab.mesh.position.set(slab.x, slab.y, 0);
        const goalColor =
          state === "done"
            ? palette.green
            : state === "current"
              ? palette.blue
              : palette.muted;
        target.copy(goalColor);
        dampColor(slab.material.color, target, 8, dt, instant);
        dampColor(slab.edgeMaterial.color, target, 8, dt, instant);
        slab.opacity = damp(
          slab.opacity,
          state === "todo" ? 0.28 : state === "done" ? 0.6 : 0.95,
          8,
          dt,
          instant,
        );
        slab.material.opacity = slab.opacity;
        slab.edgeMaterial.opacity = state === "todo" ? 0.45 : 1;
        slab.glow = damp(
          slab.glow,
          state === "current" ? 0.55 : 0,
          8,
          dt,
          instant,
        );
        slab.material.emissiveIntensity = slab.glow;
      });
    },
    dispose() {
      disposeTree(root);
    },
  };
}

/* ------------------------------------------------------------------ path: helix / ring / tree */

type PathLayout = "helix" | "ring" | "tree";

function layoutPositions(layout: PathLayout, count: number): THREE.Vector3[] {
  return Array.from({ length: count }, (_, i) => {
    if (layout === "ring") {
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      return new THREE.Vector3(
        2.25 * Math.cos(angle),
        Math.sin(angle * 2) * 0.12,
        2.0 * Math.sin(angle),
      );
    }
    if (layout === "tree") {
      const level = Math.floor(Math.log2(i + 1));
      const width = 2 ** level;
      const k = i + 1 - width;
      const spacing = 4.6 / width;
      const z = (((k * 7 + level * 3) % 5) - 2) * 0.22;
      return new THREE.Vector3(
        (k - (width - 1) / 2) * spacing,
        1.6 - level * 1.15,
        z,
      );
    }
    const angle = i * 1.05 + 0.4;
    return new THREE.Vector3(
      1.75 * Math.cos(angle),
      (i - (count - 1) / 2) * 0.62,
      1.75 * Math.sin(angle),
    );
  });
}

/** 道の立体: らせん(流れ)・輪(繰り返し)・木(階層)。道を青い光点が進み、通った所が緑になる */
function buildPath(
  layout: PathLayout,
  { count, palette }: BuildOptions,
): SceneBuild {
  const root = new THREE.Group();
  const positions = layoutPositions(layout, count);
  const isTree = layout === "tree";
  const target = new THREE.Color();

  type Edge = {
    from: number;
    to: number;
    rod: THREE.Mesh;
    material: THREE.MeshBasicMaterial;
  };
  const edges: Edge[] = [];
  const addEdge = (from: number, to: number) => {
    const material = new THREE.MeshBasicMaterial({
      color: palette.muted.clone(),
      transparent: true,
      opacity: 0.4,
    });
    const rod = makeRod(0.028, material);
    placeRod(rod, positions[from], positions[to]);
    root.add(rod);
    edges.push({ from, to, rod, material });
  };
  if (isTree) {
    for (let i = 1; i < count; i++) addEdge(Math.floor((i - 1) / 2), i);
  } else {
    for (let i = 0; i < count - 1; i++) addEdge(i, i + 1);
    if (layout === "ring" && count > 2) addEdge(count - 1, 0);
  }

  const nodeGeometry = new THREE.SphereGeometry(0.2, 24, 16);
  const nodes = positions.map((position) => {
    const material = new THREE.MeshStandardMaterial({
      color: palette.muted.clone(),
      emissive: palette.blue.clone(),
      emissiveIntensity: 0,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new THREE.Mesh(nodeGeometry, material);
    mesh.position.copy(position);
    root.add(mesh);
    return { mesh, material, scale: 1, glow: 0, opacity: 0.5 };
  });

  // 現在の節を囲む輪(カメラの方を向く)と、道を進む光点
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.36, 0.022, 8, 40),
    new THREE.MeshBasicMaterial({
      color: palette.blue.clone(),
      transparent: true,
      opacity: 0.9,
    }),
  );
  root.add(halo);
  const traveler = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 16, 12),
    new THREE.MeshBasicMaterial({ color: palette.blue.clone() }),
  );
  traveler.visible = !isTree;
  root.add(traveler);

  const ancestors = (index: number): Set<number> => {
    const set = new Set<number>();
    let node = index;
    while (node >= 0) {
      set.add(node);
      node = node === 0 ? -1 : Math.floor((node - 1) / 2);
    }
    return set;
  };

  let current = 0;
  let travelU = 0;
  const haloPosition = positions[0].clone();
  const scratch = new THREE.Vector3();
  const upper = new THREE.Vector3();

  return {
    root,
    anchors: nodes.map((node) => node.mesh),
    fixedLabels: [],
    cameraPosition: isTree
      ? new THREE.Vector3(0.2, 1.2, 7.2)
      : layout === "ring"
        ? new THREE.Vector3(0, 3.6, 6.4)
        : new THREE.Vector3(3.6, 1.6, 6.6),
    cameraTarget: isTree
      ? new THREE.Vector3(0, 0.5, 0)
      : new THREE.Vector3(0, 0, 0),
    setStep(index) {
      current = index;
    },
    update(dt, time, instant, camera) {
      const chain = isTree ? ancestors(current) : null;
      nodes.forEach((node, index) => {
        const state = stateOf(index, current);
        const goal =
          state === "done"
            ? palette.green
            : state === "current"
              ? palette.blue
              : palette.muted;
        target.copy(goal);
        dampColor(node.material.color, target, 8, dt, instant);
        node.scale = damp(
          node.scale,
          state === "current" ? 1.55 : 1,
          9,
          dt,
          instant,
        );
        node.mesh.scale.setScalar(node.scale);
        node.glow = damp(
          node.glow,
          state === "current" ? 0.7 : 0,
          9,
          dt,
          instant,
        );
        node.material.emissiveIntensity = node.glow;
        node.opacity = damp(
          node.opacity,
          state === "todo" ? 0.5 : 1,
          9,
          dt,
          instant,
        );
        node.material.opacity = node.opacity;
      });

      edges.forEach((edge) => {
        let state: "done" | "current" | "todo" = "todo";
        if (isTree) {
          if (edge.to <= current)
            state = chain?.has(edge.to) ? "current" : "done";
        } else if (
          edge.to <= current &&
          !(layout === "ring" && edge.to === 0 && edge.from === count - 1)
        ) {
          state = edge.to === current ? "current" : "done";
        }
        const goal =
          state === "done"
            ? palette.green
            : state === "current"
              ? palette.blue
              : palette.muted;
        target.copy(goal);
        dampColor(edge.material.color, target, 8, dt, instant);
        edge.material.opacity = damp(
          edge.material.opacity,
          state === "todo" ? 0.4 : 1,
          8,
          dt,
          instant,
        );
      });

      // 光点: 前の節から現在の節へ、道に沿って滑る
      travelU = damp(travelU, current, 5, dt, instant);
      const lower = Math.max(0, Math.min(count - 1, Math.floor(travelU)));
      const upperIndex = Math.min(count - 1, lower + 1);
      upper.copy(positions[upperIndex]);
      scratch.copy(positions[lower]).lerp(upper, travelU - lower);
      traveler.position.copy(scratch);

      haloPosition.x = damp(
        haloPosition.x,
        positions[current].x,
        9,
        dt,
        instant,
      );
      haloPosition.y = damp(
        haloPosition.y,
        positions[current].y,
        9,
        dt,
        instant,
      );
      haloPosition.z = damp(
        haloPosition.z,
        positions[current].z,
        9,
        dt,
        instant,
      );
      halo.position.copy(haloPosition);
      // カメラの正面を向かせるため、親(root)の回転を打ち消して向きを合わせる
      halo.quaternion
        .copy(root.quaternion)
        .invert()
        .multiply(camera.quaternion);
      halo.scale.setScalar(instant ? 1 : 1 + Math.sin(time * 3) * 0.06);
    },
    dispose() {
      disposeTree(root);
    },
  };
}

/* ------------------------------------------------------------------ color */

/** RGB立方体の中を、色の点が暗い隅から明るい側へ螺旋に進む。色は「3つの値でできた空間の1点」だと見せる */
function buildColor({ count, palette }: BuildOptions): SceneBuild {
  const root = new THREE.Group();

  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
  const positionAttribute = cubeGeometry.getAttribute("position");
  const colors = new Float32Array(positionAttribute.count * 3);
  for (let i = 0; i < positionAttribute.count; i++) {
    colors[i * 3] = (positionAttribute.getX(i) + 1) / 2;
    colors[i * 3 + 1] = (positionAttribute.getY(i) + 1) / 2;
    colors[i * 3 + 2] = (positionAttribute.getZ(i) + 1) / 2;
  }
  cubeGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  root.add(
    new THREE.Mesh(
      cubeGeometry,
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: palette.light ? 0.4 : 0.26,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    ),
  );
  root.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(cubeGeometry),
      new THREE.LineBasicMaterial({
        color: palette.muted.clone(),
        transparent: true,
        opacity: 0.8,
      }),
    ),
  );

  // 8つの隅は、その隅の色そのもの(黒・赤・緑・青・シアン・マゼンタ・黄・白)
  const cornerGeometry = new THREE.SphereGeometry(0.075, 12, 8);
  const corners: THREE.Mesh[] = [];
  for (const x of [0, 1]) {
    for (const y of [0, 1]) {
      for (const z of [0, 1]) {
        const corner = new THREE.Mesh(
          cornerGeometry,
          new THREE.MeshBasicMaterial({ color: new THREE.Color(x, y, z) }),
        );
        corner.position.set(x * 2 - 1, y * 2 - 1, z * 2 - 1);
        root.add(corner);
        corners.push(corner);
      }
    }
  }
  const cornerAt = (x: number, y: number, z: number) =>
    corners[x * 4 + y * 2 + z];

  // 道筋: 暗い隅の近くから明るい側へ、対角線のまわりを螺旋に進む
  const colorsAt: THREE.Color[] = [];
  const positions: THREE.Vector3[] = [];
  const u = new THREE.Vector3(1, -1, 0).normalize();
  const v = new THREE.Vector3(1, 1, -2).normalize();
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const axis = 0.14 + 0.72 * t;
    const radius = 0.34 * Math.sin(Math.PI * (0.12 + 0.76 * t)) + 0.06;
    const theta = t * Math.PI * 2.3;
    const c = new THREE.Vector3(axis, axis, axis)
      .addScaledVector(u, radius * Math.cos(theta))
      .addScaledVector(v, radius * Math.sin(theta));
    c.set(
      Math.min(1, Math.max(0, c.x)),
      Math.min(1, Math.max(0, c.y)),
      Math.min(1, Math.max(0, c.z)),
    );
    colorsAt.push(new THREE.Color(c.x, c.y, c.z));
    positions.push(new THREE.Vector3(c.x * 2 - 1, c.y * 2 - 1, c.z * 2 - 1));
  }

  const pointGeometry = new THREE.SphereGeometry(0.085, 16, 12);
  const points = positions.map((position, index) => {
    const material = new THREE.MeshBasicMaterial({
      color: palette.muted.clone(),
      transparent: true,
      opacity: 0.55,
    });
    const mesh = new THREE.Mesh(pointGeometry, material);
    mesh.position.copy(position);
    root.add(mesh);
    return { mesh, material, index, opacity: 0.55 };
  });

  const rods = positions.slice(0, -1).map((position, index) => {
    const material = new THREE.MeshBasicMaterial({
      color: colorsAt[index].clone(),
      transparent: true,
      opacity: 0.25,
    });
    const rod = makeRod(0.026, material);
    placeRod(rod, position, positions[index + 1]);
    root.add(rod);
    return { rod, material, opacity: 0.25 };
  });

  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 24, 16),
    new THREE.MeshBasicMaterial({ color: colorsAt[0].clone() }),
  );
  root.add(marker);
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.02, 8, 40),
    new THREE.MeshBasicMaterial({
      color: palette.blue.clone(),
      transparent: true,
      opacity: 0.95,
    }),
  );
  root.add(halo);

  let current = 0;
  let travelU = 0;
  const scratch = new THREE.Vector3();
  const mix = new THREE.Color();

  return {
    root,
    anchors: [],
    fixedLabels: [
      { text: "R", object: cornerAt(1, 0, 0) },
      { text: "G", object: cornerAt(0, 1, 0) },
      { text: "B", object: cornerAt(0, 0, 1) },
    ],
    cameraPosition: new THREE.Vector3(4.2, 3.0, 5.6),
    cameraTarget: new THREE.Vector3(0, 0, 0),
    setStep(index) {
      current = index;
    },
    update(dt, time, instant, camera) {
      points.forEach((point) => {
        const reached = point.index <= current;
        if (reached) point.material.color.copy(colorsAt[point.index]);
        else point.material.color.copy(palette.muted);
        point.opacity = damp(point.opacity, reached ? 1 : 0.55, 9, dt, instant);
        point.material.opacity = point.opacity;
      });
      rods.forEach((entry, index) => {
        const reached = index < current;
        entry.opacity = damp(
          entry.opacity,
          reached ? 0.95 : 0.25,
          8,
          dt,
          instant,
        );
        entry.material.opacity = entry.opacity;
      });

      travelU = damp(travelU, current, 5, dt, instant);
      const lower = Math.max(0, Math.min(count - 1, Math.floor(travelU)));
      const upperIndex = Math.min(count - 1, lower + 1);
      const fraction = travelU - lower;
      scratch.copy(positions[lower]).lerp(positions[upperIndex], fraction);
      marker.position.copy(scratch);
      mix.copy(colorsAt[lower]).lerp(colorsAt[upperIndex], fraction);
      (marker.material as THREE.MeshBasicMaterial).color.copy(mix);
      halo.position.copy(scratch);
      halo.quaternion
        .copy(root.quaternion)
        .invert()
        .multiply(camera.quaternion);
      halo.scale.setScalar(instant ? 1 : 1 + Math.sin(time * 3) * 0.07);
    },
    dispose() {
      disposeTree(root);
    },
  };
}

/* ------------------------------------------------------------------ mesh */

/** 形が段階的に作り込まれる: 手順が進むほど面の分割が細かくなり、光が回りこむ。モデリング・配置・見え方の章向け */
function buildMesh({ count, palette }: BuildOptions): SceneBuild {
  const root = new THREE.Group();
  const holder = new THREE.Group();
  root.add(holder);

  const solidMaterial = new THREE.MeshStandardMaterial({
    color: palette.blue.clone(),
    roughness: 0.45,
    metalness: 0.1,
    flatShading: true,
    transparent: true,
    opacity: palette.light ? 0.92 : 0.82,
  });
  const wireMaterial = new THREE.LineBasicMaterial({
    color: palette.light ? palette.text.clone() : palette.green.clone(),
    transparent: true,
    opacity: palette.light ? 0.5 : 0.75,
  });
  const pointMaterial = new THREE.PointsMaterial({
    color: palette.text.clone(),
    size: 0.05,
    sizeAttenuation: true,
  });
  const solid = new THREE.Mesh(new THREE.BufferGeometry(), solidMaterial);
  const wire = new THREE.LineSegments(new THREE.BufferGeometry(), wireMaterial);
  const dots = new THREE.Points(new THREE.BufferGeometry(), pointMaterial);
  holder.add(solid, wire, dots);

  const grid = new THREE.GridHelper(6, 12, palette.muted, palette.muted);
  grid.position.y = -1.55;
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.3;
  root.add(grid);

  const lightBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 12, 8),
    new THREE.MeshBasicMaterial({ color: palette.amber.clone() }),
  );
  const pointLight = new THREE.PointLight(0xffffff, 18, 9, 1.6);
  lightBall.add(pointLight);
  root.add(lightBall);

  let detail = -1;
  let current = 0;
  let pop = 1;
  let spin = 0;
  let angle = 0;
  const tint = new THREE.Color();

  const rebuild = (nextDetail: number) => {
    solid.geometry.dispose();
    wire.geometry.dispose();
    dots.geometry.dispose();
    const geometry = new THREE.IcosahedronGeometry(1.25, nextDetail);
    solid.geometry = geometry;
    wire.geometry = new THREE.WireframeGeometry(geometry);
    dots.geometry = geometry;
    detail = nextDetail;
  };
  rebuild(0);

  return {
    root,
    anchors: [],
    fixedLabels: [],
    cameraPosition: new THREE.Vector3(3.4, 2.2, 5.2),
    cameraTarget: new THREE.Vector3(0, -0.1, 0),
    setStep(index) {
      current = index;
      const t = count <= 1 ? 1 : index / (count - 1);
      const nextDetail = Math.min(3, Math.round(t * 3));
      if (nextDetail !== detail) rebuild(nextDetail);
      pop = 0.9;
    },
    update(dt, time, instant) {
      const t = count <= 1 ? 1 : current / (count - 1);
      pop = damp(pop, 1, 7, dt, instant);
      spin = damp(spin, current * 0.55, 4, dt, instant);
      holder.scale.setScalar(pop);
      holder.rotation.y = spin;
      tint.copy(palette.blue).lerp(palette.green, t * 0.6);
      solidMaterial.color.copy(tint);
      angle =
        damp(angle, current * 0.9, 3, dt, instant) +
        (instant ? 0 : time * 0.15);
      lightBall.position.set(2.2 * Math.cos(angle), 1.4, 2.2 * Math.sin(angle));
    },
    dispose() {
      disposeTree(root);
    },
  };
}

export function buildScene(kind: SolidKind, options: BuildOptions): SceneBuild {
  switch (kind) {
    case "stack":
      return buildStack(options);
    case "ring":
      return buildPath("ring", options);
    case "tree":
      return buildPath("tree", options);
    case "color":
      return buildColor(options);
    case "mesh":
      return buildMesh(options);
    default:
      return buildPath("helix", options);
  }
}
