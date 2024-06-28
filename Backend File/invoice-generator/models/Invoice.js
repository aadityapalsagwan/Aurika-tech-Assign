const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    description: String,
    unitPrice: Number,
    quantity: Number,
    discount: Number,
    taxRate: Number,
    netAmount: Number
});

const InvoiceSchema = new Schema({
    sellerDetails: {
        name: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        panNo: String,
        gstNo: String
    },
    placeOfSupply: String,
    billingDetails: {
        name: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        stateCode: String
    },
    shippingDetails: {
        name: String,
        address: String,
        city: String,
        state: String,
        pincode: String,
        stateCode: String
    },
    placeOfDelivery: String,
    orderDetails: {
        orderNo: String,
        orderDate: Date
    },
    invoiceDetails: {
        invoiceNo: String,
        invoiceDate: Date
    },
    reverseCharge: Boolean,
    items: [ItemSchema],
    signatureImage: String
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
