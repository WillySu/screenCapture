(function () {
    function init () {
        var form = document.timerForm;
        var slider = form.slider;
        var sliderVal = form.sliderVal;
        var startBtn = form.startBtn;
        var stopBtn = form.stopBtn;

        slider.addEventListener('change', function (ev) {
          sliderVal.value = ev.target.value;
        });
    }

    window.addEventListener('load', init);
})();
