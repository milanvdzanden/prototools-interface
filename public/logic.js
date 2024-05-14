var B24 = '#34343F';
var B30 = '#4b4b59';
var B49 = '#6A6A7F';


var colorPalette = ["#961FEA",
"#ED1E79",
"#4192C4",
"#42C162",
"#b3d559",  
"#F5CB5C", 
"#FF7F50", 
"#E04949"];

var testData = [[0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
[0,1,1,1,0,1,1,0,1,0,0,0,1,1,1,0,1,1,0,1,0,0,0,1,1,1,0,1,1,0,1,0],
[0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
[0,1,1,1,0,1,1,0,1,0,0,0,1,1,1,0,1,1,0,1,0,0,0,1,1,1,0,1,1,0,1,0],
[0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
[0,1,1,1,0,1,1,0,1,0,0,0,1,1,1,0,1,1,0,1,0,0,0,1,1,1,0,1,1,0,1,0],
[0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
[0,1,1,1,0,1,1,0,1,0,0,0,1,1,1,0,1,1,0,1,0,0,0,1,1,1,0,1,1,0,1,0],
[0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
[0,1,1,1,0,1,1,0,1,0,0,0,1,1,1,0,1,1,0,1,0,0,0,1,1,1,0,1,1,0,1,0]];

var logicP5 = function( sketch, Id ) {
    var width = 0;
    var height = 0;
    sketch.setup = function() {
        let oscCanvas = document.getElementById('logic-canvas-' + Id);
        let column = document.getElementById('logic-column-' + Id);
        dynamicWidth = column.clientWidth;
        width = dynamicWidth;
        dynamicHeight = column.clientHeight;
        height = dynamicHeight;
        let cnv2 = sketch.createCanvas(dynamicWidth, dynamicHeight, oscCanvas);
        sketch.frameRate(10);
    }

    sketch.draw = function(){
        if (document.getElementById("parent-logic").classList.contains('parent-active')){
            sketch.stroke(B30);
            sketch.strokeWeight(1);
            for (var i = 1; i < 10; i++){
                sketch.line (i*width/10, 0, i*width/10, height);
            }
            var segment = width/((testData[Id-1]).length);
            sketch.stroke(colorPalette[((Id - 1) % 8)]);
            var prev = testData[Id-1][0];
            for (var j = 0; j < (testData[Id-1]).length; j++){
                var x = j+1;
                var value = testData[Id-1][j];
                
                sketch.line(((x-1)*segment), height - 5 - value * (0.6*height), (x*segment), height - 5 - value * (0.6*height));

                if (prev != value) {
                    sketch.line((x-1)*segment, height - 5 - prev * (0.6*height), (x-1)*segment, height - 5 - value * (0.6*height))
                }

                prev = testData[Id-1][j];
            }
        }
    }
};