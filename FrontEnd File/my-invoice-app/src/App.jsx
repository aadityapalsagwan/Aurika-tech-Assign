// import React from 'react';
import InvoiceForm from './Components/InvoiceForm';
import './App.css';

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Invoice Generator</h1>
            </header>
            <main>
                <InvoiceForm />
            </main>
        </div>
    );
};

export default App;
