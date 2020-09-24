var Timer = function(callback, delay) {
    var timerId, start, remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= Date.now() - start;
    };

    this.resume = function() {
        start = Date.now();
        window.clearTimeout(timerId);
        if(remaining > 0) {
            timerId = window.setTimeout(callback, remaining);
        }
    };

    this.resume();
};

export default Timer;