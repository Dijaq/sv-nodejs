const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/*GET ALL DOCUMENTOS IDENTIDAD*/
router.get('/', function (req, res) { 
   
    database.table('tipo_comprobante as tc')
        .withFields(['tc.id',
            'tc.nombre',
            'tc.acronimo',
            'tc.estado'
        ])
        //.slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(ticomp => {
            if (ticomp.length > 0) {
                res.status(200).json(
                    //count: tidoc.length,
                    ticomp                 
                );
            } else {
                res.json({message: "No se encontraron tipos comprobantes."});
            }
        })
        .catch(err => console.log(err));
});
module.exports = router;