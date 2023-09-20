import React, { useState } from "react";
import "./App.css";

interface Item {
  id: number;
  text: string;
}

function App() {
  const [items, setItems] = useState<Item[]>([{ id: 1, text: "test1" }]);
  const [newItem, setNewItem] = useState<string>("");
  const [editItem, setEditItem] = useState<Item | null>(null);

  const handleRead = async function () {
    try {
      const response = await fetch("/api/smth");
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
    await fetch("/api/smth", {
      method: "POST",
      body: JSON.stringify({ text: newItem }),
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
    await fetch(`/api/smth/${editItem.id}`, {
      method: "PUT",
      body: JSON.stringify({ text: newItem }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await handleRead();
    setEditItem(null);
    setNewItem("");
  };

  const handleDelete = async function (id: number) {
    await fetch(`/api/smth/${id}`, {
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
                {item.text}
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
    </>
  );
}

export default App;
