function createDCModule(append, Value1, Type1, Value2, Type2){
    var uid = uuidv4();

    // Create the main container div
    var containerDiv = document.createElement('div');
    containerDiv.className = 'grid-multibar-item';

    if (DC_Modules.length == 0) { // first module, so we need to set this focussed
        containerDiv.classList.add('focus');
        containerDiv.classList.add('selected');
    }

    containerDiv.setAttribute('uid', uid);
    containerDiv.setAttribute('onclick', `selectMultibarModule('${uid}')`);
    containerDiv.style.display = 'block';

    // Create the triangle div
    var triangleDiv = document.createElement('div');
    triangleDiv.className = 'multibar-item-triangle';
    triangleDiv.style.borderColor = `var(--color${DC_Modules.length + 1}) transparent transparent transparent`;

    // Create the top row div
    var topRowDiv = document.createElement('div');
    topRowDiv.className = 'grid-multibar-item-row';

    // Create the top paragraph element
    var topParagraph = document.createElement('p');
    topParagraph.className = 'multibar-item multibar-item-top';

    // Create and append spans for A and B in the top paragraph
    var topSpanA = document.createElement('span');
    topSpanA.className = 'multibar-item-value';
    topSpanA.id = 'DC_Value_Top_' + uid;
    topSpanA.innerHTML = Value1;

    var topSpanB = document.createElement('span');
    topSpanB.className = 'multibar-item-type';
    topSpanB.id = 'DC_Type_Top_' + uid;
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
    bottomSpanC.id = 'DC_Value_Bottom_' + uid;
    bottomSpanC.innerHTML = Value2;

    var bottomSpanD = document.createElement('span');
    bottomSpanD.className = 'multibar-item-type';
    bottomSpanD.id = 'DC_Type_Bottom_' + uid;
    bottomSpanD.innerHTML = Type2;

    bottomParagraph.appendChild(bottomSpanC);
    bottomParagraph.appendChild(bottomSpanD);

    // Append the bottom paragraph to the bottom row div
    bottomRowDiv.appendChild(bottomParagraph);

    // Append the triangle, top row, and bottom row to the main container div
    containerDiv.appendChild(triangleDiv);
    containerDiv.appendChild(topRowDiv);
    containerDiv.appendChild(bottomRowDiv);

    DC_Modules.push(uid);

    var newFocusElement = new FocusElement(FocusElementType.dc_module, uid, 'none', 'none', {x: DC_Modules.length + 1, y: 5}, {voltage: Value1, voltageUnit: Type1, current: Value2, currentUnit: Type2, setpoint: 0});

    focusTree[uid] = newFocusElement;

    if (append) {
        document.getElementById("dc-focus-5").insertBefore(containerDiv, document.getElementById('multibar-dc-arrow'));
    }

    var scrollElement = document.createElement('div');
    scrollElement.classList.add('scroll-bar-element');
    document.getElementById('dc-scroll-bar').appendChild(scrollElement);

    /* Update the DC Multibar */
    updateMultibarValues('dc');
    updateMultibarIndeces('dc');
    updateMultibarWindow('dc');
}

function dcTypeSelection(id) {
    document.getElementById('dc-focus-2-2').classList.remove('toggled');
    document.getElementById('dc-focus-2-3').classList.remove('toggled');
    document.getElementById(id).classList.add('toggled');
}