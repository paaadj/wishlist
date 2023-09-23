import React, { useState } from "react";
import "./App.css";
import Registration from "./components/Registration/Registration";

interface Item {
  id: number;
  title: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<string>("");
  const [editItem, setEditItem] = useState<Item | null>(null);

  const handleRead = async function () {
    try {
      const response = await fetch("http://localhost:8000/api/get_item");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("db error");
      throw error;
    }
  };

  const handleCreate = async function () {
    if (!newItem) {
      return;
    }
    await fetch("http://localhost:8000/api/create_item", {
      method: "POST",
      body: JSON.stringify({ title: newItem }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await handleRead();
    console.log("asdf");
    setNewItem("");
  };

  const handleUpdate = async function () {
    if (!editItem) {
      return;
    }
    await fetch(`http://localhost:8000/api/update_item/${editItem.id}`, {
      method: "PUT",
      body: JSON.stringify({ title: newItem }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await handleRead();
    setEditItem(null);
    setNewItem("");
  };

  const handleDelete = async function (id: number) {
    await fetch(`http://localhost:8000/api/delete/${id}`, {
      method: "DELETE",
    });
    await handleRead();
  };

  return (
    <>
      <div>
        <h2>{"Прочитать из бд"}</h2>
        <button onClick={handleRead}>Прочитать</button>
        <h2>{"Данные"}</h2>
        {items.length ? (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.title}
                {"          "}
                <button onClick={() => setEditItem(item)}>Редактировать</button>
                <button onClick={() => handleDelete(item.id)}>Удалить</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>{"Пусто в бд"}</p>
        )}
      </div>
      <div>
        <h2>{editItem ? "Редактировать элемент" : "Добавить новый элемент"}</h2>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        {editItem ? (
          <>
            <button onClick={handleUpdate}>Редактировать</button>
            <button onClick={() => setEditItem(null)}>Отмена</button>
          </>
        ) : (
          <button onClick={handleCreate}>Добавить</button>
        )}
      </div>

          <h1>Регистрация</h1>
          <Registration/>

    </>
  );
}

export default App;
