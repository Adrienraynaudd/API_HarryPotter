const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticateToken } = require('../middlewares/auth');
// Routes pour les utilisateurs
router.post('/', UserController.createUser);
router.post('/login', UserController.login);
router.get('/',authenticateToken, UserController.getAllUsers);
router.get('/:userId',authenticateToken, UserController.getUserById);
router.put('/:userId',authenticateToken, UserController.updateUser);
router.delete('/:userId',authenticateToken, UserController.deleteUser);

module.exports = router;
