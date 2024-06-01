import ProgressComponent from "./progress-component/index.js";
import { debounce } from "./utils.js";

const progressParent = document.getElementById("progress");
const progressValueInput = document.getElementById("progress_value");
const progressAnimateInput = document.getElementById("progress_animate");
const progressHideInput = document.getElementById("progress_hide");

const progressControl = new ProgressComponent(progressParent, {
  size: 200,
  stroke_width: "17px",
  progress: 75,
});

const stateSub = progressControl.subscribeOnConfigChange(
  "state",
  (prevState, curState) => {
    progressValueInput.disabled = curState !== "normal";

    progressAnimateInput.checked = curState === "animated";
    progressHideInput.checked = curState === "hidden";
  }
);

progressValueInput.value = progressControl.getConfig().progress;
progressValueInput.oninput = debounce((e) => {
  progressControl.changeProgressValue(+e.target.value);
}, 400);

progressAnimateInput.onchange = (e) => {
  const { checked } = e.target;
  progressControl.setState(checked ? "animated" : "normal");
};

progressHideInput.onchange = (e) => {
  const { checked } = e.target;
  progressControl.setState(checked ? "hidden" : "normal");
};
