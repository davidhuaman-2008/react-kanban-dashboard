import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Building2, ShoppingBag, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Clock, Package } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { data } from '../data';
import { fetchEmpresas } from '../features/clientes/clientesSlice';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

function StatCard({ title, value, Icon, trend, color }) {
  return (
    <motion.div variants={item} whileHover={{ y: -4, scale: 1.02 }} className="card card-hover p-6">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const empresas = useSelector(s => s.empresas.list);
  const { carrito, productos } = useSelector(s => s.inventario);
  const { totalOperaciones, historial } = useSelector(s => s.operaciones);

  useEffect(() => {
    if (empresas.length === 0) dispatch(fetchEmpresas());
  }, [dispatch, empresas.length]);

  const chartData = data.actividades.map(a => ({ name: a.actividad.split(' ').slice(0, 2).join(' '), avance: a.avance }));
  const pieData = [
    { name: 'Por hacer', value: data.actividades.filter(a => a.avance === 0).length },
    { name: 'En progreso', value: data.actividades.filter(a => a.avance > 0 && a.avance < 100).length },
    { name: 'Culminadas', value: data.actividades.filter(a => a.avance === 100).length },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        <p className="text-slate-500 mt-1">Resumen operativo del sistema en tiempo real</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Empresas registradas" value={empresas.length || 7} Icon={Building2} trend={12} color="from-indigo-500 to-indigo-700" />
        <StatCard title="Productos en inventario" value={productos.length} Icon={ShoppingBag} trend={8} color="from-purple-500 to-purple-700" />
        <StatCard title="Operaciones totales" value={totalOperaciones} Icon={Activity} trend={25} color="from-pink-500 to-pink-700" />
        <StatCard title="Items en carrito" value={carrito.length} Icon={Package} trend={carrito.length > 0 ? 15 : 0} color="from-orange-500 to-orange-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2 card p-6">
          <h3 className="font-semibold text-lg mb-4">Avance de Proyectos</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.2)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-20} textAnchor="end" height={80} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,.95)', border: '1px solid #6366f1', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="avance" fill="url(#grad1)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="card p-6">
          <h3 className="font-semibold text-lg mb-4">Estado Operativo</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={5} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,.95)', border: '1px solid #6366f1', borderRadius: 8, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {pieData.map((it, i) => (
              <div key={it.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span>{it.name}</span>
                </div>
                <span className="font-medium">{it.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="card p-6">
          <h3 className="font-semibold text-lg mb-4">Tendencia de Operaciones</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.2)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: 'rgba(15,23,42,.95)', border: '1px solid #6366f1', borderRadius: 8, color: '#fff' }} />
              <Area type="monotone" dataKey="avance" stroke="#6366f1" strokeWidth={2} fill="url(#grad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={item} className="card p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock size={18} className="text-indigo-500" />
            Actividad Reciente
          </h3>
          <div className="space-y-3 max-h-[220px] overflow-y-auto">
            {historial.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">Sin actividad reciente</p>
            )}
            {historial.slice(0, 8).map((h) => (
              <motion.div key={h.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <div className={`w-2 h-2 rounded-full mt-2 ${h.tipo === 'auto' ? 'bg-green-500' : 'bg-indigo-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{h.descripcion}</p>
                  <p className="text-xs text-slate-500">{new Date(h.fecha).toLocaleTimeString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
