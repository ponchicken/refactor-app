import React, { useEffect } from "react";
import { useState } from "react";
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
  return fetch(`https://api.thecatapi.com/v1/images/search?page=${page}&order=ASC&breed_ids=beng`, {
    headers: {
      // 'x-api-key': 'live_7H4S77pmqI27UsJ9ZG1xtj2BVojwStzTIBGYum6tuzHl1oEBLXTldtgS9Ou74d2j'
    }
  })
    .then((r) => r.json())
    .then((r) => r[0]);
};

export const App = () => {
  const [page, setPage] = useState("");
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");
  const [cats, setCats] = useState([]);
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
    setLoading(true)
    Promise.all(
      Array(3)
        .fill(0)
        .map(() => getCat(pagination))
    ).then((values) => {
      console.log(values);
      setCats((p) => [...p, ...values]);
      setLoading(false)
    });
  }, [pagination]);

  return (
    <div>
      <div>
        Nav:
        <button onClick={() => setPage("todo")}>todo</button>
        <button onClick={() => setPage("cats")}>cats</button>
        <button onClick={() => setPage("third")}>third</button>
      </div>

      <hr />

      <div>
        {page === "" && (
          <div>
            <div>Today's Todos</div>

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
                  <div key={todo}>{todo} <button onClick={() => setTodos(todos.filter((_, j) => i !== j))}>x</button></div>
                ))}
              </div>
            </div>
          </div>
        )}
        {page === "cats" && (
          <div>
            <h2>cats</h2>
            <progress value={progress} max="100" />
            <div>
              {cats.map((cat, i) => (
                <div key={i}>
                  {i + 1} - {cat.id} - <img src={cat.url} style={{ height: "100px" }} />
                </div>
              ))}
            </div>
            {isLoading && <div>Loading...</div>}
          </div>
        )}
        {page === "third" && <div>page 3</div>}
      </div>
    </div>
  );
};
