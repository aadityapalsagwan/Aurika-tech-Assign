import  { useState } from 'react';
import axios from 'axios';
import './InvoiceForm.css';

const InvoiceForm = () => {
    const [invoice, setInvoice] = useState({
        sellerDetails: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            panNo: '',
            gstNo: ''
        },
        placeOfSupply: '',
        billingDetails: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            stateCode: ''
        },
        shippingDetails: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            stateCode: ''
        },
        placeOfDelivery: '',
        orderDetails: {
            orderNo: '',
            orderDate: ''
        },
        invoiceDetails: {
            invoiceNo: '',
            invoiceDate: ''
        },
        reverseCharge: false,
        items: [{
            description: '',
            unitPrice: 0,
            quantity: 0,
            discount: 0,
            netAmount: 0,
            taxType: '',
            taxAmount: 0,
            totalAmount: 0,
            taxRate: 18
        }],
        signatureImage: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [section, key] = name.split('.');

        if (key) {
            setInvoice({
                ...invoice,
                [section]: { ...invoice[section], [key]: value }
            });
        } else {
            setInvoice({ ...invoice, [name]: value });
        }
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const items = [...invoice.items];
        items[index][name] = value;

        // Compute derived values
        items[index].netAmount = items[index].unitPrice * items[index].quantity - items[index].discount;

        if (invoice.placeOfSupply === invoice.placeOfDelivery) {
            items[index].taxType = 'CGST/SGST';
            items[index].taxAmount = (items[index].netAmount * items[index].taxRate) / 2 / 100;
            items[index].totalAmount = items[index].netAmount + 2 * items[index].taxAmount;
        } else {
            items[index].taxType = 'IGST';
            items[index].taxAmount = (items[index].netAmount * items[index].taxRate) / 100;
            items[index].totalAmount = items[index].netAmount + items[index].taxAmount;
        }

        setInvoice({ ...invoice, items });
    };

    const addItem = () => {
        setInvoice({
            ...invoice,
            items: [...invoice.items, {
                description: '',
                unitPrice: 0,
                quantity: 0,
                discount: 0,
                netAmount: 0,
                taxType: '',
                taxAmount: 0,
                totalAmount: 0,
                taxRate: 18
            }]
        });
    };

    const handleFileChange = (e) => {
        setInvoice({ ...invoice, signatureImage: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(invoice).forEach(key => {
            if (key === 'items') {
                formData.append(key, JSON.stringify(invoice[key]));
            } else if (key === 'signatureImage') {
                formData.append(key, invoice[key]);
            } else {
                formData.append(key, JSON.stringify(invoice[key]));
            }
        });

        axios.post('http://localhost:5000/api/invoices', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
    };

    const totalNetAmount = invoice.items.reduce((sum, item) => sum + item.netAmount, 0);
    const totalTaxAmount = invoice.items.reduce((sum, item) => sum + item.taxAmount * (item.taxType === 'CGST/SGST' ? 2 : 1), 0);
    const totalAmount = invoice.items.reduce((sum, item) => sum + item.totalAmount, 0);

    const amountInWords = (num) => {
        // Function to convert amount to words (implement a proper function or use a library for this)
        return num.toFixed(2); // Placeholder
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Seller Details</h2>
            <input type="text" name="sellerDetails.name" placeholder="Name" onChange={handleChange} />
            <input type="text" name="sellerDetails.address" placeholder="Address" onChange={handleChange} />
            <input type="text" name="sellerDetails.city" placeholder="City" onChange={handleChange} />
            <input type="text" name="sellerDetails.state" placeholder="State" onChange={handleChange} />
            <input type="text" name="sellerDetails.pincode" placeholder="Pincode" onChange={handleChange} />
            <input type="text" name="sellerDetails.panNo" placeholder="PAN No." onChange={handleChange} />
            <input type="text" name="sellerDetails.gstNo" placeholder="GST No." onChange={handleChange} />

            <h2>Place of Supply</h2>
            <input type="text" name="placeOfSupply" placeholder="Place of Supply" onChange={handleChange} />

            <h2>Billing Details</h2>
            <input type="text" name="billingDetails.name" placeholder="Name" onChange={handleChange} />
            <input type="text" name="billingDetails.address" placeholder="Address" onChange={handleChange} />
            <input type="text" name="billingDetails.city" placeholder="City" onChange={handleChange} />
            <input type="text" name="billingDetails.state" placeholder="State" onChange={handleChange} />
            <input type="text" name="billingDetails.pincode" placeholder="Pincode" onChange={handleChange} />
            <input type="text" name="billingDetails.stateCode" placeholder="State/UT Code" onChange={handleChange} />

            <h2>Shipping Details</h2>
            <input type="text" name="shippingDetails.name" placeholder="Name" onChange={handleChange} />
            <input type="text" name="shippingDetails.address" placeholder="Address" onChange={handleChange} />
            <input type="text" name="shippingDetails.city" placeholder="City" onChange={handleChange} />
            <input type="text" name="shippingDetails.state" placeholder="State" onChange={handleChange} />
            <input type="text" name="shippingDetails.pincode" placeholder="Pincode" onChange={handleChange} />
            <input type="text" name="shippingDetails.stateCode" placeholder="State/UT Code" onChange={handleChange} />

            <h2>Place of Delivery</h2>
            <input type="text" name="placeOfDelivery" placeholder="Place of Delivery" onChange={handleChange} />

            <h2>Order Details</h2>
            <input type="text" name="orderDetails.orderNo" placeholder="Order No." onChange={handleChange} />
            <input type="date" name="orderDetails.orderDate" placeholder="Order Date" onChange={handleChange} />

            <h2>Invoice Details</h2>
            <input type="text" name="invoiceDetails.invoiceNo" placeholder="Invoice No." onChange={handleChange} />
            <input type="date" name="invoiceDetails.invoiceDate" placeholder="Invoice Date" onChange={handleChange} />

            <h2>Items</h2>
            {invoice.items.map((item, index) => (
                <div key={index}>
                    <input type="text" name="description" placeholder="Description" onChange={(e) => handleItemChange(index, e)} />
                    <input type="number" name="unitPrice" placeholder="Unit Price" onChange={(e) => handleItemChange(index, e)} />
                    <input type="number" name="quantity" placeholder="Quantity" onChange={(e) => handleItemChange(index, e)} />
                    <input type="number" name="discount" placeholder="Discount" onChange={(e) => handleItemChange(index, e)} />
                    <input type="number" name="netAmount" value={item.netAmount} readOnly />
                    <input type="text" name="taxType" value={item.taxType} readOnly />
                    <input type="number" name="taxAmount" value={item.taxAmount} readOnly />
                    <input type="number" name="totalAmount" value={item.totalAmount} readOnly />
                </div>
            ))}
            <button type="button" onClick={addItem}>Add Item</button>

            <h2>Total</h2>
            <p>Total Net Amount: {totalNetAmount}</p>
            <p>Total Tax Amount: {totalTaxAmount}</p>
            <p>Total Amount: {totalAmount}</p>
            <p>Amount in Words: {amountInWords(totalAmount)}</p>

            <h2>Signature</h2>
            <input type="file" name="signatureImage" onChange={handleFileChange} />

            <button type="submit">Submit Invoice</button>
        </form>
    );
};

export default InvoiceForm;
