import { toMetric, calcBmi, categoryFor, healthyRange, scalePosition, validate } from './bmi';

test('metric BMI is weight over height squared', () => {
  const { kg, m } = toMetric({ unit: 'metric', kg: '70', cm: '175' });
  expect(calcBmi(kg, m)).toBeCloseTo(22.86, 1);
});

test('imperial input gives the same BMI as the 703 formula', () => {
  const { kg, m } = toMetric({ unit: 'imperial', lb: '154', ft: '5', inch: '9' });
  expect(calcBmi(kg, m)).toBeCloseTo((154 / (69 * 69)) * 703, 1);
});

test('WHO categories', () => {
  expect(categoryFor(17).key).toBe('under');
  expect(categoryFor(18.5).key).toBe('healthy');
  expect(categoryFor(24.9).key).toBe('healthy');
  expect(categoryFor(25).key).toBe('over');
  expect(categoryFor(30).key).toBe('obese');
});

test('healthy range for 1.75 m', () => {
  expect(healthyRange(1.75, 'metric')).toEqual({ lo: '56.7', hi: '76.3', unit: 'kg' });
});

test('scale position is clamped', () => {
  expect(scalePosition(5)).toBe(0);
  expect(scalePosition(60)).toBe(100);
  expect(scalePosition(27)).toBe(50);
});

test('validation catches empty and implausible values', () => {
  expect(validate({ unit: 'metric', kg: '', cm: '170' })).toMatch(/Enter both/);
  expect(validate({ unit: 'metric', kg: '70', cm: '1700' })).toMatch(/height/);
  expect(validate({ unit: 'metric', kg: '70', cm: '170' })).toBeNull();
});
