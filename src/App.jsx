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
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(() => {
  return localStorage.getItem("modoOscuro") === "true";
});

  useEffect(() => {
    localStorage.setItem("lista", JSON.stringify(lista));
  }, [lista]);
  useEffect(() => {
  localStorage.setItem("modoOscuro", modoOscuro);
}, [modoOscuro]);

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
    <div
  className={`min-h-screen p-4 transition-colors duration-500 ${
    modoOscuro
      ? "bg-gradient-to-br from-gray-900 to-black"
      : "bg-gradient-to-br from-gray-100 to-gray-300"
  }`}
>

      <div className="max-w-md mx-auto relative">
          {menuAbierto && (
             <div
              onClick={() => setMenuAbierto(false)}
              className="fixed inset-0 z-40"
             />
          )}
      <div className={`backdrop-blur-xl shadow-2xl rounded-3xl p-6 mb-6 relative z-50 border transition-colors duration-500 ${
  modoOscuro
    ? "bg-white/10 border-white/10"
    : "bg-white/60 border-white/40"
}`}>
 <button
  onClick={() => setMenuAbierto(!menuAbierto)}
  className="absolute top-4 right-4 z-50 w-12 h-12 rounded-2xl bg-black text-white text-2xl flex items-center justify-center shadow-xl active:scale-95 transition"
>
  ☰
</button>

  <div className={`text-sm mb-1 ${
  modoOscuro ? "text-gray-400" : "text-gray-500"
}`}>
    TOTAL GASTADO
  </div>

  <div className={`text-4xl font-black ${
  modoOscuro ? "text-white" : "text-gray-800"
}`}>
    
    {total.toLocaleString("es-AR")}
  </div>
  
  
  <AnimatePresence>

    {menuAbierto && (

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}

        className="absolute top-16 right-5 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden z-[60] w-56"
      >

        <button 
        onClick={() => setMenuAbierto(false)}
        className="w-full text-left px-5 py-4 hover:bg-gray-100 transition">
          📤 Exportar compra
        </button>

        <button 
        onClick={() => setMenuAbierto(false)}
        className="w-full text-left px-5 py-4 hover:bg-gray-100 transition">
          ℹ️ Acerca de
        </button>

        <button 
        onClick={() => setMenuAbierto(false)}
        className="w-full text-left px-5 py-4 hover:bg-gray-100 transition">
          💬 Consultas
        </button>
        <button
           onClick={() => {
            setModoOscuro(!modoOscuro);
            setMenuAbierto(false);
          }}
           className="w-full text-left px-5 py-4 hover:bg-gray-100 transition"
>
  {modoOscuro ? "☀️ Modo claro" : "🌙 Modo oscuro"}
</button>

      </motion.div>

    )}

  </AnimatePresence>

</div>

        <div className={`backdrop-blur-xl shadow-xl rounded-3xl p-3 mb-6 flex gap-2 relative z-10 border transition-colors duration-500 ${
  modoOscuro
    ? "bg-white/10 border-white/10"
    : "bg-white/70 border-white/40"
}`}>
          <input
            type="text"
            value={producto}
            onChange={(e) =>
              setProducto(e.target.value)
            }
            placeholder="Agregar producto..."
            className={`flex-1 bg-transparent outline-none text-lg px-2 ${
            modoOscuro ? "text-white placeholder:text-gray-400" : "text-black"
            }`}
            onKeyDown={(e) => {
           if (e.key === "Enter") {
           agregarProducto();
            }
          }}
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

      className={`backdrop-blur-xl border px-4 py-2 rounded-2xl shadow whitespace-nowrap active:scale-95 transition ${
  modoOscuro
    ? "bg-white/10 border-white/10 text-white"
    : "bg-white/70 border-white/40 text-black"
}`}
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

    <div className={`text-xl font-black mt-6 mb-2 px-1 ${
  modoOscuro ? "text-gray-200" : "text-gray-700"
}`}>
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

            className={`rounded-3xl p-4 shadow-lg flex justify-between items-center transition-colors duration-500 ${
  item.comprado
    ? modoOscuro
      ? "bg-white/5 text-gray-500"
      : "bg-gray-200/80 text-gray-500"
    : modoOscuro
      ? "bg-white/10 text-white backdrop-blur-xl"
      : "bg-white/80 backdrop-blur-xl"
}`}
          >

            <div>

              <div className="text-lg font-semibold">
                {item.nombre}
              </div>

             <div className="flex items-center gap-42">

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

          <div
  className={`rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-[fadeIn_.2s_ease] transition-colors duration-500 ${
    modoOscuro
      ? "bg-gray-900 text-white"
      : "bg-white text-black"
  }`}
>

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
              className={`w-full p-4 rounded-2xl outline-none text-lg ${
  modoOscuro
    ? "bg-white/10 text-white placeholder:text-gray-400"
    : "bg-gray-100 text-black"
}`}
            />

            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) =>
                setPrecio(e.target.value)
              }
              className={`w-full p-4 rounded-2xl outline-none text-lg ${
  modoOscuro
    ? "bg-white/10 text-white placeholder:text-gray-400"
    : "bg-gray-100 text-black"
}`}
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