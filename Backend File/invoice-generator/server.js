const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/invoiceGenerator', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const invoices = require('./routes/invoices');

// Use routes
app.use('/api/invoices', invoices);

app.listen(port, () => console.log(`Server running on port ${port}`));
