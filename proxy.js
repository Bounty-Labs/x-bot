const axios = require("axios")
require('dotenv').config()
const fs = require("fs")
const template = {
  "inbounds": [
    {
      "tag": "socks",
      "port": 10818,
      "listen": "127.0.0.1",
      "protocol": "socks",
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      },
      "settings": {
        "auth": "noauth",
        "udp": true,
        "allowTransparent": false
      }
    },
    {
      "tag": "http",
      "port": 10819,
      "listen": "127.0.0.1",
      "protocol": "http",
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      },
      "settings": {
        "auth": "noauth",
        "udp": true,
        "allowTransparent": false
      }
    },
    {
      "tag": "api",
      "port": 50129,
      "listen": "127.0.0.1",
      "protocol": "dokodemo-door",
      "settings": {
        "udp": false,
        "address": "127.0.0.1",
        "allowTransparent": false
      }
    }
  ],
  "outbounds": [
    {
      "tag": "proxy",
      "protocol": "shadowsocks",
      "settings": {
        "servers": []
      },
      "streamSettings": {
        "network": "tcp"
      },
      "mux": {
        "enabled": false,
        "concurrency": -1
      }
    },
    {
      "tag": "direct",
      "protocol": "freedom",
      "settings": {}
    },
    {
      "tag": "block",
      "protocol": "blackhole",
      "settings": {
        "response": {
          "type": "http"
        }
      }
    }
  ],
  "stats": {},
  "api": {
    "tag": "api",
    "services": [
      "StatsService"
    ]
  },
  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "rules": [
      {
        "type": "field",
        "inboundTag": [
          "api"
        ],
        "outboundTag": "api",
        "enabled": true
      },
      {
        "type": "field",
        "outboundTag": "direct",
        "domain": [
          "domain:example-example.com",
          "domain:example-example2.com"
        ],
        "enabled": true
      },
      {
        "type": "field",
        "outboundTag": "block",
        "domain": [
          "geosite:category-ads-all"
        ],
        "enabled": true
      },
      {
        "type": "field",
        "outboundTag": "direct",
        "domain": [
          "geosite:cn"
        ],
        "enabled": true
      },
      {
        "type": "field",
        "outboundTag": "direct",
        "ip": [
          "geoip:private",
          "geoip:cn"
        ],
        "enabled": true
      },
      {
        "type": "field",
        "port": "0-65535",
        "outboundTag": "proxy",
        "enabled": true
      }
    ]
  }
}
const getSubscribe = async () => {
  try {
    const data = await axios(process.env.EEVPN)
    const rawStr = Buffer.from(data.data, 'base64').toString()
    console.log(rawStr)
    const arr = rawStr.split("\r\n")
    // const list = []
    arr.forEach(str => {
      if (!str) return
      str = decodeURIComponent(str)
      console.log(str)
      const obj = {
        ota: false,
        level: 1,
      }
      const resList = str.match(/ss:\/\/(.*)@(.*):(\d*)#(.*)/);
      // console.log(3334, str, resList)
      [obj.method, obj.password] = Buffer.from(resList[1], 'base64').toString().split(":")
      obj.address = resList[2]
      obj.port = Number(resList[3])
      obj.remark = `eevpn-${resList[4]}`
      template.outbounds[0].settings.servers[0] = obj
      fs.writeFileSync(`./v2ray-config/${obj.remark}.json`, JSON.stringify(template));
    })

    // console.log(list)
  } catch (error) {
    console.error(error)
  }
}
getSubscribe()
