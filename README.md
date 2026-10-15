cat > README.md << 'EOF'

# ⚛️ React Lab · Sistema de Gestión Empresarial

Sistema web moderno construido con **React 18**, **Redux Toolkit**, **TailwindCSS** y **Framer Motion**. Simula un sistema empresarial completo con módulos de proyectos, empresas, inventario, menú y registro de operaciones en tiempo real.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-1.9-764ABC?logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=react-router&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 ¿Qué es este proyecto?

Sistema de gestión empresarial que demuestra dominio de React moderno:

- ⚡ Arquitectura con hooks y Redux Toolkit
- 🎨 UI premium con TailwindCSS y modo oscuro
- 🎬 Animaciones fluidas con Framer Motion
- 📊 Gráficos interactivos con Recharts
- 🌐 Consumo de API REST con Axios
- 🔄 Estado global con Redux Toolkit
- 📱 Diseño 100% responsive

---

## 📸 Capturas

### 🌙 Dashboard (Modo Oscuro)

![1792079178926](image/README/1792079178926.png)

### ☀️ Dashboard (Modo Claro)

![1792079191011](image/README/1792079191011.png)

### 📋 Proyectos (Kanban)

![1792079206763](image/README/1792079206763.png)

🏢 Directorio de Empresas

![1792079227350](image/README/1792079227350.png)


### 🛒 Inventario

![1792079255720](image/README/1792079255720.png)

---

## 🚀 Módulos

| Módulo                       | Descripción                                 |
| ----------------------------- | -------------------------------------------- |
| 📊 **Dashboard**        | KPIs en vivo, gráficos y actividad reciente |
| 📋 **Proyectos**        | Tablero Kanban con búsqueda                 |
| 🏢 **Empresas**         | CRUD con API REST (json-server)              |
| 🛒 **Inventario**       | Catálogo con carrito de compras             |
| 🍽️ **Menú del Día** | Carta con vista cards/tabla                  |
| ⚡ **Operaciones**      | Historial de acciones del sistema            |

---

## ✨ Características

### 🎨 Interfaz

- Modo claro/oscuro con persistencia
- Sidebar responsive
- Reloj en vivo en el header
- Animaciones fluidas en cada transición

### 🧠 Arquitectura

- Redux Toolkit con slices: `empresas`, `inventario`, `operaciones`
- React Router 6
- Componentes reutilizables

### 🔄 Reactividad

- Cada acción registra una operación
- Carrito global visible desde múltiples módulos
- Dashboard actualizado en tiempo real

---

## 🛠️ Stack

| Categoría  | Tecnología       |
| ----------- | ----------------- |
| Framework   | React 18          |
| Routing     | React Router 6    |
| Estado      | Redux Toolkit 1.9 |
| Estilos     | TailwindCSS 3     |
| Animaciones | Framer Motion 11  |
| Gráficos   | Recharts 2        |
| Iconos      | Lucide React      |
| HTTP        | Axios             |
| Mock API    | json-server       |

---

## 📦 Instalación

Requiere **Node.js 18+** y **npm 9+**.

```bash
git clone https://github.com/davidhuaman-2008/react-kanban-dashboard.git
cd react-kanban-dashboard

# Frontend
cd react-app
npm install

# Mock API (en otra terminal)
cd ../api-server
npm install
```
