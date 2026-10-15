import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:3001/empresas';

export const fetchEmpresas = createAsyncThunk('empresas/fetch', async () => {
  const { data } = await axios.get(API);
  return data;
});

export const addEmpresa = createAsyncThunk('empresas/add', async (empresa) => {
  const { data } = await axios.post(API, empresa);
  return data;
});

export const updateEmpresa = createAsyncThunk('empresas/update', async ({ id, ...rest }) => {
  const { data } = await axios.put(`${API}/${id}`, rest);
  return data;
});

export const deleteEmpresa = createAsyncThunk('empresas/delete', async (id) => {
  await axios.delete(`${API}/${id}`);
  return id;
});

const empresasSlice = createSlice({
  name: 'empresas',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmpresas.pending, (s) => { s.loading = true; })
      .addCase(fetchEmpresas.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchEmpresas.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(addEmpresa.fulfilled, (s, a) => { s.list.push(a.payload); })
      .addCase(updateEmpresa.fulfilled, (s, a) => {
        const i = s.list.findIndex(e => e.id === a.payload.id);
        if (i !== -1) s.list[i] = a.payload;
      })
      .addCase(deleteEmpresa.fulfilled, (s, a) => { s.list = s.list.filter(e => e.id !== a.payload); });
  },
});

export default empresasSlice.reducer;
