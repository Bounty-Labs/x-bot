const shadowsocks = require('shadowsocks');

// 配置 Shadowsocks 代理服务器信息
const config = {
  server: 'pic2.zhimg.com.e3020.com', // 代理服务器地址
  serverPort: 35157, // 代理服务器端口
  localPort: 1080, // 本地端口
  password: 'dd6b85ef-6607-4929-bac7-a66d55ea1057', // 密码
  method: 'chacha20-ietf-poly1305', // 加密方法
};

// 创建 Shadowsocks 代理客户端
const ssClient = new shadowsocks.Client(config);

// 监听代理客户端的事件
ssClient.on('connect', () => {
  console.log('Connected to Shadowsocks proxy server');
  // 在此处执行您的网络请求或其他操作
});

ssClient.on('error', (err) => {
  console.error('Error connecting to Shadowsocks proxy server:', err);
});

// 启动代理客户端
ssClient.start();
