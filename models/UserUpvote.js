// junction table between user and upvotes of responses
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class UserUpvote extends Model {}

UserUpvote.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    response_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'response',
        key: 'id'
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'userupvote'
  }
);

module.exports = UserUpvote;
