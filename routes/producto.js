const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');
const { Router } = require('express');
//const Persona = require('../models/persona');

/*GET ALL PERSONAS*/
router.get('/', function (req, res) { 
    console.log( new Date().toLocaleString());
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
    database.table('producto as p')
        .filter({'p.estado': 2})
        .withFields(['p.id',
            'p.nombre',
            'p.codigo',
            'p.estado'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(prod => { 
            if (prod.length > 0) {
                res.status(200).json({
                    count: prod.length,
                    productos: prod
                });
            } else {
                res.json({message: "No se encontraron productos."});
            }
        })
        .catch(err => console.log(err));
});

/*EXTRAE LOS DATOS DE UN PRODUCTO */
router.get('/:id', function (req, res) { 
    let idProducto = req.params.id;
    //let persona = new Persona();
    
    database.table('producto as p')
        .join([
            {
                table: "marca as m",
                on: 'm.id = p.marca_id'
            },
            {
                table: "linea as lin",
                on: 'lin.id = p.linea_id'
            },
            {
                table: "unidad_de_medida as udm",
                on: 'udm.id = p.unidad_medida_id'
            }
        ])
        .withFields(['p.id',
            'p.nombre',
            'm.id as idMarca',
            'lin.id as idLinea',
            'udm.id as idUnidadMedida',
            'p.descripcion',
            'p.url_imagen as urlImagen',
            'p.codigo',
            'p.estado'
            
        ])
        .filter({'p.id': idProducto})
        .getAll()
        .then(prod => { 
            if (prod.length > 0) {
                
                /*persona.id = prod[0].id;
                persona.nombres = prod[0].nombres;
                persona.apellidos = prod[0].apellidos;
                persona.direccion = prod[0].direccion;
                persona.numeroDocumento = prod[0].numero_documento;
                persona.idTipoDocumento = pers[0].tipo_documento_id;
                persona.estado = pers[0].estado;*/

                console.log(prod);

                //res.status(200).json(pers[0]);
                res.status(200).json(prod[0]);
            } else {
                res.json({message: "No se encontraró el producto indicado."});
            }
        })
        .catch(err => console.log(err));
});

/*EXTRAE LOS DATOS DE UN PRODUCTO */
router.get('/:nombre', function (req, res) { 
    let idProducto = req.params.id;
    //let persona = new Persona();
    
    database.table('producto as p')
        .join([
            {
                table: "marca as m",
                on: 'm.id = p.marca_id'
            },
            {
                table: "linea as lin",
                on: 'lin.id = p.linea_id'
            },
            {
                table: "unidad_de_medida as udm",
                on: 'udm.id = p.unidad_medida_id'
            }
        ])
        .withFields(['p.id',
            'p.nombre',
            'm.id as idMarca',
            'lin.id as idLinea',
            'udm.id as idUnidadMedida',
            'p.descripcion',
            'p.url_imagen as urlImagen',
            'p.codigo',
            'p.estado'
            
        ])
        .filter({'p.id': idProducto})
        .getAll()
        .then(prod => { 
            if (prod.length > 0) {
                
                console.log(prod);

                //res.status(200).json(pers[0]);
                res.status(200).json(prod[0]);
            } else {
                res.json({message: "No se encontraró el producto indicado."});
            }
        })
        .catch(err => console.log(err));
});

/*CREAR LOS DATOS DE UNA PERSONA*/
router.post('/create', function(req, res) {
    console.log(req.body);
    database.table('producto')
        .insert({
            nombre: req.body.nombre,
            codigo: req.body.codigo,
            descripcion: req.body.descripcion,
            url_imagen: req.body.urlImage,
            linea_id: req.body.idLinea,
            marca_id: req.body.idMarca,
            unidad_medida_id: req.body.idUnidadMedida,
            fecha_creacion:  new Date().toLocaleString(),
            fecha_modificacion:  new Date().toLocaleString(),
            estado: req.body.estado

        }).catch(err=>console.log(err));
    res.json({message: 'Se ingreso satisfactoriamente', success: true});
});

/*CREAR LOS DATOS DE UNA PERSONA*/
router.put('/:id', function(req, res) {
    console.log(req);
    let idProducto = req.params.id;
    database.table('producto as p')
        .filter({'p.id': idProducto})
        .update({
            nombre: req.body.nombre,
            codigo: req.body.codigo,
            descripcion: req.body.descripcion,
            url_imagen: req.body.urlImage,
            linea_id: req.body.idLinea,
            marca_id: req.body.idMarca,
            unidad_medida_id: req.body.idUnidadMedida,
            fecha_modificacion:  new Date().toLocaleString(),
            estado: req.body.estado

        })
        .catch(err=>console.log(err));
    res.json({message: 'Se modifico satisfactoriamente', success: true});
});

/*CREAR LOS DATOS DE UNA PERSONA*/
router.delete('/:id', function(req, res) {
    console.log(req);
    let idProducto = req.params.id;
    database.table('producto as p')
        .filter({'p.id': idProducto})
        .update({
            estado: 1
        })
        .catch(err=>console.log(err));
    res.json({message: 'Se elimino satisfactoriamente', success: true});
});

module.exports = router;