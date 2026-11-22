import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  color = "currentColor",
  className,
  width = 96,
  height = 28,
  filled = false,
}: {
  data: number[];
  color?: string;
  className?: string;
  width?: number;
  height?: number;
  filled?: boolean;
}) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const points = data.map((value, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * width;
    const y = height - ((value - min) / (max - min || 1)) * height;
    return { x, y };
  });

  let path = points.length ? `M ${points[0].x},${points[0].y}` : "";
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    path += ` C ${midX},${prev.y} ${midX},${curr.y} ${curr.x},${curr.y}`;
  }

  const id = `spark-${color.replace(/[^a-z0-9]/gi, "")}-${data.length}-${Math.round(max)}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("overflow-visible", className)} fill="none">
      {filled && (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path} L ${width},${height} L 0,${height} Z`} fill={`url(#${id})`} />
        </>
      )}
      <path d={path} stroke={color} strokeWidth={1.75} strokeLinecap="round" />
    </svg>
  );
}
