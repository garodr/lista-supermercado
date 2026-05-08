import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
const frecuentes = [
  "Leche",
  "Dulce de Leche",
  "Azúcar",
  "Arroz",
  "Fideos",
  "Cerveza",
  "Manteca",
  "Harina",
  "Mata Arañas",
];
const categorias = {
  "🥛 Lácteos": [
    "leche",
    "queso",
    "yogur",
    "manteca",
  ],

  "🥩 Carnicería": [
    "carne",
    "pollo",
    "milanesa",
    "hamburguesa",
  ],

  "🥤 Bebidas": [
    "coca",
    "agua",
    "jugo",
    "vino",
    "cerveza",
  ],

  "🧼 Limpieza": [
    "lavandina",
    "detergente",
    "jabón",
    "suavizante",
  ],

  "🍞 Panadería": [
    "pan",
    "factura",
    "galleta",
  ],

  "🍝 Almacén": [
    "arroz",
    "fideos",
    "yerba",
    "azúcar",
    "harina",
  ],
};

function detectarCategoria(nombre) {
  const texto = nombre.toLowerCase();

  for (const categoria in categorias) {
    if (
      categorias[categoria].some((palabra) =>
        texto.includes(palabra)
      )
    ) {
      return categoria;
    }
  }

  return "🛒 Otros";
}

export default function App() {
  const [producto, setProducto] = useState("");

  const [lista, setLista] = useState(() => {
    const guardado = localStorage.getItem("lista");
    return guardado ? JSON.parse(guardado) : [];
  });

  const [modalAbierto, setModalAbierto] = useState(false);

  const [productoSeleccionado, setProductoSeleccionado] =
    useState(null);

  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    localStorage.setItem("lista", JSON.stringify(lista));
  }, [lista]);

  const agregarProducto = () => {
    if (!producto.trim()) return;

    setLista([
      {
        nombre: producto,
        comprado: false,
        cantidad: 0,
        precio: 0,
        categoria: detectarCategoria(producto),
      },
      ...lista,
    ]);

    setProducto("");
  };
const agregarFrecuente = (nombre) => {

  setLista([
    {
      nombre,
      comprado: false,
      cantidad: 0,
      precio: 0,
      categoria: detectarCategoria(nombre),
    },
    ...lista,
  ]);

};
  const abrirModal = (index) => {
    setProductoSeleccionado(index);
    setCantidad("");
    setPrecio("");
    setModalAbierto(true);
  };

  const confirmarCompra = () => {
    if (!cantidad || !precio) return;

    const nuevaLista = [...lista];

    nuevaLista[productoSeleccionado] = {
      ...nuevaLista[productoSeleccionado],
      comprado: true,
      cantidad: Number(cantidad),
      precio: Number(precio),
    };

    const item = nuevaLista.splice(
      productoSeleccionado,
      1
    )[0];

    nuevaLista.push(item);

    setLista(nuevaLista);

    setModalAbierto(false);
  };
const eliminarProducto = (index) => {

  const nuevaLista = [...lista];

  nuevaLista.splice(index, 1);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">

      <div className="max-w-md mx-auto">

        <div className="backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-6 mb-6">

          <div className="text-sm text-gray-500 mb-1">
            TOTAL GASTADO
          </div>

          <div className="text-4xl font-black text-gray-800">
            $
            {total.toLocaleString("es-AR")}
          </div>

        </div>

        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-3xl p-3 mb-6 flex gap-2">

          <input
            type="text"
            value={producto}
            onChange={(e) =>
              setProducto(e.target.value)
            }
            placeholder="Agregar producto..."
            className="flex-1 bg-transparent outline-none text-lg px-2"
          />

          <button
            onClick={agregarProducto}
            className="w-12 h-12 rounded-2xl bg-black text-white text-2xl font-bold active:scale-95 transition"
          >
            +
          </button>

        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">

  {frecuentes.map((item) => (

    <button
      key={item}

      onClick={() => agregarFrecuente(item)}

      className="bg-white/70 backdrop-blur-xl border border-white/40 px-4 py-2 rounded-2xl shadow whitespace-nowrap active:scale-95 transition"
    >
      + {item}
    </button>

  ))}

</div>
        {Object.entries(

  lista.reduce((acc, item) => {

    if (!acc[item.categoria]) {
      acc[item.categoria] = [];
    }

    acc[item.categoria].push(item);

    return acc;

  }, {})

).map(([categoria, items]) => (

  <div key={categoria}>

    <div className="text-xl font-black text-gray-700 mt-6 mb-2 px-1">
      {categoria}
    </div>

    <AnimatePresence>

      <div className="space-y-3">

        {items.map((item, index) => (

          <motion.div
            key={item.nombre + index}
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}

            className={`rounded-3xl p-4 shadow-lg flex justify-between items-center ${
              item.comprado
                ? "bg-gray-200/80 text-gray-500"
                : "bg-white/80 backdrop-blur-xl"
            }`}
          >

            <div>

              <div className="text-lg font-semibold">
                {item.nombre}
              </div>

             <div className="flex items-center gap-6">

  <button
  onClick={() => eliminarProducto(index)}
  className="w-11 h-11 rounded-2xl bg-red-500 text-white text-xl shadow-lg active:scale-95 transition"
>
  🗑️
</button>

{!item.comprado && (

  <button
    onClick={() => abrirModal(index)}
    className="w-11 h-11 rounded-2xl bg-green-500 text-white text-xl shadow-lg active:scale-95 transition"
  >
    ✓
  </button>

)}

</div>

            </div>

          </motion.div>

        ))}

      </div>

    </AnimatePresence>

  </div>

))}        <button
          onClick={reiniciarCompra}
          className="w-full mt-8 bg-red-500 text-white p-4 rounded-3xl text-lg font-bold shadow-xl active:scale-95 transition"
        >
          Nueva compra
        </button>

      </div>

      {modalAbierto && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-[fadeIn_.2s_ease]">

            <h2 className="text-2xl font-black mb-5">
              Confirmar compra
            </h2>

            <input
              type="number"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) =>
                setCantidad(e.target.value)
              }
              className="w-full p-4 rounded-2xl bg-gray-100 outline-none mb-3 text-lg"
            />

            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) =>
                setPrecio(e.target.value)
              }
              className="w-full p-4 rounded-2xl bg-gray-100 outline-none mb-5 text-lg"
            />

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setModalAbierto(false)
                }
                className="flex-1 p-4 rounded-2xl bg-gray-200 font-semibold"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarCompra}
                className="flex-1 p-4 rounded-2xl bg-green-500 text-white font-bold shadow-lg"
              >
                OK
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}