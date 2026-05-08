import { useState, useEffect } from "react";

export default function App() {
  const [producto, setProducto] = useState("");
  const [lista, setLista] = useState(() => {
    const guardado = localStorage.getItem("lista");
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("lista", JSON.stringify(lista));
  }, [lista]);

  const agregarProducto = () => {
    if (!producto.trim()) return;

    setLista([
      ...lista,
      {
        nombre: producto,
        comprado: false,
        cantidad: 0,
        precio: 0,
      },
    ]);

    setProducto("");
  };

  const marcarComprado = (index) => {
    const cantidad = prompt("Cantidad:");
    const precio = prompt("Precio:");

    if (!cantidad || !precio) return;

    const nuevaLista = [...lista];

    nuevaLista[index] = {
      ...nuevaLista[index],
      comprado: true,
      cantidad: Number(cantidad),
      precio: Number(precio),
    };

    const item = nuevaLista.splice(index, 1)[0];
    nuevaLista.push(item);

    setLista(nuevaLista);
  };

  const reiniciarCompra = () => {
    const reiniciada = lista.map((item) => ({
      ...item,
      comprado: false,
      cantidad: 0,
      precio: 0,
    }));

    setLista(reiniciada);
  };

  const total = lista.reduce((acc, item) => {
    return acc + item.cantidad * item.precio;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      <div className="bg-green-500 text-white text-3xl font-bold p-4 rounded-2xl mb-4 shadow">
        TOTAL: ${total}
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          placeholder="Agregar producto"
          className="flex-1 p-3 rounded-xl border"
        />

        <button
          onClick={agregarProducto}
          className="bg-blue-500 text-white px-4 rounded-xl"
        >
          +
        </button>
      </div>

      <div className="space-y-2">
        {lista.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-2xl flex justify-between items-center shadow ${
              item.comprado
                ? "bg-gray-300 text-gray-600"
                : "bg-white"
            }`}
          >
            <div>
              <div className="font-semibold">
                {item.nombre}
              </div>

              {item.comprado && (
                <div className="text-sm">
                  x{item.cantidad} - $
                  {item.precio}
                </div>
              )}
            </div>

            {!item.comprado && (
              <button
                onClick={() => marcarComprado(index)}
                className="bg-green-500 text-white px-3 py-1 rounded-lg"
              >
                ✔
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={reiniciarCompra}
        className="w-full mt-8 bg-red-500 text-white p-4 rounded-2xl text-xl"
      >
        Nueva compra
      </button>
    </div>
  );
}