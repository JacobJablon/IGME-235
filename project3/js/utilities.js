// The three functions below are taken directly from "Circle Blast", a game created Andrew Wheeland
function lerp(start, end, amt){
    return start * (1-amt) + amt * end;
}

function clamp(val, min, max) {
    return val < min ? min : (val > max ? max : val);
}

function rectsIntersect(a,b){
    var ab = a.getBounds();
    var bb = b.getBounds();
    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}