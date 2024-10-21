const { DataTypes } = require('sequelize');
const sequelize = require('./config');


const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfSale: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    sold: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, { timestamps: false });

module.exports = Transaction;
