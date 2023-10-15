const { DataTypes } = require('sequelize')
module.exports = {
  created_at: {
    type: DataTypes.STRING,
  },
  id: {
    type: DataTypes.BIGINT,
  },
  id_str: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  full_text: {
    type: DataTypes.STRING,
  },
  truncated: {
    type: DataTypes.BOOLEAN,
  },
  display_text_range: {
    type: DataTypes.JSON,
  },
  entities: {
    type: DataTypes.JSON,
  },
  source: {
    type: DataTypes.STRING,
  },
  in_reply_to_status_id: {
    type: DataTypes.BIGINT,
  },
  in_reply_to_status_id_str: {
    type: DataTypes.STRING,
  },
  in_reply_to_user_id: {
    type: DataTypes.BIGINT,
  },
  in_reply_to_user_id_str: {
    type: DataTypes.STRING,
  },
  in_reply_to_screen_name: {
    type: DataTypes.STRING,
  },
  user_id: {
    type: DataTypes.BIGINT,
  },
  user_id_str: {
    type: DataTypes.STRING,
  },
  geo: {
    type: DataTypes.STRING,
  },
  coordinates: {
    type: DataTypes.STRING,
  },
  place: {
    type: DataTypes.STRING,
  },
  contributors: {
    type: DataTypes.STRING,
  },
  is_quote_status: {
    type: DataTypes.BOOLEAN,
  },
  retweet_count: {
    type: DataTypes.INTEGER,
  },
  favorite_count: {
    type: DataTypes.INTEGER,
  },
  reply_count: {
    type: DataTypes.INTEGER,
  },
  quote_count: {
    type: DataTypes.INTEGER,
  },
  conversation_id: {
    type: DataTypes.BIGINT,
  },
  conversation_id_str: {
    type: DataTypes.STRING,
  },
  conversation_muted: {
    type: DataTypes.BOOLEAN,
  },
  favorited: {
    type: DataTypes.BOOLEAN,
  },
  retweeted: {
    type: DataTypes.BOOLEAN,
  },
  lang: {
    type: DataTypes.STRING,
  },
  ext: {
    type: DataTypes.JSON,
  }
}