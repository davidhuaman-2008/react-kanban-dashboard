import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, CheckCircle2, Search } from 'lucide-react';
import { data } from '../data';
import { registrarOperacion } from '../features/operaciones/operacionesSlice';

const COLUMNS = [
  { id: 'todo', title: 'Por Hacer', Icon: Clock, color: 'from-slate-500 to-slate-700', filter: a => a.avance === 0 },
  { id: 'doing', title: 'En Ejecución', Icon: Play, color: 'from-orange-500 to-orange-700', filter: a => a.avance > 0 && a.avance < 100 },
  { id: 'done', title: 'Culminadas', Icon: CheckCircle2, color: 'from-green-500 to-green-700', filter: a => a.avance === 100 },
];

function TaskCard({ task }) {
  const dispatch = useDispatch();
  const progressColor = task.avance === 0 ? 'bg-slate-400' : task.avance < 50 ? 'bg-orange-500' : task.avance < 100 ? 'bg-yellow-500' : 'bg-green-500';

  const handleClick = () => {
    dispatch(registrarOperacion({ tipo: 'proyecto', descripcion: `Revisó: ${task.actividad.substring(0, 40)}...` }));
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={handleClick}
      className="card p-4 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-sm leading-snug">{task.actividad}</h4>
        <span className="text-xs font-bold text-indigo-500 whitespace-nowrap">{task.avance}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
        <motion.div initial={{ width: 0 }} animate={{ width: `${task.avance}%` }} transition={{ duration: 0.8 }} className={`h-full ${progressColor} rounded-full`} />
      </div>
      <span className="badge bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">{task.responsable}</span>
    </motion.div>
  );
}

export default function Proyectos() {
  const [search, setSearch] = useState('');
  const filtered = data.actividades.filter(a => a.actividad.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Proyectos Activos</h1>
          <p className="text-slate-500 mt-1">Gestión Kanban de {data.actividades.length} tareas del equipo</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Buscar tarea..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10 w-full sm:w-72" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const Icon = col.Icon;
          const tasks = filtered.filter(col.filter);
          return (
            <motion.div key={col.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-4 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${col.color} shadow`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <h3 className="font-semibold">{col.title}</h3>
                </div>
                <span className="badge bg-slate-200 dark:bg-slate-700">{tasks.length}</span>
              </div>
              <div className="space-y-3 min-h-[300px]">
                <AnimatePresence>
                  {tasks.map(t => <TaskCard key={t.id} task={t} />)}
                </AnimatePresence>
                {tasks.length === 0 && <div className="text-center py-8 text-slate-400 text-sm">Sin tareas</div>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
