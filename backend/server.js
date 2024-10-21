const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { Op } = require('sequelize');
const sequelize = require('./config');  
const Transaction = require('./model');  

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;


sequelize.sync().then(() => {
    console.log('MySQL database synced');
}).catch(err => console.error('Error syncing MySQL database:', err));


app.get('/api/init', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        await Transaction.destroy({ where: {} }); 
        await Transaction.bulkCreate(transactions); 

        res.status(200).json({ message: 'Database initialized with transaction data' });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching and seeding data' });
    }
});


app.get('/api/transactions', async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;

    let query = {};
    if (month) {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(`${month}-31`);
        query.dateOfSale = { [Op.between]: [startDate, endDate] };
    }
    if (search) {
        query = {
            ...query,
            [Op.or]: [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { price: { [Op.like]: `%${search}%` } },
            ]
        };
    }

    try {
        const transactions = await Transaction.findAll({
            where: query,
            offset: (page - 1) * perPage,
            limit: parseInt(perPage),
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
});


app.get('/api/statistics', async (req, res) => {
    const { month } = req.query;
    let query = {};
    if (month) {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(`${month}-31`);
        query.dateOfSale = { [Op.between]: [startDate, endDate] };
    }

    try {
        const totalSale = await Transaction.sum('price', { where: query });
        const totalSold = await Transaction.count({ where: { ...query, sold: true } });
        const totalNotSold = await Transaction.count({ where: { ...query, sold: false } });

        res.json({
            totalSale: totalSale || 0,
            totalSold: totalSold || 0,
            totalNotSold: totalNotSold || 0
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching statistics' });
    }
});


app.get('/api/bar-chart', async (req, res) => {
    const { month } = req.query;
    let query = {};
    if (month) {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(`${month}-31`);
        query.dateOfSale = { [Op.between]: [startDate, endDate] };
    }

    const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: 1000000 },
    ];

    try {
        const result = await Promise.all(priceRanges.map(async (range) => {
            const count = await Transaction.count({
                where: { ...query, price: { [Op.between]: [range.min, range.max] } }
            });
            return { range: range.range, count };
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching bar chart data' });
    }
});


app.get('/api/pie-chart', async (req, res) => {
    const { month } = req.query;
    let query = {};
    if (month) {
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(`${month}-31`);
        query.dateOfSale = { [Op.between]: [startDate, endDate] };
    }

    try {
        const categories = await Transaction.findAll({
            where: query,
            attributes: ['category', [sequelize.fn('count', sequelize.col('category')), 'count']],
            group: ['category']
        });

        res.json(categories.map(cat => ({ category: cat.category, count: cat.dataValues.count })));
    } catch (error) {
        res.status(500).json({ error: 'Error fetching pie chart data' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
