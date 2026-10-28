# Ámbar

Trabajo Práctico de Desarrollo de Software — UTN Facultad Regional Rosario (Comisión 304).

## Integrantes

- 54161 - Saisi, Juana
- 55123 - Azurmendi, Felicitas

## Repositorios

- **Repositorio del proyecto:** [https://github.com/Juasaisi/Tp-dsoft-com04](https://github.com/Juasaisi/Tp-dsoft-com04)
- **Repositorio de la cátedra:** [https://github.com/utnfrrodsw/tp](https://github.com/utnfrrodsw/tp)

## ¿De qué trata el proyecto?

**ÁMBAR** es una aplicación web full stack diseñada para la gestión comercial y administrativa de un emprendimiento de accesorios artesanales.

El sistema busca reemplazar los registros informales y manuales, centralizando en una plataforma digital:
- El catálogo de **productos** y el control de su inventario.
- La administración y seguimiento de **clientes**.
- El registro de **ventas**, calculando subtotales, totales y controlando el stock disponible.
- La consulta histórica de ventas con el desglose detallado de sus ítems.

## Tecnologías utilizadas

El proyecto está desarrollado bajo una arquitectura desacoplada en dos partes comunicadas mediante una **API REST**:

- **Backend:** NestJS, TypeScript, TypeORM y base de datos relacional MySQL. Documentación interactiva con Swagger OpenAPI.
- **Frontend:** Angular (Standalone Components), TypeScript, HTML5, SCSS y Bootstrap (diseño responsive mobile-first).

## Cómo correrlo

Para ejecutar el proyecto en tu entorno local es necesario tener instalados **Node.js** (v18 o superior), **npm** y un servidor **MySQL** activo (mediante XAMPP, MySQL Workbench o servicio local).

### 1. Clonar el repositorio

```bash
git clone [https://github.com/Juasaisi/Tp-dsoft-com04.git](https://github.com/Juasaisi/Tp-dsoft-com04.git)
cd Tp-dsoft-com04
```

### 2. Configurar la base de datos

1. Iniciar el servicio de MySQL.
2. Crear una base de datos llamada `base` (o el nombre configurado en el archivo de conexión).
3. Verificar los datos de conexión en el backend:
   `backend/src/config/typeorm.config.ts`

### 3. Ejecutar el Backend (NestJS)

Abrir una terminal en la carpeta del backend:

```bash
cd backend
npm install
npm run start:dev
```

El backend se iniciará en `http://localhost:3000`.

* Documentación viva de Swagger: [http://localhost:3000/swagger](http://localhost:3000/swagger)
* Prefijo global de la API: `/api/v1`

### 4. Ejecutar el Frontend (Angular)

Abrir una segunda terminal en la carpeta del frontend:

```bash
cd frontend
npm install
npm start
```

Abrir la aplicación en el navegador web:
 [http://localhost:4200](http://localhost:4200)

> **Nota:** Para que la aplicación funcione de forma integral, deben estar ejecutándose en simultáneo MySQL, el backend (puerto 3000) y el frontend (puerto 4200).

## Alcance del Trabajo Práctico (Regularidad)

Para la instancia de regularidad (grupo de 2 integrantes), el sistema cubre los requisitos exigidos por la cátedra:

| Requisito | Detalle funcional | Implementación |
| :--- | :--- | :--- |
| **CRUD Simple 1** | Gestión de Clientes | Alta, baja, modificación, listado y panel de detalle de clientes. |
| **CRUD Simple 2** | Gestión de Productos | Alta, baja, modificación, listado y panel de detalle de productos. |
| **CRUD Dependiente** | Gestión de Ventas | Una venta depende de un cliente existente y se compone de múltiples ítems de detalle asociados a productos. |
| **Listados con filtro y detalle** | Búsqueda y desglose | • Listado de productos filtrable por nombre/descripción y alerta de stock bajo (≤ 5).<br>• Listado de ventas con filtro por fechas y modal de detalle completo con renglones y totales. |
| **CUU / Epic de Negocio** | Registrar una venta | Selección de cliente, carga dinámica de productos con cantidades, cálculo de subtotales y total en tiempo real, validación de stock y persistencia en MySQL. |
| **UX/UI & Mobile-First** | Frontend Angular | Navbar superior unificada, adaptabilidad en 3 breakpoints (SM, MD, LG) y manejo amigable de errores sin bloqueos de interfaz. |

## Propuesta original y documentación

- El detalle completo de la propuesta y los alcances futuros para aprobación directa se encuentran en [proposal.md](proposal.md).
- El modelo entidad-relación y diagramas pueden consultarse en [Diagrams.net](https://app.diagrams.net/#G1T11jYeY_qR7FxvZmBbJ7FdSLdI3C0bG_#%7B%22pageId%22%3A%22FupV3o8o4jS1qKbRf3Cx%22%7D)
