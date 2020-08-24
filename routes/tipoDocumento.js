const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/*GET ALL DOCUMENTOS IDENTIDAD*/
router.get('/', function (req, res) { 
   
    database.table('tipo_documento as td')
        .withFields(['td.id',
            'td.nombre',
            'td.acronimo',
            'td.estado'
        ])
        //.slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(tidoc => {
            if (tidoc.length > 0) {
                res.status(200).json(
                    //count: tidoc.length,
                    tidoc                 
                );
            } else {
                res.json({message: "No se encontraron tipos documentos."});
            }
        })
        .catch(err => console.log(err));
});
module.exports = router;
