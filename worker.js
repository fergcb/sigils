function pathID(path) {
  return path.reduce((id, edge) => id | 2n ** BigInt(edge), 0n)
}

self.addEventListener('message', e => {
  const { cmd, constants } = e.data
  if (cmd === 'generate-glyphs') {
    generateGlyphs(constants);
  }
})

function generateGlyphs(constants) {
  const { EDGES, VERTICES, VPRIME } = constants;
  const glyphs = [];
  const queue = EDGES.flatMap((_, i) => [[[i], false], [[i], true]]);
  let lastSent = -1;
  while (queue.length > 0) {
    const [path, reversed] = queue.shift();
    const glyph = pathID(path);
    if (!glyphs.includes(glyph)) {
      glyphs.push(glyph)
      if (glyphs.length % 50 === 0) {
        self.postMessage(glyphs.slice(lastSent + 1, glyphs.length));
        lastSent = glyphs.length - 1;
      }
    }
    const last = path.at(-1);
    const end = reversed ? 'from' : 'to';
    const currentPoint = EDGES[last][end];
    const nexts = (reversed ? VPRIME : VERTICES)[last]
      .filter(next => {
        const nextEdge = EDGES[next];
        const nextReversed = currentPoint !== nextEdge.from
        const target = nextEdge[nextReversed ? 'from' : 'to']
        return !path.some(existing => {
          const existingEdge = EDGES[existing];
          return target === existingEdge.from || target === existingEdge.to
        })
      });
    queue.push(...nexts.map(next => [[...path, next], EDGES[next].from !== currentPoint]))
  }
  
  return glyphs;
}
