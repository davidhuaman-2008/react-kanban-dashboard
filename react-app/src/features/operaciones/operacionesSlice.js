import { createSlice } from '@reduxjs/toolkit';

const operacionesSlice = createSlice({
  name: 'operaciones',
  initialState: {
    totalOperaciones: 0,
    historial: [],
    auto: false,
  },
  reducers: {
    registrarOperacion: (s, a) => {
      s.totalOperaciones += 1;
      s.historial.unshift({
        id: Date.now(),
        tipo: a.payload.tipo,
        descripcion: a.payload.descripcion,
        fecha: new Date().toISOString(),
      });
      if (s.historial.length > 20) s.historial.pop();
    },
    incrementarAuto: (s) => {
      s.totalOperaciones += 1;
      s.historial.unshift({
        id: Date.now(),
        tipo: 'auto',
        descripcion: 'Operación automática del sistema',
        fecha: new Date().toISOString(),
      });
      if (s.historial.length > 20) s.historial.pop();
    },
    toggleAuto: (s) => { s.auto = !s.auto; },
    resetear: (s) => { s.totalOperaciones = 0; s.historial = []; },
  },
});

export const { registrarOperacion, incrementarAuto, toggleAuto, resetear } = operacionesSlice.actions;
export default operacionesSlice.reducer;
