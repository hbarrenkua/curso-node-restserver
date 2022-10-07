const { response } = require("express")
const {Categoria} = require('../models');


const obtenerCategorias = async (req,res) =>{

    const {limite=5, desde=0 } = req.query;

    const query={estado:true}
  
  
    const [total, categorias] = await Promise.all([
      Categoria.countDocuments(query)   ,
      Categoria.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate('usuario','nombre')
    ])
  
    res.json({
      total, 
      categorias
      })
}





const obtenerCategoria = async (req, res) => {

    const {id}= req.params;


    const categoria= await Categoria.findById (id)
        .populate('usuario','nombre');

    res.json({
        categoria
    })
  }









const crearCategoria= async (req,res=response)=>{

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg:`La categoría ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria =  new Categoria(data);

    // guardar

    await categoria.save();

    res.status(201).json(
        categoria
    );


}


//actualizarCategoria

const actualizarCategoria = async (req, res) => {

    const {id}= req.params;
    const _id = req.body._id;
    const nombre= req.body.nombre.toUpperCase()


    //TODO validar contra base de datos


    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria= await Categoria.findByIdAndUpdate (id,data,{new:true});

    res.json({
        categoria
    })
  }


//borrarCategoria

const borrarCategoria =async (req, res) => {

    const {id}= req.params;

    const categoria = await Categoria.findByIdAndUpdate(id,{estado:false},{new:true});
    
    res.json({
        categoria
    })
  }


module.exports={
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}