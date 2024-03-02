// This model is a through/join table for Tag and Post
// It has a composite primary key that ensures unique combinations
// of tag_id and post_id (ie, you can't apply the same tag more than
// once to a given post)

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js');

class TagPost extends Model { }

TagPost.init(
  {
    tag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tag',
        key: 'id'
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'post',
        key: 'id'
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    timestamps: false,
    modelName: 'tagpost'
  }
);

module.exports = TagPost;
