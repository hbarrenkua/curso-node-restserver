const {response, request} = require('express')
const bcryptjs = require('bcryptjs');

const Usuario=require('../models/usuario');

const usuariosGet = async(req=request, res = response) => {


  const {limite=5, desde=0 } = req.query;

  const query={estado:true}
  // const usuarios = await Usuario.find(query)
  //   .skip(Number(desde))
  //   .limit(Number(limite));
  // const total = await Usuario.countDocuments(query);   



  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query)   ,
    Usuario.find(query)
    .skip(Number(desde))
    .limit(Number(limite))
  ])

  res.json({
    total, 
    usuarios
    })
  }


  const usuariosPut = async (req, res) => {

    const {id}= req.params;
    const {_id, password,  google,correo, ...resto} = req.body;

    //TODO validar contra base de datos


    if(password){
      //encriptar contraseña
      const salt=bcryptjs.genSaltSync();
      resto.password=bcryptjs.hashSync(password,salt);

    }

    const usuario= await Usuario.findByIdAndUpdate (id,resto);

    res.json({
        usuario
    })
  }

  const usuariosPost = async (req, res) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});
    //verificar si el correo existe


    //encriptar contraseña
    const salt=bcryptjs.genSaltSync();
    usuario.password=bcryptjs.hashSync(password,salt);



    //guardar
    await usuario.save();
    res.status('201').json({
        usuario
    })
  }

  const usuariosDel =async (req, res) => {

    const {id}= req.params;

    
    // //Fiicamente lo borramos

    // const usuario = await Usuario.findByIdAndDelete( id);
    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false});
    const usuarioAtenticado = req.usuario;
    
    res.json({
        usuario,
        usuarioAtenticado
    })
  }
  const usuariosPatch =(req, res) => {
    res.json({
        msg: 'patch API - controlador'
    })
  }



module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosDel,
    usuariosPost,
    usuariosPatch        
}