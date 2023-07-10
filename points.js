import { midpoint } from './math.js'

export const POINTS = [
  [0.25, 0],
  [0.75, 0],
  [0, 0.5],
  [0.5, 0.5],
  [1, 0.5],
  [0.25, 1],
  [0.75, 1],
];

export const EDGES = [
  // Circular
  { from: POINTS[0], to: POINTS[1], via: POINTS[3], curviness: 0.45, thickness: 0.18, group: 0 },
  { from: POINTS[1], to: POINTS[4], via: POINTS[3], curviness: 0.45, thickness: 0.18, group: 0 },
  { from: POINTS[4], to: POINTS[6], via: POINTS[3], curviness: 0.45, thickness: 0.18, group: 0 },
  { from: POINTS[6], to: POINTS[5], via: POINTS[3], curviness: 0.45, thickness: 0.18, group: 0 },
  { from: POINTS[5], to: POINTS[2], via: POINTS[3], curviness: 0.45, thickness: 0.18, group: 0 },
  { from: POINTS[2], to: POINTS[0], via: POINTS[3], curviness: 0.45, thickness: 0.18, group: 0 },
  // Radial
  { from: POINTS[0], to: POINTS[3], via: POINTS[2], curviness: 0.5, thickness: 0.18, group: 1 },
  { from: POINTS[0], to: POINTS[3], via: POINTS[1], curviness: 0.5, thickness: 0.18, group: 1 },
  { from: POINTS[1], to: POINTS[3], via: POINTS[0], curviness: 0.5, thickness: 0.18, group: 1 },
  { from: POINTS[1], to: POINTS[3], via: POINTS[4], curviness: 0.5, thickness: 0.18, group: 1 },
  { from: POINTS[4], to: POINTS[3], via: POINTS[1], curviness: 0.5, thickness: 0.18, group: 1 },
  { from: POINTS[4], to: POINTS[3], via: POINTS[6], curviness: 0.5, thickness: 0.18, group: 1 },
  { from: POINTS[6], to: POINTS[3], via: POINTS[4], curviness: 0.5, thickness: 0.18, group: 1 },
  { from: POINTS[6], to: POINTS[3], via: POINTS[5], curviness: 0.5, thickness: 0.18, group: 1 },
  { from: POINTS[5], to: POINTS[3], via: POINTS[6], curviness: 0.5, thickness: 0.18, group: 1 },
  { from: POINTS[5], to: POINTS[3], via: POINTS[2], curviness: 0.5, thickness: 0.18, group: 1 },
  { from: POINTS[2], to: POINTS[3], via: POINTS[5], curviness: 0.5, thickness: 0.18, group: 1 },
  { from: POINTS[2], to: POINTS[3], via: POINTS[0], curviness: 0.5, thickness: 0.18, group: 1 },
  // Diametric
  { from: POINTS[0], to: POINTS[6], via: midpoint(POINTS[2], POINTS[5]), curviness: 0.5, thickness: 0.2, group: 2 },
  { from: POINTS[0], to: POINTS[6], via: midpoint(POINTS[1], POINTS[4]), curviness: 0.5, thickness: 0.2, group: 2 },
  { from: POINTS[1], to: POINTS[5], via: midpoint(POINTS[0], POINTS[2]), curviness: 0.5, thickness: 0.2, group: 2 },
  { from: POINTS[1], to: POINTS[5], via: midpoint(POINTS[4], POINTS[6]), curviness: 0.5, thickness: 0.2, group: 2 },
  { from: POINTS[4], to: POINTS[2], via: midpoint(POINTS[0], POINTS[1]), curviness: 0.5, thickness: 0.2, group: 2 },
  { from: POINTS[4], to: POINTS[2], via: midpoint(POINTS[6], POINTS[5]), curviness: 0.5, thickness: 0.2, group: 2 },
  // Diagonal
  { from: POINTS[0], to: POINTS[4], via: POINTS[3], curviness: 0.8, thickness: 0.27, group: 3 },
  { from: POINTS[1], to: POINTS[6], via: POINTS[3], curviness: 0.8, thickness: 0.27, group: 3 },
  { from: POINTS[4], to: POINTS[5], via: POINTS[3], curviness: 0.8, thickness: 0.27, group: 3 },
  { from: POINTS[6], to: POINTS[2], via: POINTS[3], curviness: 0.8, thickness: 0.27, group: 3 },
  { from: POINTS[5], to: POINTS[0], via: POINTS[3], curviness: 0.8, thickness: 0.27, group: 3 },
  { from: POINTS[2], to: POINTS[1], via: POINTS[3], curviness: 0.8, thickness: 0.27, group: 3 },
];

export const VERTICES = [
  [1, 8, 9, 20, 21, 25, 29],
  [2, 10, 11, 22, 23, 24, 26],
  [3, 12, 13, 18, 19, 25, 27],
  [4, 14, 15, 20, 21, 26, 28],
  [5, 16, 17, 22, 23, 27, 29],
  [0, 6, 7, 18, 19, 24, 28],
  [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  [6, 7, 10, 11, 12, 13, 14, 15, 16, 17],
  [6, 7, 10, 11, 12, 13, 14, 15, 16, 17],
  [6, 7, 8, 9, 12, 13, 14, 15, 16, 17],
  [6, 7, 8, 9, 12, 13, 14, 15, 16, 17],
  [6, 7, 8, 9, 10, 11, 14, 15, 16, 17],
  [6, 7, 8, 9, 10, 11, 14, 15, 16, 17],
  [6, 7, 8, 9, 10, 11, 12, 13, 16, 17],
  [6, 7, 8, 9, 10, 11, 12, 13, 16, 17],
  [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [2, 3, 12, 25, 27],
  [2, 3, 13, 25, 27],
  [3, 4, 14, 26, 28],
  [3, 4, 15, 26, 28],
  [4, 5, 16, 27, 29],
  [4, 5, 17, 27, 29],
  [1, 2, 11, 23, 26, 22],
  [2, 3, 13, 18, 19, 27],
  [3, 4, 15, 20, 21, 28],
  [4, 5, 17, 22, 23, 29],
  [0, 5, 7, 18, 19, 24],
  [0, 1, 9, 21, 20, 25],
];

export const VPRIME = [
  [5, 6, 7, 18, 19, 24, 28],
  [0, 8, 9, 20, 21, 25, 29],
  [1, 10, 11, 22, 23, 24, 26],
  [2, 12, 13, 18, 19, 25, 27],
  [3, 14, 15, 20, 21, 26, 28],
  [4, 16, 17, 22, 23, 27, 29],
  [0, 5, 19, 24],
  [0, 5, 18, 28],
  [0, 1, 21, 25],
  [0, 1, 20, 29],
  [1, 2, 23, 26],
  [1, 2, 22, 24],
  [2, 3, 18, 27],
  [2, 3, 19, 25],
  [3, 4, 20, 28],
  [3, 4, 21, 26],
  [4, 5, 22, 29],
  [4, 5, 23, 27],
  [0, 5, 7, 24, 28],
  [0, 5, 6, 24, 28],
  [0, 1, 9, 25, 29],
  [0, 1, 8, 25, 29],
  [1, 2, 11, 26, 24],
  [1, 2, 10, 26, 24],
  [0, 5, 6, 18, 19, 28],
  [0, 1, 8, 20, 21, 29],
  [1, 2, 10, 22, 23, 24],
  [2, 3, 12, 18, 19, 25],
  [3, 4, 14, 20, 21, 26],
  [4, 5, 16, 22, 23, 27],
];

export function edgeID(edge) {
  return 1 << edge;
}

export function pathID(path) {
  return path.reduce((acc, cur) => acc | edgeID(cur), 0)
}
