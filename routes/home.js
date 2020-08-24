const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

router.get('/', function (req, res) { 

    database.table('persona')
        .getAll()
        .then(personas => { 
            database.table('producto')
                .getAll()
                .then(productos => { 
                    database.table('comprobante_cab')
                        .getAll()
                        .then(comprobante => { 
                            total = 0
                            for(let i=0; i<comprobante.length; i++)
                            {
                                total = total+comprobante[i].monto_total
                            }
                            
                            res.status(200).json({
                                numero_personas: personas.length,
                                numero_productos: productos.length,
                                total: total.toFixed(2)
                            });
                        })
                })
                .catch(err => console.log(err));
            /*res.status(200).json({
                count: personas.length,
            });*/
            //res.status(200).json(personas.length)
        })
        .catch(err => console.log(err));
});
     
module.exports = router;
