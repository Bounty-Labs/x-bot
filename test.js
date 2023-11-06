/* var Agent = require('socks5-http-client/lib/Agent');
const axios = require("axios")
axios({
  url: 'http://en.wikipedia.org/wiki/SOCKS',
  agentClass: Agent,
  agentOptions: {
    socksHost: 'pic2.zhimg.com.e3020.com', // Defaults to 'localhost'.
    socksPort: 35157, // Defaults to 1080.
    encryption: 'aes-256-cfb',
    password: 'dd6b85ef-6607-4929-bac7-a66d55ea1057'
  }
}, function (err, res) {
  console.log(err || res.body);
}); */
const axios = require("axios")
const { SocksProxyAgent } = require('socks-proxy-agent');
const proxyOptions = `socks5://127.0.0.1:10808`; // your sock5 host and port;
const httpsAgent = new SocksProxyAgent(proxyOptions);
axios({
  // httpsAgent,
  proxy: {
    protocol: 'http',
    host: '127.0.0.1',
    port: 10809
    // host: '192.168.8.28',
    // port: 6666
  },
  method: 'GET',
  url: 'https://www.google.com/',
  //...
}).then(e => {
  console.log(e, 222)
}).catch(err => {
  console.log(err, 22222)
})