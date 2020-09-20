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
    database.table('linea as lin')
        .withFields(['lin.id',
            'lin.nombre',
            'lin.acronimo',
            'lin.estado'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(lin => { 
            if (lin.length > 0) {
                res.status(200).json({
                    count: lin.length,
                    lineas: lin
                });
            } else {
                res.json({message: "No se encontraron lineas."});
            }
        })
        .catch(err => console.log(err));
});

/*EXTRAE LOS DATOS DE UN LINEA */
router.get('/:id', function (req, res) { 
    let idLinea = req.params.id;
    //let persona = new Persona();
    
    database.table('linea as lin')
        .withFields(['lin.id',
            'lin.nombre',
            'lin.acronimo',
            'lin.estado'
            
        ])
        .filter({'lin.id': idLinea})
        .getAll()
        .then(lin => { 
            if (lin.length > 0) {

                console.log(lin);

                //res.status(200).json(pers[0]);
                res.status(200).json(lin[0]);
            } else {
                res.json({message: "No se encontraró la linea indicado."});
            }
        })
        .catch(err => console.log(err));
});

/*CREAR LOS DATOS DE UNA LINEA*/
router.post('/create', function(req, res) {
    console.log(req.body);
    database.table('linea')
        .insert({
            nombre: req.body.nombre,
            acronimo: req.body.acronimo,
            fecha_creacion:  new Date(),
            fecha_modificacion:  new Date(),
            estado: req.body.estado

        }).then((idLinea) => {
            res.json({message: idLinea});
        })
        .catch(err=>{
            console.log(err)
            res.json({message: err})
        });
    
    res.json({message: 'Se ingreso la linea satisfactoriamente', success: true});
});

router.put('/:id', function(req, res) {
    console.log(req);
    let idLinea = req.params.id;
    database.table('linea as lin')
        .filter({'lin.id': idLinea})
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
    let idLinea = req.params.id;
    database.table('linea as lin')
        .filter({'lin.id': idLinea})
        .update({
            estado: 1
        })
        .catch(err=>console.log(err));
    res.json({message: 'Se elimino satisfactoriamente', success: true});
});

module.exports = router;
