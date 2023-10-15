const { Sequelize } = require('sequelize');
const mentionModel = require("./mention.js")
const userModel = require("./user.js")
module.exports = class DB {
  sequelize
  mention
  user
  constructor() {
    this.init()
  }
  init() {
    try {
      this.sequelize = new Sequelize({
        dialect: 'mysql',
        define: { // sequelize.define() 或 Model.init() 的默认选项
          charset: 'utf8',
          timestamps: false, // 添加updatedAt,createdAt属性
          paranoid: false, // 若为true，将不实际删除记录，而是设置一个新的deletedAt属性，设为false则实际删除记录
          underscored: false, // 若为true，自动设置字段为蛇型命名规则，不会覆盖已定义的字段属性
          freezeTableName: true, // 固定表名，禁止自动修改表名，默认情况下sequelize会自动将表名改为模型名称的复数形式(如User -> users)
          version: true // 启用乐观锁
        },
        sync: {
          alter: true, // 允许添加新字段
          force: false // 若为true，每次同步模型之前会执行DROP TABLE IF EXISTS，强制删掉以前的表数据
        },
        logging: console.log,
        benchmark: true, // 传递每一次执行查询的时长给logging函数
        pool: {
          max: 10, // 连接池最大连接数
          min: 1, // 连接池最小连接数
          idle: 10000, // 空闲连接时长到达多少以后释放该连接
          acquire: 60000, // 试图连接数据库的最大时长
          evict: 1000 // 释放空闲连接的检测间隔
        }
      })
    } catch (error) {
      console.error(error)
    }
    this.mention = this.sequelize.define("mention", mentionModel)
    this.user = this.sequelize.define("user", userModel)
  }
  async syncModel() {
    await this.mention.sync({ alter: { drop: false } })
    await this.user.sync({ alter: { drop: false } })
  }
}