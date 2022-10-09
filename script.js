
const number_state = "number";
const operator_state = "operator";
const equals_state = "equals";

let state = "number";

let scale = 2;

let numbers = [0,1,2,3,4,5,6,7,8,9];
let operators = ['+', '-', '/', '*'];
let initialDisplayValue = "0";
let calculatorDisplay = null;

let buffer = [];
let calculationsHistory = [];

function scalePexels(pexels){
    return (pexels * scale).toString() + "px";
}

function createCalculatorButton(key){
    const keyButton = document.createElement("button")
    keyButton.innerText = key
    keyButton.style.margin = scalePexels(5);
    keyButton.style.width = scalePexels(40);
    keyButton.style.height = scalePexels(40);
    keyButton.onclick = calculatorButtonClicked;

    keyButton.dataset.value = key;
    keyButton.setAttribute('id', 'key-'+key);
    keyButton.setAttribute('class', 'key-number');

    return keyButton
}

function createNewLineSeparator(){
    return document.createElement("br");
}

function initButtons(container){
    let buttons = ['+', '-', '/', '*', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '=', '.', 'C', 'CL'];
    
    for(let i=0; i<buttons.length; i++){
        container.appendChild(createCalculatorButton(buttons[i]));

        if( (i+1)%4 === 0 ){
            container.appendChild(createNewLineSeparator());
        }
    }
}

function styleContainer(container){
    container.style.width = scalePexels(200);
    container.style.height = scalePexels(300);
    container.style.backgroundColor = "gray";
}

function createCalculatorDisplay(initialContent = "0"){
    const calculatorDisplay = document.createElement("div");
    calculatorDisplay.style.height = scalePexels(50);
    calculatorDisplay.style.backgroundColor = "white";
    calculatorDisplay.style.border = "1px solid gray";
    calculatorDisplay.innerText = initialContent;

    return calculatorDisplay;
}

function initOthers(main, operators){
    for(let operator of operators){
        let operatorButton = createKeyButtonBase(operator);
        operatorButton.dataset.value = operator;
        main.appendChild(operatorButton);
    }
}

function clearDisplay(){
    buffer = [];
    calculatorDisplay.innerText = initialDisplayValue;
}

function clearLastChar(){
    if( buffer.length < 1 ){
        return;
    }

    let last = buffer.length-1;
    buffer[last] = buffer[last].slice(0,-1);

    if( !buffer[last] ){
        buffer.pop();
    }

    calculatorDisplay.innerText = buffer.join('');
}

function addCharToStringNumber(str, chr){
    if(chr==="." && str.includes(".") ){
        return str;
    }
    str = str+chr;

    if( str.length >= 2 && str[0] === '0' && str[1] !== '.'){
        return str.substring(1);
    }
    return str;
}

function calculateResult(buffer){
    if( buffer.length < 2 ){
        throw "Buffer size is to low";
    }
    if( buffer.length === 2 ){
        return parseFloat(buffer[1]);
    }

    let a = parseFloat(buffer[0]);
    let b = parseFloat(buffer[2]);

    let result = undefined;

    switch(buffer[1]){
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

    historyString = a.toString() + " " + buffer[1] + " "+ b.toString() + " = " + result;

    calculationsHistory.push(historyString);
    return result;
}

function addKeyToBuffer(key){
    if( operators.includes(key) ){
        state = operator_state;
    }
    else if( numbers.includes( parseInt(key) ) ){
        state = number_state;
    }
    else if( key === "=" ){
        state = equals_state;
    }

    if( buffer.length === 0 && state === number_state){
        buffer.push(key);
    }
    else if( buffer.length === 1 && state === number_state ){
        buffer[0] = addCharToStringNumber(buffer[0], key);
    }
    else if( buffer.length === 0 && state === operator_state ){
        return;
    }
    else if( buffer.length === 1 && state === operator_state ){
        buffer[1] = key;
    }
    else if( buffer.length === 2 && state === number_state ){
        buffer.push(key);
    }
    else if( buffer.length === 3 && state === number_state ){
        buffer[2] = addCharToStringNumber(buffer[2], key);
    }
    else if( buffer.length === 3 && state === operator_state ){
        buffer = [calculateResult(buffer), key];
    }
    else if( state === equals_state ){
        buffer = [calculateResult(buffer)];
    }
}

function calculatorButtonClicked(event) {
    if( calculatorDisplay === null ){
        return;
    }

    const key = event.target.dataset.value;

    if( key === "C" ){
        clearDisplay();
        return;
    }

    if( key === "CL" ){
        clearLastChar();
        return;
    }

    addKeyToBuffer(key);

    calculatorDisplay.innerText = buffer.join('');
}

function createHistoryButton(main){
    const historyBtn = document.createElement("button");
    historyBtn.innerText = "Pokaż historię";
    historyBtn.onclick = printHistory;

    main.appendChild(historyBtn);
}

function printHistory(){
    message = "Historia obliczeń:\n";
    alert( message+calculationsHistory.join('\n') );
}

function gen() {
    const main = document.getElementById("main")
    calculatorDisplay = createCalculatorDisplay(initialDisplayValue);

    styleContainer(main);
    
    main.appendChild(calculatorDisplay);
    initButtons(main);
    createHistoryButton(main);
}