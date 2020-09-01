const express = require('express');
const {check, validationResult, body} = require('express-validator');
const router = express.Router();
const helper = require('../config/helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {database} = require('../config/helpers');


// LOGIN ROUTE
router.post('/login', [helper.hasAuthFields, helper.isPasswordAndUserMatch], (req, res) => {
    let token = jwt.sign({state: 'true', email: req.body.email, username: req.body.username}, helper.secret, {
        algorithm: 'HS512',
        expiresIn: '4h'
    });

    database.table('usuario as user')
        .join([
            {
                table: "sucursal as suc",
                on: 'suc.id = user.sucursal_id'
            }
        ])
        .withFields(['user.id',
            'user.email',
            'user.username',
            'user.sucursal_id as idSucusal',
            'user.rol_id as idRol',
            'user.estado',
            'suc.razon_social as razonSocial'
            
        ])
        .filter({'user.email': req.body.email})
        .get()
        .then(usuario => {   
            res.json({token: token, auth: true, usuario});
                //res.status(200).json(lin[0]);
           
        })
        .catch(err => console.log(err));

    //res.json({token: token, auth: true, email: req.body.email, username: req.body.username, role: "2"});
    
});

// REGISTER ROUTE
router.post('/register', [
    check('email').isEmail().not().isEmpty().withMessage('Field can\'t be empty')
        .normalizeEmail({all_lowercase: true}),
    check('password').escape().trim().not().isEmpty().withMessage('Field can\'t be empty')
        .isLength({min: 6}).withMessage("must be 6 characters long"),
    body('email').custom(value => {
        return helper.database.table('usuario').filter({
            $or:
                [
                    {email: value}, {username: value.split("@")[0]}
                ]
        }).get().then(user => {
            if (user) {
                console.log(user);
                return Promise.reject('Email / Username already exists, choose another one.');
            }
        })
    })
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {

        let email = req.body.email;
        //let username = email.split("@")[0];
        let username = req.body.username;
        let password = await bcrypt.hash(req.body.password, 10);
        let idPersona = req.body.idPersona
        //let fname = req.body.fname;
        //let lname = req.body.lname;

        /**
         * ROLE 777 = ADMIN
         * ROLE 555 = CUSTOMER
         **/
        helper.database.table('usuario').insert({
            username: username,
            password: password,
            email: email,
            persona_id : 1
            //role: 555,
            //lname: lname || null,
            //fname: fname || null
        }).then(lastId => {
            if (lastId > 0) {
                res.status(201).json({message: 'Registration successful.'});
            } else {
                res.status(501).json({message: 'Registration failed.'});
            }
        }).catch(err => res.status(433).json({error: err}));
    }
});


module.exports = router;
