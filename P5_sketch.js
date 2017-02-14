//In first field, circles will increase size as people approaching and decrease size as people leave
var mySketch = function(p){

    function Shutter(x, y){
        this.x = x;
        this.y = y;
        this.prev_radius = 0;
        this.current_radius = 0;
        this.acceleration = 0;
        this.dist = 0;
    }
    function getRadius_01(dist, r){
        var divider = 100;
        var newR = span*(Math.exp(-dist/divider)) - 5;
        var ratio = 0.95;
        //people approaching or leaving? how should the circle changing accordingly?
        if (newR > r) {
            var ratio = 0.05; //approaching
        } else {
            var ratio = 0.99; //leaving
        }
        return(newR*(1-ratio) + r*ratio);
    }
    Shutter.prototype.update_01 = function () {
        this.prev_radius = this.current_radius;
        this.dist = p.createVector(this.x - p.mouseX, this.y - p.mouseY).mag();
        this.current_radius = getRadius_01(this.dist, this.current_radius);
    }

    Shutter.prototype.display_01 = function () {
        p.stroke(255);
        p.strokeWeight(1);
        p.fill(255);
        p.ellipse(this.x, this.y, this.current_radius, this.current_radius);
    }

    function getRadius_02(dist, r){
        var divider = 200;
        var newR = span*(1 - (1/Math.pow(dist/divider + 1, 2))) - 5;
        //people approaching or leaving? how should the circle changing accordingly?
        if (newR < r) {
            var ratio = 0.05; //approaching
        } else {
            var ratio = 0.99; //leaving
        }
        //console.log(r);
        return(newR*(1-ratio) + r*ratio);
    }
    Shutter.prototype.update_02 = function () {
        this.dist = p.createVector(this.x - p.mouseX, this.y - p.mouseY).mag();
        this.current_radius = getRadius_02(this.dist, this.current_radius, this.acceleration);
    }

    Shutter.prototype.display_02 = function () {
        p.stroke(255);
        p.strokeWeight(1);
        p.fill(255);
        p.ellipse(this.x, this.y, this.current_radius, this.current_radius);
    }

    //what's the current acceleration?
    function getAcceleration_03(acceleration, dist, r, x, y){
        //return(0);
        //return((getNeighborStatus(x, y) - r)/40);
        return(acceleration*0.97 + (getNeighborStatus(x, y) - r)/40) //diffrence between neighbors average divide the framerate
    }

    function getRadius_03(dist, r, acceleration, x, y){
        //what happen when people approachign threshold distance?
        if (dist <= 50){
            return((Math.sin(p.frameCount/10) + 1)*span/2);
        }
        //what happen for the shutter that out of range? ripple according to surrounding
        return(r + acceleration);
    }
    Shutter.prototype.update_03 = function () {
        this.prev_radius = this.current_radius;
        this.dist = p.createVector(this.x - p.mouseX, this.y - p.mouseY).mag();
        this.acceleration = getAcceleration_03(this.acceleration, this.dist, this.current_radius, this.x, this.y);
        this.current_radius = getRadius_03(this.dist, this.current_radius, this.acceleration, this.x, this.y);
    }

    Shutter.prototype.display_03 = function () {
        p.stroke(255);
        p.strokeWeight(1);
        p.fill(255);
        p.ellipse(this.x, this.y, this.current_radius, this.current_radius);
    }

    //what's the the neighbor status?
    function getNeighborStatus(pos_x, pos_y){
        var i = pos_x - span/2;
        var j = pos_y - span/2;
        var up = 0;
        var down = 0;
        var left = 0;
        var right = 0;
        var up_r = 0;
        var down_r = 0;
        var right_r = 0;
        var left_r = 0;
        //console.log(i, j);
        //up
        if (i > 0){
            up = shutter[i - span][j].acceleration;
            up_r = shutter[i - span][j].current_radius;
        }
        //down
        if (i < x-span){
            down = shutter[i+span][j].acceleration;
            down_r = shutter[i+span][j].current_radius;
        }
        //left
        if (j > 0){
            left = shutter[i][j-span].acceleration;
            left_r = shutter[i][j - span].current_radius;
        }
        //right
        if (j < y-span){
            //console.log("j+span ", j+span);
            right = shutter[i][j + span].acceleration;
            right_r = shutter[i][j + span].current_radius;
        }
        var neighbor_avg = (up_r + down_r + left_r + right_r)/4
        return(neighbor_avg);
    }

    //what's the current acceleration?
    function getAcceleration_04(acceleration, dist, r, x, y){
        //return(0);
        //return((getNeighborStatus(x, y) - r)/40);
        return(acceleration*0.97 + (getNeighborStatus(x, y) - r)/40) //diffrence between neighbors average divide the framerate
    }

    function getRadius_04(dist, r, acceleration, x, y){
        //what happen when people approachign threshold distance?
        if (dist <= 50){
            return((Math.sin(p.frameCount/10) + 1)*span/2);
        }
        //what happen for the shutter that out of range? ripple according to surrounding
        return(r + acceleration);
    }

    Shutter.prototype.update_04= function () {
        this.prev_radius = this.current_radius;
        this.dist = p.createVector(this.x - p.mouseX, this.y - p.mouseY).mag();
        this.acceleration = getAcceleration_04(this.acceleration, this.dist, this.current_radius, this.x, this.y);
        this.current_radius = getRadius_04(this.dist, this.current_radius, this.acceleration, this.x, this.y);
    }

    Shutter.prototype.display_04 = function () {
        p.stroke(0);
        p.strokeWeight(1);
        if (Math.floor(this.current_radius + this.x + this.y) % 10 < 7){
            p.fill(255);
        } else {
            p.fill(100);
        }
        p.ellipse(this.x, this.y, this.current_radius, this.current_radius);
    }

    /////////////p5 global variables
    var x = 1000;
    var y = 600;
    var span = 50;
    var interior;
    var shutter = []; //2 dimensional array corresponding to board contain all the shutter modules

    p.setup = function(){

        p.createCanvas(x, y);
        p.noStroke();
        p.frameRate(40);
        //setup the shutter initial state
        for (var i=0; i<x; i+=span){
            shutter[i] = [];
            for (var j=0; j<y; j+=span){
                shutter[i][j] = new Shutter(i + span/2, j + span/2);
            }
        }
        //p.textAlign(CENTER);
        selector = p.createSelect();
        selector.position(x+20, y-30);
        selector.option("scenario 1");
        selector.option("scenario 2");
        selector.option("scenario 3");
        selector.option("scenario 4");
    }
    p.draw = function(){
        switch (selector.value()) {
            case "scenario 1":
                drawing_01();
                break;
            case "scenario 2":
                drawing_02();
                break;
            case "scenario 3":
                drawing_03();
                break;
            case "scenario 4":
                drawing_04();
                break;
        }
    }
    function drawing_01(){
        p.background(0);
        for (var i=0; i<x; i+=span){
            for (var j=0; j<y; j+=span){
                //console.log(shutter[i][j]); //new Shutter(i + span/2, j + span/2);
                shutter[i][j].update_01();
                shutter[i][j].display_01();
            }
        }
    }

//In Second field, circles will decrease size as people approaching and increase size as people leave

    function drawing_02(){
        p.background(0);
        for (var i=0; i<x; i+=span){
            for (var j=0; j<y; j+=span){
                //console.log(shutter[i][j]); //new Shutter(i + span/2, j + span/2);
                shutter[i][j].update_02();
                shutter[i][j].display_02();
            }
        }
    }

    //In Third field, people will signal a ripple effects
    function drawing_03(){
        p.background(0);
        for (var i=0; i<x; i+=span){
            for (var j=0; j<y; j+=span){
                //console.log(shutter[i][j]); //new Shutter(i + span/2, j + span/2);
                shutter[i][j].update_03();
                shutter[i][j].display_03();
            }
        }


    }

    //In Fourth field, people will signal a ripple effects with overlay
    function drawing_04(){
        p.background(0);
        for (var i=0; i<x; i+=span){
            for (var j=0; j<y; j+=span){
                //console.log(shutter[i][j]); //new Shutter(i + span/2, j + span/2);
                shutter[i][j].update_04();
                shutter[i][j].display_04();
            }
        }
    }
}
///////////////////////////////////////////

var myP5 = new p5(mySketch, "my_container_01");
