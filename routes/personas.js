const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');
const { Router } = require('express');
const Persona = require('../models/persona');

/*GET ALL PERSONAS*/
router.get('/', function (req, res) { 
    //console.log( new Date().toLocaleString());
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
    database.table('persona as p')
        .filter({'p.estado': 2})
        .withFields(['p.id',
            'p.nombres',
            'p.apellidos',
            'p.direccion',
            'p.estado'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(pers => { 
            if (pers.length > 0) {
                res.status(200).json({
                    count: pers.length,
                    personas: pers
                });
            } else {
                res.json({message: "No se encontraron personas."});
            }
        })
        .catch(err => console.log(err));
});

/*CREAR LOS DATOS DE UNA PERSONA*/
router.post('/create', function(req, res) {
    console.log(req.body);
    database.table('persona')
        .insert({
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            direccion: req.body.direccion,
            numero_documento: req.body.numeroDocumento,
            tipo_documento_id: req.body.idTipoDocumento,
            fecha_creacion:  new Date(),
            fecha_modificacion:  new Date(),
            estado: req.body.estado

        }).catch(err=>console.log(err));
    res.json({message: 'Se ingreso satisfactoriamente', success: true});
});

/*CREAR LOS DATOS DE UNA PERSONA*/
router.put('/:id', function(req, res) {
    console.log(req);
    let idPersona = req.params.id;
    database.table('persona as p')
        .filter({'p.id': idPersona})
        .update({
            nombres: req.body.nombres,
            apellidos: req.body.apellidos,
            direccion: req.body.direccion,
            numero_documento: req.body.numeroDocumento,
            tipo_documento_id: req.body.idTipoDocumento,
            fecha_modificacion:  new Date(),
            estado: req.body.estado

        })
        .catch(err=>console.log(err));
    res.json({message: 'Se ingreso satisfactoriamente', success: true});
});

/*CREAR LOS DATOS DE UNA PERSONA*/
router.delete('/:id', function(req, res) {
    console.log(req);
    let idPersona = req.params.id;
    database.table('persona as p')
        .filter({'p.id': idPersona})
        .update({
            estado: 1
        })
        .catch(err=>console.log(err));
    res.json({message: 'Se elimino satisfactoriamente', success: true});
});

/*EXTRAE LOS DATOS DE UNA PERSONA */
router.get('/:id', function (req, res) { 
    let idPersona = req.params.id;
    let persona = new Persona();
    
    database.table('persona as p')
        .withFields(['p.id',
            'p.nombres',
            'p.apellidos',
            'p.direccion',
            'p.tipo_documento_id',
            'p.numero_documento',
            'p.estado'
        ])
        .filter({'p.id': idPersona})
        .getAll()
        .then(pers => { 
            if (pers.length > 0) {
                
                persona.id = pers[0].id;
                persona.nombres = pers[0].nombres;
                persona.apellidos = pers[0].apellidos;
                persona.direccion = pers[0].direccion;
                persona.numeroDocumento = pers[0].numero_documento;
                persona.idTipoDocumento = pers[0].tipo_documento_id;
                persona.estado = pers[0].estado;

                //res.status(200).json(pers[0]);
                res.status(200).json(persona);
            } else {
                res.json({message: "No se encontraron personas."});
            }
        })
        .catch(err => console.log(err));
});

/* GET ALL PRODUCTS */
/*router.get('/', function (req, res) {       // Sending Page Query Parameter is mandatory http://localhost:3636/api/products?page=1
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
    database.table('products as p')
        .join([
            {
                table: "categories as c",
                on: `c.id = p.cat_id`
            }
        ])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.description',
            'p.image',
            'p.id'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({message: "No products found"});
            }
        })
        .catch(err => console.log(err));
});*/

module.exports = router;
