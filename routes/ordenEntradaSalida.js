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

    console.log(req.query)

    if(req.query.fechaInicio !== 'undefined' && req.query.fechaFin !== 'undefined'){
        database.table('orden_entrada_salida as orden_cab')
            .join([
                {
                    table: "orden_entrada_salida_det as orden_det",
                    on: 'orden_cab.id = orden_det.orden_entrada_salida_id'
                },
                {
                    table: "tipo_orden_entrada_salida as tipo",
                    on: 'tipo.id = orden_cab.tipo_orden_entrada_salida_id'
                },
                {
                    table: "producto as pro",
                    on: 'pro.id = orden_det.producto_id'
                }
            ])
            .withFields(['orden_cab.id',
                'orden_cab.fecha',
                'tipo.nombre as nombreTipo',
                'pro.nombre as nombreProducto',
                'orden_det.cantidad as cantidad',
                'orden_det.precio_unitario as precioUnitario',
                'orden_det.total as total',
            ])
            .filter("orden_cab.fecha >= '"+ req.query.fechaInicio+"' and orden_cab.fecha <= '"+req.query.fechaFin+"' and pro.id = '"+req.query.idProducto+"'")
            .slice(startValue, endValue)
            .sort({fecha: .1})
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
        database.table('orden_entrada_salida as orden_cab')
            .join([
                {
                    table: "orden_entrada_salida_det as orden_det",
                    on: 'orden_cab.id = orden_det.orden_entrada_salida_id'
                },
                {
                    table: "tipo_orden_entrada_salida as tipo",
                    on: 'tipo.id = orden_cab.tipo_orden_entrada_salida_id'
                },
                {
                    table: "producto as pro",
                    on: 'pro.id = orden_det.producto_id'
                }
            ])
            .withFields(['orden_cab.id',
                'orden_cab.fecha',
                'tipo.nombre as nombreTipo',
                'pro.nombre as nombreProducto',
                'orden_det.cantidad as cantidad',
                'orden_det.precio_unitario as precioUnitario',
                'orden_det.total as total',
            ])
            .slice(startValue, endValue)
            .sort({fecha: .1})
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


module.exports = router;