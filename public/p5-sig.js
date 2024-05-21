var sigP5 = function( sketch ) {
    var dynamicHeight; var dynamicWidth;
    var sigCanvas;
    sketch.setup = function() {

        sigCanvas = document.getElementById('sig-viewport');
        let column = document.getElementsByClassName('sig-viewport-wrapper')[0];
        dynamicWidth = column.clientWidth;
        dynamicHeight = column.clientHeight;
        console.log(dynamicWidth, dynamicHeight);
        cnv = sketch.createCanvas(dynamicWidth, dynamicHeight, sigCanvas);
        sketch.frameRate(2);
    }

    sketch.draw = function(){
        if (activePage == 'sig'){
            console.log('sig drawing');
            sketch.clear();
            sketch.fill(0,0,0,0);

            var configuration = getSigConfiguration();

            var offsetY = (((-configuration.offset / 1000) + ((configuration.waveform == 2) ? -configuration.amplitude/2 : 0)) / (configuration.amplitude / 2)) * (20) + dynamicHeight / 2;
            var centerY = dynamicHeight / 2;
            var marginX = 40;

            sketch.stroke(106, 106, 127, 64);
            sketch.line(10, centerY, dynamicWidth - 10, centerY);

            sketch.strokeWeight(2);
            sketch.stroke(106, 106, 127);

            sketch.beginShape();
            if (configuration.waveform == 1) { // sine
                for (var x = marginX; x <= dynamicWidth - marginX; x++) {
                    sketch.vertex(x, offsetY + Math.sin((x - marginX)*0.053) * 20);
                }
            } 
            else if (configuration.waveform == 2) { // square
                for (let x = marginX; x <= dynamicWidth - marginX; x++) {
                    let t = x * (1 / (dynamicWidth - 2 * marginX)); // Time parameter normalized to one period
                    let y = offsetY + squareWave(t, 2, 1 - configuration.dutycycle / 100) * 20; // Amplitude is set to 100
                    sketch.vertex(x, y);
                }
            }
            else if (configuration.waveform == 3) { // triangle
                for (let x = marginX; x <= dynamicWidth - marginX; x++) {
                    let t = x * (1 / (dynamicWidth - 2 * marginX)); // Time parameter normalized to one period
                    let y = offsetY + (triangleWave(t, 2, 1 - configuration.dutycycle / 100) / 2) * 20; // Amplitude is set to 100
                    sketch.vertex(x, y);
                }
            }
            sketch.endShape();
        }
    }
};

function squareWave(t, frequency, dutyCycle) {
    let period = 1 / frequency;
    let tInPeriod = (t % period) / period;
  
    return tInPeriod < dutyCycle ? 1 : -1;
}
function triangleWave(t, frequency, dutyCycle) {
    let period = 1 / frequency;
    let tInPeriod = (t % period) / period;
  
    if (tInPeriod < dutyCycle) {
      return -2 + 4 * (tInPeriod / dutyCycle);
    } else {
      return 2 - 4 * ((tInPeriod - dutyCycle) / (1 - dutyCycle));
    }
  }

function getSigConfiguration(){
    var output = {};
    if (document.getElementById('sig-focus-2-1').classList.contains('selected')) output.waveform = 1;
    if (document.getElementById('sig-focus-2-2').classList.contains('selected')) output.waveform = 2;
    if (document.getElementById('sig-focus-2-3').classList.contains('selected')) output.waveform = 3;
    output.frequency = parseFloat(document.querySelector('[uid="823c3894-892d-430a-ab55-bda993824f3e"]').value);
    output.dutycycle = parseFloat(document.querySelector('[uid="5db72ec2-aca4-4e0d-a767-ead843472575"]').value);
    output.amplitude = parseFloat(document.querySelector('[uid="d02d85f3-a6d6-4259-a178-53c00aa46648"]').value);
    output.offset = parseFloat(document.querySelector('[uid="4707b675-b39b-4881-94d6-3ab4b53f2cd6"]').value);
    return output;
}

function sigTypeSelection(id) {
    document.getElementById('sig-focus-2-1').classList.remove('selected');
    document.getElementById('sig-focus-2-2').classList.remove('selected');
    document.getElementById('sig-focus-2-3').classList.remove('selected');
    document.getElementById(id).classList.add('selected');
}