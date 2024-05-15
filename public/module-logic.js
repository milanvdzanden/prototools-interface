function createLOGICChannel(labelBottom) {
    LOGIC_Channels.push(LOGIC_Channels.length + 1);

    // Create main container
    var rowContainer = document.createElement('div');
    rowContainer.className = 'grid-logic-row';

    // Create left column
    var leftColumn = document.createElement('div');
    leftColumn.className = 'grid-logic-column';
    leftColumn.style = "border-left: 5px solid var(--color" + ((LOGIC_Channels.length - 1) % 8 + 1) + ");"

    // Create label containers and labels
    var labelContainerTop = document.createElement('div');
    labelContainerTop.className = 'grid-logic-label-container';
    var labelTopElement = document.createElement('p');
    labelTopElement.className = 'logic-label logic-label-top';
    labelTopElement.textContent = "CH " + LOGIC_Channels.length;
    labelContainerTop.appendChild(labelTopElement);

    var labelContainerBottom = document.createElement('div');
    labelContainerBottom.className = 'grid-logic-label-container';
    var labelBottomElement = document.createElement('p');
    labelBottomElement.className = 'logic-label logic-label-bottom';
    labelBottomElement.innerHTML = labelBottom;
    labelContainerBottom.appendChild(labelBottomElement);

    // Append label containers to the left column
    leftColumn.appendChild(labelContainerTop);
    leftColumn.appendChild(labelContainerBottom);

    // Create right column
    var rightColumn = document.createElement('div');
    rightColumn.className = 'grid-logic-column grid-logic-column-wide';
    rightColumn.id = 'logic-column-' + LOGIC_Channels.length;

    // Create canvas
    var canvas = document.createElement('canvas');
    canvas.className = 'logic-canvas';
    canvas.id = 'logic-canvas-' + LOGIC_Channels.length;

    // Append canvas to the right column
    rightColumn.appendChild(canvas);

    // Append left and right columns to the main container
    rowContainer.appendChild(leftColumn);
    rowContainer.appendChild(rightColumn);

    // Return the generated element
    document.getElementById('logic-channels').appendChild(rowContainer);
}

function updateLogicChannels(){
    document.querySelector(':root').style.setProperty('--logic-number', Math.max(5,LOGIC_Channels.length));
    const canvasList = document.getElementsByClassName('logic-canvas');
    const columnList = document.getElementsByClassName('grid-logic-column-wide');

    LOGIC_Channels.forEach(Channel => {
        new p5((sketch)=>{logicP5(sketch, Channel)});
    });
}