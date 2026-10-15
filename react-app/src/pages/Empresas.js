import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pencil, X, Building2, Star } from 'lucide-react';
import { fetchEmpresas, addEmpresa, updateEmpresa, deleteEmpresa } from '../features/clientes/clientesSlice';
import { registrarOperacion } from '../features/operaciones/operacionesSlice';

function Modal({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Empresas() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.empresas);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', calificacion: 0 });

  useEffect(() => { dispatch(fetchEmpresas()); }, [dispatch]);

  const openNew = () => { setEditing(null); setForm({ nombre: '', descripcion: '', calificacion: 0 }); setModalOpen(true); };
  const openEdit = (item) => { setEditing(item); setForm(item); setModalOpen(true); };

  const submit = (e) => {
    e.preventDefault();
    if (editing) {
      dispatch(updateEmpresa({ ...form, id: editing.id }));
      dispatch(registrarOperacion({ tipo: 'empresa', descripcion: `Actualizó empresa: ${form.nombre}` }));
    } else {
      dispatch(addEmpresa(form));
      dispatch(registrarOperacion({ tipo: 'empresa', descripcion: `Registró nueva empresa: ${form.nombre}` }));
    }
    setModalOpen(false);
  };

  const remove = (item) => {
    if (window.confirm(`¿Eliminar ${item.nombre}?`)) {
      dispatch(deleteEmpresa(item.id));
      dispatch(registrarOperacion({ tipo: 'empresa', descripcion: `Eliminó empresa: ${item.nombre}` }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Directorio de Empresas</h1>
          <p className="text-slate-500 mt-1">{list.length} empresas registradas en el sistema</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2"><Plus size={18} /> Nueva</button>
      </div>

      {loading && <p className="text-slate-500">Cargando...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {list.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }} className="card card-hover p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                  <Building2 size={20} className="text-white" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><Pencil size={16} /></button>
                  <button onClick={() => remove(item)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
              <h3 className="font-bold text-lg">{item.nombre}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.descripcion}</p>
              <div className="flex items-center gap-1 mt-3">
                {[...Array(10)].map((_, i) => (
                  <Star key={i} size={12} className={i < item.calificacion ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'} />
                ))}
                <span className="ml-2 text-xs text-slate-500">{item.calificacion}/10</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{editing ? 'Editar' : 'Nueva'} Empresa</h2>
          <button onClick={() => setModalOpen(false)}><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm text-slate-500">Nombre</label>
            <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="input" />
          </div>
          <div>
            <label className="text-sm text-slate-500">Descripción</label>
            <input required value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="input" />
          </div>
          <div>
            <label className="text-sm text-slate-500">Calificación (0-10)</label>
            <input type="number" min="0" max="10" required value={form.calificacion} onChange={(e) => setForm({ ...form, calificacion: Number(e.target.value) })} className="input" />
          </div>
          <button type="submit" className="btn-primary w-full">{editing ? 'Actualizar' : 'Guardar'}</button>
        </form>
      </Modal>
    </div>
  );
}
