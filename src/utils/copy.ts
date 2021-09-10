import { ElMessage } from 'element-plus'
export default function copyUrl(val:string) {
  const oInput = document.createElement("input");
  oInput.value = val;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象
  document.execCommand("Copy"); // 执行浏览器复制命令
  oInput.remove();
  ElMessage({
    type: "success",
    message: "链接复制成功!",
    showClose: true,
  });
}