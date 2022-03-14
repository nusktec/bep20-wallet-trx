const {Sequelize, Model, DataTypes} = require('sequelize');
//declaration
const sequelize = new Sequelize({dialect: 'sqlite', storage: 'db.sqlite'});

//trx tables
class TRX_Table extends Model {
}
//attributes
TRX_Table.init(
    {
        id: {autoIncrement: true, primaryKey: true, type: DataTypes.INTEGER},
        hash: {allowNull: false, type: DataTypes.TEXT, unique: true},
        initialUnit: {allowNull: false, type: DataTypes.INTEGER},
        status: {defaultValue: 0, type: DataTypes.INTEGER}
    }, {sequelize, modelName: 'Trx_table'});
//synchronize it
TRX_Table.sync();
module.exports = {TRX_Table, sequelize, Sequelize, timestamp: true};