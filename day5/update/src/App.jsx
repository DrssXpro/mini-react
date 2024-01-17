import React from "./core/React";

let count = 10;

const Counter = () => {
  function handleClick() {
    console.log("click");
    count++;
    React.update();
  }
  return (
    <div>
      counter: {count}
      <button onClick={handleClick}>click</button>
    </div>
  );
};

const App = () => {
  return (
    <div>
      mini-react
      <Counter />
    </div>
  );
};

export default App;
