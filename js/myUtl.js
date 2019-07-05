var myUtl = {}
/**
 * 频幕上pageX,pageY的点是否在target对向内
 */
myUtl.isPointOverElement = function (pageX, pageY, targetEl) {
    var targetCollisionDiv = targetEl;
    if (typeof (targetEl) == "string") {
        targetCollisionDiv = $("#" + targetEl);
    }
    if (targetCollisionDiv == null) return false;
    var x = targetCollisionDiv.offset().left;
    var y = targetCollisionDiv.offset().top;
    var w = x + targetCollisionDiv.width();
    var h = y + targetCollisionDiv.height();
    return (
        pageX > x &&
        pageX < w &&
        pageY > y &&
        pageY < h
    );
}

myUtl.isString = function (f) {
    return f == null ? false : (typeof f === "string" || f.constructor === String);
}
