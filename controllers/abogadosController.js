
const AppError = require('../utils/appError');
const ClientesAbogados = require('./../models/clientesModel');
const catchAsync = require('./../utils/catchAsync');

//const abogados = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/abogados.json`));


exports.getAllCliente = catchAsync(async (req,res,next)=>{
    
        const queryObj = {...req.query}
        const excludeFields = ['nombre','archivo'];
        excludeFields.forEach(el=>delete queryObj[el]);
        //Sepuede usar un query para consumir despues y esto nos ayuda a crear metodos para verificar varios campos de busqueda de datos
      

        const clientes = await ClientesAbogados.find();
        res.status(200).
        json({
            status: 'success',
            results:clientes.length,
            data:{
                ClientesAbogados:clientes
            }
        })
  
})

exports.getCliente =catchAsync(async  (req,res,next)=>{
        const cliente = await ClientesAbogados.findOne({nroRegistro: req.params.id});
        //para filtar con el que quiera
        //ClientesAbogados.findOne({nroRegistro: req.params.nroRegsitro})
        //Field limiting
        if(!cliente){
            return next(new AppError('No Cliente encontrado con es NroDeRegistro'))
        }

        res.status(200).json({
            status:'success',
            data:{
                ClientesAbogados:cliente
            }
        })
       
})


exports.createCliente = catchAsync(async (req,res,next)=>{
    const newCliente = await ClientesAbogados.create(req.body);

    res.status(201).json({
        status: 'success',
        data:{
            ClientesAbogados: newCliente
        }
    });
    
});
//updateabogados
exports.patchClientes = catchAsync(async (req,res,next) =>{
        const clienteUpdated = await ClientesAbogados.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        })
        res.status(201).json({
            status: 'success',
            data:{
                ClientesAbogados: clienteUpdated
            }
        });
       
});

exports.deleteCliente = catchAsync(async(req,res,next)=>{
    await ClientesAbogados.findByIdAndDelete(req.params.id)
    res.status(204).json({
        status: 'succes',
        data:null
    }); 
   
});

