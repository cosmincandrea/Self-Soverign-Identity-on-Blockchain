const { DataTypes } = require('sequelize');

var sequelize = global.db_seq; 

const Contract = sequelize.define('Contract', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  abi: {
    type: DataTypes.TEXT,  
    allowNull: false,
    get() {
      return JSON.parse(this.getDataValue('abi'));  
    },
    set(value) {
      this.setDataValue('abi', JSON.stringify(value));  
    }
  }
}, {
  timestamps: false  
});

module.exports = Contract;
