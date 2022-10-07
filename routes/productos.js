const {Router, response } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const {crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto} = require('../controllers/Productos');

const {existeCategoriaPorId , existeProductoPorId } = require('../helpers/db-validators');

const router = Router();


//Obtener todas las categorías - publico
router.get('/',obtenerProductos);

//Obtener una Producto por id
router.get('/:id',[
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],obtenerProducto);

//crear una Producto - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un ID valido').isMongoId(),
    check('categoria','La categoría es obligatoria').not().isEmpty(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
],crearProducto);

//actualizar una Producto - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('id').custom(existeProductoPorId),
//    check('categoria','No es un ID valido').isMongoId(),
    validarCampos
    ],actualizarProducto);

//Borra Producto - Admin

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROL'),
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos

],borrarProducto);



module.exports=router;