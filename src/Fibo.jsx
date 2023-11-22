import React, { useState } from "react";
import { useEffect } from "react";

export const Fibo = () => {
  const [n, setN] = useState(1);
  const [result, setResult] = useState(0);

  const calcFibonacci = (n) => {
    if (n <= 1) {
      return n;
    }

    return calcFibonacci(n - 1) + calcFibonacci(n - 2);
  };

  useEffect(() => {
    setResult(calcFibonacci(n));
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
    </div>
  );
};
