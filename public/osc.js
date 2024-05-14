var B24 = '#ff0000';
var B30 = '#4b4b59';
var B49 = '#6A6A7F';


var horizontalDividerNumber = 9;
var verticalDividerNumber = 5;
var horizontalSubDividerNumber = 5;
var verticalSubDividerNumber = 5;

var subDividerWidth = 6;

var oscP5_1 = function( sketch ) {
    sketch.setup = function() {
        let oscCanvasBg = document.getElementById('osc-viewport-bg');
        let viewport = document.getElementsByClassName('viewport-wrapper')[0];
        dynamicWidth = viewport.clientWidth;
        dynamicHeight = viewport.clientHeight;
    
        let cnv = sketch.createCanvas(dynamicWidth, dynamicHeight, oscCanvasBg);
        sketch.background(49, 49, 58);

        sketch.strokeWeight(2);
        sketch.stroke(B30);
        for (var i = 1; i <= horizontalDividerNumber; i++){
            sketch.line((dynamicWidth / (horizontalDividerNumber + 1)) * i, 0, (dynamicWidth / (horizontalDividerNumber + 1)) * i, dynamicHeight);
        }
        for (var i = 1; i <= verticalDividerNumber; i++){
            sketch.line(0, (dynamicHeight / (verticalDividerNumber + 1)) * i, dynamicWidth, (dynamicHeight / (verticalDividerNumber + 1)) * i);
        }
        for (var i = 1; i < (verticalDividerNumber + 1) * verticalSubDividerNumber; i++) {
            sketch.line(dynamicWidth / 2 - subDividerWidth, (dynamicHeight / ((verticalDividerNumber + 1) * verticalSubDividerNumber)) * i, dynamicWidth / 2 + subDividerWidth, (dynamicHeight / ((verticalDividerNumber + 1) * verticalSubDividerNumber)) * i);
        }
        for (var i = 1; i < (horizontalDividerNumber + 1) * horizontalSubDividerNumber; i++) {
            sketch.line((dynamicWidth / ((horizontalDividerNumber + 1) * horizontalSubDividerNumber)) * i , dynamicHeight / 2 - subDividerWidth, (dynamicWidth / ((horizontalDividerNumber + 1) * horizontalSubDividerNumber)) * i, dynamicHeight / 2 + subDividerWidth);
        }

        sketch.strokeWeight(4);
        sketch.line((dynamicWidth / 2), 0, (dynamicWidth / 2), dynamicHeight);
        sketch.line(0, (dynamicHeight / 2), dynamicWidth, (dynamicHeight / 2));
        sketch.frameRate(1);
    }
};

var oscP5_2 = function( sketch ) {

    sketch.setup = function() {
        let oscCanvas = document.getElementById('osc-viewport');
        let viewport = document.getElementsByClassName('viewport-wrapper')[0];
        dynamicWidth = viewport.clientWidth;
        dynamicHeight = viewport.clientHeight;
        let cnv2 = sketch.createCanvas(dynamicWidth, dynamicHeight, oscCanvas);
        sketch.frameRate(10);
    }

    sketch.draw = function(){
        if (document.getElementById("parent-osc").classList.contains('parent-active')){
            console.log('osc drawing');
            sketch.stroke(255,0,0);
            sketch.strokeWeight(2);
            sketch.line (0,0, 300, 300);
        }
    }
};