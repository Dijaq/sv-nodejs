const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/*GET ALL DOCUMENTOS IDENTIDAD*/
router.get('/', function (req, res) { 
   
    database.table('sucursal as suc')
        .withFields(['suc.id',
            'suc.razon_social as razonSocial',
            'suc.estado'
        ])
        //.slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(sucur => {
            if (sucur.length > 0) {
                res.status(200).json(
                    //count: tidoc.length,
                    sucur                 
                );
            } else {
                res.json({message: "No se encontraron sucursales."});
            }
        })
        .catch(err => console.log(err));
});
module.exports = router;