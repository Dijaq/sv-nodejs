const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/*GET ARTICULOS POR NOMBRE O CODIGO*/
router.get('/:buscar', function (req, res) { 
    let codigoOrNombre = req.params.buscar;
    console.log(codigoOrNombre)
    database.table('articulo as art')
        .join([
            {
                table: "producto as prod",
                on: 'art.producto_id = prod.id'
            }
        ])
        .withFields(['art.id',
            'prod.nombre as nombreProducto',
            'prod.id as idProducto',
            'prod.codigo as codigoProducto',
            'art.precio_venta as precioUnitarioVenta',
            'art.stock as stock',
            'art.estado as estado'
        ])
        .filter("prod.nombre like "+"'%"+codigoOrNombre+"%' OR prod.codigo like "+"'%"+codigoOrNombre+"%'")
        //.filter({'prod.nombre': '%'+codigoOrNombre+'%'})
        .sort({id: .1})
        .getAll()
        .then(art => {
            if (art.length > 0) {
                res.status(200).json(
                    //count: tidoc.length,
                    art                 
                );
            } else {
                res.json({message: "No se encontraron articulos."});
            }
        })
        .catch(err => console.log(err));
});


/*GET ARTICULOS POR SUCURSAL*/
router.get('/inventario/:idSucursal', function (req, res) { 
    let idSucursal = req.params.idSucursal;
    
    database.table('articulo as art')
        .join([
            {
                table: "producto as prod",
                on: 'art.producto_id = prod.id'
            }
        ])
        .withFields(['art.id',
            'prod.nombre as nombreProducto',
            'prod.codigo as codigoProducto',
            'art.precio_venta as precioUnitarioVenta',
            'art.stock as stock',
            'art.estado as estado'
        ])
        .filter({sucursal_id: idSucursal})
        //.filter({'prod.nombre': '%'+codigoOrNombre+'%'})
        .sort({id: .1})
        .getAll()
        .then(art => {
            if (art.length > 0) {
                res.status(200).json(
                    //count: tidoc.length,
                    art                 
                );
            } else {
                res.json({message: "No se encontraron articulos."});
            }
        })
        .catch(err => console.log(err));
});

/*GET ALL DOCUMENTOS IDENTIDAD*/
router.get('/1/:buscar', function (req, res) { 
    let codigoOrNombre = req.params.buscar;
    console.log(codigoOrNombre)
    database.table('articulo as art')
        .join([
            {
                table: "producto as prod",
                on: 'art.producto_id = prod.id'
            }
        ])
        .withFields(['art.id',
            'prod.nombre as nombreProducto',
            'art.precio_venta as precioVenta',
            'art.stock as stock'
        ])
        .filter("prod.nombre like "+"'%"+codigoOrNombre+"%'")
        //.filter({'prod.nombre': codigoOrNombre})
        //.filter({'prod.nombre': '%'+codigoOrNombre+'%'})
        .sort({id: .1})
        .getAll()
        .then(art => {
            if (art.length > 0) {
                res.status(200).json(
                    //count: tidoc.length,
                    art                 
                );
            } else {
                res.json({message: "No se encontraron articulos."});
            }
        })
        .catch(err => console.log(err));
});

module.exports = router;