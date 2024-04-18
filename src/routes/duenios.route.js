const express = require('express');
const router = express.Router();
const dueniosController = require('../controllers/duenios.controller');

router.get('/', dueniosController.index);
router.get('/:id', dueniosController.getById);
router.post('/', dueniosController.create);
router.delete('/:id', dueniosController.delete);
router.patch('/:id', dueniosController.update);

module.exports = router;