import { configureStore } from '@reduxjs/toolkit';
import empresasReducer from '../features/clientes/clientesSlice';
import inventarioReducer from '../features/inventario/inventarioSlice';
import operacionesReducer from '../features/operaciones/operacionesSlice';

export const store = configureStore({
  reducer: {
    empresas: empresasReducer,
    inventario: inventarioReducer,
    operaciones: operacionesReducer,
  },
});
