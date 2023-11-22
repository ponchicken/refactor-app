import React, { useEffect } from "react";
import { useState } from "react";
import { Fibo } from "./Fibo";
import { Space } from "./Space";
import _ from "lodash";
import "./styles.css";

/**
 * @see https://thecatapi.com/
 * @example response
 * [{
    "id":"0XYvRd7oD",
    "width":1204,"height":1445,
    "url":"https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg",
    "breeds":[{
        "weight":{"imperial":"7  -  10","metric":"3 - 5"},
        "id":"abys","name":"Abyssinian",
        "temperament":"Active, Energetic, Independent, Intelligent, Gentle",
        "origin":"Egypt",
        "country_codes":"EG",
        "country_code":"EG",
        "life_span":"14 - 15",
        "wikipedia_url":"https://en.wikipedia.org/wiki/Abyssinian_(cat)"
    }]
  }]
  */
const getCat = (page = 0) => {
  return fetch(
    `https://api.thecatapi.com/v1/images/search?page=${page}&order=ASC&breed_ids=beng`,
    {
      headers: {
        // 'x-api-key': 'live_7H4S77pmqI27UsJ9ZG1xtj2BVojwStzTIBGYum6tuzHl1oEBLXTldtgS9Ou74d2j'
      },
    }
  )
    .then((r) => r.json())
    .then((r) => r[0]);
};

export const App = () => {
  const [page, setPage] = useState("");
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");
  const [cats, setCats] = useState([]);
  const [catId, setCatId] = useState("");
  const [progress, setProgress] = useState(0);
  const [pagination, setPagination] = useState(0);
  const [isLoading, setLoading] = useState(false);

  function recalculateProgress(e) {
    // Высота экрана:
    const viewportHeight = window.innerHeight;
    // Высота страницы:
    const pageHeight = document.body.offsetHeight;
    // Текущее положение прокрутки:
    const currentPosition = window.scrollY;

    // Из высоты страницы вычтем высоту экрана,
    // чтобы при прокручивании до самого низа
    // прогресс-бар заполнялся до конца.
    const availableHeight = pageHeight - viewportHeight;

    // Считаем процент «прочитанного» текста:
    const percent = (currentPosition / availableHeight) * 100;

    // Проставляем посчитанное значение
    // в качестве значения для value прогресс-бара:
    setProgress(percent);
  }

  useEffect(() => {
    document.addEventListener("scroll", recalculateProgress);
    document.addEventListener("scroll", () => {
      if (
        window.scrollY / (document.body.offsetHeight - window.innerHeight) >
        0.9
      ) {
        setPagination((p) => p + 3);
      }
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all(
      Array(3)
        .fill(0)
        .map(() => getCat(pagination))
    ).then((values) => {
      console.log(values);
      setCats((p) => [...p, ...values]);
      setLoading(false);
    });
  }, [pagination]);

  return (
    <div>
      <div className="nav">
        <nav>
          <ul>
            <li>
              <button onClick={() => setPage("todo")}>todo</button>
            </li>
            <li>
              <button onClick={() => setPage("fibo")}>fibo</button>
            </li>
            <li>
              <button onClick={() => setPage("cats")}>cats</button>
            </li>
            <li>
              <button onClick={() => setPage("space")}>space</button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="content">
        {page === "" && (
          <div>
            <h1>Today's Todos</h1>

            <div>
              <input
                onChange={(e) => {
                  setInputText(e.target.value);
                }}
                placeholder="Type todo text..."
                value={inputText}
              />
              <div>
                <button onClick={() => setTodos([inputText])}>Add todo</button>
              </div>

              <hr />

              <div>
                {todos.map((todo, i) => (
                  <div key={todo}>
                    {todo}{" "}
                    <button
                      onClick={() => setTodos(todos.filter((_, j) => i !== j))}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {page === "cats" && (
          <div>
            <h1>cats</h1>
            <progress value={progress} max="100" />
            <div>
              <input
                type="search"
                placeholder="Find cat with id"
                value={catId}
                onChange={(e) => setCatId(e.target.value)}
              />
            </div>
            <hr />
            <div>
              {cats
                .filter((cat) => cat.id.includes(catId))
                .map((cat, i) => (
                  <div key={i}>
                    {i + 1} <img src={cat.url} style={{ height: "100px" }} /> -{" "}
                    {cat.id}
                  </div>
                ))}
            </div>
            {isLoading && <div>Loading...</div>}
          </div>
        )}
        {page === "space" && (
          <div>
            <h1>space</h1>
            <Space />
          </div>
        )}

        {page === "fibo" && (
          <div>
            <h1>fibo</h1>
            <Fibo />
          </div>
        )}
      </div>
    </div>
  );
};
