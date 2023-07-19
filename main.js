import { EDGES, POINTS, VERTICES, VPRIME, VALID_STARTING_STROKES } from "./points.js";
import { lerp, midpoint, TAU } from "./math.js";

const SCALE = 150;
const SHOW_GUIDES = false;

const abjad = {
  "p": [19327377442n, "lava flow"],
  "b": [1285n, "snake"],
  "t": [68157473n, "scorpion"],
  "d": [5163n, "human"],
  "k": [262176n, "mountain"],
  "g": [33570825n, "animal fat"],
  "s": [1048577n, "dragon"],
  "z": [32870n, "seven"],
  "t͡ʃ": [16431n, "sun"],
  "h": [4296016897n, "city"],
  "m": [4196496n, "fairy"],
  "n": [83902496n, "quiver"],
  "r": [1048630n, "fishing net"],
}

const $glyphs = document.querySelector('#glyphs');
const $count = document.querySelector('#count');
const $grid = document.querySelector('#grid');
const $chkShowGuides = document.querySelector('#chkShowGuides');
const $abjad = document.querySelector("#abjad");
const $source = document.querySelector("#source");
const $translation = document.querySelector("#translation");

function onSourceChange() {
  const chars = $source.value
    .replaceAll(/[aeiou]/g, '')
    .split('')
    .map(c => abjad[c.replace('c', 't͡ʃ')]?.[0] ?? 0n);
  
  if (chars.some(c => c > 0)) {
    const $c = document.createElement('canvas');
    $c.width = chars.length * 300;
    $c.height = 300;
    const ctx = $c.getContext('2d');
    chars.forEach((char, i) => {
      const glyph = glyphFromID(char);
      drawGlyph(ctx, glyph, { size: 300, offsetX: 300 * i, padding: 0 })
    });
    const dataURL = $c.toDataURL();
    const $img = document.createElement('img');
    $img.src = dataURL;
    $translation.replaceChildren($img);
  } else {
    $translation.replaceChildren();
  }
}

$source.addEventListener('change', onSourceChange);
$source.addEventListener('keyup', onSourceChange);
$source.addEventListener('paste', onSourceChange);

$grid.width = 300;
$grid.height = 300;
const gridCtx = $grid.getContext('2d');
drawGlyph(gridCtx, [], { size: 300, drawGuide: true, drawIds: true })

let showGuides = SHOW_GUIDES;
$chkShowGuides.checked = showGuides;
$chkShowGuides.addEventListener('change', () => {
  showGuides = $chkShowGuides.checked;
  redrawAll();
})

Object.entries(abjad).forEach(([phoneme, [glyphID, meaning]]) => {
  const $glyph = document.createElement('div');
  $glyph.classList.add('glyph');

  const $canvas = document.createElement('canvas');
  $canvas.width = SCALE;
  $canvas.height = SCALE;
  const ctx = $canvas.getContext('2d');
  drawGlyph(ctx, glyphFromID(glyphID), { drawGuide: showGuides });

  const $info = document.createElement('div');
  $info.innerHTML = `
    <div class="ipa">/${phoneme}/</div>
    <div class="meaning">"${meaning}"</div>
  `

  $glyph.appendChild($canvas);
  $glyph.appendChild($info);
  $abjad.appendChild($glyph);
})

function drawGlyph(
  ctx,
  path,
  { drawGuide = false, drawIds = false, size = SCALE, padding = 0.1, offsetX = 0, offsetY = 0 } = {}
) {
  ctx.font = "bold 16px 'Fira Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const scaleX = (x) => offsetX + x * size * (1 - padding * 2) + size * padding;
  const scaleY = (y) => offsetY + y * size * (1 - padding * 2) + size * padding;
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
            lerp(m, c, 0.2),
            lerp(m, c, 0.35),
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

  const untouchedPoints = new Set(POINTS);

  path.forEach(
    ({ from: a, to: b, via: c, curviness, thickness }, i) => {
      untouchedPoints.delete(a);
      untouchedPoints.delete(b);
      const [ax, ay] = scale(a);
      const [bx, by] = scale(b);
      const m = midpoint(a, b);
      const [cp1x, cp1y] = scale(lerp(m, c, curviness));
      const [cp2x, cp2y] = scale(lerp(m, c, curviness - thickness));
      ctx.fillStyle = /* i === 0 ? "#fab005" : */ "#c2255c";
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(cp1x, cp1y, bx, by);
      ctx.quadraticCurveTo(cp2x, cp2y, ax, ay);
      ctx.fill();

      if (drawGuide && i === 0) {
        const r = size * 0.025;
        ctx.fillStyle = "#3bc9db";
        ctx.beginPath();
        ctx.ellipse(ax, ay, r, r, 0, 0, TAU);
        ctx.fill();
      }
    }
  );

  // untouchedPoints.forEach(point => {
  //   const [ax, ay] = scale(point);
  //   const r = size * 0.0365;
  //   ctx.strokeStyle = "#c2255c";
  //   ctx.lineWidth = r / 2;
  //   ctx.beginPath();
  //   ctx.ellipse(ax, ay, r, r, 0, 0, TAU);
  //   ctx.stroke();
  // })
}

function drawGlyphs(glyphs, first, last) {
  for (let i = first; i < last; i++) {
    const glyphID = glyphs[i];
    const glyph = glyphFromID(glyphID)

    const $glyph = document.createElement('div');
    $glyph.classList.add('glyph');
    
    const $canvas = document.createElement('canvas');
    $glyph.appendChild($canvas);

    $canvas.width = SCALE;
    $canvas.height = SCALE;
    const ctx = $canvas.getContext('2d');
    drawGlyph(ctx, glyph, {
      drawGuide: showGuides,
      drawIds: SHOW_GUIDES,
    });
    
    const $id = document.createElement('div');
    $id.classList.add('id');
    $id.innerHTML = glyphID;
    $glyph.appendChild($id);

    $glyphs.appendChild($glyph);
  }
}

function redraw(ctx, glyph, options) {
  ctx.clearRect(0, 0, SCALE, SCALE);
  drawGlyph(ctx, glyph, options)
}

function redrawAll() {
  $abjad.querySelectorAll('canvas').forEach(($canvas, i) => {
    const ctx = $canvas.getContext('2d');
    const glyph = glyphFromID(Object.entries(abjad)[i][1][0])
    redraw(ctx, glyph, { drawGuide: showGuides });
  });

  $glyphs.childNodes.forEach((node, i) => {
    const $canvas = node.querySelector('canvas');
    const ctx = $canvas.getContext('2d');
    redraw(ctx, glyphFromID(glyphs[i]), { drawGuide: showGuides });
  })
}

function pathFromID(id) {
  let path = []
  let bit = 0
  while (id > 0) {
    if (id % 2n == 1) path.push(bit)
    id >>= 1n
    bit += 1
  }
  return path
}

function glyphFromID(id) {
  return pathFromID(id).map(edge => EDGES[edge])
}

const glyphs = [];
let lastRendered = 0;
let renderNextBatch = true;
const batchSize = 50;
const worker = new Worker('/worker.js');

window.glyphs = glyphs;
window.glyphFromID = glyphFromID;
window.pathFromID = pathFromID;
window.pathID = function (path) {
  return path.reduce((id, edge) => id | 2n ** BigInt(edge), 0n)
}
 
worker.addEventListener('message', e => {
  const newGlyphs = e.data
  glyphs.push(...newGlyphs);
  $count.innerHTML = glyphs.length;
  if (renderNextBatch) {
    renderNextBatch = false;
    drawGlyphs(glyphs, lastRendered, lastRendered + batchSize);
    lastRendered += batchSize;
  }
})

worker.postMessage({
  cmd: 'generate-glyphs',
  constants: { EDGES, VERTICES, VPRIME, VALID_STARTING_STROKES },
});


window.addEventListener('scroll', () => {
  if (window.innerHeight + Math.round(window.scrollY) < document.body.offsetHeight - SCALE) return
  if (lastRendered >= glyphs.length) { renderNextBatch = true; return }
  renderNextBatch = false;
  drawGlyphs(glyphs, lastRendered, lastRendered + batchSize);
  lastRendered += batchSize;
})
