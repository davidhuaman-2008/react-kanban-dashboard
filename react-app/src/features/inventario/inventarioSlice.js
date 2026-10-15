import { createSlice } from '@reduxjs/toolkit';
import { data } from '../../data';

const inventarioSlice = createSlice({
  name: 'inventario',
  initialState: {
    productos: data.productosB,
    carrito: [],
    filtro: 'todos',
  },
  reducers: {
    agregarAlCarrito: (s, a) => {
      const existe = s.carrito.find(p => p.id === a.payload.id);
      if (existe) existe.cantidad += 1;
      else s.carrito.push({ ...a.payload, cantidad: 1 });
    },
    quitarDelCarrito: (s, a) => {
      s.carrito = s.carrito.filter(p => p.id !== a.payload);
    },
    cambiarCantidad: (s, a) => {
      const item = s.carrito.find(p => p.id === a.payload.id);
      if (item) item.cantidad = Math.max(1, item.cantidad + a.payload.delta);
    },
    vaciarCarrito: (s) => { s.carrito = []; },
    setFiltro: (s, a) => { s.filtro = a.payload; },
  },
});

export const { agregarAlCarrito, quitarDelCarrito, cambiarCantidad, vaciarCarrito, setFiltro } = inventarioSlice.actions;
export default inventarioSlice.reducer;
