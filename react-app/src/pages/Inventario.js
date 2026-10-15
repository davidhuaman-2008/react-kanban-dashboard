import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, X, Search } from 'lucide-react';
import { agregarAlCarrito, quitarDelCarrito, cambiarCantidad, vaciarCarrito } from '../features/inventario/inventarioSlice';
import { registrarOperacion } from '../features/operaciones/operacionesSlice';

export default function Inventario() {
  const dispatch = useDispatch();
  const { productos, carrito } = useSelector(s => s.inventario);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const add = (p) => {
    dispatch(agregarAlCarrito(p));
    dispatch(registrarOperacion({ tipo: 'inventario', descripcion: `Agregó al carrito: ${p.nombre}` }));
  };

  const remove = (id) => {
    dispatch(quitarDelCarrito(id));
    dispatch(registrarOperacion({ tipo: 'inventario', descripcion: 'Quitó producto del carrito' }));
  };

  const changeQty = (id, delta) => dispatch(cambiarCantidad({ id, delta }));

  const total = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  const confirmarCompra = () => {
    if (carrito.length === 0) return;
    dispatch(registrarOperacion({ tipo: 'inventario', descripcion: `Confirmó compra por S/ ${total.toFixed(2)}` }));
    dispatch(vaciarCarrito());
    setOpen(false);
  };

  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="text-slate-500 mt-1">{productos.length} productos · {carrito.length} en carrito</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10 w-full sm:w-60" />
          </div>
          <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2 relative">
            <ShoppingCart size={18} /> Carrito
            {carrito.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">{carrito.length}</span>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtrados.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }} className="card card-hover overflow-hidden">
            <div className="aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{p.nombre}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.descripcion}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-indigo-500">S/ {p.precio.toFixed(2)}</span>
                <button onClick={() => add(p)} className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-slate-800 z-50 shadow-2xl flex flex-col">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-bold">Carrito de Compra</h2>
                <button onClick={() => setOpen(false)}><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {carrito.length === 0 && <p className="text-center text-slate-400 py-10">Carrito vacío</p>}
                {carrito.map((i) => (
                  <div key={i.id} className="card p-3 flex items-center gap-3">
                    <img src={i.imagen} alt={i.nombre} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{i.nombre}</h4>
                      <p className="text-xs text-slate-500">S/ {i.precio.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => changeQty(i.id, -1)} className="p-1 rounded hover:bg-slate-100"><Minus size={14} /></button>
                      <span className="w-6 text-center text-sm font-medium">{i.cantidad}</span>
                      <button onClick={() => changeQty(i.id, 1)} className="p-1 rounded hover:bg-slate-100"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => remove(i.id)} className="p-1 text-red-500"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between mb-4">
                  <span className="text-slate-500">Total</span>
                  <span className="text-2xl font-bold">S/ {total.toFixed(2)}</span>
                </div>
                <button disabled={carrito.length === 0} onClick={confirmarCompra} className="btn-primary w-full disabled:opacity-50">
                  Confirmar compra
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
