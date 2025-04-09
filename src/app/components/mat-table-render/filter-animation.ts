import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

// Component transition animations
export const slideInDownAnimation = trigger("openClose", [
  // ...
  state(
    "open",
    style({
      opacity: 1,
      transform: "translateX(0)",
    })
  ),
  state(
    "closed",
    style({
      opacity: 0,
      transform: "translateX(100%)",
    })
  ),
  transition("open => closed", [animate(".3s ease-in")]),
  transition("closed => open", [animate("0.2s")]),
]);
