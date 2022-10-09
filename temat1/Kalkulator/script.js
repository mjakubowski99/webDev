
const constants = {
    digits: [0,1,2,3,4,5,6,7,8,9],
    arithmeticOperators: ['+', '-', '/', '*'],
    dot: ".",
    eqaualSymbol: "=",
    clearButtons: ["C", "CL"],
    initialDisplayValue: "",
    states: {
        number_state: "number",
        operator_state: "operator",
        equals_state: "equals"
    }
}

let calculatorLogic = null;

function gen() {
    const scale = 2;
    const container = document.getElementById("main");

    const calculatorUiBuilder = new CalculatorUiBuilder(main,scale);
    calculatorUiBuilder.build();

    calculatorLogic = new CalculatorLogic(
        main.querySelector('#display'),
        main.querySelectorAll(".action-button"),
        main.querySelector(".history-button")
    );
}

function checkIfCalculatorLogicInitialized(){
    if( calculatorLogic === null ){
        throw "Calculator logic object must be initialized";
    }
}

function historyButtonClicked(event){
    checkIfCalculatorLogicInitialized();
    alert(calculatorLogic.calculationsHistory);
}

function calculatorButtonClicked(event) {
    checkIfCalculatorLogicInitialized();
    const key = event.target.dataset.value;

    if( key === "C" ){
        calculatorLogic.clear();
        return;
    }

    if( key === "CL" ){
        calculatorLogic.clearLastSymbolFromDisplay();
        return;
    }

    calculatorLogic.addKeyToBuffer(key);
    calculatorLogic.display.innerText = calculatorLogic.transformBufferToString();
}

class CalculatorUiBuilder{

    constructor(container, scale){
        this.container = container;
        this.scale = scale;
    }

    build(){
        this.styleContainer();
        this.attachDisplay();
        this.attachButttons();
        this.attachNewLineSeparator();
        this.attachHistoryButton();
    }

    attachDisplay(){
        const calculatorDisplay = document.createElement("div");
        calculatorDisplay.style.height = this.scalePexels(50);
        calculatorDisplay.style.backgroundColor = "white";
        calculatorDisplay.style.border = "1px solid gray";
        calculatorDisplay.innerText = constants.initialDisplayValue;
        calculatorDisplay.setAttribute('id', 'display');
    
        this.container.appendChild( calculatorDisplay );
    }

    attachButttons(){
        let buttons = [
            ...constants.arithmeticOperators,
            constants.dot,
            constants.eqaualSymbol,
            ...constants.digits,
            ...constants.clearButtons
        ];

        for(let i=0; i<buttons.length; i++){
            this.container.appendChild(
                this.createSingleButton(buttons[i])
            );

            if( (i+1)%4 === 0 ){
                this.attachNewLineSeparator();
            }
        }
    }

    attachHistoryButton(){
        const historyBtn = document.createElement("button");
        historyBtn.innerText = "Pokaż historię";
        historyBtn.style.margin = this.scalePexels(3);
        historyBtn.setAttribute("id", "history-button");
        historyBtn.onclick = historyButtonClicked;
    
        this.container.appendChild(historyBtn);
    }

    createSingleButton(key){
        const calculatorButton = document.createElement("button")
        calculatorButton.innerText = key
        calculatorButton.style.margin = this.scalePexels(5);
        calculatorButton.style.width = this.scalePexels(40);
        calculatorButton.style.height = this.scalePexels(40);
        calculatorButton.classList.add("action-button");

        calculatorButton.dataset.value = key;

        return calculatorButton
    }

    attachNewLineSeparator(){
        this.container.appendChild( document.createElement("br") );
    }

    scalePexels(pexels){
        return (pexels * this.scale).toString() + "px";
    }

    styleContainer(){
        this.container.style.width = this.scalePexels(200);
        this.container.style.height = this.scalePexels(300);
        this.container.style.backgroundColor = "gray";
    }
}

class CalculatorLogic{

    constructor(display, buttons){
        this.buffer = [];
        this.display = display;
        this.buttons = buttons;
        this.calculationsHistory = [];
        this.state = constants.states.number_state;

        for(let button of this.buttons){
            button.onclick = calculatorButtonClicked;
        }
    }

    updateState(key){
        if( constants.arithmeticOperators.includes(key) ){
            this.state = constants.states.operator_state;
        }
        else if( constants.digits.includes( parseInt(key) ) ){
            this.state = constants.states.number_state;
        }
        else if( key === constants.eqaualSymbol ){
            this.state = constants.states.equals_state;
        }
    }

    addKeyToBuffer(key){
        this.updateState(key);
    
        if( this.checkIfWeNeedToPushBufferAtPosition(1) ){
            this.buffer.push(key);
        }
        else if( this.checkIfWeNeedAddAnotherDigitToBufferAtPosition(1) ){
            this.buffer[0] = this.addNewSymbolToBufferElement(this.buffer[0], key);
        }
        else if( this.checkIfWeAreInTheCaseWhenTryToAddOperatorAtBegin() ){
            return;
        }
        else if( this.checkIfWeCanAddOperatorToBuffer() ){
            this.buffer[1] = key;
        }
        else if( this.checkIfWeNeedToPushBufferAtPosition(3) ){
            this.buffer.push(key);
        }
        else if( this.checkIfWeNeedAddAnotherDigitToBufferAtPosition(3) ){
            this.buffer[2] = this.addNewSymbolToBufferElement(this.buffer[2], key);
        }
        else if( this.checkIfWeHaveSecondOperatorInBuffer() ){
            this.buffer = [ this.calculateResult().toString(), key];
        }
        else if( this.checkIfWeShouldRunCalculations() ){
            this.buffer = [this.calculateResult().toString()];
        }
        console.log(this.buffer);
    }

    checkIfWeNeedToPushBufferAtPosition(position){
        return this.buffer.length === position-1 && this.state === constants.states.number_state;
    }

    checkIfWeNeedAddAnotherDigitToBufferAtPosition(position){
        return this.buffer.length === position && this.state === constants.states.number_state;
    }

    checkIfWeAreInTheCaseWhenTryToAddOperatorAtBegin(){
        return this.buffer.length === 0 
            && ( this.state === constants.states.operator_state || this.state === constants.states.operator_state );
    }

    checkIfWeCanAddOperatorToBuffer(){
        return this.buffer.length === 1 && this.state === constants.states.operator_state;
    }

    checkIfWeHaveSecondOperatorInBuffer(){
        return this.buffer.length === 3 && this.state === constants.states.operator_state;
    }

    checkIfWeShouldRunCalculations(){
        return this.state === constants.states.equals_state;
    }

    addNewSymbolToBufferElement(str, chr){
        if( this.checkIfNotTryToInsertSecondDot(str,chr) ){
            return str;
        }
        str = str+chr;

        return this.removeLeadingZeroIfNeeded(str);
    }

    removeLeadingZeroIfNeeded(str){
        if( str.length >= 2 && str[0] === '0' && str[1] !== '.'){
            return str.substring(1);
        }
        return str;
    }

    checkIfNotTryToInsertSecondDot(str, chr){
        return chr==="." && str.includes(".");
    }

    clear(){
        this.buffer = [];
        this.display.innerText = constants.initialDisplayValue;
    }

    clearLastSymbolFromDisplay(){
        //if buffer is empty we don't need to do anythin
        if( this.buffer.length === 0 ){
            return;
        }
    
        let lastIndex = this.buffer.length-1;
        this.buffer[lastIndex] = this.buffer[lastIndex].slice(0,-1);
    
        //if buffer on the last index is empty string we can remove that element
        if( !this.buffer[lastIndex] ){
            this.buffer.pop();
        }
    
        this.display.innerText = this.transformBufferToString();
    }

    transformBufferToString(){
        return this.buffer.join('');
    }

    calculateResult(){
        if( this.buffer.length < 2 ){
            throw "Buffer size is to low";
        }
        if( this.buffer.length === 2 ){
            return parseFloat(this.buffer[1]);
        }
    
        let a = parseFloat(this.buffer[0]);
        let b = parseFloat(this.buffer[2]);
        let operator = this.buffer[1];
    
        let result = undefined;
    
        switch(operator){
            case "+":
                result = a+b;
                break;
            case "-":
                result = a-b;
                break;
            case "/":
                if( b===0 ){
                    alert("Dzielenie przez 0");
                    return 0;
                }
                result = a/b;
                break;
            case "*":
                result = a*b;
                break;
            default:
                throw "Invalid operator type passed in buffer";    
        }
    
        const historyString = a.toString() + " " + this.buffer[1] + " "+ b.toString() + " = " + result;
        this.calculationsHistory.push(historyString);
        return result;
    }
}
