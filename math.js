export const TAU = 2 * Math.PI;

export function midpoint([ax, ay], [bx, by]) {
  return [(ax + bx) / 2, (ay + by) / 2];
}

export function lerp([ax, ay], [bx, by], t) {
  const u = 1 - t;
  return [ax * u + bx * t, ay * u + by * t];
}
