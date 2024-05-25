const FocusElementType = {
    dc_input: 1,        /* DC value input element */
    dc_output: 2,       /* DC value output element */
    sig_type: 3,        /* SIG waveform selection element */
    sig_input: 4,       /* SIG value input element */

    dc_module: 5,       /* DC module (Multibar) element */
    sig_module: 6,
    osc_module: 7,
    logic_module: 8,
    dc_mode: 9,

    dc_nav_tab: 20,
    sig_nav_tab: 21,
    osc_nav_tab: 22,
    logic_nav_tab: 23 
}

function removeFromArray(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}

function TypeToPage(focus_element_type_inst) {
    if (focus_element_type_inst == FocusElementType.dc_input |
        focus_element_type_inst == FocusElementType.dc_output |
        focus_element_type_inst == FocusElementType.dc_nav_tab |
        focus_element_type_inst == FocusElementType.dc_module |
        focus_element_type_inst == FocusElementType.dc_mode
    ) {return 'dc'}
    if (focus_element_type_inst == FocusElementType.sig_type |
        focus_element_type_inst == FocusElementType.sig_input |
        focus_element_type_inst == FocusElementType.sig_nav_tab |
        focus_element_type_inst == FocusElementType.sig_module
    ) {return 'sig'}
    if (focus_element_type_inst == FocusElementType.osc_module |
        focus_element_type_inst == FocusElementType.osc_nav_tab
    ) {return 'osc'}
    if (focus_element_type_inst == FocusElementType.logic_module |
        focus_element_type_inst == FocusElementType.logic_nav_tab
    ) {return 'logic'}
}

function getFocussedElementInRow(page, row) {
    try {
        var DomElement = document.querySelector(`#${page}-focus-${row} .focus`);
        return focusTree[DomElement.getAttribute('uid')];
    } catch (e) { return false }
}

function getSelectedElementInRow(page, row) {
    try {
        var DomElement = document.querySelector(`#${page}-focus-${row} .selected`);
        return focusTree[DomElement.getAttribute('uid')];
    } catch (e) { return false }
}

class FocusElement {
    constructor(type, uid, prev_uid, next_uid, location = {x: -1, y: -1}, defaultValues = {}) {
        this.type = type;
        this.uid = uid;
        this.next_uid = next_uid;
        this.prev_uid = prev_uid;
        this.values = defaultValues;
        this.location = location;
    }

    // Getter for selected
    isSelected() {
        return document.querySelector(`[uid="${this.uid}"]`).classList.contains('selected');
    }

    // Setter for selected
    setSelected(value = true) {
        var DomElement = document.querySelector(`[uid="${this.uid}"]`);

        /* Check if the element is actually selectable */
        if (!DomElement.disabled) {
            /* Remove selected property from other elements in that row */
            var rowElement = document.querySelector(`#${TypeToPage(this.type)}-focus-${this.location.y}`);
            /* Select all elements in that row that have a defined uid, I.e that can be selected */
            rowElement.querySelectorAll('[uid]').forEach(selectableElement => {
                selectableElement.classList.remove('selected');
            })
            value ? DomElement.classList.add('selected') : DomElement.classList.remove('selected');
        }
    }

    // Getter for focus
    isFocused() {
        return document.querySelector(`[uid="${this.uid}"]`).classList.contains('focus');
    }

    // Setter for focus
    setFocus(value = true) {
        var DomElement = document.querySelector(`[uid="${this.uid}"]`);

        /* Check if the element is actually focussable */
        if (!DomElement.disabled) {
            /* Remove selected property from other elements in that row */
            var rowElement = document.querySelector(`#${TypeToPage(this.type)}-focus-${this.location.y}`);
            /* Select all elements in that row that have a defined uid, I.e that can be selected */
            rowElement.querySelectorAll('[uid]').forEach(selectableElement => {
                selectableElement.classList.remove('focus');
            })
            value ? DomElement.classList.add('focus') : DomElement.classList.remove('focus');
        }
    }

    /* focusses on the next element in the row */
    scrollToNext(direction = 1) {
        if (direction == 1) {
            /* The only selectable element in the row */
            if (this.next_uid == this.uid) {
                focusTree[this.next_uid].setSelected(true);
            }
            else {
                focusTree[this.next_uid].setFocus(true);
            }
        }
        else {
            /* The only selectable element in the row */
            if (this.prev_uid == this.uid) {
                focusTree[this.prev_uid].setSelected(true);
            }
            else {
                focusTree[this.prev_uid].setFocus(true);
            }
        }
    }

    /* No arguments is just clicking (= 0), direction < 0 means lower the value, direction > 0 means increase */
    interact(direction = 0) {
        if (this.type >= 20) {
            var DomElement = document.querySelector(`[uid="${this.uid}"]`);
            DomElement.click();
        }
        else {
            switch (this.type) {
                case FocusElementType.dc_input:
                    var DomElement = document.querySelector(`[uid="${this.uid}"]`);
                    
                    if (DomElement.classList.contains('focus') && !DomElement.classList.contains('selected')) {
                        this.setSelected(true);
                    }
                    else if (DomElement.classList.contains('focus') && DomElement.classList.contains('selected')) {
                        if (direction == 0) { this.setSelected(false) }
                        else {
                            var newValue = stepNumberInput(DomElement, direction); /* Step number input returns the value to which it is now set */
                            if (this.uid == 'e6f0ad7f-98cb-4ffd-a967-73592a9673ba') { getSelectedElementInRow(activePage, 5).values.voltage = newValue } // Voltage
                            if (this.uid == 'd1fa07ee-2712-461d-ab16-dd984b4f081a') { getSelectedElementInRow(activePage, 5).values.setpoint = newValue } // Setpoint
                            
                            updateMultibarValues('dc');
                        }
                    }
                    break;
    
                case FocusElementType.dc_output:
                    break;

                case FocusElementType.dc_mode:
                    var domElement = document.querySelector(`[uid="${this.uid}"]`);
                    domElement.click();
                    break;
    
                case FocusElementType.dc_module:
                    var DomElement = document.querySelector(`[uid="${this.uid}"]`);
                    /* If the multibar module is focussed but not selected, select it first */
                    if (DomElement.classList.contains('focus') && !DomElement.classList.contains('selected')) {
                        this.setSelected(true);

                        updateMultibarValues('dc');
                    }
                    break;
    
                case FocusElementType.sig_type:
                    var DomElement = document.querySelector(`[uid="${this.uid}"]`);
                    DomElement.click();
                    break;
    
                case FocusElementType.sig_input:
                    var DomElement = document.querySelector(`[uid="${this.uid}"]`);
                    /* If the sig input is focussed but not selected, select it first */
                    if (DomElement.classList.contains('focus') && !DomElement.classList.contains('selected')) {
                        this.setSelected(true);
                    }
                    else {
                        /* If the sig input is both selected and focussed, but the interaction is just clicking, deselect it instead of changing the number */
                        if (DomElement.classList.contains('focus') && DomElement.classList.contains('selected') && direction == 0) {
                            this.setSelected(false);
                        }
                        else {
                            stepNumberInput(DomElement, direction);
                            updateMultibarValues('dc');
                        }
                    }
                    break;
    
                case FocusElementType.sig_module:
                    break;
    
                case FocusElementType.osc_module:
                    break;
    
                case FocusElementType.logic_module:
                    break;
    
            }
        }
    }
}

function stepNumberInput(inputElement, steps) {
    let value = parseFloat(inputElement.value);
    const min = inputElement.min ? parseFloat(inputElement.min) : -Infinity;
    const max = inputElement.max ? parseFloat(inputElement.max) : Infinity;
    const step = inputElement.step ? parseFloat(inputElement.step) : 1;

    console.log(value, step*steps, value + step*steps);
    value = Math.min(Math.max(parseFloat(value + step*steps).toFixed(2), min), max);
    inputElement.value = value;
    return value;
}

function changeFocusRow(rowNumber) {
    /* remove focus from all rows */
    for (var row = 1; row <= 5; row++) {
        var element = getFocussedElementInRow(activePage, row)
        if (element) {
            element.setFocus(false);
        }
    }

    activeRow = rowNumber;

    var selectedElement = getSelectedElementInRow(activePage, activeRow);
    /* Check if there is an element already selected in the new row */
    if (selectedElement) {
        getSelectedElementInRow(activePage, activeRow).setFocus(true);
    }
    /* If not, enable the default */
    else {
        /* Get the first element in that row (that is selectable) and set focus and selected to it */
        var activeRowElement = document.querySelector(`#${activePage}-focus-${activeRow}`);
        var rowQuery = activeRowElement.querySelectorAll('[uid]');
        for (var index = 0; index < rowQuery.length; index++){
            selectableElement = rowQuery[index];
    
            if (!selectableElement.disabled) {
                var ElementUid = selectableElement.getAttribute('uid');
                focusTree[ElementUid].setFocus(true);
    
                /* If there is only one element in that row, select it already */
                /* Use a filter to count how many elements in that row are actually selectable */
                if (Array.from(rowQuery).filter(element => !element.disabled).length == 1) {
                    focusTree[ElementUid].setSelected(true);
                }
    
                break;
            }
        }
    }
}

var encoderButtonDown = false;

function hardwareButtonClick(buttonNumber) {
    switch (buttonNumber) {
        case 1: // BTN 1
            toggleSideBar();
            break;
        case 2: // BTN 2
            changeFocusRow(5);
            break;
        case 3: // BTN 3
            changeFocusRow(4);
            break;
        case 4: // BTN 4
            changeFocusRow(3)
            break;
        case 5: // BTN 5
            changeFocusRow(2);
            break;
        case 6: // BTN 6
            changeFocusRow(1);
            break;
        case 7: // BTN ENCODER SW RELEASED
            getFocussedElementInRow(activePage, activeRow).interact()
            encoderButtonDown = false;
            // find active selected element
            break;
        case 8: // BTN ENCODER SW PRESSED DOWN
            encoderButtonDown = true;
    }
}

function hardwareEncoderTick(previousEncoderPosition, newEncoderPosition) {
    var differenceEncoderPosition = (newEncoderPosition - previousEncoderPosition);
    if (differenceEncoderPosition == 255) differenceEncoderPosition = -1;
    if (differenceEncoderPosition == 254) differenceEncoderPosition = -2;
    if (differenceEncoderPosition == 253) differenceEncoderPosition = -3;
    if (differenceEncoderPosition == 252) differenceEncoderPosition = -4;
    if (differenceEncoderPosition == -255) differenceEncoderPosition = 1;
    if (differenceEncoderPosition == -254) differenceEncoderPosition = 2;
    if (differenceEncoderPosition == -253) differenceEncoderPosition = 3;
    if (differenceEncoderPosition == -252) differenceEncoderPosition = 4;

    if (differenceEncoderPosition != 0) {
        /* If the focussed element is already selected, scrolling the encoder would mean changing the value, otherwise scroll to other nearby elements */
        if (getFocussedElementInRow(activePage, activeRow) == getSelectedElementInRow(activePage, activeRow)) {
            if (activeRow == 1 | 
                getFocussedElementInRow(activePage, activeRow).type == FocusElementType.sig_type |
                getFocussedElementInRow(activePage, activeRow).type == FocusElementType.dc_mode |
                [5,6,7,8].includes(getFocussedElementInRow(activePage, activeRow).type)) { /* if the current row is the navbar, do not interact but scroll to next instead, same for signal type selection and for any multibar items */
                for (var i = 0; i < Math.abs(differenceEncoderPosition); i++) {
                    getFocussedElementInRow(activePage, activeRow).scrollToNext(differenceEncoderPosition > 0 ? 1 : 0);

                    /* If the element is a multibar item, also update the window visibility (i.e the 4 that can be shown at maximum at any time) */
                    updateMultibarWindow(activePage);
                }
            }
            else {
                getFocussedElementInRow(activePage, activeRow).interact(differenceEncoderPosition);
            }
        }
        else {
            getFocussedElementInRow(activePage, activeRow).scrollToNext(differenceEncoderPosition > 0 ? 1 : 0);
            
            /* If the element is a multibar item, also update the window visibility (i.e the 4 that can be shown at maximum at any time) */
            updateMultibarWindow(activePage);
        }
    }
}

/* Function that re-assings the next and previous UIDs to the elements in the multibar */
function updateMultibarIndeces(page) {
    switch (page) {
        case 'dc':
            for (let i = 0; i < DC_Modules.length; i++) {
                var uid = DC_Modules[i];
                var nextIndex = (i + 1);
                var prevIndex = (i - 1);
        
                if (prevIndex < 0) { prevIndex = DC_Modules.length - 1;}
                if (nextIndex >= DC_Modules.length ) { nextIndex = 0;}
                focusTree[uid].prev_uid = DC_Modules[prevIndex];
                focusTree[uid].next_uid = DC_Modules[nextIndex];
            }
            break;
    }
}

/* Function to synchronise the multibar value with the UI */
function updateMultibarValues(page) {
    if (!getSelectedElementInRow(activePage, 5)) { // Check if there are any selected modules already, if not select the default
        var tempRow = activeRow;
        changeFocusRow(5);
        
        /* Get the first element in that row (that is selectable) and set focus and selected to it */
        var activeRowElement = document.querySelector(`#${activePage}-focus-${activeRow}`);
        var rowQuery = activeRowElement.querySelectorAll('[uid]');
        for (var index = 0; index < rowQuery.length; index++){
            selectableElement = rowQuery[index];
    
            if (!selectableElement.disabled) {
                var ElementUid = selectableElement.getAttribute('uid');
                focusTree[ElementUid].setFocus(true);
                focusTree[ElementUid].setSelected(true);
                break;
            }
        }
        changeFocusRow(tempRow);
    }
    switch (page) {
        /* This is different for each page, take a look at all the IDs and what they link to */
        case 'dc':
            /* If there are no DC_Modules, no update is needed */
            if (DC_Modules.length == 0) {
                break;
            }
            /* Update the UI with the data of this multibar */
            document.querySelector(`[uid="e6f0ad7f-98cb-4ffd-a967-73592a9673ba"]`).value = getSelectedElementInRow(page, 5).values.voltage; // Voltage
            document.querySelector(`#dc-voltage-label`).innerHTML = getSelectedElementInRow(page, 5).values.voltageUnit; // VoltageUnit
            document.querySelector(`[uid="d1fa07ee-2712-461d-ab16-dd984b4f081a"]`).value = getSelectedElementInRow(page, 5).values.setpoint; // Setpoint
            document.querySelector(`[uid="12f81bce-fded-4eb8-9352-97ea88fcc59b"]`).value = getSelectedElementInRow(page, 5).values.current; // Current
            document.querySelector(`#dc-current-label`).innerHTML = getSelectedElementInRow(page, 5).values.currentUnit; // CurrentUnit
            
            DC_Modules.forEach(uid => {
                var domElement = document.querySelector(`[uid="${uid}"]`);
                var focusElement = focusTree[uid];
                document.querySelector(`#DC_Value_Top_${uid}`).innerHTML = focusElement.values.voltage;
                document.querySelector(`#DC_Type_Top_${uid}`).innerHTML = focusElement.values.voltageUnit;
                document.querySelector(`#DC_Value_Bottom_${uid}`).innerHTML = focusElement.values.current;
                document.querySelector(`#DC_Type_Bottom_${uid}`).innerHTML = focusElement.values.currentUnit;
            });
            break;
    }
}

/* Function to update the visible 4 modules (window) */
function updateMultibarWindow(page) {
    switch (page) {
        case 'dc':
            /* If there are no DC_Modules, change the opacity */
            document.documentElement.style.setProperty('--dc-module-count', DC_Modules.length + 0.05);
            if (DC_Modules.length == 0) {
                break;
            }

            DC_Modules.forEach(uid => {
                var domElement = document.querySelector(`[uid="${uid}"]`);
                domElement.style.display = 'none';
            });

            for (var i = 0; i < DC_Modules.length; i++) {
                var uid = DC_Modules[i];
                var focusElement = focusTree[uid];
                if ((activeRow == 5) ? focusElement.isFocused() : focusElement.isSelected()) {
                    /* Check wether it is outside the window on the left or the right */
                    if (i < Math.min(...DC_ModulesWindow)) { /* Left */
                        var delta = Math.min(...DC_ModulesWindow) - i; /* Calculate the amount the window has to be shifted */
                        DC_ModulesWindow = DC_ModulesWindow.map(v => v - delta);
                        console.log('left', delta);
                    }
                    else if (i > Math.max(...DC_ModulesWindow)) { /* Right */
                        var delta = i - Math.max(...DC_ModulesWindow); /* Calculate the amount the window has to be shifted */
                        DC_ModulesWindow = DC_ModulesWindow.map(v => v + delta);
                        console.log('right', delta);
                    }
                    
                    DC_ModulesWindow.forEach(index => {
                        if (index < DC_Modules.length) { /* The window is by default too big, ignore the out of range window elements */
                            var visibleUid = DC_Modules[index];
                            var domElement = document.querySelector(`[uid="${visibleUid}"]`);
                            domElement.style.display = 'block';
                        }
                    });
                }
            }
            break;
    }
}

/* Removes a specific module by UID */
function removeMultibarModule(uid) {
    /* Get the DOM elements */
    var child = document.querySelector(`[uid="${uid}"]`);
    var parent = document.getElementById(`${TypeToPage(focusTree[uid].type)}-focus-5`);

    /* Remove any trace of the elements existence */
    parent.removeChild(child);
    delete focusTree[uid];
    DC_Modules = removeFromArray(DC_Modules, uid);

    /* Update the UI accordingly */
    updateMultibarValues('dc');
    updateMultibarIndeces('dc');
    updateMultibarWindow('dc');
}

/* Function used as the onclick handler for multibar modules */
function selectMultibarModule(uid) {
    var domElement = document.querySelector(`[uid="${this.uid}"]`);
    var focusElement = focusTree[uid];

    /* First remove focus and selected from current module */
    var element = getFocussedElementInRow(activePage, 5)
    if (element) {
        element.setFocus(false);
    }
    var element = getSelectedElementInRow(activePage, 5)
    if (element) {
        element.setSelected(false);
    }

    focusElement.setSelected(true);
    if (activeRow == 5) {
        focusElement.setFocus(true);
    }
    updateMultibarValues(activePage);
}

function externalUpdate(uid, values) {
    focusTree[uid].values = values;
}