import React, { useEffect, useState } from "react";

function rand(min, max) {
  return min + Math.random() * (max + 1 - min);
}

function randColor() {
  return `rgba(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`;
}

function createPlanetState() {
  return {
    id: Math.random(),
    // диаметр планеты
    size: rand(10, 30),
    // цвет планеты
    color: randColor(),
    // расстояние до центра солнечной системы
    orbit: rand(70, 250),
    // текущий угол
    angle: rand(0, 2 * Math.PI),
    // время, за которое планета делает полный оборот
    speedMs: rand(4000, 9000),
  };
}

export const Space = () => {
  const [planets, setPlanets] = useState([]);

  const addPlanet = () => {
    const newPlanet = createPlanetState();
    setPlanets((prev) => [...prev, newPlanet]);

    const TICK_MS = 16;

    setInterval(() => {
      setPlanets((prev) =>
        prev.map((planet) => {
          if (planet.id === newPlanet.id) {
            const angleDiff = (2 * Math.PI * TICK_MS) / planet.speedMs;
            return { ...planet, angle: planet.angle + angleDiff };
          }

          return planet;
        })
      );
    }, TICK_MS);
  };

  const removePlanet = (id) => {
    setPlanets((prev) => prev.filter((x) => x.id !== id));
  };

  useEffect(() => {
    Array(150).fill(0).forEach(addPlanet);
  }, []);

  return (
    <div>
      <button onClick={addPlanet}>Add planet</button>
      <div style={{ background: "black", width: 600, height: 600 }}>
        <div style={{ position: "relative", left: 300, top: 300 }}>
          <div
            // sun
            style={{
              width: 40,
              height: 40,
              background: "yellow",
              position: "absolute",
              borderRadius: "50%",
              left: -20,
              top: -20,
            }}
          />
          {planets.map((planet) => (
            <div
              key={planet.id}
              onClick={() => removePlanet(planet.id)}
              style={{
                width: planet.size,
                height: planet.size,
                background: planet.color,
                borderRadius: "50%",
                position: "absolute",
                left: planet.orbit * Math.cos(planet.angle) - planet.size / 2,
                top: planet.orbit * Math.sin(planet.angle) - planet.size / 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
