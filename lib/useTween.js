import tween from "@tweenjs/tween.js";
import { useState } from "react";

export const ease = tween.Easing;

const useTween = (start, states, easing = ease.Quadratic.InOut) => {
  const [value, setValue] = useState(start);
  let prevInstance;
  states.start = start;

  const begin = (state, duration) => {
    if (prevInstance) prevInstance.stop();
    let val = value;
    const tweenInstance = new tween.Tween(val)
      .to(states[state], duration)
      .easing(easing)
      .onUpdate(() => {
        setValue(val);
      });
    tweenInstance.start();
  };

  return [value, begin];
};

export default useTween;

export const update = () => {
  tween.update();
};
