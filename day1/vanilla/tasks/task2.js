// task2: 引入虚拟 DOM，用 JS 对象描述 DOM 节点
const box = {
  type: "div",
  props: {
    id: "app",
    children: [],
  },
};

const text = {
  type: "TEXT_ELEMENT",
  props: {
    textContent: "app",
    children: [],
  },
};

const container = document.querySelector("#root");

const boxDom = document.createElement(box.type);
boxDom.id = box.id;
const textDom = document.createTextNode("");
textDom.textContent = text.props.textContent;
boxDom.append(textDom);
container.append(boxDom);
