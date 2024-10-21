import React, { useState, useEffect } from 'react';
import api from './api';

const Statistics = ({ month }) => {
    const [statistics, setStatistics] = useState({ totalSale: '', totalSold: '', totalNotSold: '' });

    useEffect(() => {
        fetchStatistics();
    }, [month]);

    const fetchStatistics = async () => {
        try {
            const response = await api.get('/statistics', { params: { month } });
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    return (
        <div>
            <h3>Statistics for {month}</h3>
            <p>Total Sale: {statistics.totalSale}</p>
            <p>Total Sold Items: {statistics.totalSold}</p>
            <p>Total Not Sold Items: {statistics.totalNotSold}</p>
        </div>
    );
};

export default Statistics;
