const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/*GET ALL DOCUMENTOS IDENTIDAD*/
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
    database.table('marca as mr')
        .withFields(['mr.id',
            'mr.nombre',
            'mr.acronimo',
            'mr.estado'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(mr => { 
            if (mr.length > 0) {
                res.status(200).json({
                    count: mr.length,
                    marcas: mr
                });
            } else {
                res.json({message: "No se encontraron marcas."});
            }
        })
        .catch(err => console.log(err));
});


/*EXTRAE LOS DATOS DE UN MARCA */
router.get('/:id', function (req, res) { 
    let idMarca = req.params.id;
    //let persona = new Persona();
    
    database.table('marca as mrc')
        .withFields(['mrc.id',
            'mrc.nombre',
            'mrc.acronimo',
            'mrc.estado'
            
        ])
        .filter({'mrc.id': idMarca})
        .getAll()
        .then(mrc => { 
            if (mrc.length > 0) {

                console.log(mrc);

                //res.status(200).json(pers[0]);
                res.status(200).json(mrc[0]);
            } else {
                res.json({message: "No se encontraró la marca indicado."});
            }
        })
        .catch(err => console.log(err));
});

/*CREAR LOS DATOS DE UNA MARCA*/
router.post('/create', function(req, res) {
    console.log(req.body);
    database.table('marca')
        .insert({
            nombre: req.body.nombre,
            acronimo: req.body.acronimo,
            fecha_creacion:  new Date(),
            fecha_modificacion:  new Date(),
            estado: req.body.estado

        }).catch(err=>console.log(err));
    res.json({message: 'Se ingreso satisfactoriamente', success: true});
});

router.put('/:id', function(req, res) {
    console.log(req);
    let idMarca = req.params.id;
    database.table('marca as mac')
        .filter({'mac.id': idMarca})
        .update({
            nombre: req.body.nombre,
            acronimo: req.body.acronimo,
            fecha_modificacion:  new Date(),
            estado: req.body.estado

        })
        .catch(err=>console.log(err));
    res.json({message: 'Se modifico satisfactoriamente', success: true});
});

/*CREAR LOS DATOS DE UNA PERSONA*/
router.delete('/:id', function(req, res) {
    console.log(req);
    let idMarca = req.params.id;
    database.table('marca as mac')
        .filter({'mac.id': idMarca})
        .update({
            estado: 1
        })
        .catch(err=>console.log(err));
    res.json({message: 'Se elimino satisfactoriamente', success: true});
});

module.exports = router;
