import React from "react";
import "./App.css";

import Slider from "./slider";

const options = {
  itemsToShow: 5,
  spaceBetween: 10
};

function App() {
  return (
    <div className="App">
      <Slider options={options}>
        <div className="item">1</div>
        <div className="item">2</div>
        <div className="item">3</div>
        <div className="item">4</div>
        <div className="item">5</div>
        <div className="item">6</div>
        <div className="item">7</div>
        <div className="item">8</div>
        <div className="item">9</div>
        <div className="item">10</div>
        <div className="item">11</div>
        <div className="item">12</div>
      </Slider>
    </div>
  );
}

export default App;
