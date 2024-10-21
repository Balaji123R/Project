import React, { useState } from 'react';
import TransactionTable from './pages/TransactionTable'
import Statistics from './pages/Statistics';
import BarChart from './pages/Barchart';
import PieChart from './pages/PieChart';



const App = () => {
    const [month, setMonth] = useState('January');

    return (
        <div className="App">
            <h1>MERN Stack Transactions Application</h1>
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>

            <TransactionTable month={month} />
            <Statistics month={month} />
            <BarChart month={month} />
            <PieChart month={month} />
        </div>
    );
};

export default App;
