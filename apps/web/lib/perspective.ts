// Motor de transformación de perspectiva ("enderezar" un documento fotografiado
// en ángulo). No usa ninguna librería externa — es álgebra lineal pura.
//
// Idea general: el usuario marca las 4 esquinas del documento en la foto
// (que puede estar en ángulo/perspectiva). Calculamos la matriz matemática
// que "estira" ese cuadrilátero irregular hasta convertirlo en un rectángulo
// perfecto, y usamos esa matriz para redibujar la imagen pixel por pixel.

export interface Point {
  x: number;
  y: number;
}

// Resuelve un sistema de ecuaciones lineales Ax = b (eliminación Gauss-Jordan
// con pivoteo parcial, para estabilidad numérica).
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[pivotRow][col])) pivotRow = row;
    }
    [M[col], M[pivotRow]] = [M[pivotRow], M[col]];

    const pivot = M[col][col];
    if (Math.abs(pivot) < 1e-12) continue;

    for (let j = col; j <= n; j++) M[col][j] /= pivot;

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = M[row][col];
      for (let j = col; j <= n; j++) M[row][j] -= factor * M[col][j];
    }
  }

  return M.map((row) => row[n]);
}

// Calcula la matriz de transformación de perspectiva (homografía 3x3) que
// mapea cada punto de "from" a su correspondiente punto en "to".
// Devuelve 9 coeficientes [a,b,c,d,e,f,g,h,1] de la matriz:
//   [ a b c ]
//   [ d e f ]
//   [ g h 1 ]
export function getPerspectiveTransform(from: Point[], to: Point[]): number[] {
  const A: number[][] = [];
  const b: number[] = [];

  for (let i = 0; i < 4; i++) {
    const { x, y } = from[i];
    const { x: X, y: Y } = to[i];

    A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]);
    b.push(X);

    A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]);
    b.push(Y);
  }

  const [a, bb, c, d, e, f, g, h] = solveLinearSystem(A, b);
  return [a, bb, c, d, e, f, g, h, 1];
}

function applyTransform(m: number[], x: number, y: number): Point {
  const w = m[6] * x + m[7] * y + m[8];
  return {
    x: (m[0] * x + m[1] * y + m[2]) / w,
    y: (m[3] * x + m[4] * y + m[5]) / w,
  };
}

const MAX_OUTPUT_DIMENSION = 2000; // evita que fotos enormes tranquen el navegador

// "Endereza" la región marcada (4 esquinas, en orden TL, TR, BR, BL) de un
// canvas fuente, dibujándola ya corregida en un canvas nuevo.
export function warpPerspective(
  source: HTMLCanvasElement,
  corners: Point[],
  outputWidth: number,
  outputHeight: number
): HTMLCanvasElement {
  // Si el rectángulo calculado es enorme (fotos de celular pueden ser de
  // 4000+ px), lo reducimos proporcionalmente para que el navegador no se
  // trabe procesando millones de pixeles innecesarios.
  const scale = Math.min(
    1,
    MAX_OUTPUT_DIMENSION / Math.max(outputWidth, outputHeight)
  );
  const width = Math.max(1, Math.round(outputWidth * scale));
  const height = Math.max(1, Math.round(outputHeight * scale));

  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;

  const srcCtx = source.getContext("2d")!;
  const dstCtx = output.getContext("2d")!;

  const srcData = srcCtx.getImageData(0, 0, source.width, source.height);
  const dstData = dstCtx.createImageData(width, height);

  const dstCorners: Point[] = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];

  // Mapeo inverso: por cada pixel de SALIDA, calculamos de dónde viene en la
  // imagen ORIGINAL. Así no quedan huecos en el resultado (si hiciéramos el
  // mapeo al revés, algunos pixeles de salida quedarían sin pintar).
  const matrix = getPerspectiveTransform(dstCorners, corners);

  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const { x: sx, y: sy } = applyTransform(matrix, dx, dy);
      const dstIndex = (dy * width + dx) * 4;

      if (sx < 0 || sy < 0 || sx >= source.width - 1 || sy >= source.height - 1) {
        dstData.data[dstIndex + 3] = 0; // fuera de la imagen original: transparente
        continue;
      }

      // Interpolación bilineal (promedia los 4 pixeles vecinos) para que el
      // resultado no se vea "pixeleado" o con bordes duros.
      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const fx = sx - x0;
      const fy = sy - y0;

      for (let channel = 0; channel < 4; channel++) {
        const i00 = (y0 * source.width + x0) * 4 + channel;
        const i10 = (y0 * source.width + x0 + 1) * 4 + channel;
        const i01 = ((y0 + 1) * source.width + x0) * 4 + channel;
        const i11 = ((y0 + 1) * source.width + x0 + 1) * 4 + channel;

        const top = srcData.data[i00] * (1 - fx) + srcData.data[i10] * fx;
        const bottom = srcData.data[i01] * (1 - fx) + srcData.data[i11] * fx;
        dstData.data[dstIndex + channel] = top * (1 - fy) + bottom * fy;
      }
    }
  }

  dstCtx.putImageData(dstData, 0, 0);
  return output;
}
