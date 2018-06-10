function init () {
    var form = document.timerForm;
    var slider = form.slider;
    var sliderVal = form.sliderVal;

    slider.addEventListener("change", function (ev) {
      sliderVal.value = ev.target.value;
    });
}

window.addEventListener("load", init);
