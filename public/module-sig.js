function createSIGModule(append, Value1, Type1, Value2, Type2, Dutycycle, Offset){
    IdNum = (SIG_Modules.length + 1);
    // Create the main container div
    var containerDiv = document.createElement('div');
    containerDiv.className = 'grid-multibar-item';
    containerDiv.id = 'sig-focus-5-' + IdNum;
    if (IdNum == 1) { // first module, so we need to set this focussed
        containerDiv.classList.add('focus');
        containerDiv.classList.add('selected');
    }
    containerDiv.style.display = "none";
    //'SigSine', '20.1kHz', '4.00', 'V<sub>pp</sub>'
    var focusElement = new FocusElement(3, containerDiv.id, uuidv4(), false, IdNum == 1, IdNum == 1, {type: Value1, dutycycle: Dutycycle, offset: Offset, frequency: parseFloat(Type1.replace('kHz', '')), amplitude: parseFloat(Value2)});
    containerDiv.setAttribute('uid', focusElement.uid);
    containerDiv.setAttribute('onclick', 'updateMultibar(getElementMultibarNumber(\'' + focusElement.uid + '\'), "sig")');

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
    topSpanA.id = focusElement.uid + '-top-left';
    topSpanA.innerHTML = '<img class="sig-icon" src="' + Value1 + '.png">';

    var topSpanB = document.createElement('span');
    topSpanB.className = 'multibar-item-type';
    topSpanB.id = focusElement.uid + '-top-right';
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
    bottomSpanC.id = focusElement.uid + '-bottom-left';
    bottomSpanC.innerHTML = Value2;

    var bottomSpanD = document.createElement('span');
    bottomSpanD.className = 'multibar-item-type';
    bottomSpanD.id = focusElement.uid + '-bottom-right';
    bottomSpanD.innerHTML = Type2;

    bottomParagraph.appendChild(bottomSpanC);
    bottomParagraph.appendChild(bottomSpanD);

    // Append the bottom paragraph to the bottom row div
    bottomRowDiv.appendChild(bottomParagraph);

    // Append the triangle, top row, and bottom row to the main container div
    containerDiv.appendChild(triangleDiv);
    containerDiv.appendChild(topRowDiv);
    containerDiv.appendChild(bottomRowDiv);
    SIG_Modules.push(IdNum);

    if (append) {
        document.getElementById("sig-focus-5").insertBefore(containerDiv, document.getElementById('multibar-sig-arrow'));
        focusTree['sig'][5 - 1].push(focusElement);
    }

    var scrollElement = document.createElement('div');
    scrollElement.classList.add('scroll-bar-element');
    document.getElementById('sig-scroll-bar').appendChild(scrollElement);
}