const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Routes pour les utilisateurs
router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:userId', UserController.getUserById);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);

module.exports = router;