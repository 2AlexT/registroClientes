const express = require('express');
const abogadosController= require('./../controllers/abogadosController');
const authController = require('./../controllers/authController')


const router= express.Router({mergeParams:true});



router
.route('/')
.get(authController.protect,abogadosController.getAllCliente)
.post(abogadosController.createCliente);
router
.route(`/:id`).get(abogadosController.getCliente).patch(abogadosController.patchClientes).delete(authController.protect,authController.restricTo('admin'),abogadosController.deleteCliente);

module.exports = router;