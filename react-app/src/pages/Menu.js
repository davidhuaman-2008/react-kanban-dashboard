import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, UtensilsCrossed, ShoppingCart } from 'lucide-react';
import { data } from '../data';
import { agregarAlCarrito } from '../features/inventario/inventarioSlice';
import { registrarOperacion } from '../features/operaciones/operacionesSlice';

export default function Menu() {
  const dispatch = useDispatch();
  const [vista, setVista] = useState('cards');

  const agregar = (plato) => {
    dispatch(agregarAlCarrito({ id: `plato-${plato.id}`, nombre: plato.nombre, precio: plato.precio, imagen: plato.imagen }));
    dispatch(registrarOperacion({ tipo: 'menu', descripcion: `Agregó al pedido: ${plato.nombre}` }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Menú del Día</h1>
          <p className="text-slate-500 mt-1">Carta del restaurante · {data.platos.length} platos disponibles</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button onClick={() => setVista('cards')} className={`p-2 rounded-lg transition-all ${vista === 'cards' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>
            <LayoutGrid size={18} />
          </button>
          <button onClick={() => setVista('tabla')} className={`p-2 rounded-lg transition-all ${vista === 'tabla' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>
            <List size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {vista === 'cards' ? (
          <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.platos.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }} className="card card-hover overflow-hidden">
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
                  <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur">
                    <UtensilsCrossed size={16} className="text-indigo-500" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg capitalize">{p.nombre}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-indigo-500 font-bold text-xl">S/ {p.precio.toFixed(2)}</p>
                    <button onClick={() => agregar(p)} className="p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition flex items-center gap-1">
                      <ShoppingCart size={14} /> <span className="text-xs">Pedir</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="tabla" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-500">#</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-slate-500">Plato</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-slate-500">Precio</th>
                  <th className="text-center px-6 py-3 text-sm font-semibold text-slate-500">Acción</th>
                </tr>
              </thead>
              <tbody>
                {data.platos.map((p) => (
                  <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                    <td className="px-6 py-3">{p.id}</td>
                    <td className="px-6 py-3 capitalize font-medium">{p.nombre}</td>
                    <td className="px-6 py-3 text-right font-bold text-indigo-500">S/ {p.precio.toFixed(2)}</td>
                    <td className="px-6 py-3 text-center">
                      <button onClick={() => agregar(p)} className="btn-primary text-sm py-1.5 px-3">
                        Pedir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
