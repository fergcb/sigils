import { EDGES, POINTS, VERTICES, VPRIME, pathID } from "./points.js";
import { lerp, midpoint, TAU } from "./math.js";

const SCALE = 100;

const $glyphs = document.querySelector('#glyphs');
const $count = document.querySelector('#count');
const $grid = document.querySelector('#grid');
const $chkShowGuides = document.querySelector('#chkShowGuides');

$grid.width = 300;
$grid.height = 300;
const gridCtx = $grid.getContext('2d');
drawGlyph(gridCtx, [], { size: 300, drawGuide: true, drawIds: true })

let showGuides = false;
$chkShowGuides.checked = showGuides;
$chkShowGuides.addEventListener('change', () => {
  showGuides = $chkShowGuides.checked;
  redrawAll();
})

function drawGlyph(
  ctx,
  path,
  { drawGuide = false, drawIds = false, size = SCALE } = {}
) {
  ctx.font = "bold 16px 'Fira Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const scaleX = (x) => x * size * 0.8 + size * 0.1;
  const scaleY = (y) => y * size * 0.8 + size * 0.1;
  const scale = ([x, y]) => [scaleX(x), scaleY(y)];

  POINTS.forEach(([px, py], i) => {
    const x = scaleX(px);
    const y = scaleY(py);

    if (drawGuide) {
      const r = size * 0.025;
      ctx.fillStyle = "#868e96";
      ctx.beginPath();
      ctx.ellipse(x, y, r, r, 0, 0, TAU);
      ctx.fill();
    }

    if (drawIds) {
      ctx.fillStyle = "grey";
      ctx.fillText(i, x - 10, y - 10);
    }
  });

  if (drawGuide) {
    EDGES.forEach(
      ({ from: a, to: b, via: c, curviness, thickness, group }, i) => {
        const [ax, ay] = scale(a);
        const [bx, by] = scale(b);

        const m = midpoint(a, b);
        const [cp1x, cp1y] = scale(lerp(m, c, curviness));
        const [cp2x, cp2y] = scale(lerp(m, c, curviness - thickness * 0.7));
        ctx.fillStyle = [
          "#ff922b40",
          "#94d82d40",
          "#22b8cf40",
          "#845ef740",
        ][group];
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(cp1x, cp1y, bx, by);
        ctx.quadraticCurveTo(cp2x, cp2y, ax, ay);
        ctx.fill();
        if (drawIds) {
          const [tx, ty] = scale([
            lerp(m, c, 0.05),
            lerp(m, c, 0.6),
            lerp(m, c, 0.25),
            lerp(m, c, 0.2),
          ][group]);
          ctx.fillStyle = [
            "#ff922b",
            "#94d82d",
            "#66d9e8",
            "#7950f2"
          ][group];
          ctx.fillText(i, tx, ty);
        }
      }
    );
  }

  path.forEach(
    ({ from: a, to: b, via: c, curviness, thickness }, i) => {
      const [ax, ay] = scale(a);
      const [bx, by] = scale(b);
      const m = midpoint(a, b);
      const [cp1x, cp1y] = scale(lerp(m, c, curviness));
      const [cp2x, cp2y] = scale(lerp(m, c, curviness - thickness));
      ctx.fillStyle = "#c2255c";
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(cp1x, cp1y, bx, by);
      ctx.quadraticCurveTo(cp2x, cp2y, ax, ay);
      ctx.fill();

      // if (drawGuide && i === 0) {
      //   const r = size * 0.025;
      //   ctx.fillStyle = "#3bc9db";
      //   ctx.beginPath();
      //   ctx.ellipse(ax, ay, r, r, 0, 0, TAU);
      //   ctx.fill();
      // }
    }
  );
}

function redraw(ctx, glyph, options) {
  ctx.clearRect(0, 0, SCALE, SCALE);
  drawGlyph(ctx, glyph, options)
}

function redrawAll() {
  $glyphs.childNodes.forEach((node, i) => {
    const $canvas = node.querySelector('canvas');
    const ctx = $canvas.getContext('2d');
    redraw(ctx, glyphs[i].edges, { drawGuide: showGuides });
  })
}


// const glyphs = VPRIME.map((v, i) => [EDGES[i], ...v.map(j => EDGES[j])]);

// const glyphs = [];
// const stack = EDGES.map((p) => [p]);
// while (stack.length > 0) {
//   const current = stack.pop();
//   glyphs.push(current);
//   const neighbours = EDGES.filter((p) => {
//     return p.from === current.at(-1).to
//       && !current.some(c => c.to === p.to)
//   });
//   stack.push(...neighbours.map((next) => [...current, next]));
// }

const paths = [];
const queue = EDGES.flatMap((_, i) => [[[i], false], [[i], true]]);
while (queue.length > 0) {
  const [path, reversed] = queue.shift();
  if (!paths.some(other => pathID(other) === pathID(path))) paths.push(path);
  const last = path.at(-1);
  const start = reversed ? 'to' : 'from';
  const end = reversed ? 'from' : 'to';
  const nexts = (reversed ? VPRIME : VERTICES)[last]
    .filter(next => !path.some(existing => {
      return EDGES[existing][start] === EDGES[next][end]
          || EDGES[existing][end] === EDGES[next][end]
    }));
  queue.push(...nexts.map(next => [[...path, next], reversed]))
}

const glyphs = paths.map(path => ({
  id: pathID(path),
  edges: path.map(i => EDGES[i])
}));

$count.innerHTML = glyphs.length;

glyphs.forEach((glyph, i) => {
  const $glyph = document.createElement('div');
  $glyph.classList.add('glyph');
  
  const $canvas = document.createElement('canvas');
  $glyph.appendChild($canvas);

  $canvas.width = SCALE;
  $canvas.height = SCALE;
  const ctx = $canvas.getContext('2d');
  drawGlyph(ctx, glyph.edges, {
    drawGuide: showGuides,
    drawIds: false,
  });
  
  const $id = document.createElement('div');
  $id.classList.add('id');
  $id.innerHTML = glyph.id;
  $glyph.appendChild($id);

  $glyphs.appendChild($glyph);
});
