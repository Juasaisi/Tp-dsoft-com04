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
Req | Detalle
|:-|:-|
|CRUD simple | 1. CRUD Producto<br>2. CRUD Cliente|
CRUD dependiente | 1. CRUD Venta {depende de} CRUD Cliente y se compone de DetalleVenta asociados a Producto|
|Listado + detalle | 1. Listado de productos filtrado por nombre o stock → detalle completo del producto<br>2. Listado de ventas filtrado por rango de fechas → detalle completo de la venta, cliente, productos, cantidades, subtotales y total
CUU/Epic | 1. Registrar una venta con uno o más productos y cantidades, calculando subtotales y total|


Adicionales para Aprobación:

Req | Detalle
--- | ---
CRUD | 1. CRUD Producto
 | 2. CRUD Cliente
 | 3. CRUD Venta
 | 4. CRUD Usuario
CUU/Epic | 1. Registrar una venta: seleccionar cliente, agregar uno o más productos y cantidades, generar los detalles de venta y calcular el total
 | 2. Actualizar y controlar el stock de los productos a partir de las ventas registradas


### Alcance Adicional Voluntario

### Alcance Adicional Voluntario

Req | Detalle
--- | ---
Listados | 1. Listado de productos con filtro por bajo stock
 | 2. Listado de ventas con filtro por rango de fechas
 | 3. Listado de clientes con historial de ventas
CUU/Epic | 1. Consultar productos con bajo stock
 | 2. Consultar resumen de ventas e ingresos por período
Otros | 1. Mostrar alertas de stock bajo
