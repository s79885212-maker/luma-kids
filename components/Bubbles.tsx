// Декоративные «пузыри» как на логотипе Luma Kids: малиновые и голубые круги разного размера.
// Кладётся внутрь блока с position: relative и overflow-hidden.
type Variant = "hero" | "banner" | "header";

const sets: Record<Variant, { cx: number; cy: number; r: number; fill: string; opacity?: number }[]> = {
  hero: [
    { cx: 92, cy: 8, r: 16, fill: "#ffffff", opacity: 0.18 },
    { cx: 4, cy: 92, r: 12, fill: "#00a3d6", opacity: 0.85 },
    { cx: 14, cy: 80, r: 4, fill: "#ffffff", opacity: 0.5 },
    { cx: 80, cy: 96, r: 6, fill: "#00a3d6", opacity: 0.6 },
  ],
  banner: [
    { cx: 96, cy: 10, r: 14, fill: "#00a3d6", opacity: 0.25 },
    { cx: 86, cy: 88, r: 8, fill: "#e40381", opacity: 0.18 },
    { cx: 3, cy: 85, r: 6, fill: "#00a3d6", opacity: 0.3 },
  ],
  header: [
    { cx: 97, cy: 30, r: 10, fill: "#e40381", opacity: 0.12 },
    { cx: 90, cy: 85, r: 5, fill: "#00a3d6", opacity: 0.25 },
  ],
};

export function Bubbles({ variant }: { variant: Variant }) {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      {sets[variant].map((b, i) => (
        <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.fill} opacity={b.opacity ?? 1} />
      ))}
    </svg>
  );
}
