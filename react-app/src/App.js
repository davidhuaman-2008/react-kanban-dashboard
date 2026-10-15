import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { store } from './app/store';
import { toggleAuto, incrementarAuto } from './features/operaciones/operacionesSlice';
import {
  LayoutDashboard, KanbanSquare, Building2, ShoppingBag, UtensilsCrossed,
  Sun, Moon, Menu as MenuIcon, X, Code2, Clock, Activity, Circle
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Proyectos from './pages/Proyectos';
import Empresas from './pages/Empresas';
import Inventario from './pages/Inventario';
import Menu from './pages/Menu';
import Operaciones from './pages/Operaciones';

const NAV = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/proyectos', label: 'Proyectos', icon: KanbanSquare },
  { path: '/empresas', label: 'Empresas', icon: Building2 },
  { path: '/inventario', label: 'Inventario', icon: ShoppingBag },
  { path: '/menu', label: 'Menú del Día', icon: UtensilsCrossed },
  { path: '/operaciones', label: 'Operaciones', icon: Activity },
];

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800">
      <Clock size={16} className="text-indigo-500" />
      <span className="text-sm font-mono font-medium">{time.toLocaleTimeString()}</span>
    </div>
  );
}

function Sidebar({ open, onClose }) {
  const location = useLocation();
  const carrito = useSelector(s => s.inventario.carrito);
  const totalOps = useSelector(s => s.operaciones.totalOperaciones);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden" />
        )}
      </AnimatePresence>
     <motion.aside
  initial={false}
  animate={{ x: open ? 0 : 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  className="fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40 flex flex-col"
  style={{ transform: open || window.innerWidth >= 1024 ? 'translateX(0)' : 'translateX(-100%)' }}
>
        <div className="p-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">React Lab</h1>
              <p className="text-xs text-slate-500">Gestión Empresarial</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const badge = item.path === '/inventario' && carrito.length > 0 ? carrito.length : null;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm flex-1">{item.label}</span>
                {badge && <span className="badge bg-red-500 text-white">{badge}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Operaciones</span>
            <span className="font-bold text-indigo-500">{totalOps}</span>
          </div>
          <a href="https://github.com/davidhuaman-2008" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-500 transition-colors">
            <Code2 size={16} /> <span>davidhuaman-2008</span>
          </a>
        </div>
      </motion.aside>
    </>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const s = localStorage.getItem('theme');
    return s === 'dark' || (!s && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);
  return (
    <motion.button whileHover={{ scale: 1.05, rotate: 15 }} whileTap={{ scale: 0.95 }} onClick={() => setDark(!dark)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all">
      {dark ? <Moon size={20} /> : <Sun size={20} />}
    </motion.button>
  );
}

function GlobalAuto() {
  const dispatch = useDispatch();
  const auto = useSelector(s => s.operaciones.auto);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => dispatch(incrementarAuto()), 3000);
    return () => clearInterval(id);
  }, [auto, dispatch]);

  return (
    <button
      onClick={() => dispatch(toggleAuto())}
      className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
        auto ? 'bg-green-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
      }`}
    >
      <Circle size={10} className={auto ? 'fill-white animate-pulse' : ''} />
      {auto ? 'Sistema activo' : 'Sistema en pausa'}
    </button>
  );
}

function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between p-4 gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100">
              <MenuIcon size={20} />
            </button>
            <div className="flex-1" />
            <GlobalAuto />
            <LiveClock />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/operaciones" element={<Operaciones />} />
          </Routes>
        </main>

        <footer className="p-6 text-center text-sm text-slate-500 border-t border-slate-200 dark:border-slate-700">
          React Lab · Sistema de Gestión · Hecho por David Huaman
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </Provider>
  );
}
