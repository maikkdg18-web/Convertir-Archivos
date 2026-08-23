"use client";

import { useRef, useState, useCallback } from "react";
import { warpPerspective, type Point } from "../lib/perspective";

interface CornerAdjusterProps {
  imageUrl: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}

type Corner = "tl" | "tr" | "br" | "bl";
const cornerOrder: Corner[] = ["tl", "tr", "br", "bl"];

/**
 * Muestra una imagen ya cargada con 4 puntos arrastrables sobre las esquinas
 * (como el recorte en polígono de Google Classroom). Al confirmar, "endereza"
 * la perspectiva y devuelve el resultado como blob de imagen (PNG).
 */
export function CornerAdjuster({ imageUrl, onConfirm, onCancel }: CornerAdjusterProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [corners, setCorners] = useState<Record<Corner, Point> | null>(null);
  const [dragging, setDragging] = useState<Corner | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleImageLoad() {
    const img = imgRef.current;
    if (!img) return;

    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    setDisplaySize({ width: img.clientWidth, height: img.clientHeight });

    const marginX = img.clientWidth * 0.08;
    const marginY = img.clientHeight * 0.08;

    setCorners({
      tl: { x: marginX, y: marginY },
      tr: { x: img.clientWidth - marginX, y: marginY },
      br: { x: img.clientWidth - marginX, y: img.clientHeight - marginY },
      bl: { x: marginX, y: img.clientHeight - marginY },
    });
  }

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clamp(e.clientX - rect.left, 0, displaySize.width);
      const y = clamp(e.clientY - rect.top, 0, displaySize.height);
      setCorners((prev) => (prev ? { ...prev, [dragging]: { x, y } } : prev));
    },
    [dragging, displaySize]
  );

  async function handleApply() {
    if (!corners || !imgRef.current) return;
    setIsProcessing(true);

    try {
      const scaleX = imageSize.width / displaySize.width;
      const scaleY = imageSize.height / displaySize.height;

      const realCorners: Point[] = cornerOrder.map((c) => ({
        x: corners[c].x * scaleX,
        y: corners[c].y * scaleY,
      }));

      const sourceCanvas = document.createElement("canvas");
      sourceCanvas.width = imageSize.width;
      sourceCanvas.height = imageSize.height;
      sourceCanvas.getContext("2d")!.drawImage(imgRef.current, 0, 0);

      const outputWidth = Math.round(
        Math.max(distance(realCorners[0], realCorners[1]), distance(realCorners[3], realCorners[2]))
      );
      const outputHeight = Math.round(
        Math.max(distance(realCorners[0], realCorners[3]), distance(realCorners[1], realCorners[2]))
      );

      const resultCanvas = warpPerspective(
        sourceCanvas,
        realCorners,
        Math.max(outputWidth, 200),
        Math.max(outputHeight, 200)
      );

      resultCanvas.toBlob((blob) => {
        if (blob) onConfirm(blob);
        setIsProcessing(false);
      }, "image/png");
    } catch {
      setIsProcessing(false);
    }
  }

  return (
    <div className="result-panel" style={{ borderStyle: "solid" }}>
      <p className="result-meta" style={{ marginBottom: 12 }}>
        Ajusta los 4 puntos a las esquinas del documento
      </p>

      <div
        ref={containerRef}
        style={{ position: "relative", display: "inline-block", touchAction: "none", maxWidth: "100%" }}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setDragging(null)}
        onPointerLeave={() => setDragging(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Foto tomada"
          onLoad={handleImageLoad}
          style={{ maxWidth: "100%", display: "block", userSelect: "none" }}
          draggable={false}
        />

        {corners && (
          <svg
            width={displaySize.width}
            height={displaySize.height}
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
          >
            <polygon
              points={cornerOrder.map((c) => `${corners[c].x},${corners[c].y}`).join(" ")}
              fill="rgba(242,169,59,0.15)"
              stroke="#f2a93b"
              strokeWidth={2}
            />
          </svg>
        )}

        {corners &&
          cornerOrder.map((c) => (
            <div
              key={c}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging(c);
              }}
              style={{
                position: "absolute",
                left: corners[c].x - 14,
                top: corners[c].y - 14,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#f2a93b",
                border: "2px solid #12263a",
                cursor: "grab",
                touchAction: "none",
              }}
            />
          ))}

        {dragging && corners && displaySize.width > 0 && (
          <Magnifier point={corners[dragging]} imageUrl={imageUrl} displaySize={displaySize} />
        )}
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={handleApply} disabled={isProcessing} className="btn btn-primary">
          {isProcessing ? "procesando…" : "enderezar y agregar →"}
        </button>
        <button onClick={onCancel} className="btn btn-success">
          cancelar
        </button>
      </div>
    </div>
  );
}

const LOUPE_SIZE = 110;
const LOUPE_ZOOM = 2.5;
const LOUPE_OFFSET = 90; // separa la lupa del dedo para no taparla

interface MagnifierProps {
  point: Point;
  imageUrl: string;
  displaySize: { width: number; height: number };
}

/**
 * Lupa flotante (como el recorte en polígono de Google Classroom): al
 * arrastrar una esquina, muestra un acercamiento centrado en ese punto para
 * poder ubicarlo con precisión sin que el dedo tape la imagen debajo.
 */
function Magnifier({ point, imageUrl, displaySize }: MagnifierProps) {
  const showBelow = point.y - LOUPE_OFFSET - LOUPE_SIZE / 2 < 0;
  const centerY = showBelow ? point.y + LOUPE_OFFSET : point.y - LOUPE_OFFSET;

  return (
    <div
      style={{
        position: "absolute",
        left: point.x - LOUPE_SIZE / 2,
        top: centerY - LOUPE_SIZE / 2,
        width: LOUPE_SIZE,
        height: LOUPE_SIZE,
        borderRadius: "50%",
        border: "3px solid #f2a93b",
        boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
        overflow: "hidden",
        pointerEvents: "none",
        backgroundImage: `url(${imageUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${displaySize.width * LOUPE_ZOOM}px ${displaySize.height * LOUPE_ZOOM}px`,
        backgroundPosition: `${-(point.x * LOUPE_ZOOM - LOUPE_SIZE / 2)}px ${-(point.y * LOUPE_ZOOM - LOUPE_SIZE / 2)}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(242,169,59,0.9)",
          transform: "translateX(-50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          background: "rgba(242,169,59,0.9)",
          transform: "translateY(-50%)",
        }}
      />
    </div>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
