import { ElMessageBox } from "element-plus";
let currentVersion = "";

// 定义一个函数用于获取最新版本号
async function getLatestVersion(): Promise<string> {
  const response = await fetch("/version.json");
  const json = await response.json();
  return json.version;
}
let timerId;
const DURATION = 2000;
// 检查版本号并提示用户更新的函数
async function checkUpdate() {
  const latestVersion = await getLatestVersion();

  if (latestVersion && latestVersion !== currentVersion) {
    return ElMessageBox.confirm("有新版本可用，点击确认刷新页面", "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "忽略",
      type: "warning",
    })
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        clearTimeout(timerId);
      });
  }
  // 设置定时器，在 20 秒后再次执行检查更新
  timerId = setTimeout(checkUpdate, DURATION);
}

// 初始化函数，获取当前版本号并启动检查更新
async function initialize() {
  currentVersion = await getLatestVersion();
  checkUpdate();
}

// 调用初始化函数
initialize();
