const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('mernstack', 'root', 'Balaji@123', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => console.log('MySQL connected'))
    .catch(err => console.error('Unable to connect to MySQL:', err));

module.exports = sequelize;
