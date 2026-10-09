// Pure BMI helpers, kept separate from the UI so they are easy to test.

export const CATEGORIES = [
  { key: 'under', label: 'Underweight', min: 0, max: 18.5, color: '#5B9BD5' },
  { key: 'healthy', label: 'Healthy weight', min: 18.5, max: 25, color: '#3E9F68' },
  { key: 'over', label: 'Overweight', min: 25, max: 30, color: '#E09A2F' },
  { key: 'obese', label: 'Obese', min: 30, max: Infinity, color: '#D04E4A' },
];

// The visible range of the tape measure.
export const SCALE_MIN = 12;
export const SCALE_MAX = 42;

const LB_PER_KG = 2.20462;
const CM_PER_IN = 2.54;

/** Convert the form values to kilograms and metres. Returns null when invalid. */
export function toMetric({ unit, kg, cm, lb, ft, inch }) {
  if (unit === 'metric') {
    const w = parseFloat(kg);
    const h = parseFloat(cm) / 100;
    return w > 0 && h > 0 ? { kg: w, m: h } : null;
  }
  const w = parseFloat(lb);
  const totalIn = (parseFloat(ft) || 0) * 12 + (parseFloat(inch) || 0);
  return w > 0 && totalIn > 0 ? { kg: w / LB_PER_KG, m: (totalIn * CM_PER_IN) / 100 } : null;
}

export function calcBmi(kg, m) {
  return kg / (m * m);
}

export function categoryFor(bmi) {
  return CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) || CATEGORIES[CATEGORIES.length - 1];
}

/** Healthy weight range (BMI 18.5 – 24.9) for a height, in the user's unit. */
export function healthyRange(m, unit) {
  const lo = 18.5 * m * m;
  const hi = 24.9 * m * m;
  return unit === 'metric'
    ? { lo: lo.toFixed(1), hi: hi.toFixed(1), unit: 'kg' }
    : { lo: (lo * LB_PER_KG).toFixed(0), hi: (hi * LB_PER_KG).toFixed(0), unit: 'lb' };
}

/** How far the user is from the healthy range, as a sentence. */
export function adviceFor(bmi, kg, m, unit) {
  const toUnit = (v) => (unit === 'metric' ? `${v.toFixed(1)} kg` : `${(v * LB_PER_KG).toFixed(0)} lb`);
  if (bmi < 18.5) return `Gaining about ${toUnit(18.5 * m * m - kg)} would bring you into the healthy range.`;
  if (bmi >= 25) return `Losing about ${toUnit(kg - 24.9 * m * m)} would bring you into the healthy range.`;
  return 'You are inside the healthy range for your height.';
}

/** Position of a BMI value on the tape, as a percentage (clamped). */
export function scalePosition(bmi) {
  const pct = ((bmi - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
  return Math.min(100, Math.max(0, pct));
}

/** Sanity limits so typos like 1700 cm are caught instead of producing nonsense. */
export function validate(values) {
  const metric = toMetric(values);
  if (!metric) return 'Enter both your weight and your height.';
  if (metric.m < 0.5 || metric.m > 2.6) return 'That height looks off. Check the number and the unit.';
  if (metric.kg < 10 || metric.kg > 400) return 'That weight looks off. Check the number and the unit.';
  return null;
}
