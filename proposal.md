# Propuesta TP DSW - Ámbar
 
## Grupo
### Integrantes
* 54161 - Saisi, Juana
* 55123 - Azurmendi, Felicitas
### Repositorio
* [Ámbar - Aplicación fullstack](https://github.com/Juasaisi/Tp-dsoft-com04/tree/develop)
## Tema
### Descripción
 
*Sistema de gestión de ventas para un emprendimiento de accesorios artesanales. Permite administrar clientes y productos, controlar el stock, registrar ventas y consultar su historial. Al realizar una venta, el sistema actualiza el stock de los productos vendidos.*
 
### Modelo
 
<!-- IMPORTANTE: reemplazar por la imagen exportada de diagrams.net (DER). Ej: ![Modelo entidad-relación](docs/modelo.png) -->
![Modelo entidad-relación de Ámbar](docs/modelo.png)
 
Entidades: **Cliente** (1:N) **Venta** (1:N) **DetalleVenta** (N:1) **Producto**.
 
## Alcance Funcional
 
### Alcance Mínimo
 
Regularidad (grupo de 2 integrantes):
 
| Req | Detalle |
| :- | :- |
| CRUD simple | 1. CRUD Producto (nombre, descripción, precio, stock; baja lógica) <br> 2. CRUD Cliente (DNI, nombre, apellido, teléfono, email; baja lógica) |
| CRUD dependiente | 1. CRUD DetalleVenta (depende de Venta y Producto): alta al registrar la venta, consulta en el detalle de la venta, modificación de cantidad y eliminación de renglón |
| Listado con filtro | 1. Listado de productos con filtro por nombre/descripción y por stock bajo <br> 2. Listado de ventas con filtro por fecha |
| Detalle de cada listado | 1. Producto → ficha completa <br> 2. Cliente → ficha completa <br> 3. Venta → cliente, fecha, productos, cantidades, subtotales y total |
| Caso de uso / Epic | 1. **Registrar una venta**: se elige un cliente y uno o más productos con cantidad; el servidor valida el stock, calcula subtotales y total, descuenta el stock y guarda venta y detalles en una única transacción |
 
### Alcance Adicional Voluntario
 
| Req | Detalle |
| :- | :- |
| CUU/Epic | 1. **Anular una venta**: marca la venta como anulada (baja lógica) y devuelve el stock de todos sus productos, en una transacción |
| Validaciones | 1. Cliente: DNI de 7-8 dígitos, teléfono de 10 dígitos, email válido; DNI y email únicos <br> 2. Producto: precio positivo, stock no negativo |
