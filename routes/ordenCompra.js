const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/*GET ALL ORDENES DE COMPRA*/
router.get('/', function (req, res) { 
   
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;   // set limit of items per page
    let startValue;
    let endValue;
    if (page > 0) {
        startValue = (page * limit) - limit;     // 0, 10, 20, 30
        endValue = page * limit;                  // 10, 20, 30, 40
    } else {
        startValue = 0;
        endValue = 10;
    }

    if(req.query.fechaInicio !== 'undefined' && req.query.fechaFin !== 'undefined'){
        database.table('orden_compra as ord_cmp')
            .withFields(['ord_cmp.id',
                'ord_cmp.numero_orden as numeroOrden',
                'ord_cmp.monto_total as montoTotal',
                'ord_cmp.fecha',
                'ord_cmp.estado_orden as estadoOrden'
            ])
            .filter("ord_cmp.fecha >= '"+ req.query.fechaInicio+"' and ord_cmp.fecha <= '"+req.query.fechaFin+"'")
            .slice(startValue, endValue)
            .sort({id: .1})
            .getAll()
            .then(ord_cmp => { 
                if (ord_cmp.length > 0) {
                    res.status(200).json({
                        count: ord_cmp.length,
                        ordenesCompra: ord_cmp
                    });
                } else {
                    res.json({message: "No se encontraron ordenes de compra."});
                }
            })
            .catch(err => console.log(err));
    }
    else{
        database.table('orden_compra as ord_cmp')
            .withFields(['ord_cmp.id',
                'ord_cmp.numero_orden as numeroOrden',
                'ord_cmp.monto_total as montoTotal',
                'ord_cmp.fecha',
                'ord_cmp.estado_orden as estadoOrden'
            ])
            .slice(startValue, endValue)
            .sort({id: .1})
            .getAll()
            .then(ord_cmp => { 
                if (ord_cmp.length > 0) {
                    res.status(200).json({
                        count: ord_cmp.length,
                        ordenesCompra: ord_cmp
                    });
                } else {
                    res.json({message: "No se encontraron ordenes de compra."});
                }
            })
            .catch(err => console.log(err));
    }
});

/*EXTRAE LOS DATOS DE UN PRODUCTO */
router.get('/:id', function (req, res) { 
    let idOrdenCompra = req.params.id;
    //let persona = new Persona();
    
    database.table('orden_compra as ord_cmp')
        .withFields(['ord_cmp.id',
            'ord_cmp.numero_orden as numeroOrden',
            'ord_cmp.monto_total as montoTotal',
            'ord_cmp.fecha',
            'ord_cmp.estado_orden as estadoOrden'        
        ])
        .filter({'ord_cmp.id': idOrdenCompra})
        .getAll()
        .then(prod => { 
            if (prod.length > 0) {
                console.log(prod);

                //res.status(200).json(pers[0]);
                res.status(200).json(prod[0]);
            } else {
                res.json({message: "No se encontraró la orden de compra indicada."});
            }
        })
        .catch(err => console.log(err));
});

/*EXTRAE UNA ORDEN DE COMPRA CON DETALLES*/
router.get('/detail/:id', function (req, res) { 
    let idOrdenCompra = req.params.id;
    //let persona = new Persona();
    
    database.table('orden_compra as ord_cmp')
        .join([
            {
                table: "sucursal as suc",
                on: 'suc.id = ord_cmp.sucursal_id'
            }
        ])
        .withFields(['ord_cmp.id',
            'ord_cmp.numero_orden as numeroOrden',
            'ord_cmp.monto_total as montoTotal',
            'ord_cmp.fecha',
            'ord_cmp.estado_orden as estadoOrden',
            'suc.razon_social as razonSocial'        
        ])
        .filter({'ord_cmp.id': idOrdenCompra})
        .getAll()
        .then(prod => { 
            if (prod.length > 0) {
                console.log(prod);
                //Detalls
                database.table('orden_compra_det as ord_cmp_det')
                    .join([
                        {
                            table: "producto as pro",
                            on: 'pro.id = ord_cmp_det.producto_id'
                        }
                    ])
                    .withFields(['ord_cmp_det.id',
                        'ord_cmp_det.cantidad as cantidad',
                        'ord_cmp_det.precio_unitario as precioUnitario',
                        'pro.nombre as nombreProducto',
                        'ord_cmp_det.total as subTotal'
                    ])
                    .filter({'ord_cmp_det.orden_compra_id': idOrdenCompra})
                    .getAll()
                    .then(detalles => { 
                        cabecera = prod[0];
                        respuesta = { 
                            id: prod[0].id,
                            numeroOrden: prod[0].numeroOrden,
                            montoTotal: prod[0].montoTotal,
                            estadoOrden: prod[0].estadoOrden , 
                            nombreSucursal: prod[0].razonSocial, 
                            fecha: prod[0].fecha,
                            detalles
                        };

                        //respuesta = { cabecera, detalles};
                        //res.status(200).json(prod[0]);
                        res.status(200).json(respuesta);
                        
                    });
                //res.status(200).json(pers[0]);
                
            } else {
                res.json({message: "No se encontraró la orden de compra indicada."});
            }
        })
        .catch(err => console.log(err));
});

/*CREAR LOS DATOS DE UNA PERSONA*/
router.post('/create', function(req, res) {
    console.log(req.body);
    database.table('orden_compra')
        .insert({
            sucursal_id: req.body.idSucursal,
            numero_orden: req.body.numeroOrden,
            fecha: req.body.fecha,
            monto_total: req.body.montoTotal,
            estado_orden: 1,
            fecha_creacion:  new Date().toLocaleString(),
            fecha_modificacion:  new Date().toLocaleString(),
            estado: req.body.estado
        })
        .then((ordenId) => {
            console.log(ordenId);

            req.body.detalles.forEach(async (det) => {
                database.table('orden_compra_det')
                    .insert({
                        orden_compra_id: ordenId,
                        producto_id: det.idProducto,
                        cantidad: det.cantidad,
                        precio_unitario: det.precioUnitario,
                        total: det.cantidad*det.precioUnitario,
                        fecha_creacion:  new Date().toLocaleString(),
                        fecha_modificacion:  new Date().toLocaleString(),
                        estado: 2
                    })
                    .catch(err=>console.log(err));
                
                //Modificar Cantidad en Stock
                database.table('articulo as art')
                .withFields(['art.id',
                   'art.stock as stock'     
                ])
                .filter({producto_id:  det.idProducto})
                .getAll()
                .then(art => { 

                    if (art.length === 0)
                    {
                        database.table('articulo')
                            .insert({
                                producto_id:  det.idProducto,
                                sucursal_id: 1,
                                stock: det.cantidad,
                                precio_venta: det.precioUnitario,
                                precio_compra: det.precioUnitario,                    
                                fecha_creacion:  new Date().toLocaleString(),
                                fecha_modificacion:  new Date().toLocaleString(),
                                estado: 2

                            })
                            
                            .catch(err=>console.log(err));
                        res.json({message: 'Se ingreso satisfactoriamente', success: true});
                    }
                    else
                        if (art.length > 0) {
                            database.table('articulo')
                                .filter({producto_id: det.idProducto})
                                .update({
                                    stock: parseInt(det.cantidad)+parseInt(art[0].stock)
                                })
                                .catch(err=>console.log(err));
                        } else {
                            res.json({message: "No se encontraró la orden de compra indicada."});
                        }
                })
                .catch(err => console.log(err));           
            });
        })
        .catch(err=>console.log(err));

    res.json({message: 'Se ingreso satisfactoriamente', success: true});
   
});

router.post('/orden_es', function(req, res) 
{
    database.table('orden_entrada_salida')
    .insert({
        sucursal_id: req.body.idSucursal,
        tipo_orden_entrada_salida_id: 2,
        numero_orden: req.body.numeroOrden,
        fecha: req.body.fecha,
        monto_total: req.body.montoTotal,
        fecha_creacion:  new Date().toLocaleString(),
        fecha_modificacion:  new Date().toLocaleString(),
        estado: req.body.estado
    })
    .then((ordenId) => {
        console.log(ordenId);

        req.body.detalles.forEach(async (det) => {
            database.table('orden_entrada_salida_det')
                .insert({
                    orden_entrada_salida_id: ordenId,
                    producto_id: det.idProducto,
                    cantidad: det.cantidad,
                    precio_unitario: det.precioUnitario,
                    total: det.cantidad*det.precioUnitario,
                    fecha_creacion:  new Date().toLocaleString(),
                    fecha_modificacion:  new Date().toLocaleString(),
                    estado: 2
                })
                .catch(err=>console.log(err));
        })
    })
    .catch(err=>console.log(err));

    res.json({message: 'Se ingreso satisfactoriamente', success: true});
    
});

module.exports = router;
