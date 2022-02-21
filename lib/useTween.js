import tween from "@tweenjs/tween.js";
import { useState } from "react";

export const ease = tween.Easing;

const useTween = (start, to, duration, easing = ease.Quadratic.InOut, ref) => {
  const [value, setValue] = useState(start);

  const tweenInstance = new tween.Tween(start)
    .to(to, duration)
    .easing(easing)
    .onUpdate(() => {
      setValue(start);
    });

  const begin = () => {
    tweenInstance.start();
  };

  return [value, begin, update];
};

export default useTween;

export const update = () => {
  tween.update();
};
