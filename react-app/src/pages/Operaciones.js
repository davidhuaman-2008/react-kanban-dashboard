import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Plus, Minus, RotateCcw, Zap, Clock, TrendingUp, Building2, ShoppingCart, UtensilsCrossed, KanbanSquare } from 'lucide-react';
import { incrementarAuto, resetear, toggleAuto } from '../features/operaciones/operacionesSlice';

const TIPO_ICONS = {
  auto: Zap,
  empresa: Building2,
  inventario: ShoppingCart,
  menu: UtensilsCrossed,
  proyecto: KanbanSquare,
};

const TIPO_COLORS = {
  auto: 'text-green-500 bg-green-500/10',
  empresa: 'text-indigo-500 bg-indigo-500/10',
  inventario: 'text-purple-500 bg-purple-500/10',
  menu: 'text-orange-500 bg-orange-500/10',
  proyecto: 'text-pink-500 bg-pink-500/10',
};

export default function Operaciones() {
  const dispatch = useDispatch();
  const { totalOperaciones, historial, auto } = useSelector(s => s.operaciones);
  const [filtro, setFiltro] = useState('todos');

  const tipos = ['todos', 'auto', 'empresa', 'inventario', 'menu', 'proyecto'];
  const historialFiltrado = filtro === 'todos' ? historial : historial.filter(h => h.tipo === filtro);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Registro de Operaciones</h1>
        <p className="text-slate-500 mt-1">Historial completo de actividad del sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div whileHover={{ y: -4 }} className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              <Activity size={20} className="text-white" />
            </div>
            <span className="text-sm text-slate-500">Total operaciones</span>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            {totalOperaciones}
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${auto ? 'bg-green-500' : 'bg-slate-400'}`}>
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-sm text-slate-500">Modo auto</span>
          </div>
          <p className="text-lg font-bold">{auto ? 'Activado' : 'Desactivado'}</p>
          <button onClick={() => dispatch(toggleAuto())} className={`mt-3 w-full py-2 rounded-lg font-medium transition ${auto ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {auto ? 'Detener' : 'Activar'}
          </button>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-sm text-slate-500">Acciones manuales</span>
          </div>
          <p className="text-lg font-bold">{historial.filter(h => h.tipo !== 'auto').length}</p>
          <button onClick={() => dispatch(incrementarAuto())} className="mt-3 w-full py-2 rounded-lg font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition">
            Registrar manual
          </button>
        </motion.div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Clock size={18} className="text-indigo-500" />
            Historial detallado
          </h3>
          <button onClick={() => dispatch(resetear())} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600">
            <RotateCcw size={14} /> Limpiar historial
          </button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {tipos.map(t => (
            <button key={t} onClick={() => setFiltro(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${filtro === t ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          <AnimatePresence>
            {historialFiltrado.length === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-slate-400">
                Sin operaciones registradas
              </motion.p>
            )}
            {historialFiltrado.map((h) => {
              const Icon = TIPO_ICONS[h.tipo] || Activity;
              const color = TIPO_COLORS[h.tipo] || 'text-slate-500 bg-slate-500/10';
              return (
                <motion.div key={h.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <div className={`p-2 rounded-lg ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{h.descripcion}</p>
                    <p className="text-xs text-slate-500">{new Date(h.fecha).toLocaleString()}</p>
                  </div>
                  <span className={`badge text-xs ${color}`}>{h.tipo}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
