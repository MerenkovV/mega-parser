const sequelize = require("../db");
const { DataTypes, STRING, INTEGER, BOOLEAN, TEXT } = require("sequelize");

const House = sequelize.define("house", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  description: { type: TEXT, allowNull: false },
  number: { type: INTEGER, allowNull: false },
  address: { type: STRING, allowNull: false },
  price: { type: STRING, allowNull: false },
  right: { type: BOOLEAN, allowNull: false },
  favorite: { type: BOOLEAN, allowNull: false, defaultValue: "false" },
});

const Images = sequelize.define("images", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  link: { type: STRING },
});

House.hasMany(Images);
Images.belongsTo(House);

module.exports = {
  House,
  Images,
};
