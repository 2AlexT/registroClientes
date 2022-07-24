const express = require('express');
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const registradosClientes = require('./../routes/registrarAbogadosRoutes')

const router = express.Router();



router.get('/me',authController.protect,userController.getMe,userController.getUser);

router.use('/:_id/registrarAbogados',registradosClientes);
//router de signup
router.post('/signup',authController.signup);
router.post('/login',authController.login);

router.route(`/`).get(userController.getAllUsers).post(userController.createUser);
router.route(`/:id`).get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);


module.exports = router;