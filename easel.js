var stations = [];
var stationRadius = 25;
var currentStation = null;
var dot = null;

function log(msg) { return; }
//function log(msg) {console.log(msg);}

function Station (shape, x, y) {
    this.x = x;
    this.y = y;
    this.shape = shape;
}

function init() {
    var stage = new createjs.Stage("demo");
    // Draw a background. Only events on a child of the stage are picked up.
    var background = new createjs.Shape();
    background.graphics.beginFill("Aquamarine").drawRect(0,0,800,800);
    stage.addChild(background);
    log(background);
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawRect(100,200,300,400);
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(50,50,50);
    stage.addChild(circle);
    stage.update();
/*    circle.addEventListener("click", function(event) {
        alert("Circle clicked");
    });*/
    stage.addEventListener("click",addStationAtClick(stage,stations));
}

function addStationAtClick(stage, stations) {
    return function (event) {
        var x = event.stageX;
        var y = event.stageY;
        log("Click at " + x + ", " + y);
        for (s of stations) {
            if (contains(s,x,y)) {
                log("Already in station");
                log(s);
                return;
            }
        }
        createStation(x,y,stations,stage);
    }
}
 // contains returns true if (x,y) is within the station
function contains(station,x,y) {
    var dx = x - station.x;
    var dy = y - station.y;
    return dx*dx + dy*dy <= stationRadius*stationRadius;
}

function createStation(x,y,stations,stage) {
    var shape = new createjs.Shape();
    var station = new Station(shape,x,y);
    var straitLine = undefined;
    var diagonalLine = undefined;
    shape.graphics.beginFill("ForestGreen").drawCircle(0,0,stationRadius);
    shape.x = x;
    shape.y = y;
    shape.addEventListener("mousedown",function(event) {
        log("Circle clicked");
        currentStation = station;
        log("CurrentStation: x=" + currentStation.x + " y=" + currentStation.y);
        shape.graphics.beginFill("Red").drawCircle(0,0,stationRadius-5);
        stage.update();
        dot = new createjs.Shape();
        dot.graphics.beginFill("Blue").drawCircle(0,0,5);
        straitLine = new createjs.shape();
        straitLine = 
        stage.update();
    });
    shape.addEventListener("pressup", function(event) {
        currentStation = undefined;
        shape.graphics.beginFill("ForestGreen").drawCircle(0,0,stationRadius);
        stage.removeChild(dot);
        stage.update();
        dot = undefined;
    });
    shape.addEventListener("pressmove",function(event) {
        var dx = event.stageX - currentStation.x;
        var dy = event.stageY - currentStation.y;
        var xa=0,ya=0;
        if (Math.abs(dx) > Math.abs(dy)) {
            // This is one of the horizontal quadrants
            ya = event.stageY;
            if (dx < 0) {
                xa = currentStation.x - Math.abs(dy);
                log("q1");
            } else {
                xa = currentStation.x + Math.abs(dy);
                log("q3");
            }
        } else {
            // Vertical quadrant
            xa = event.stageX;
            if (dy < 0) {
                ya = currentStation.y - Math.abs(dx);
                log("q2");
            } else {
                ya = currentStation.y + Math.abs(dx);
                log("q4");
            }
        }
        dot.x = xa;
        dot.y = ya;
        stage.addChild(dot);
        stage.update();
        log("dx="+dx+", xa="+xa+", ya="+ya);
        log(dot);
    });
    stations.push(station);
    stage.addChild(shape);
    stage.update();
}
    

