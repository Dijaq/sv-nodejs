const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/*CONSULTA TODOS LOS COMPROBANTES*/

router.get('/', function (req, res) { 

    let valor = 0.00;

    database.table('comprobante_cab as cmpro')
        .withFields(['cmpro.id',
        'cmpro.sucursal_id as idSucursal', 
        'cmpro.numero_comprobante as numeroComprobante',
        'cmpro.monto_total as montoTotal',
        'cmpro.fecha',
        'cmpro.estado as estado'
        ])
        //.filter("cmpro.fecha >= '"+ req.query.fechaInicio+"' and cmpro.fecha <= '"+req.query.fechaFin+"'")
        .filter("cmpro.fecha BETWEEN '"+ req.query.fechaInicio+"' and '"+req.query.fechaFin+"'")
        .sort({id: .1})
        .getAll()
        .then(ord_cmp => { 
            if (ord_cmp.length > 0) {

                for(let i=0; i<ord_cmp.length; i++)
                {
                    valor = valor+ord_cmp[i].montoTotal
                }

                res.status(200).json({
                    totalGeneral: valor,
                    ventaCab: ord_cmp
                });
            } else {
                res.json({message: "No se encontraron ordenes de compra."});
            }
        })
        .catch(err => console.log(err));


});

/*router.get('/', function (req, res) { 
   
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
    database.table('comprobante_cab as cmpro')
        .withFields(['cmpro.id',
            'cmpro.sucursal_id as idSucursal', 
            'cmpro.numero_comprobante as numeroComprobante',
            'cmpro.monto_total as montoTotal',
            'cmpro.fecha',
            'cmpro.estado as estado'
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
});*/

router.get('/numero/', function (req, res) { 

    database.table('comprobante_cab as cmpro')
        .withFields(['cmpro.id',
        'cmpro.numero_comprobante as numeroComprobante',
        ])
        .sort({id: -1})
        .getAll()
        .then(ord_cmp => { 
            if (ord_cmp.length > 0) {
                res.status(200).json(
                    ord_cmp[0].numeroComprobante
                    //count: ord_cmp.length,
                    //ordenesCompra: ord_cmp
                );
            } else {
                //res.json({message: "No se encontraron ordenes de compra."});
                res.status(200).json(0);
            }
        })
        .catch(err => console.log(err));


});

router.get('/numero', function(req, res) {
    res.json(
        getLastComprobante()
    )
});

function getLastComprobante(){

    database.table('comprobante_cab as cmpro')
    .withFields(['cmpro.id',
    'cmpro.numero_comprobante as numeroComprobante',
    ])
    .sort({id: -1})
    .getAll()
    .then(ord_cmp => { 
        if (ord_cmp.length > 0) {
            
            this.numero = ord_cmp[0].numeroComprobante;
            return ord_cmp[0].numeroComprobante
            //return numero
            //count: ord_cmp.length,
                //ordenesCompra: ord_cmp
        } else {
            //res.json({message: "No se encontraron ordenes de compra."});
            return 0;
        }
    })
    .catch(err => console.log(err));

    console.log(this.numero)
    return this.numero;
}

router.post('/create', function(req, res) {
    console.log(req.body);

    let persona_id = 1
    let sucursal_id = 1
    let fecha = new Date()
    let tipo_comprobante_id = 1
    let numeroComprobante;
    //console.log("Get: "+getLastComprobante())

    database.table('comprobante_cab as cmpro')
    .withFields(['cmpro.id',
    'cmpro.numero_comprobante as numeroComprobante',
    ])
    .sort({id: -1})
    .getAll()
    .then(orden => { 
        if (orden.length > 0) {
            numeroComprobante = orden[0].numeroComprobante+1
        } else {
            numeroComprobante = 1
        }

        // SECTION INSERT
        database.table('comprobante_cab')
            .insert({
                persona_id: persona_id,
                sucursal_id: sucursal_id,
                tipo_comprobante_id: tipo_comprobante_id,
                numero_comprobante: numeroComprobante,
                monto_total: req.body.montoTotal,
                fecha: fecha,
                fecha_creacion:  new Date(),
                fecha_modificacion:  new Date(),
                estado: 2
            })
            .then((idComprobante) => {
                console.log(idComprobante);

                req.body.ventaDet.forEach(async (det) => {
                    database.table('comprobante_det')
                        .insert({
                            comprobante_cab_id: idComprobante,
                            producto_id: det.idProducto,
                            cantidad: det.cantidad,
                            precio_unitario: det.precioUnitario,
                            total: det.cantidad*det.precioUnitario,
                            fecha_creacion:  new Date(),
                            fecha_modificacion:  new Date(),
                            estado: 2
                        })
                        .catch(err=>console.log(err));
                    
                    database.table('articulo as art')
                    .withFields(['art.id',
                    'art.stock as stock'     
                    ])
                    .filter({producto_id:  det.idProducto})
                    .getAll()
                    .then(art => { 
                        if (art.length > 0) {
                            database.table('articulo')
                                .filter({producto_id: det.idProducto})
                                .update({
                                    stock: parseInt(art[0].stock)-parseInt(det.cantidad)
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
    })
    .catch(err => console.log(err));

    
   
});


/*CREAR LA VENTA Y DESUENTA STOCK*/
/*router.post('/create', function(req, res) {
    console.log(req.body);

    let persona_id = 1
    let sucursal_id = 1
    let fecha = new Date().toLocaleString()
    let tipo_comprobante_id = 1
    let numeroComprobante = getLastComprobante()+1
    console.log("Get: "+getLastComprobante())

    database.table('comprobante_cab')
        .insert({
            persona_id: persona_id,
            sucursal_id: sucursal_id,
            tipo_comprobante_id: tipo_comprobante_id,
            numero_comprobante: numeroComprobante,
            monto_total: req.body.montoTotal,
            fecha: fecha,
            fecha_creacion:  new Date().toLocaleString(),
            fecha_modificacion:  new Date().toLocaleString(),
            estado: 2
        })
        .then((idComprobante) => {
            console.log(idComprobante);

            req.body.ventaDet.forEach(async (det) => {
                database.table('comprobante_det')
                    .insert({
                        comprobante_cab_id: idComprobante,
                        producto_id: det.idProducto,
                        cantidad: det.cantidad,
                        precio_unitario: det.precioUnitario,
                        total: det.cantidad*det.precioUnitario,
                        fecha_creacion:  new Date().toLocaleString(),
                        fecha_modificacion:  new Date().toLocaleString(),
                        estado: 2
                    })
                    .catch(err=>console.log(err));
                
                database.table('articulo as art')
                .withFields(['art.id',
                   'art.stock as stock'     
                ])
                .filter({producto_id:  det.idProducto})
                .getAll()
                .then(art => { 
                    if (art.length > 0) {
                        database.table('articulo')
                            .filter({producto_id: det.idProducto})
                            .update({
                                stock: parseInt(art[0].stock)-parseInt(det.cantidad)
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
   
});*/

router.get('/detail/:id', function (req, res) { 
    let idComprobante = req.params.id;
    //let persona = new Persona();
    
    database.table('comprobante_cab as comp')
        .join([
            {
                table: "sucursal as suc",
                on: 'suc.id = comp.sucursal_id'
            }
        ])
        .withFields(['comp.id',
            'comp.numero_comprobante as numeroComprobante',
            'comp.monto_total as montoTotal',
            'comp.fecha',
            'suc.razon_social as razonSocial'        
        ])
        .filter({'comp.id': idComprobante})
        .getAll()
        .then(prod => { 
            if (prod.length > 0) {
                console.log(prod);
                //Detalls
                database.table('comprobante_det as comp_det')
                    .join([
                        {
                            table: "producto as pro",
                            on: 'pro.id = comp_det.producto_id'
                        }
                    ])
                    .withFields(['comp_det.id',
                        'comp_det.cantidad as cantidad',
                        'comp_det.precio_unitario as precioUnitario',
                        'pro.nombre as nombreProducto',
                        'comp_det.total as subTotal'
                    ])
                    .filter({'comp_det.comprobante_cab_id': idComprobante})
                    .getAll()
                    .then(detalles => { 
                        cabecera = prod[0];
                        respuesta = { 
                            id: prod[0].id,
                            numeroComprobante: prod[0].numeroComprobante,
                            montoTotal: prod[0].montoTotal,
                            nombreSucursal: prod[0].razonSocial, 
                            fecha: prod[0].fecha,
                            detalles
                        };

                        //respuesta = { cabecera, detalles};
                        //res.status(200).json(prod[0]);
                        res.status(200).json(respuesta);
                        
                    })
                    .catch(err => console.log(err));
                //res.status(200).json(pers[0]);
                
            } else {
                res.json({message: "No se encontraró la orden de compra indicada."});
            }
        })
        .catch(err => console.log(err));
});

router.post('/orden_es', function(req, res) 
{
    let sucursal_id = 1
    let fecha = new Date().toLocaleString()

    database.table('orden_entrada_salida')
    .insert({
        sucursal_id: sucursal_id,
        tipo_orden_entrada_salida_id: 1,
        numero_orden: 1,
        fecha: fecha,
        monto_total: req.body.montoTotal,
        fecha_creacion:  new Date(),
        fecha_modificacion:  new Date(),
        estado: 2
    })
    .then((ordenId) => {
        console.log(ordenId);

        req.body.ventaDet.forEach(async (det) => {
            database.table('orden_entrada_salida_det')
                .insert({
                    orden_entrada_salida_id: ordenId,
                    producto_id: det.idProducto,
                    cantidad: det.cantidad,
                    precio_unitario: det.precioUnitario,
                    total: det.cantidad*det.precioUnitario,
                    fecha_creacion:  new Date(),
                    fecha_modificacion:  new Date(),
                    estado: 2
                })
                .catch(err=>console.log(err));
        })
    })
    .catch(err=>console.log(err));

    res.json({message: 'Se ingreso satisfactoriamente', success: true});
    
});

module.exports = router;

