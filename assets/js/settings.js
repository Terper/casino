document.addEventListener("DOMContentLoaded", () => {
  // initialize backgroundColorChanger from storage or default
  const backgroundColor =
    sessionStorage.getItem("backgroundColor") ?? "rgb(255,255,255)";
  const backgroundChanger = document.querySelector("#backgroundChanger");
  backgroundChanger.value = backgroundColor;
  // set backgroundColor to the value of backgroundColorChanger
  backgroundChanger.addEventListener("change", () => {
    sessionStorage.setItem("backgroundColor", backgroundChanger.value);
    refreshBackgroundColor();
  });

  // initialize rgbSliders from storage or default
  const rgbSliders = document.querySelectorAll(".rgbSlider");
  const textColor = sessionStorage.getItem("textColor") ?? "rgb(0,0,0)";
  rgbSliders.forEach((element) => {
    const guide = ["red", "green", "blue"];
    // removes "rgb(" + ")" and gets the values seperated by commas
    let rgbValues = textColor.substring(4, textColor.length - 1).split(",");
    // set the value of the slider to the value of the respective rgbValues
    element.value = rgbValues[guide.indexOf(element.id)];
    // event listener for any change in the sliders
    element.addEventListener("change", () => {
      // gets the newest textColor
      const currentTextColor =
        sessionStorage.getItem("textColor") ?? "rgb(0,0,0)";
      // isolates rgb values
      rgbValues = currentTextColor
        .substring(4, currentTextColor.length - 1)
        .split(",");
      // changes the respective rgb value
      rgbValues[guide.indexOf(element.id)] = element.value;
      // generates new rgb(x,x,x) string for usage and storage
      const newTextColor = `rgb(${rgbValues[0]},${rgbValues[1]},${rgbValues[2]})`;
      sessionStorage.setItem("textColor", newTextColor);
      refreshTextColor();
    });
  });
});
