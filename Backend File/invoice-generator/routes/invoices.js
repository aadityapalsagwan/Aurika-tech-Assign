const express = require('express');
const router = express.Router();

// Invoice Model
const Invoice = require('../models/Invoice');

// @route   POST /api/invoices
// @desc    Create an Invoice
// @access  Public
router.post('/', (req, res) => {
    const newInvoice = new Invoice(req.body);

    newInvoice.save()
        .then(invoice => res.json(invoice))
        .catch(err => res.status(400).json({ error: 'Unable to add this invoice' }));
});

// @route   GET /api/invoices/:id
// @desc    Get an Invoice by ID
// @access  Public
router.get('/:id', (req, res) => {
    console.log("Start")
    Invoice.findById(req.params.id)
        .then(invoice => res.json(invoice))
        .catch(err => res.status(404).json({ error: 'No such invoice' }));
});

module.exports = router;
