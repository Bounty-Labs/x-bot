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
const proxyOptions = `socks5://127.0.0.1:10818`; // your sock5 host and port;
// const proxyOptions = "socks5://chacha20-ietf-poly1305:dd6b85ef-6607-4929-bac7-a66d55ea1057@pic2.zhimg.com.e3020.com:28000#香港 03"
const httpsAgent = httpAgent = new SocksProxyAgent(proxyOptions);
axios({
  httpsAgent,
  httpAgent,
  method: 'GET',
  url: 'https://x.com/',
}).then(e => {
  console.log(e, "succeed")
}).catch(err => {
  console.log(err && err.response, err && err.response && err && err.response.status, 22222)
})