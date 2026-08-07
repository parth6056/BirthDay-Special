/**
 * Tiny dependency-free confetti burst. Draws hearts, circles and ribbons
 * onto a throwaway full-screen canvas, then cleans itself up.
 */

// Bright, saturated stops — muted colours vanish against the night background.
const COLORS = ['#f0aecb', '#f3d29a', '#ab9ae4', '#7de3c0', '#ffffff', '#e896b6'];

interface Bit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  spin: number;
  angle: number;
  color: string;
  shape: 'heart' | 'circle' | 'ribbon';
  life: number;
}

function heartPath(ctx: CanvasRenderingContext2D, s: number): void {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(0, -s * 0.1, -s, -s * 0.15, -s, s * 0.35);
  ctx.bezierCurveTo(-s, s * 0.8, 0, s * 1.05, 0, s * 1.4);
  ctx.bezierCurveTo(0, s * 1.05, s, s * 0.8, s, s * 0.35);
  ctx.bezierCurveTo(s, -s * 0.15, 0, -s * 0.1, 0, s * 0.3);
  ctx.closePath();
}

/**
 * @param originX 0–1 horizontal origin of the burst
 * @param originY 0–1 vertical origin of the burst
 * @param count   how many pieces
 */
export function burstConfetti(originX = 0.5, originY = 0.35, count = 140): void {
  if (typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  // iPhones run at 3x — capping the backing store keeps the burst smooth.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  // A phone screen needs fewer pieces to look just as full.
  const pieces = w < 700 ? Math.round(count * 0.6) : count;

  const shapes: Bit['shape'][] = ['heart', 'circle', 'ribbon'];
  const bits: Bit[] = Array.from({ length: pieces }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 11;
    return {
      x: originX * w,
      y: originY * h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      size: 5 + Math.random() * 8,
      spin: (Math.random() - 0.5) * 0.3,
      angle: Math.random() * Math.PI,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      shape: shapes[(Math.random() * shapes.length) | 0],
      life: 1,
    };
  });

  let frame = 0;
  const tick = (): void => {
    frame++;
    ctx.clearRect(0, 0, w, h);
    let alive = false;

    for (const b of bits) {
      b.vy += 0.28;          // gravity
      b.vx *= 0.99;          // drag
      b.vy *= 0.99;
      b.x += b.vx;
      b.y += b.vy;
      b.angle += b.spin;
      if (frame > 60) b.life -= 0.012;
      if (b.life <= 0 || b.y > h + 60) continue;
      alive = true;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);
      ctx.globalAlpha = Math.max(0, b.life);
      ctx.fillStyle = b.color;

      if (b.shape === 'heart') {
        heartPath(ctx, b.size * 0.6);
        ctx.fill();
      } else if (b.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, b.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-b.size * 0.35, -b.size * 0.7, b.size * 0.7, b.size * 1.4);
      }
      ctx.restore();
    }

    if (alive && frame < 460) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  };

  requestAnimationFrame(tick);
}
