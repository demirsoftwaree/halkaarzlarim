"use client";
import { useEffect, useRef } from "react";

/** Ana sayfa hero'sundaki dekoratif canlı grafik animasyonu. */
export default function HeroChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const W = cv.width;
    const H = cv.height;
    const N = 90;
    const data: number[] = [];
    let base = 60;
    for (let i = 0; i < N; i++) {
      base += (Math.random() - 0.42) * 5;
      base = Math.max(30, Math.min(H - 60, base));
      data.push(base);
    }

    let t = 0;
    let raf = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(94,118,155,0.08)";
      ctx.lineWidth = 1;
      for (let y = 30; y < H; y += 42) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      const step = W / (N - 1);
      const pts = data.map((v, i) => [i * step, H - v - 20]);
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "rgba(16,185,129,0.28)");
      grad.addColorStop(1, "rgba(16,185,129,0)");
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.strokeStyle = "#34d399";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(16,185,129,0.6)";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
      const [ex, ey] = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(ex, ey, 4, 0, 7);
      ctx.fillStyle = "#34d399";
      ctx.fill();
      const pr = 1 + 0.6 * Math.abs(Math.sin(t / 24));
      ctx.beginPath();
      ctx.arc(ex, ey, 4 + pr * 5, 0, 7);
      ctx.strokeStyle = `rgba(52,211,153,${0.55 - pr * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    function tick() {
      t++;
      if (t % 5 === 0) {
        const last = data[data.length - 1];
        let next = last + (Math.random() - 0.44) * 6;
        next = Math.max(30, Math.min(H - 60, next));
        data.push(next);
        data.shift();
      }
      draw();
      raf = requestAnimationFrame(tick);
    }

    draw();
    if (!reduceMotion) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} width={560} height={240} className="block w-full h-auto" />;
}
