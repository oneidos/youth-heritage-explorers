import { CITIES, MAP_VIEWBOX, project, type City } from "@/lib/cicero";
import { cn } from "@/lib/utils";

// Contorni semplificati (lat, lon) — bastano a rendere riconoscibile la penisola.
const MAINLAND: [number, number][] = [
  [46.5, 7.9],
  [46.6, 10.4],
  [46.8, 12.3],
  [46.5, 13.6],
  [45.7, 13.8],
  [44.8, 12.3],
  [43.6, 13.5],
  [42.2, 14.4],
  [41.9, 15.5],
  [41.4, 16.5],
  [40.5, 18.0],
  [40.0, 18.4],
  [40.2, 17.2],
  [39.9, 16.9],
  [38.9, 16.6],
  [37.95, 16.1],
  [38.05, 15.65],
  [39.3, 16.1],
  [40.0, 15.3],
  [40.8, 14.3],
  [41.2, 13.1],
  [41.8, 12.3],
  [42.4, 11.3],
  [43.4, 10.3],
  [44.2, 9.4],
  [44.4, 8.5],
  [43.8, 7.6],
  [44.7, 7.0],
  [45.5, 6.9],
  [46.0, 7.0],
];

const SICILY: [number, number][] = [
  [38.2, 12.4],
  [38.1, 13.4],
  [38.0, 15.1],
  [37.4, 15.1],
  [36.7, 15.1],
  [36.8, 14.5],
  [37.5, 12.5],
];

const SARDINIA: [number, number][] = [
  [41.2, 9.2],
  [41.0, 9.6],
  [40.5, 9.7],
  [39.5, 9.6],
  [39.1, 9.1],
  [39.3, 8.4],
  [40.5, 8.2],
  [41.0, 8.2],
];

function toPoints(coords: [number, number][]): string {
  return coords
    .map(([lat, lon]) => {
      const { x, y } = project(lat, lon);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function ItalyMap({
  selected,
  onSelect,
  highlightCities,
  className,
}: {
  selected?: string | null;
  onSelect?: (city: City) => void;
  highlightCities?: string[];
  className?: string;
}) {
  const shown = highlightCities
    ? CITIES.filter((c) => highlightCities.includes(c.name))
    : CITIES.slice(0, 20);

  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-card p-2", className)}>
      <svg
        viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
        className="h-full w-full"
        role="img"
        aria-label="Mappa dell'Italia con le città disponibili"
      >
        <defs>
          <pattern id="cicero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M20 0H0V20"
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width={MAP_VIEWBOX.width} height={MAP_VIEWBOX.height} fill="url(#cicero-grid)" />
        {[MAINLAND, SICILY, SARDINIA].map((shape, i) => (
          <polygon
            key={i}
            points={toPoints(shape)}
            fill="var(--color-elevated)"
            stroke="var(--color-primary)"
            strokeOpacity="0.45"
            strokeWidth="1.2"
          />
        ))}
        {shown.map((city) => {
          const { x, y } = project(city.lat, city.lon);
          const isSelected = selected === city.name;
          return (
            <g
              key={city.name}
              onClick={() => onSelect?.(city)}
              className={onSelect ? "cursor-pointer" : undefined}
            >
              {isSelected && (
                <circle cx={x} cy={y} r="9" fill="var(--color-primary)" opacity="0.25" />
              )}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 4.4 : 3}
                fill={isSelected ? "var(--color-primary)" : "var(--color-foreground)"}
                fillOpacity={isSelected ? 1 : 0.75}
              />
              <text
                x={x + 6}
                y={y + 3.4}
                fontSize="8.5"
                fill={isSelected ? "var(--color-primary)" : "var(--color-muted-foreground)"}
                fontFamily="DM Sans, sans-serif"
              >
                {city.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
