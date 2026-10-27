# Propuesta TP DSW- Ambar 

## Grupo
### Integrantes
* 54161- Saisi, Juana
* 55123 - Azurmendi, Felicitas

### Repositorio
* [Ámbar - Aplicación fullstack](https://github.com/Juasaisi/Tp-dsoft-com04/tree/develop)

## Tema
### Descripción

*Sistema de gestión de ventas para un emprendimiento de accesorios artesanales. Permite administrar clientes y productos, controlar el stock, registrar ventas y consultar su historial. Al realizar una venta, el sistema actualiza el stock de los productos vendidos.*

### Modelo
![imagen del modelo]()



## Alcance Funcional 

### Alcance Mínimo
 

Regularidad:

| Req | Detalle |
| :- | :- |
| CRUD simple | 1. CRUD Producto (nombre, descripción, precio, stock) <br> 2. CRUD Cliente (nombre, contacto) |
| CRUD dependiente | 1. CRUD DetalleVenta (depende de Venta y Producto) |
| Listado + detalle | 1. Listado de productos → detalle completo <br> 2. Listado de ventas → detalle con productos y total |


### Alcance Adicional Voluntario


| Req | Detalle |
| :- | :- |
| Listados | 1. Listado de ventas con filtro por rango de fechas. |
| CUU/Epic | 1. Registrar una venta → descuenta stock automáticamente. <br> 2. Anular una venta → devuelve el stock de los productos. |
