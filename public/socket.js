var socket = io();
var receivedDataPrev = [0]; // initial value such that the first startup encoder tick does not do unwated scrolling in the UI because of differences
var firstTick = true;

socket.on("module-updates", (arg) => {
    var receivedData = Array.from(new Uint8Array(arg.input));
    //console.log(receivedData.slice(0, 32).join(' '));
    
    // before updating the data, lets compare for the encoder data
    if (!firstTick) {
        //hardwareEncoderTick(receivedDataPrev[0], receivedData[0]);
    }
    else { // always skip the first tick, since that occurs when the page gets loaded and it move the selection by one.
        firstTick = false;
    }

    for (var buttonIndex = 1; buttonIndex < 4; buttonIndex++) {
        if (receivedData[buttonIndex] != 0) {
            console.log("button " + receivedData[buttonIndex]);
            //hardwareButtonClick(receivedData[buttonIndex]);
        }
    }
    receivedDataPrev = [...receivedData];
});

function sendUpdate(buffer) {
    socket.emit('update', buffer);
}