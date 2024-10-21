
import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';  
import {
    Chart as ChartJS,
    CategoryScale,    
    LinearScale,      
    BarElement,       
    ArcElement,       
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import api from './api';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = ({ month }) => {
    const [data, setData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetchBarChartData();
    }, [month]);

    const fetchBarChartData = async () => {
        try {
            const response = await api.get('/bar-chart', { params: { month } });
            const labels = response.data.map(item => item.range);
            const values = response.data.map(item => item.count);

            setData({
                labels,
                datasets: [
                    {
                        label: 'Number of items',
                        data: values,
                        backgroundColor: 'rgba(75,192,192,0.6)',
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
        }
    };

    return (
        <div>
            <h3>Price Range Bar Chart for {month}</h3>
            <Bar data={data} />
        </div>
    );
};

export default BarChart;
