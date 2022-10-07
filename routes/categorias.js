const {Router, response } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, tieneRole } = require('../middlewares');

const {crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria} = require('../controllers/categorias');

const {existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();


//Obtener todas las categorías - publico
router.get('/',obtenerCategorias);

//Obtener una categoria por id
router.get('/:id',[
    check('id','No es un id de mongo').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],obtenerCategoria);

//crear una categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);

//actualizar una categoria - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
    ],actualizarCategoria);

//Borra categoria - Admin

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROL'),
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos

],borrarCategoria);



module.exports=router;