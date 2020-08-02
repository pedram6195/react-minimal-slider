import React, { useEffect, useRef, useState } from "react";
import "./css/main.css";

// arrow icons
import { ReactComponent as ArrowRight } from "./arrows/right.svg";
import { ReactComponent as ArrowLeft } from "./arrows/left.svg";

// find closest number in array to needle
const closest = (needle, haystack) => {
  if (haystack.length > 0)
    return haystack.reduce((a, b) => {
      let aDiff = Math.abs(a - needle);
      let bDiff = Math.abs(b - needle);
      if (aDiff === bDiff) return a > b ? a : b;
      else return bDiff < aDiff ? b : a;
    });
};

// default options for slider
const defaultOptions = {
  itemsToShow: 6,
  spaceBetween: 10,
  draggable: true,
  showArrows: true,
  showBullets: false,
  rtl: true
};

const Slider = ({ children, options }) => {
  // mixing defualt options with user options
  const { itemsToShow, spaceBetween, draggable, showArrows, showBullets } = {
    ...defaultOptions,
    ...options
  };

  // assigning children to state
  const [ch, setch] = useState(null);

  // creating new children array (or null if empty)
  useEffect(() => {
    if (!children || children?.length === 0) {
      setch(null);
    } else if (!Array.isArray(children))
      setch(React.Children.toArray(children));
    else setch(children);
  }, [children]);

  // slides container & track elements
  const container = useRef();
  const track = useRef();

  const [translate, setTranslate] = useState(0);
  const [maxTranslate, setMaxTranslate] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (container.current && ch) {
      let w = Math.ceil(container.current.offsetWidth / itemsToShow);
      setItemWidth(w);
      setMaxTranslate((ch?.length - itemsToShow) * w);
      ch.forEach((el, index) => {
        setPositions(positions => [...positions, index * w]);
      });
    }
  }, [ch, itemsToShow]);

  // moving slider by translate by px
  const changeTranslate = (amount, flag = true) => {
    track.current.style.transform = `translateX(${amount}px)`;
    if (flag) setTranslate(amount);
  };

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [walk, setWalk] = useState(0);

  const dragStart = e => {
    if (e.cancelable) e.preventDefault();
    track.current.classList.remove("minimal-slider__track--transition");
    if (e.type === "touchstart")
      setStartX(e.touches[0].pageX - container.current.offsetLeft);
    else setStartX(e.pageX - container.current.offsetLeft);
    setIsDown(true);
  };

  const drag = e => {
    if (!isDown) return;
    e.preventDefault();
    let pageX, w;
    if (e.type === "touchmove") pageX = e.touches[0].pageX;
    else pageX = e.pageX;
    w = pageX - container.current.offsetLeft - startX;
    if (translate + w >= 0 && translate + w <= maxTranslate) {
      changeTranslate(translate + w, false);
      setWalk(w);
    }
  };

  const dragEnd = () => {
    track.current.classList.add("minimal-slider__track--transition");
    let shouldGo = closest(translate + walk, positions);
    changeTranslate(shouldGo);
    setCurrentSlide(positions.indexOf(shouldGo) + 1);
    setIsDown(false);
    setWalk(0);
  };

  useEffect(() => {
    if (container && draggable && ch) {
      const slider = container.current;
      slider.addEventListener("mousedown", dragStart);
      slider.addEventListener("touchstart", dragStart);
      slider.addEventListener("mousemove", drag);
      slider.addEventListener("touchmove", drag);
      slider.addEventListener("mouseleave", dragEnd);
      slider.addEventListener("mouseup", dragEnd);
      slider.addEventListener("touchend", dragEnd);
      return () => {
        slider.removeEventListener("mousedown", dragStart);
        slider.removeEventListener("touchstart", dragStart);
        slider.removeEventListener("mousemove", drag);
        slider.removeEventListener("touchmove", drag);
        slider.removeEventListener("mouseleave", dragEnd);
        slider.removeEventListener("mouseup", dragEnd);
        slider.removeEventListener("touchend", dragEnd);
      };
    }
  });

  const moveRight = () => {
    if (translate - itemWidth < 0) return;
    track.current.classList.add("minimal-slider__track--transition");
    changeTranslate(translate - itemWidth);
  };
  const moveLeft = () => {
    if (translate + itemWidth > maxTranslate) return;
    track.current.classList.add("minimal-slider__track--transition");
    changeTranslate(translate + itemWidth);
  };

  // useEffect(() => {
  //   console.log("translate", translate);
  // }, [translate]);

  // useEffect(() => {
  //   console.log("isDown", isDown);
  // }, [isDown]);

  // useEffect(() => {
  //   console.log("startX", startX);
  // }, [startX]);

  // useEffect(() => {
  //   console.log("walk", walk);
  // }, [walk]);

  useEffect(() => {
    if (ch) changeTranslate(positions[currentSlide - 1]);
  }, [currentSlide, positions, ch]);

  if (!ch) return null;
  else
    return (
      <div className="minimal-slider">
        <div className="minimal-slider__container" ref={container}>
          <div
            className="minimal-slider__track"
            ref={track}
            style={{
              width: itemWidth > 0 ? itemWidth * ch?.length : "auto"
            }}
          >
            {ch?.map((item, index) => (
              <div
                className="minimal-slider__item"
                key={index}
                style={{ padding: `0 ${spaceBetween / 2}px`, width: itemWidth }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {showBullets && ch.length > 1 && (
          <div className="minimal-slider__bullets-container">
            {ch.map((item, index) => (
              <span
                key={index}
                className={`minimal-slider__bullet ${
                  index + 1 === currentSlide
                    ? "minimal-slider__bullet--active"
                    : ""
                }`}
                onClick={() => setCurrentSlide(index + 1)}
              ></span>
            ))}
          </div>
        )}

        {showArrows && (
          <>
            <ArrowRight
              className="minimal-slider__right-arrow"
              onClick={moveRight}
            />
            <ArrowLeft
              className="minimal-slider__left-arrow"
              onClick={moveLeft}
            />
          </>
        )}
      </div>
    );
};

export default Slider;
