var stations = [];
var tracks = []
var stationRadius = 25;
var currentStation = null;

function log(msg) { return; }
//function log(msg) {console.log(msg);}

function Station (shape, x, y) {
    this.x = x;
    this.y = y;
    this.shape = shape;
}

function Track (startStation, endStation) {
    this.start = startStation;
    this.end = endStation;
    this.color = "#".concat(Math.floor(0xffffff*Math.random()).toString(16));
    this.shape = new createjs.Shape();
    var dx = endStation.x - startStation.x;
    var dy = endStation.y - startStation.y;
    var {x,y} = calculateTrackCoordinates(dx,dy);
    this.shape.graphics
        .beginStroke(this.color)
        .setStrokeStyle(10,"round","round")
        .moveTo(0,0)
        .lineTo(x,y)
        .lineTo(dx,dy);
    this.shape.x = startStation.x;
    this.shape.y = startStation.y;
}

// This returns the coordinates of the bend in the middle of the track,
// assuming the beginning is at (0,0).
function calculateTrackCoordinates(endX, endY) {
    var dx = -endX;
    var dy = -endY;
    var xa=0,ya=0;
    if (Math.abs(dx) > Math.abs(dy)) {
        // This is one of the horizontal quadrants
        ya = endY;
        if (dx < 0) {
            xa = Math.abs(endY);
            log("q1");
        } else {
            xa = -Math.abs(endY);
            log("q3");
        }
    } else {
        // Vertical quadrant
        xa = endX;
        if (dy < 0) {
            ya = Math.abs(endX);
            log("q2");
        } else {
            ya = -Math.abs(endX);
            log("q4");
        }
    }
    return {x : xa, y : ya};
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
    var potentialTrack = undefined;
    shape.graphics.beginFill("ForestGreen").drawCircle(0,0,stationRadius);
    shape.x = x;
    shape.y = y;
    shape.addEventListener("mousedown",function(event) {
        log("Circle clicked");
        currentStation = station;
        log("CurrentStation: x=" + currentStation.x + " y=" + currentStation.y);
        shape.graphics.beginFill("Red").drawCircle(0,0,stationRadius-5);
        stage.update();
        potentialTrack = new createjs.Shape();
        potentialTrack.x = 0;
        potentialTrack.y = 0;
        stage.addChild(potentialTrack);
        stage.update();
    });
    shape.addEventListener("pressup", function(event) {
        currentStation = undefined;
        var x = event.stageX, y = event.stageY;
        shape.graphics.beginFill("ForestGreen").drawCircle(0,0,stationRadius);
        stage.removeChild(potentialTrack);
        for (s of stations) {
            if (contains(s,x,y)) {
                var track = new Track(station,s);
                tracks.push(track);
                stage.addChild(track.shape);
                console.log("Added track");
                console.log(track);
            }
        }
        stage.update();
        potentialTrack = undefined;
    });
    shape.addEventListener("pressmove",function(event) {
        var dx = event.stageX - shape.x, dy = event.stageY - shape.y;
        var {x, y} = calculateTrackCoordinates(dx,dy);
        potentialTrack.graphics.clear()
            .setStrokeStyle(10,"round","round")
            .beginStroke("Orange")
            .moveTo(0,0)
            .lineTo(x, y)
            .lineTo(dx,dy);
        potentialTrack.x = currentStation.x;
        potentialTrack.y = currentStation.y;
        stage.update();
    });
    stations.push(station);
    stage.addChild(shape);
    stage.update();
}
    

