const child_process = require("child_process")
const controller = new AbortController();
const { signal } = controller;
child_process.execFile("./v2ray.exe", [`run`, `-config=../v2ray-config/eevpn-德国 01.json`], { cwd: "./bin", signal }, (error) => {
  console.error(333, error); // an AbortError
})