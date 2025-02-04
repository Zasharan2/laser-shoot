var c = document.getElementById("mainCanvas");
var ctx = c.getContext("2d");

var spritesheet = document.getElementById("spritesheet");

var keys = [];

document.addEventListener("keydown", function (event) {
    keys[event.key] = true;
    if ([" ", "Control"].indexOf(event.key) > -1) {
        event.preventDefault();
    }
    if (keys["Enter"] && laserState == LASERSTATE.OFF) {
        laserState = LASERSTATE.STATIC;
    } else if (keys["Enter"] && laserState != LASERSTATE.OFF) {
        achievedPoint = null;
        laserState = LASERSTATE.OFF;
    }
    if (keys[" "] && laserState == LASERSTATE.STATIC) {
        laserState = LASERSTATE.LIVE;
    } else if (keys[" "] && laserState == LASERSTATE.LIVE) {
        laserState = LASERSTATE.STATIC;
    }

    if (keys["n"]) {
        showMirrorPerpendiculars = !showMirrorPerpendiculars;
    }
});

document.addEventListener("keyup", function (event) {
    keys[event.key] = false;
});

var mouseX = -500;
var mouseY = -500;

c.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

window.addEventListener("mousemove", function(event) {
    mouseX = (event.clientX - c.getBoundingClientRect().left) * scale;
    mouseY = (event.clientY - c.getBoundingClientRect().top) * scale;
});

var mouseDown, mouseButton;

window.addEventListener("mousedown", function(event) {
    mouseDown = true;
    mouseButton = event.buttons;

    if (laserState != LASERSTATE.STATIC) {
        mirrorList.push(new Mirror(new Vector2(placeMirror.pos.x, placeMirror.pos.y), placeMirror.theta));
    }
});

window.addEventListener("mouseup", function(event) {
    mouseDown = false;
});

ctx.imageSmoothingEnabled = false;

const displayWidth = 350;
const displayHeight = 560;
const scale = 4;
c.style.width = displayWidth + 'px';
c.style.height = displayHeight + 'px';
c.width = displayWidth * scale;
c.height = displayHeight * scale;

// 80, 160 generates a square
var mirrorWidth = 80;
var mirrorDepth = 40;
var mirrorMarkLength = 30;

var borderWidth = 80;
var borderDepth = 40;

var targetPoint = scale * displayWidth * Math.random();
var achievedPoint = null;

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

var showMirrorPerpendiculars = false;

class Mirror {
    constructor(pos, theta) {
        this.pos = pos;
        this.theta = theta;
    }

    render() {
        // outline
        ctx.beginPath();
        ctx.strokeStyle = "#00ffffff";
        ctx.lineWidth = 1 * scale;
        ctx.moveTo(this.pos.x - (mirrorWidth * Math.cos(this.theta)), this.pos.y - (mirrorWidth * Math.sin(this.theta)));
        ctx.lineTo(this.pos.x + (mirrorWidth * Math.cos(this.theta)), this.pos.y + (mirrorWidth * Math.sin(this.theta)));
        ctx.moveTo(this.pos.x - (mirrorWidth * Math.cos(this.theta)) + (mirrorDepth * Math.cos(this.theta + (Math.PI / 2))), this.pos.y - (mirrorWidth * Math.sin(this.theta)) + (mirrorDepth * Math.sin(this.theta + (Math.PI / 2))));
        ctx.lineTo(this.pos.x + (mirrorWidth * Math.cos(this.theta)) + (mirrorDepth * Math.cos(this.theta + (Math.PI / 2))), this.pos.y + (mirrorWidth * Math.sin(this.theta)) + (mirrorDepth * Math.sin(this.theta + (Math.PI / 2))));
        ctx.moveTo(this.pos.x - (mirrorWidth * Math.cos(this.theta)), this.pos.y - (mirrorWidth * Math.sin(this.theta)));
        ctx.lineTo(this.pos.x - (mirrorWidth * Math.cos(this.theta)) + (mirrorDepth * Math.cos(this.theta + (Math.PI / 2))), this.pos.y - (mirrorWidth * Math.sin(this.theta)) + (mirrorDepth * Math.sin(this.theta + (Math.PI / 2))));
        ctx.moveTo(this.pos.x + (mirrorWidth * Math.cos(this.theta)), this.pos.y + (mirrorWidth * Math.sin(this.theta)));
        ctx.lineTo(this.pos.x + (mirrorWidth * Math.cos(this.theta)) + (mirrorDepth * Math.cos(this.theta + (Math.PI / 2))), this.pos.y + (mirrorWidth * Math.sin(this.theta)) + (mirrorDepth * Math.sin(this.theta + (Math.PI / 2))));
        ctx.stroke();

        // marks
        ctx.beginPath();
        ctx.strokeStyle = "#00ffffff";
        ctx.lineWidth = 1 * scale;
        ctx.moveTo(this.pos.x + (-0.75 * mirrorWidth * Math.cos(this.theta)), this.pos.y + (-0.75 * mirrorWidth * Math.sin(this.theta)));
        ctx.lineTo(this.pos.x + (-0.75 * mirrorWidth * Math.cos(this.theta)) + (-mirrorMarkLength * Math.cos(this.theta - (Math.PI / 4))), this.pos.y + (-0.75 * mirrorWidth * Math.sin(this.theta)) + (-mirrorMarkLength * Math.sin(this.theta - (Math.PI / 4))));
        ctx.moveTo(this.pos.x + (-0.25 * mirrorWidth * Math.cos(this.theta)), this.pos.y + (-0.25 * mirrorWidth * Math.sin(this.theta)));
        ctx.lineTo(this.pos.x + (-0.25 * mirrorWidth * Math.cos(this.theta)) + (-mirrorMarkLength * Math.cos(this.theta - (Math.PI / 4))), this.pos.y + (-0.25 * mirrorWidth * Math.sin(this.theta)) + (-mirrorMarkLength * Math.sin(this.theta - (Math.PI / 4))));
        ctx.moveTo(this.pos.x + (0.25 * mirrorWidth * Math.cos(this.theta)), this.pos.y + (0.25 * mirrorWidth * Math.sin(this.theta)));
        ctx.lineTo(this.pos.x + (0.25 * mirrorWidth * Math.cos(this.theta)) + (-mirrorMarkLength * Math.cos(this.theta - (Math.PI / 4))), this.pos.y + (0.25 * mirrorWidth * Math.sin(this.theta)) + (-mirrorMarkLength * Math.sin(this.theta - (Math.PI / 4))));
        ctx.moveTo(this.pos.x + (0.75 * mirrorWidth * Math.cos(this.theta)), this.pos.y + (0.75 * mirrorWidth * Math.sin(this.theta)));
        ctx.lineTo(this.pos.x + (0.75 * mirrorWidth * Math.cos(this.theta)) + (-mirrorMarkLength * Math.cos(this.theta - (Math.PI / 4))), this.pos.y + (0.75 * mirrorWidth * Math.sin(this.theta)) + (-mirrorMarkLength * Math.sin(this.theta - (Math.PI / 4))));
        ctx.stroke();

        if (showMirrorPerpendiculars) {
            ctx.beginPath();
            ctx.strokeStyle = "#00ff00ff";
            ctx.lineWidth = 1 * scale;
            ctx.moveTo(this.pos.x, this.pos.y);
            ctx.lineTo(this.pos.x + (mirrorWidth * Math.cos(this.theta - (Math.PI / 2))), this.pos.y + (mirrorWidth * Math.sin(this.theta - (Math.PI / 2))))
            ctx.stroke();
        }
    }
}

class Border {
    constructor(pos, theta) {
        this.pos = pos;
        this.theta = theta;
    }

    render() {
        // outline
        ctx.beginPath();
        ctx.strokeStyle = "#ffaa00ff";
        ctx.lineWidth = 1 * scale;
        ctx.moveTo(this.pos.x - (borderWidth * Math.cos(this.theta)), this.pos.y - (borderWidth * Math.sin(this.theta)));
        ctx.lineTo(this.pos.x + (borderWidth * Math.cos(this.theta)), this.pos.y + (borderWidth * Math.sin(this.theta)));
        ctx.moveTo(this.pos.x - (borderWidth * Math.cos(this.theta)) + (borderDepth * Math.cos(this.theta + (Math.PI / 2))), this.pos.y - (borderWidth * Math.sin(this.theta)) + (borderDepth * Math.sin(this.theta + (Math.PI / 2))));
        ctx.lineTo(this.pos.x + (borderWidth * Math.cos(this.theta)) + (borderDepth * Math.cos(this.theta + (Math.PI / 2))), this.pos.y + (borderWidth * Math.sin(this.theta)) + (borderDepth * Math.sin(this.theta + (Math.PI / 2))));
        ctx.moveTo(this.pos.x - (borderWidth * Math.cos(this.theta)), this.pos.y - (borderWidth * Math.sin(this.theta)));
        ctx.lineTo(this.pos.x - (borderWidth * Math.cos(this.theta)) + (borderDepth * Math.cos(this.theta + (Math.PI / 2))), this.pos.y - (borderWidth * Math.sin(this.theta)) + (borderDepth * Math.sin(this.theta + (Math.PI / 2))));
        ctx.moveTo(this.pos.x + (borderWidth * Math.cos(this.theta)), this.pos.y + (borderWidth * Math.sin(this.theta)));
        ctx.lineTo(this.pos.x + (borderWidth * Math.cos(this.theta)) + (borderDepth * Math.cos(this.theta + (Math.PI / 2))), this.pos.y + (borderWidth * Math.sin(this.theta)) + (borderDepth * Math.sin(this.theta + (Math.PI / 2))));
        ctx.stroke();
    }
}

var placeMirror = new Mirror(new Vector2(-500, -500), 0);
var mirrorList = [];
var borderList = [];

function addRandomBorder() {
    borderList.push(new Border(new Vector2(scale * ((borderWidth / 4) + (displayWidth - (borderWidth / 2)) * Math.random()), scale * ((borderWidth / 4) + (displayHeight - (borderWidth / 2)) * Math.random())), 2*Math.PI*Math.random()));
}

function renderBackground() {
    // background
    ctx.beginPath();
    ctx.fillStyle = "#000000ff";
    ctx.fillRect(0, 0, displayWidth * scale, displayHeight * scale);

    // draw borderlines
    ctx.beginPath();
    ctx.strokeStyle = "#ffaa00ff";
    ctx.lineWidth = 1 * scale;
    ctx.moveTo(0 * scale, 0 * scale);
    ctx.lineTo(0 * scale, displayHeight * scale);
    ctx.moveTo(displayWidth * scale, 0 * scale);
    ctx.lineTo(displayWidth * scale, displayHeight * scale);
    ctx.moveTo(0 * scale, 0 * scale);
    ctx.lineTo(displayWidth * scale, 0 * scale);
    ctx.moveTo(0 * scale, displayHeight * scale);
    ctx.lineTo(displayWidth * scale, displayHeight * scale);
    ctx.stroke();

    // draw gridlines
    ctx.beginPath();
    ctx.strokeStyle = "#ffffffff";
    ctx.lineWidth = 1 * scale;
    ctx.moveTo(displayWidth*(1/3) * scale, 0 * scale);
    ctx.lineTo(displayWidth*(1/3) * scale, displayHeight * scale);
    ctx.moveTo(displayWidth*(2/3) * scale, 0 * scale);
    ctx.lineTo(displayWidth*(2/3) * scale, displayHeight * scale);
    ctx.moveTo(0 * scale, displayHeight*(1/3) * scale);
    ctx.lineTo(displayWidth * scale, displayHeight*(1/3) * scale);
    ctx.moveTo(0 * scale, displayHeight*(2/3) * scale);
    ctx.lineTo(displayWidth * scale, displayHeight*(2/3) * scale);
    ctx.stroke();
}

function hoverPlaceMirror() {
    placeMirror.pos.x = mouseX;
    placeMirror.pos.y = mouseY;

    var slow = 30;
    if (keys["Shift"]) { slow = 100; }
    if (keys["Control"]) { slow = 300; }
    if (keys["d"] || keys["D"] || keys["∂"]) {
        placeMirror.theta += (deltaTime / slow);
    }
    if (keys["a"] || keys["A"] || keys["å"]) {
        placeMirror.theta -= (deltaTime / slow);
    }

    placeMirror.render();
}

var hovering = false;

function checkBorderHover() {
    for (var i = 0; i < borderList.length; i++) {
        if (Math.sqrt(Math.pow(mouseX - borderList[i].pos.x, 2) + Math.pow(mouseY - borderList[i].pos.y, 2)) < (borderWidth / 2) * scale) {
            hovering = true;
        }
    }
}

function hoverDeleteMirror() {
    for (var i = 0; i < mirrorList.length; i++) {
        if (Math.sqrt(Math.pow(mouseX - mirrorList[i].pos.x, 2) + Math.pow(mouseY - mirrorList[i].pos.y, 2)) < (mirrorWidth / 2) * scale) {
            hovering = true;
            if (keys["Backspace"] && laserState != LASERSTATE.STATIC) {
                mirrorList.splice(i, 1);
                i--;
            }
        }
    }
}

function hoverTurnMirror() {
    for (var i = 0; i < mirrorList.length; i++) {
        if (Math.sqrt(Math.pow(mouseX - mirrorList[i].pos.x, 2) + Math.pow(mouseY - mirrorList[i].pos.y, 2)) < (mirrorWidth / 2) * scale) {
            hovering = true;
            if (laserState != LASERSTATE.STATIC) {
                var slow = 30;
                if (keys["Shift"]) { slow = 100; }
                if (keys["Control"]) { slow = 300; }
                if (keys["d"] || keys["D"] || keys["∂"]) {
                    mirrorList[i].theta += (deltaTime / slow);
                }
                if (keys["a"] || keys["A"] || keys["å"]) {
                    mirrorList[i].theta -= (deltaTime / slow);
                }
            }
        }
    }
}

function renderMirrorList() {
    for (var i = 0; i < mirrorList.length; i++) {
        mirrorList[i].render();
    }
}

function renderBorderList() {
    for (var i = 0; i < borderList.length; i++) {
        borderList[i].render();
    }
}

function renderTargetPoint() {
    ctx.beginPath();
    ctx.strokeStyle = "#00ff00ff";
    ctx.lineWidth = 1 * scale;
    ctx.moveTo(targetPoint, 0);
    ctx.lineTo(targetPoint, 4 * scale);
    ctx.stroke();
}

function renderLaserShootPoint() {
    ctx.beginPath();
    ctx.strokeStyle = "#00ff00ff";
    ctx.lineWidth = 1 * scale;
    ctx.moveTo(scale * displayWidth / 2, scale * displayHeight - (4 * scale));
    ctx.lineTo(scale * displayWidth / 2, scale * displayHeight);
    ctx.stroke();
}

function renderDistance() {
    ctx.beginPath();
    ctx.fillStyle = "#ffffffff";
    ctx.font = String(10 * scale) + "px Comic Sans MS";
    ctx.fillText(String(Math.abs(Math.round(achievedPoint / scale))) + "cm", 5 * scale, 20 * scale);
}

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(p, { x: v.x + t * (w.x - v.x),
                      y: v.y + t * (w.y - v.y) });
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

var laserPos = new Vector2((displayWidth / 2) * scale, displayHeight * scale);
var laserTheta;

function shineLaser() {
    laserPos.x = (displayWidth / 2) * scale;
    laserPos.y = displayHeight * scale;
    laserTheta = -(Math.PI / 2)
    var collision = false;
    while (!collision) {
        ctx.beginPath();
        ctx.fillStyle = (laserState == LASERSTATE.LIVE) ? "#ff8080ff" : "#ff0000ff";
        ctx.fillRect(laserPos.x - (scale / 2), laserPos.y - (scale / 2), scale, scale);

        laserPos.x += Math.cos(laserTheta);
        laserPos.y += Math.sin(laserTheta);

        // wall
        achievedPoint = null;
        if (laserPos.x > displayWidth * scale || laserPos.x < 0 || laserPos.y > displayHeight * scale || laserPos.y < 0) {
            collision = true;
            if (laserPos.y < 0) {
                achievedPoint = targetPoint - laserPos.x;
            }
        }
        // mirror
        for (var i = 0; i < mirrorList.length; i++) {
            // reflective side
            if (distToSegment(laserPos, new Vector2(mirrorList[i].pos.x - (mirrorWidth * Math.cos(mirrorList[i].theta)), mirrorList[i].pos.y - (mirrorWidth * Math.sin(mirrorList[i].theta))), new Vector2(mirrorList[i].pos.x + (mirrorWidth * Math.cos(mirrorList[i].theta)), mirrorList[i].pos.y + (mirrorWidth * Math.sin(mirrorList[i].theta)))) < 2) {
                var vx = Math.cos(laserTheta);
                var vy = Math.sin(laserTheta);
                var wx = Math.cos(mirrorList[i].theta - (Math.PI / 2));
                var wy = Math.sin(mirrorList[i].theta - (Math.PI / 2));
                laserTheta = Math.atan2(vy - (2 * wy * (vx*wx + vy*wy)), vx - (2 * wx * (vx*wx + vy*wy)));
            }
            // back
            if (distToSegment(laserPos, new Vector2(mirrorList[i].pos.x - (mirrorWidth * Math.cos(mirrorList[i].theta)) + (mirrorDepth * Math.cos(mirrorList[i].theta + (Math.PI / 2))), mirrorList[i].pos.y - (mirrorWidth * Math.sin(mirrorList[i].theta)) + (mirrorDepth * Math.sin(mirrorList[i].theta + (Math.PI / 2)))), new Vector2(mirrorList[i].pos.x + (mirrorWidth * Math.cos(mirrorList[i].theta)) + (mirrorDepth * Math.cos(mirrorList[i].theta + (Math.PI / 2))), mirrorList[i].pos.y + (mirrorWidth * Math.sin(mirrorList[i].theta)) + (mirrorDepth * Math.sin(mirrorList[i].theta + (Math.PI / 2))))) < 2) {
                collision = true;
            }
            if (distToSegment(laserPos, new Vector2(mirrorList[i].pos.x - (mirrorWidth * Math.cos(mirrorList[i].theta)), mirrorList[i].pos.y - (mirrorWidth * Math.sin(mirrorList[i].theta))), new Vector2(mirrorList[i].pos.x - (mirrorWidth * Math.cos(mirrorList[i].theta)) + (mirrorDepth * Math.cos(mirrorList[i].theta + (Math.PI / 2))), mirrorList[i].pos.y - (mirrorWidth * Math.sin(mirrorList[i].theta)) + (mirrorDepth * Math.sin(mirrorList[i].theta + (Math.PI / 2))))) < 2) {
                collision = true;
            }
            if (distToSegment(laserPos, new Vector2(mirrorList[i].pos.x + (mirrorWidth * Math.cos(mirrorList[i].theta)) + (mirrorDepth * Math.cos(mirrorList[i].theta + (Math.PI / 2))), mirrorList[i].pos.y + (mirrorWidth * Math.sin(mirrorList[i].theta)) + (mirrorDepth * Math.sin(mirrorList[i].theta + (Math.PI / 2)))), new Vector2(mirrorList[i].pos.x + (mirrorWidth * Math.cos(mirrorList[i].theta)), mirrorList[i].pos.y + (mirrorWidth * Math.sin(mirrorList[i].theta)))) < 2) {
                collision = true;
            }
        }
        // border
        for (var i = 0; i < borderList.length; i++) {
            if (distToSegment(laserPos, new Vector2(borderList[i].pos.x - (borderWidth * Math.cos(borderList[i].theta)), borderList[i].pos.y - (borderWidth * Math.sin(borderList[i].theta))), new Vector2(borderList[i].pos.x + (borderWidth * Math.cos(borderList[i].theta)), borderList[i].pos.y + (borderWidth * Math.sin(borderList[i].theta)))) < 2) {
                collision = true;
            }
            if (distToSegment(laserPos, new Vector2(borderList[i].pos.x - (borderWidth * Math.cos(borderList[i].theta)) + (borderDepth * Math.cos(borderList[i].theta + (Math.PI / 2))), borderList[i].pos.y - (borderWidth * Math.sin(borderList[i].theta)) + (borderDepth * Math.sin(borderList[i].theta + (Math.PI / 2)))), new Vector2(borderList[i].pos.x + (borderWidth * Math.cos(borderList[i].theta)) + (borderDepth * Math.cos(borderList[i].theta + (Math.PI / 2))), borderList[i].pos.y + (borderWidth * Math.sin(borderList[i].theta)) + (borderDepth * Math.sin(borderList[i].theta + (Math.PI / 2))))) < 2) {
                collision = true;
            }
            if (distToSegment(laserPos, new Vector2(borderList[i].pos.x - (borderWidth * Math.cos(borderList[i].theta)), borderList[i].pos.y - (borderWidth * Math.sin(borderList[i].theta))), new Vector2(borderList[i].pos.x - (borderWidth * Math.cos(borderList[i].theta)) + (borderDepth * Math.cos(borderList[i].theta + (Math.PI / 2))), borderList[i].pos.y - (borderWidth * Math.sin(borderList[i].theta)) + (borderDepth * Math.sin(borderList[i].theta + (Math.PI / 2))))) < 2) {
                collision = true;
            }
            if (distToSegment(laserPos, new Vector2(borderList[i].pos.x + (borderWidth * Math.cos(borderList[i].theta)) + (borderDepth * Math.cos(borderList[i].theta + (Math.PI / 2))), borderList[i].pos.y + (borderWidth * Math.sin(borderList[i].theta)) + (borderDepth * Math.sin(borderList[i].theta + (Math.PI / 2)))), new Vector2(borderList[i].pos.x + (borderWidth * Math.cos(borderList[i].theta)), borderList[i].pos.y + (borderWidth * Math.sin(borderList[i].theta)))) < 2) {
                collision = true;
            }
        }
    }
}

const LASERSTATE = {
    OFF: 0,
    STATIC: 1,
    LIVE: 2
};

var laserState = LASERSTATE.OFF;
var runLaser = false;

function main() {
    renderBackground();
    if (laserState != LASERSTATE.STATIC) {
        if (mirrorList.length < 5 && !hovering) {
            hoverPlaceMirror();
        }
        hovering = false;
        hoverDeleteMirror();
        hoverTurnMirror();
        checkBorderHover();
    }
    renderMirrorList();
    renderBorderList();
    renderTargetPoint();
    renderLaserShootPoint();
    if (achievedPoint != null) {
        renderDistance();
    }

    if (laserState > LASERSTATE.OFF) {
        shineLaser();
    }
}

var deltaTime = 0;
var deltaCorrect = (1 / 8);
var prevTime = Date.now();
function loop() {
    deltaTime = (Date.now() - prevTime) * deltaCorrect;
    prevTime = Date.now();

    main();
    window.requestAnimationFrame(loop);
}

function init() {
    for (var i = 0; i < 2 + Math.floor(3 * Math.random()); i++) {
        addRandomBorder();
    }
    window.requestAnimationFrame(loop)
}
window.requestAnimationFrame(init);
