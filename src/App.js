import React, { useEffect, useState } from 'react';
import './index.css';
import {
  CATEGORIES,
  SCALE_MIN,
  SCALE_MAX,
  toMetric,
  calcBmi,
  categoryFor,
  healthyRange,
  adviceFor,
  scalePosition,
  validate,
} from './bmi';

const HISTORY_KEY = 'bmi-history';
const UNIT_KEY = 'bmi-unit';
const EMPTY = { kg: '', cm: '', lb: '', ft: '', inch: '' };

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) – the app still works */
  }
}

function Tape({ bmi }) {
  const ticks = [];
  for (let v = SCALE_MIN; v <= SCALE_MAX; v += 1) ticks.push(v);
  const span = SCALE_MAX - SCALE_MIN;

  return (
    <div className="tape" role="img" aria-label={bmi ? `BMI ${bmi.toFixed(1)} on a scale from ${SCALE_MIN} to ${SCALE_MAX}` : 'BMI scale'}>
      <div className="tape-bands">
        {CATEGORIES.map((c) => {
          const lo = Math.max(c.min, SCALE_MIN);
          const hi = Math.min(c.max, SCALE_MAX);
          return (
            <span
              key={c.key}
              className="tape-band"
              style={{ left: `${((lo - SCALE_MIN) / span) * 100}%`, width: `${((hi - lo) / span) * 100}%`, background: c.color }}
              title={c.label}
            />
          );
        })}
      </div>
      <div className="tape-body">
        {ticks.map((v) => (
          <span
            key={v}
            className={`tick ${v % 5 === 0 ? 'tick-major' : ''}`}
            style={{ left: `${((v - SCALE_MIN) / span) * 100}%` }}
          >
            {v % 5 === 0 && <em>{v}</em>}
          </span>
        ))}
        {bmi && <span className="marker" style={{ left: `${scalePosition(bmi)}%` }} />}
      </div>
    </div>
  );
}

function App() {
  const [unit, setUnit] = useState(() => load(UNIT_KEY, 'metric'));
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => load(HISTORY_KEY, []));

  useEffect(() => save(UNIT_KEY, unit), [unit]);
  useEffect(() => save(HISTORY_KEY, history), [history]);

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const switchUnit = (next) => {
    setUnit(next);
    setValues(EMPTY);
    setResult(null);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = { unit, ...values };
    const problem = validate(form);
    if (problem) {
      setError(problem);
      setResult(null);
      return;
    }
    setError('');
    const { kg, m } = toMetric(form);
    const bmi = calcBmi(kg, m);
    const category = categoryFor(bmi);
    setResult({ bmi, kg, m, category });
    setHistory((h) =>
      [{ bmi: Number(bmi.toFixed(1)), key: category.key, date: new Date().toISOString() }, ...h].slice(0, 8)
    );
  };

  const reset = () => {
    setValues(EMPTY);
    setResult(null);
    setError('');
  };

  const range = result && healthyRange(result.m, unit);

  return (
    <main className="app">
      <header className="masthead">
        <h1>BMI Calculator</h1>
        <p>Measure where your weight sits for your height.</p>
      </header>

      <section className="panel">
        <div className="units" role="radiogroup" aria-label="Units">
          {['metric', 'imperial'].map((u) => (
            <button
              key={u}
              type="button"
              role="radio"
              aria-checked={unit === u}
              className={unit === u ? 'unit active' : 'unit'}
              onClick={() => switchUnit(u)}
            >
              {u === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lb, ft)'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {unit === 'metric' ? (
            <div className="fields">
              <label>
                Weight
                <span className="input-unit">
                  <input inputMode="decimal" value={values.kg} onChange={update('kg')} placeholder="70" />
                  <span>kg</span>
                </span>
              </label>
              <label>
                Height
                <span className="input-unit">
                  <input inputMode="decimal" value={values.cm} onChange={update('cm')} placeholder="175" />
                  <span>cm</span>
                </span>
              </label>
            </div>
          ) : (
            <div className="fields fields-3">
              <label>
                Weight
                <span className="input-unit">
                  <input inputMode="decimal" value={values.lb} onChange={update('lb')} placeholder="154" />
                  <span>lb</span>
                </span>
              </label>
              <label>
                Height
                <span className="input-unit">
                  <input inputMode="numeric" value={values.ft} onChange={update('ft')} placeholder="5" />
                  <span>ft</span>
                </span>
              </label>
              <label>
                <span className="sr-only">Inches</span>&nbsp;
                <span className="input-unit">
                  <input inputMode="decimal" value={values.inch} onChange={update('inch')} placeholder="9" aria-label="Inches" />
                  <span>in</span>
                </span>
              </label>
            </div>
          )}

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <div className="actions">
            <button className="btn" type="submit">
              Calculate BMI
            </button>
            <button className="btn btn-quiet" type="button" onClick={reset}>
              Clear
            </button>
          </div>
        </form>

        <Tape bmi={result?.bmi} />

        <div className="result" aria-live="polite">
          {result ? (
            <>
              <div className="reading">
                <strong>{result.bmi.toFixed(1)}</strong>
                <span className="chip" style={{ background: result.category.color }}>
                  {result.category.label}
                </span>
              </div>
              <p>
                A healthy weight for your height is{' '}
                <b>
                  {range.lo}–{range.hi} {range.unit}
                </b>
                .
              </p>
              <p>{adviceFor(result.bmi, result.kg, result.m, unit)}</p>
            </>
          ) : (
            <p className="hint">Enter your weight and height to see your reading on the tape.</p>
          )}
        </div>
      </section>

      {history.length > 0 && (
        <section className="history">
          <div className="history-head">
            <h2>Your recent readings</h2>
            <button type="button" className="link" onClick={() => setHistory([])}>
              Clear history
            </button>
          </div>
          <ol>
            {history.map((h, i) => {
              const c = CATEGORIES.find((x) => x.key === h.key);
              return (
                <li key={h.date + i}>
                  <span className="dot" style={{ background: c?.color }} />
                  <b>{h.bmi.toFixed(1)}</b>
                  <span>{c?.label}</span>
                  <time dateTime={h.date}>
                    {new Date(h.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </time>
                </li>
              );
            })}
          </ol>
          <p className="small">Saved only in this browser.</p>
        </section>
      )}

      <footer className="small">
        BMI is a screening measure based on the WHO adult ranges. It doesn't account for muscle mass, age or body
        shape, so talk to a health professional about your own situation.
      </footer>
    </main>
  );
}

export default App;
