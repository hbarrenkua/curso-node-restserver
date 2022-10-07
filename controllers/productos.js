const { response } = require("express")
const {Producto} = require('../models');


const obtenerProductos = async (req,res) =>{

    const {limite=5, desde=0 } = req.query;

    const query={estado:true}
  
  
    const [total, productos] = await Promise.all([
      Producto.countDocuments(query)   ,
      Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate('usuario','nombre')
      .populate('categoria','nombre')

    ])
  
    res.json({
      total, 
      productos
      })
}





const obtenerProducto = async (req, res) => {

    const {id}= req.params;


    const producto= await Producto.findById (id)
        .populate('usuario','nombre')
        .populate('categoria','nombre');

    res.json({
        producto
    })
  }









const crearProducto= async (req,res=response)=>{

    const {estado, usuario, ...body}= req.body;
    const data = body;

    data.nombre= data.nombre.toUpperCase();
    data.usuario= req.usuario._id
    console.log(data);

    
    const productoDB = await Producto.findOne({nombre:data.nombre});


    if(productoDB){
        return res.status(400).json({
            msg:`El producto ${productoDB.nombre}, ya existe`
        });
    }

    // Generar la data

    

    const producto =  new Producto(data);

    // guardar

    await producto.save();

    res.status(201).json(
        producto
    );


}


//actualizarProducto

const actualizarProducto = async (req, res) => {

    const {id}= req.params;
    const {_id,estado, usuario, ...data} = req.body;


    //TODO validar contra base de datos
    if (data.nombre)
    {
        data.nombre= data.nombre.toUpperCase();
    }
    data.usuario= req.usuario._id

    const producto= await Producto.findByIdAndUpdate (id,data,{new:true});

    res.json({
        producto
    })
  }


//borrarProducto

const borrarProducto =async (req, res) => {

    const {id}= req.params;

    const producto = await Producto.findByIdAndUpdate(id,{estado:false},{new:true});
    
    res.json({
        producto
    })
  }


module.exports={
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}