// task3: 动态创建虚拟 DOM 方法
function createElement(type, props, ...children) {
  return {
    type,
    props: { ...props, children },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: { textContent: text, children: [] },
  };
}

const text = createTextElement("app");
const box = createElement("div", { id: "app" }, text);

const container = document.querySelector("#root");

const boxDom = document.createElement(box.type);
boxDom.id = box.props.id;

const textDom = document.createTextNode("");
textDom.textContent = text.props.textContent;

boxDom.append(textDom);
container.append(boxDom);
