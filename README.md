# Propuesta TP DSW

## Grupo
### Integrantes
* 54161- Saisi, Juana
* 55123 - Azurmendi, Felicitas

### Repositorios
* [frontend app](http://hyperlinkToGihubOrGitlab)
* [backend app](http://hyperlinkToGihubOrGitlab)
*Nota*: si utiliza un monorepo indicar un solo link con fullstack app.

## Tema
### Descripción

*Sistema de gestión de ventas para un emprendimiento de accesorios artesanales. Permite administrar productos y su stock, registrar ventas y llevar un control de clientes. Además, permite gestionar los usuarios que acceden al sistema según su rol. El sistema busca automatizar tareas que actualmente se realizan de forma manual, centralizando la información de ventas, productos, stock y clientes en un solo lugar.*

### Tecnologías utilizadas

- Backend: Node.js con TypeScript
- Frontend: a definir
- Base de datos: a definir
- Control de versiones: Git y GitHub
  
### Modelo
https://app.diagrams.net/#G1T11jYeY_qR7FxvZmBbJ7FdSLdI3C0bG_#%7B%22pageId%22%3A%22FupV3o8o4jS1qKbRf3Cx%22%7D

## Alcance Funcional 

### Alcance Mínimo


Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Producto (nombre, descripción, precio, stock) <br>2.  CRUD Cliente (nombre, apellido, telefono, email)
|CRUD dependiente|1. 1. CRUD Venta {depende de} Producto y Cliente)
|Listado<br>+<br>detalle| 1. Listado de productos → detalle completo  <br>2. Listado de ventas → detalle con productos y total


Adicionales para Aprobación
|Req|Detalle|
|:-|:-|
|CRUD |1. CRUD Producdto<br>2. CRUD Cliente<br>3. CRUD Material<br>4. CRUD Venta<br>5. CRUD Categoria<br>|
|CUU/Epic| 1. Registrar una venta → descuenta stock automáticamente. <br>2. Consultar stock disponible → muestra productos y materiales por agotarse



### Alcance Adicional Voluntario


|Req|Detalle|
|:-|:-|
|Listados |1. Listado de productos con filtro por bajo stock (productos por agotarse).<br>2. Listado de ventas con filtro por rango de fechas.<br>3. Listado de materiales ordenado por cantidad disponible 
|CUU/Epic|1. 1. Registrar una venta → descuenta stock automáticamente. <br>2. Registrar compra de materiales → actualiza stock. <br>3. Ver resumen de ingresos por período
