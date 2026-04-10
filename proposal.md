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

*Sistema de gestión para un emprendimiento de accesorios artesanales. Permite administrar el stock de productos y materiales, registrar ventas y encargues, y llevar un control de clientes. Automatiza tareas que actualmente se realizan de forma manual, centralizando la información del negocio en un solo lugar.*

### Modelo
![imagen del modelo]()

*Nota*: incluir un link con la imagen de un modelo, puede ser modelo de dominio, diagrama de clases, DER. Si lo prefieren pueden utilizar diagramas con [Mermaid](https://mermaid.js.org) en lugar de imágenes.

## Alcance Funcional 

### Alcance Mínimo

*Nota*: el siguiente es un ejemplo para un grupo de 3 integrantes para un sistema de hotel. El 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Producto (nombre, descripción, precio, stock) <br>2.  CRUD Cliente (nombre, contacto)
|CRUD dependiente|1. 1. CRUD Venta (depende de Producto y Cliente)
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

