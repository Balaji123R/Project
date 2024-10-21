import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,       
    Tooltip,
    Legend,
} from 'chart.js';
import api from './api';


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const PieChart = ({ month }) => {
    const [data, setData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetchPieChartData();
    }, [month]);

    const fetchPieChartData = async () => {
        try {
            const response = await api.get('/pie-chart', { params: { month } });
            const labels = response.data.map(item => item.category);
            const values = response.data.map(item => item.count);

            setData({
                labels,
                datasets: [
                    {
                        label: 'Categories',
                        data: values,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                            '#FF9F40'
                        ]
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching pie chart data:', error);
        }
    };

    return (
        <div>
            <h3>Category Distribution for {month}</h3>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;
