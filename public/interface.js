const FocusElementType = {
    dc_input: 1,        /* DC value input element */
    dc_output: 2,       /* DC value output element */
    sig_type: 3,        /* SIG waveform selection element */
    sig_input: 4,       /* SIG value input element */

    dc_module: 5,       /* DC module (Multibar) element */
    sig_module: 6,
    osc_module: 7,
    logic_module: 8,

    dc_nav_tab: 20,
    sig_nav_tab: 21,
    osc_nav_tab: 22,
    logic_nav_tab: 23
}

function TypeToPage(focus_element_type_inst) {
    if (focus_element_type_inst == FocusElementType.dc_input |
        focus_element_type_inst == FocusElementType.dc_output |
        focus_element_type_inst == FocusElementType.dc_nav_tab |
        focus_element_type_inst == FocusElementType.dc_module
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
    constructor(type, uid, next_uid, location = {x: -1, y: -1}, defaultValues = {}) {
        this.type = type;
        this.uid = uid;
        this.next_uid = next_uid;
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
    scrollToNext() {
        /* The only selectable element in the row */
        if (this.next_uid == this.uid) {
            focusTree[this.next_uid].setSelected(true);
        }
        else {
            focusTree[this.next_uid].setFocus(true);
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
                    stepNumberInput(DomElement, direction);
                    break;
    
                case FocusElementType.dc_output:
                    break;
    
                case FocusElementType.dc_module:
                    break;
    
                case FocusElementType.sig_type:
                    break;
    
                case FocusElementType.sig_input:
                    var DomElement = document.querySelector(`[uid="${this.uid}"]`);
                    stepNumberInput(DomElement, direction);
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

    value = Math.min(Math.max(value + step*steps, min), max);
    inputElement.value = value;
}

function changeFocusRow(rowNumber) {
    var focussedElement = getFocussedElementInRow(activePage, activeRow);
    if (focussedElement) {
        focussedElement.setFocus(false);
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
        activeRowElement.querySelectorAll('[uid]').forEach(selectableElement => {
            if (!selectableElement.disabled) {
                var ElementUid = selectableElement.getAttribute('uid');
                focusTree[ElementUid].setSelected(true);
                focusTree[ElementUid].setFocus(true);
            }
        })
    }
}

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
            interactFocusElement();
            encoderButtonDown = false;
            // find active selected element
            break;
        case 8: // BTN ENCODER SW PRESSED DOWN
            encoderButtonDown = true;
    }
}