const express = require('express');
const router = express.Router();
const cachorrosController = require('../controllers/cachorros.controller');

router.get('/', cachorrosController.index);
router.get('/:id', cachorrosController.getById);
router.post('/', cachorrosController.create);
router.delete('/:id', cachorrosController.delete);
router.patch('/:id', cachorrosController.update);

module.exports = router;