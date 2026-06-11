/**
 * data/analyticsData.ts
 *
 * Two complete datasets (Sales & Orders) spanning 2023–2024.
 *
 * Segment proportions are DELIBERATELY exaggerated to make the DonutChart
 * morph animation (Mode B) clearly visible on every timeline tap — each
 * category's share swings dramatically month-to-month so the arcs visibly
 * grow, shrink, and shift around the ring.
 *
 * All percentage arrays must sum to 100. Format:
 *   [food%, home%, services%, entertainment%, health%, other%]
 */

export type MetricType = 'sales' | 'orders' | 'users' | 'revenue';
export type TimePeriod = 'days' | 'weeks' | 'months' | 'quarters' | 'halves' | 'years';

export interface DonutSegment {
  key:     string;
  label:   string;
  value:   number;
  percent: number;
  color:   string;
}

export interface TimePoint {
  key:      string;
  label:    string;
  total:    number;
  segments: DonutSegment[];
}

// ─── Fixed colour palette per category ───────────────────────────────────────
const P = {
  food:          '#f56e0f',
  home:          '#38bdf8',
  services:      '#fbbf24',
  entertainment: '#a78bfa',
  health:        '#4ade80',
  other:         '#6b7280',
} as const;

const KEYS   = ['food','home','services','entertainment','health','other'] as const;
const LABELS = ['Food','Home','Services','Entertainment','Health','Other'];
const COLORS = [P.food, P.home, P.services, P.entertainment, P.health, P.other];

type Pcts = [number, number, number, number, number, number];

function segs(total: number, pcts: Pcts): DonutSegment[] {
  // Normalise so they always sum to exactly 100
  const sum  = pcts.reduce((a, b) => a + b, 0);
  const norm = pcts.map(p => Math.round((p / sum) * 100)) as unknown as number[];
  // Fix rounding drift on last element
  const drift = 100 - norm.reduce((a, b) => a + b, 0);
  norm[norm.length - 1] += drift;

  return KEYS.map((key, i) => ({
    key,
    label:   LABELS[i],
    value:   Math.round(total * norm[i] / 100),
    percent: norm[i],
    color:   COLORS[i],
  }));
}

// ─── SALES dataset — monthly ──────────────────────────────────────────────────
// Proportions swing dramatically so the morph animation is always clearly visible.
// Each month has a dominant category that rotates through the full palette.
const SALES_MONTHS: TimePoint[] = [
  // Jan: food-dominant (post-holiday food orders)
  { key:'jan23', label:'Jan 23', total:8400,  segments: segs(8400,  [52, 12,  8,  8, 12,  8]) },
  // Feb: home surges (Valentine's + decor), food halves
  { key:'feb23', label:'Feb 23', total:7900,  segments: segs(7900,  [18, 48,  9,  8, 10,  7]) },
  // Mar: services dominate (spring cleaning campaigns)
  { key:'mar23', label:'Mar 23', total:9200,  segments: segs(9200,  [20, 14, 44, 10,  7,  5]) },
  // Apr: entertainment peaks (Easter + school holidays)
  { key:'apr23', label:'Apr 23', total:10100, segments: segs(10100, [16, 10, 10, 50, 10,  4]) },
  // May: health explodes (fitness season / summer prep)
  { key:'may23', label:'May 23', total:11300, segments: segs(11300, [18, 12,  8, 12, 46,  4]) },
  // Jun: food rebounds + entertainment summer combo
  { key:'jun23', label:'Jun 23', total:12800, segments: segs(12800, [38, 14, 10, 26,  8,  4]) },
  // Jul: food peaks hardest (summer BBQ / delivery boom)
  { key:'jul23', label:'Jul 23', total:13400, segments: segs(13400, [55,  9,  7, 18,  7,  4]) },
  // Aug: home spikes (back-to-school)
  { key:'aug23', label:'Aug 23', total:11300, segments: segs(11300, [14, 52,  8, 14,  8,  4]) },
  // Sep: services bounce (autumn prep / home services)
  { key:'sep23', label:'Sep 23', total:10500, segments: segs(10500, [16, 12, 48, 12,  8,  4]) },
  // Oct: entertainment dominates (Halloween)
  { key:'oct23', label:'Oct 23', total:12100, segments: segs(12100, [12,  8,  8, 58,  8,  6]) },
  // Nov: home + food neck-and-neck (Black Friday split)
  { key:'nov23', label:'Nov 23', total:14200, segments: segs(14200, [36, 34,  8, 12,  6,  4]) },
  // Dec: entertainment + food holiday season
  { key:'dec23', label:'Dec 23', total:17800, segments: segs(17800, [30, 14,  6, 38, 10,  2]) },
  // Jan 24: health surges (new year resolutions)
  { key:'jan24', label:'Jan 24', total:9100,  segments: segs(9100,  [14, 10,  8, 10, 52,  6]) },
  // Feb 24: home again (Valentine's)
  { key:'feb24', label:'Feb 24', total:8700,  segments: segs(8700,  [16, 50,  8, 12,  8,  6]) },
  // Mar 24: services spike
  { key:'mar24', label:'Mar 24', total:10400, segments: segs(10400, [18, 12, 46, 12,  8,  4]) },
  // Apr 24: entertainment
  { key:'apr24', label:'Apr 24', total:11600, segments: segs(11600, [14,  8,  8, 54,  8,  8]) },
  // May 24: health again
  { key:'may24', label:'May 24', total:12500, segments: segs(12500, [16, 10,  8,  8, 52,  6]) },
  // Jun 24: food + entertainment summer
  { key:'jun24', label:'Jun 24', total:13900, segments: segs(13900, [42, 12, 10, 24,  8,  4]) },
];

// ─── Sales quarters ───────────────────────────────────────────────────────────
const SALES_QUARTERS: TimePoint[] = [
  { key:'q1_23', label:'Q1 2023', total:25500,  segments: segs(25500,  [30, 25, 20, 12,  9,  4]) },
  { key:'q2_23', label:'Q2 2023', total:34200,  segments: segs(34200,  [24, 12, 10, 32, 18,  4]) },
  { key:'q3_23', label:'Q3 2023', total:37200,  segments: segs(37200,  [40, 28,  8, 14,  8,  2]) },
  { key:'q4_23', label:'Q4 2023', total:44100,  segments: segs(44100,  [22, 16,  6, 44,  8,  4]) },
  { key:'q1_24', label:'Q1 2024', total:28200,  segments: segs(28200,  [16, 22, 34, 12, 12,  4]) },
  { key:'q2_24', label:'Q2 2024', total:38000,  segments: segs(38000,  [36,  8,  8, 28, 16,  4]) },
];

// ─── Sales halves ─────────────────────────────────────────────────────────────
const SALES_HALVES: TimePoint[] = [
  { key:'h1_23', label:'H1 2023', total:59700,  segments: segs(59700,  [28, 18, 14, 22, 14,  4]) },
  { key:'h2_23', label:'H2 2023', total:81300,  segments: segs(81300,  [32, 22,  6, 28, 10,  2]) },
  { key:'h1_24', label:'H1 2024', total:66200,  segments: segs(66200,  [24, 16, 20, 18, 18,  4]) },
];

// ─── Sales years ──────────────────────────────────────────────────────────────
const SALES_YEARS: TimePoint[] = [
  { key:'y2020', label:'2020',    total:62000,  segments: segs(62000,  [44, 18,  8, 14, 12,  4]) },
  { key:'y2021', label:'2021',    total:98000,  segments: segs(98000,  [22, 32, 12, 18, 12,  4]) },
  { key:'y2022', label:'2022',    total:118000, segments: segs(118000, [30, 14, 20, 22, 10,  4]) },
  { key:'y2023', label:'2023',    total:141000, segments: segs(141000, [28, 22,  8, 30, 10,  2]) },
  { key:'y2024', label:'2024',    total:66200,  segments: segs(66200,  [24, 16, 20, 18, 18,  4]) },
];

// ─── Sales days (14 days, dramatic daily swings) ─────────────────────────────
const DAY_PCTS: Pcts[] = [
  [50, 10,  8, 14, 12,  6],  // big food day
  [16, 50,  8, 10, 10,  6],  // big home day
  [14, 12, 50, 10,  8,  6],  // big services day
  [12, 10,  8, 54, 10,  6],  // big entertainment day
  [12, 10,  8, 10, 54,  6],  // big health day
  [36, 22, 12, 16,  8,  6],  // balanced food/home
  [48, 10,  8, 18, 10,  6],  // food spike
  [14, 46, 10, 12, 12,  6],  // home spike
  [18, 14, 44, 12,  8,  4],  // services spike
  [14, 12, 10, 48, 10,  6],  // entertainment spike
  [16, 12,  8, 12, 46,  6],  // health spike
  [38, 20, 14, 14,  8,  6],  // food+home
  [20, 16, 14, 34, 10,  6],  // entertainment+food
  [30, 26, 12, 16, 12,  4],  // balanced
];

const SALES_DAYS: TimePoint[] = Array.from({ length: 14 }, (_, i) => {
  const d = new Date('2024-06-18');
  d.setDate(d.getDate() - (13 - i));
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  const total = 280 + Math.round(Math.sin(i * 0.9) * 60 + i * 8);
  return {
    key:      `day_${i}`,
    label:    `${dd}/${mm}/${yy}`,
    total,
    segments: segs(total, DAY_PCTS[i]),
  };
});

// ─── Sales weeks (12 weeks, rotating dominant category) ──────────────────────
const WEEK_LABELS = [
  'Apr(1)', 'Apr(2)', 'Apr(3)', 'Apr(4)–May(1)',
  'May(2)', 'May(3)', 'May(4)',
  'Jun(1)', 'Jun(2)', 'Jun(3)', 'Jun(4)', 'Jun(4)–Jul(1)',
];
const WEEK_PCTS: Pcts[] = [
  [42, 14, 10, 16, 12,  6],
  [14, 48,  8, 14, 10,  6],
  [16, 14, 44, 12,  8,  6],
  [12, 10, 10, 50, 12,  6],
  [12, 10,  8, 12, 52,  6],
  [46, 16,  8, 14, 10,  6],
  [14, 46, 10, 14, 10,  6],
  [18, 12, 48, 12,  6,  4],
  [12,  8,  8, 56, 10,  6],
  [14, 10,  8, 10, 52,  6],
  [50, 14,  8, 14,  8,  6],
  [20, 38, 14, 16,  8,  4],
];
const SALES_WEEKS: TimePoint[] = WEEK_LABELS.map((label, i) => {
  const total = 1600 + Math.round(Math.sin(i * 0.7) * 200 + i * 30);
  return { key: `wk_${i}`, label, total, segments: segs(total, WEEK_PCTS[i]) };
});

// ─── ORDERS dataset — derived from Sales with independent proportion swings ───
const ORDER_MONTH_PCTS: Pcts[] = [
  [46, 14,  8, 12, 14,  6],
  [14, 46, 10,  8, 16,  6],
  [18, 12, 46,  8, 10,  6],
  [14, 10,  8, 52,  8,  8],
  [16, 10,  8, 10, 50,  6],
  [40, 14, 12, 22,  6,  6],
  [54,  8,  8, 16,  8,  6],
  [12, 54,  8, 12,  8,  6],
  [14, 12, 50, 12,  8,  4],
  [10,  8,  8, 58,  8,  8],
  [34, 32,  8, 14,  6,  6],
  [28, 12,  6, 40, 12,  2],
  [12,  8,  8, 10, 56,  6],
  [14, 48, 10, 12,  8,  8],
  [16, 14, 46, 12,  8,  4],
  [12,  8,  8, 56,  8,  8],
  [14, 10,  6, 10, 54,  6],
  [44, 10, 10, 24,  6,  6],
];

const ORDERS_MONTHS: TimePoint[] = SALES_MONTHS.map((sm, i) => ({
  ...sm,
  key:      sm.key + '_ord',
  total:    Math.round(sm.total / 28),
  segments: segs(Math.round(sm.total / 28), ORDER_MONTH_PCTS[i]),
}));

// ─── Assemble datasets ────────────────────────────────────────────────────────
export type DatasetKey = 'sales' | 'orders';

function scalePeriod(points: TimePoint[], divisor: number): TimePoint[] {
  return points.map(p => ({
    ...p,
    key:      p.key + '_ord',
    total:    Math.round(p.total / divisor),
    segments: p.segments.map(s => ({
      ...s,
      value: Math.round(s.value / divisor),
    })),
  }));
}

export const DATASETS: Record<DatasetKey, Record<TimePeriod, TimePoint[]>> = {
  sales: {
    days:     SALES_DAYS,
    weeks:    SALES_WEEKS,
    months:   SALES_MONTHS,
    quarters: SALES_QUARTERS,
    halves:   SALES_HALVES,
    years:    SALES_YEARS,
  },
  orders: {
    days:     scalePeriod(SALES_DAYS,     25),
    weeks:    scalePeriod(SALES_WEEKS,    25),
    months:   ORDERS_MONTHS,
    quarters: scalePeriod(SALES_QUARTERS, 30),
    halves:   scalePeriod(SALES_HALVES,   30),
    years:    scalePeriod(SALES_YEARS,    30),
  },
};

export const DATASET_OPTIONS: { key: DatasetKey; label: string }[] = [
  { key: 'sales',  label: 'Sales'  },
  { key: 'orders', label: 'Orders' },
];

export const PERIOD_OPTIONS: { key: TimePeriod; label: string }[] = [
  { key: 'days',     label: 'Days'     },
  { key: 'weeks',    label: 'Weeks'    },
  { key: 'months',   label: 'Months'   },
  { key: 'quarters', label: 'Quarters' },
  { key: 'halves',   label: 'Halves'   },
  { key: 'years',    label: 'Years'    },
];

// ─── Best sellers ─────────────────────────────────────────────────────────────
export const BEST_SELLERS = [
  {
    id: 'bs1', name: 'Lava Glazed Bowl', orders: 842, price: '$42.00', trend: '+8%',
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpO9PhniihDaYzg8AQLPQZLreEsvA8rFLRn1fmN6oQGv8orwFkqrfAEYBJN4yUkPRqTx-YXLh9ezOodDVPRV2WWv5kUCFs-N47jj5we7des27Y21vzqzAzwbXryUbuzpbldDUzxr_KXGKDTsqOJ3IoFWfZPckToQH0THf8MKBeRBSCukUKz1eG5hPy9JZNGa6hMKcGJsDlFccGJGx5viE0ORC2NdBYNG8hyBZZAC4q0LE5RE45xE5nzhW7PkkIkEcsP6pL11LqJDef',
  },
  { id: 'bs2', name: 'Nitro Espresso', orders: 2103, price: '$6.50',  trend: '+14%', imageUri: null },
  { id: 'bs3', name: 'Spicy Ramen Bowl', orders: 1540, price: '$18.00', trend: '+5%', imageUri: null },
];

export const TOP_VENUES = [
  {
    id: 'v1', name: 'The Vault Kitchen', visitors: '12.4k',
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeJTm7VLozkDStaIv-38KcGJysEKFmQs5NjEGr-p2PeZTxbOqQjXJblOdUNrUnf4WvgDlIA2Rn3FPO2f0RUuDWApr4VRSMRqvwX5gh88V16rkzy3Z-zl0M7wNSwd5o11WvBxm7sej-3AvDv3RQm1EVG0r1EEWfz64AWefmM5mz2ax2ILKbzTjxBs1RKral1sSqTTV-OkdvsCCHh-WWEs8DcCwUYOy8j1EMsuwXe8SxoZxonzuDw6oLpKbmtxvAfaadl-9FYpZHw-tI',
  },
  {
    id: 'v2', name: 'Neon Siphon', visitors: '9.8k',
    imageUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLcodurA8I8BdKM-LnxdIivDpquod0t1Ir0Fcx-Ebvh7dX3abZvysjeTeMR7JIfvsXsL7jrJlQTKZTqlnu-812p75QDYMAEibt5Lr64exk7paJbOi930U2BBNvCheyxLFSkzGGwITSwZ0Pghx1IPhPIF5YVpwddPGSmaDdm_aEyH9bTmLDdp9RuhQho96h-Vso7Z3MtDj9U-QxQB62HYLsrVZqIMWamvcTVqctX3qZ48YQIL6kxE8XfHou1rhIS1imvm7pcUa1L1sS',
  },
];

export const SUPPORT_STATS = {
  unresolved:        8,
  unresolvedDelta:  '+12%',
  avgResponse:      '4m',
  avgResponseDelta: '-2m',
};