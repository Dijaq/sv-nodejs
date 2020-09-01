const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Shop API",
            description: "Backend Api",
            contact: {
                name: 'Amazing Developer'
            },
            servers: "http://localhost:3638"
        }
    },
    apis: ["app.js", ".routes/*.js"]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


/* CORS */
app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const personaRouter = require('./routes/personas');
const tipoDocumentoRouter = require('./routes/tipoDocumento');
const marcaRouter = require('./routes/marca');
const lineaRouter = require('./routes/linea');
const unidadMedidaRouter = require('./routes/unidadMedida');
const productosRouter = require('./routes/producto') 
const ordenCompraRouter = require('./routes/ordenCompra') 
const tipoComprobanteRouter = require('./routes/tipoComprobante')
const sucursalRouter = require('./routes/sucursal');
const articuloRouter = require('./routes/articulos');
const comprobanteRouter = require('./routes/comprobantes');
const homeRouter = require('./routes/home');
const ordenEntradaSalida = require('./routes/ordenEntradaSalida');
const authentication = require('./routes/auth');

app.use('/api/personas', personaRouter);
app.use('/api/tipoDocumentos', tipoDocumentoRouter);
app.use('/api/marcas', marcaRouter);
app.use('/api/lineas', lineaRouter);
app.use('/api/unidadesMedida', unidadMedidaRouter);
app.use('/api/productos', productosRouter);
app.use('/api/ordenesCompra', ordenCompraRouter);
app.use('/api/tipoComprobantes', tipoComprobanteRouter);
app.use('/api/sucursales', sucursalRouter);
app.use('/api/articulos', articuloRouter);
app.use('/api/comprobantes', comprobanteRouter);
app.use('/api/home', homeRouter);
app.use('/api/ordenEntradaSalida', ordenEntradaSalida);
app.use('/api/auth', authentication);




// Import Routes
/*const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const orderRouter = require('./routes/order');
*/
// Define Routes
/**
 * @swagger
 * /api/products:
 *   get:
 *    description: Get All Products
 *
 */

/*app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);*/

module.exports = app;
