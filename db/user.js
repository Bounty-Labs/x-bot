const { DataTypes } = require('sequelize')
module.exports = {
  user_id_str: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  followers_count: {
    type: DataTypes.INTEGER,
  },
  screen_name: {
    type: DataTypes.STRING,
  },
  update_at: {
    type: DataTypes.STRING,
  }
}