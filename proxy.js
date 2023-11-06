const axios = require("axios")
require('dotenv').config()
const fs = require("fs")
const getSubscribe = async () => {
  try {
    const data = await axios(process.env.EEVPN)
    const rawStr = Buffer.from(data.data, 'base64').toString()
    console.log(rawStr)
    const arr = rawStr.split("\r\n")
    const list = []
    arr.forEach(str => {
      if (!str) return
      str = decodeURIComponent(str)
      console.log(str)
      const obj = {}
      const resList = str.match(/ss:\/\/(.*)@(.*):(\d*)#(.*)/)
      // console.log(3334, str, resList)
      obj.protocol = "ss";
      [obj.encryption, obj.password] = Buffer.from(resList[1], 'base64').toString().split(":")
      obj.host = resList[2]
      obj.port = resList[3]
      obj.remark = `eevpn-${resList[4]}`
      // console.log(333, obj)
      if (/^\d*$/.test(obj.remark.slice(-2))) {
        list.push(obj)
      }
    })
    fs.writeFileSync('./account/proxy.json', JSON.stringify(list));
    console.log(list)
  } catch (error) {
    console.error(error)
  }
}
getSubscribe()