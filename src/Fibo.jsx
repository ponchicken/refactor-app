import React, { useMemo, useState } from "react";
import { useEffect } from "react";

const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export const Fibo = () => {
  const [calcTimes, setCalcTimes] = useState([]);
  const maxCalcTime = useMemo(
    () => Math.max(...calcTimes.map((t) => t.calcTime), 1),
    [calcTimes]
  );

  const [n, setN] = useState(1);
  const [result, setResult] = useState(0);

  const calcFibonacci = (n) => {
    if (n <= 1) {
      return n;
    }

    return calcFibonacci(n - 1) + calcFibonacci(n - 2);
  };

  useEffect(() => {
    const now = Date.now();
    const result = calcFibonacci(n);

    const addCalcTime = (n, calcTime) => {
      setCalcTimes((p) => [{ n, calcTime, id: p.length }, ...p]);
    };
    setResult(result);
    addCalcTime(n, Date.now() - now);
  }, [n]);

  return (
    <div id="canvas-container">
      <input
        type="range"
        min="1"
        max="100"
        value={n}
        onChange={(e) => setN(Number(e.target.value))}
      />
      <br />
      <input
        type="number"
        max={100}
        min={1}
        value={n}
        onChange={(e) => setN(Number(e.target.value))}
      />

      <div>result: {result}</div>

      <div>
        {calcTimes.map((c, i) => (
          <div
            key={c.id}
            style={{
              width: `calc(${c.calcTime} / ${maxCalcTime} * 100%)`,
              backgroundColor: randomColor(c.n),
              whiteSpace: "nowrap",
            }}
          >
            {c.id} - {c.n}: {c.calcTime}
          </div>
        ))}
      </div>
    </div>
  );
};
