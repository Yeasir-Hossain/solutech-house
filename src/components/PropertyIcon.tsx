import type { PropertyType } from '@/lib/valuation';

/**
 * Line-art silhouettes for the property-type tiles. Each one is deliberately
 * distinct on storeys, width and attachment so the option reads at a glance
 * rather than needing its label.
 */
const PATHS: Record<PropertyType, string[]> = {
  // Tall apartment block with window rows.
  apartment: [
    'M12 36V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v29',
    'M8 36h24',
    'M17 36v-6h6v6',
    'M16 11h2M22 11h2M16 16h2M22 16h2M16 21h2M22 21h2',
  ],
  // Wide single-storey bungalow, big roof.
  'bungalow-detached': ['M5 21 20 9l15 12', 'M9 20v16h22V20', 'M18 36v-8h4v8', 'M13 24h3M24 24h3'],
  // Bungalow semi — centre divider, two doors.
  'bungalow-semi': ['M5 21 20 9l15 12', 'M9 20v16h22V20', 'M20 20v16', 'M12 36v-6h4v6M24 36v-6h4v6'],
  // Bungalow end terrace — offset divider.
  'bungalow-endterr': ['M5 21 20 9l15 12', 'M9 20v16h22V20', 'M27 20v16', 'M14 36v-7h5v7'],
  // Terrace — row of three rooftops.
  'house-terrace': ['M4 18l6-6 6 6M16 18l6-6 6 6M28 18l6-6', 'M6 16v20h28V16', 'M16 36V16M26 36V16'],
  // End terrace — two rooftops with a solid end wall.
  'house-endterrace': ['M6 18l6-6 6 6M18 18l6-6 6 6', 'M8 16v20h24V16', 'M20 36V16', 'M32 12v24'],
  // Detached two-storey house with chimney.
  'house-detached': [
    'M6 20 20 8l14 12',
    'M9 18v18h22V18',
    'M17 36v-9h6v9',
    'M14 22h3M23 22h3',
    'M26 9v4',
  ],
  // Semi-detached — two joined two-storey houses.
  'house-semi': [
    'M4 19 12 12l8 7M20 19l8-7 8 7',
    'M6 18v18h28V18',
    'M20 36V18',
    'M11 36v-7h4v7M25 36v-7h4v7',
  ],
  // Other — house outline with a marker.
  other: ['M8 20 20 10l12 10', 'M11 18v18h18V18', 'M20 24.5v5M17.5 27h5'],
};

export default function PropertyIcon({ type }: { type: PropertyType }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[type].map((d) => (
        <path key={d} d={d} />
      ))}
      {type === 'other' ? <circle cx={20} cy={27} r={4.5} /> : null}
    </svg>
  );
}
