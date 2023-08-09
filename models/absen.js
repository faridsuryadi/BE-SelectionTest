'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Absen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Absen.belongsTo(models.User)
      Absen.belongsTo(models.Role)
    }
  }
  Absen.init({
    date: {
      type: DataTypes.DATEONLY,
    },
    clock_in: {
      type: DataTypes.DATE,
    },
    clock_out: {
      type:DataTypes.DATE,
    },
    dailySalary: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Absen',
  });
  return Absen;
};