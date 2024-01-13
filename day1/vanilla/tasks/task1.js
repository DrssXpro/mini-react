// task1: 将 app 内容展示到 root 容器里
const container = document.querySelector("#root");

const box = document.createElement("div");
box.id = "app";

const text = document.createTextNode("");
text.textContent = "app";

box.append(text);
container.append(box);
