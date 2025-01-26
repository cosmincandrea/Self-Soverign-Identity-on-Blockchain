const { DataTypes } = require('sequelize');

var sequelize = global.db_seq; 

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false  
});

module.exports = User;
