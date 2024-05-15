function createDCModule(append, Value1, Type1, Value2, Type2){
    var IdNum = (DC_Modules.length + 1);
    // Create the main container div
    var containerDiv = document.createElement('div');
    containerDiv.className = 'grid-multibar-item';
    containerDiv.id = 'dc-focus-5-' + IdNum; //DC_module_
    if (IdNum == 1) { // first module, so we need to set this focussed
        containerDiv.classList.add('focus');
        containerDiv.classList.add('selected');
    }

    var focusElement = new FocusElement(3, containerDiv.id, uuidv4(), false, IdNum == 1, IdNum == 1);
    containerDiv.setAttribute('uid', focusElement.uid);

    containerDiv.setAttribute('onclick', 'updateMultibar(getElementMultibarNumber(\'' + focusElement.uid + '\'), "dc")');
    containerDiv.style.display = "none";

    // Create the triangle div
    var triangleDiv = document.createElement('div');
    triangleDiv.className = 'multibar-item-triangle';
    triangleDiv.style.borderColor = 'var(--color' + IdNum + ') transparent transparent transparent';

    // Create the top row div
    var topRowDiv = document.createElement('div');
    topRowDiv.className = 'grid-multibar-item-row';

    // Create the top paragraph element
    var topParagraph = document.createElement('p');
    topParagraph.className = 'multibar-item multibar-item-top';

    // Create and append spans for A and B in the top paragraph
    var topSpanA = document.createElement('span');
    topSpanA.className = 'multibar-item-value';
    topSpanA.id = 'DC_Value_Top_' + IdNum;
    topSpanA.innerHTML = Value1;

    var topSpanB = document.createElement('span');
    topSpanB.className = 'multibar-item-type';
    topSpanB.id = 'DC_Type_Top_' + IdNum;
    topSpanB.innerHTML = Type1;

    topParagraph.appendChild(topSpanA);
    topParagraph.appendChild(topSpanB);

    // Append the top paragraph to the top row div
    topRowDiv.appendChild(topParagraph);

    // Create the bottom row div
    var bottomRowDiv = document.createElement('div');
    bottomRowDiv.className = 'grid-multibar-item-row';

    // Create the bottom paragraph element
    var bottomParagraph = document.createElement('p');
    bottomParagraph.className = 'multibar-item multibar-item-bottom';

    // Create and append spans for C and D in the bottom paragraph
    var bottomSpanC = document.createElement('span');
    bottomSpanC.className = 'multibar-item-value';
    bottomSpanC.id = 'DC_Value_Bottom_' + IdNum;
    bottomSpanC.innerHTML = Value2;

    var bottomSpanD = document.createElement('span');
    bottomSpanD.className = 'multibar-item-type';
    bottomSpanD.id = 'DC_Type_Bottom_' + IdNum;
    bottomSpanD.innerHTML = Type2;

    bottomParagraph.appendChild(bottomSpanC);
    bottomParagraph.appendChild(bottomSpanD);

    // Append the bottom paragraph to the bottom row div
    bottomRowDiv.appendChild(bottomParagraph);

    // Append the triangle, top row, and bottom row to the main container div
    containerDiv.appendChild(triangleDiv);
    containerDiv.appendChild(topRowDiv);
    containerDiv.appendChild(bottomRowDiv);

    DC_Modules.push(IdNum);

    if (append) {
        document.getElementById("dc-focus-5").insertBefore(containerDiv, document.getElementById('multibar-dc-arrow'));
        focusTree['dc'][5 - 1].push(focusElement);
    }

    var scrollElement = document.createElement('div');
    scrollElement.classList.add('scroll-bar-element');
    document.getElementById('dc-scroll-bar').appendChild(scrollElement);
}