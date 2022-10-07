const Usuario=require('../models/usuario');

const esAdminRole = (req,res, next) =>{

    if(!req.usuario){
        return res.status(500).json({
            msg:"Se quiere verificar role sin validar el token primero"
        })
    }
    
    const {rol, nombre} = req.usuario;

    if (rol!=='ADMIN_ROL'){
        return res.status(401).json({
            msg: `${nombre} no es administrador`
        })
    }
    next();

}


const tieneRole = (...roles) =>{
    return (req,res,next) =>{
        if(!req.usuario){
            return res.status(500).json({
                msg:"Se quiere verificar role sin validar el token primero"
            })
        }
        if(!roles.includes(req.usuario.rol))
        {
            return res.status(401).json({
                msg: `El servicio requiere los roles ${roles}`
            })

        }
        
        next();


    }

}

module.exports={
    esAdminRole,
    tieneRole
}