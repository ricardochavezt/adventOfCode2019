function getParameters(count, currentState, currentPointer, paramModes) {
    let parameters = [];
    for (var i = 0; i < count; i++) {
        let paramMode = paramModes % 10;
        let operator = currentState[currentPointer+i+1];
        if (paramMode == 0) {
            operator = currentState[operator];
        }
        parameters.push(operator);
        paramModes = Math.floor(paramModes / 10);
    }
    return parameters;
}

module.exports = function main(programText, inputs, outputBuffer) { // old school name :)
    let program = programText.split(",").map(s => parseInt(s));
    let programPointer = 0;
    let programTerminated = false;

    while (programPointer < program.length && !programTerminated) {
        let opcodeWithParamModes = program[programPointer];
        let opcode = opcodeWithParamModes % 100;
        let paramModes = Math.floor(opcodeWithParamModes / 100);
        switch (opcode) {
        case 1: {
            let operator = getParameters(2, program, programPointer, paramModes);
            let outputPos = program[programPointer+3];
            program[outputPos] = operator[0] + operator[1];
            programPointer += 4;
            break;
        }
        case 2: {
            let operator = getParameters(2, program, programPointer, paramModes);
            let outputPos = program[programPointer+3];
            program[outputPos] = operator[0] * operator[1];
            programPointer += 4;
            break;
        }
        case 3: {
            let inputStoragePos = program[programPointer+1];
            let input = inputs.shift();
            if (input == null) {
                console.log("Program execution aborted, not enough inputs");
                programTerminated = true;
            }
            else {
                program[inputStoragePos] = input;
            }
            programPointer += 2;
            break;
        }
        case 4: {
            let operator = getParameters(2, program, programPointer, paramModes);
            let output = operator[0];
            // console.log(`Output: ${output}`);
            outputBuffer.push(output);
            programPointer += 2;
            break;
        }
        case 5: {
            let operator = getParameters(2, program, programPointer, paramModes);
            if (operator[0] != 0) {
                programPointer = operator[1];
            }
            else {
                programPointer += 3;
            }
            break;
        }
        case 6: {
            let operator = getParameters(2, program, programPointer, paramModes);
            if (operator[0] == 0) {
                programPointer = operator[1];
            }
            else {
                programPointer += 3;
            }
            break;
        }
        case 7: {
            let operator = getParameters(2, program, programPointer, paramModes);
            let outputPos = program[programPointer+3];
            program[outputPos] = (operator[0] < operator[1]) ? 1 : 0;
            programPointer += 4;
            break;
        }
        case 8: {
            let operator = getParameters(2, program, programPointer, paramModes);
            let outputPos = program[programPointer+3];
            program[outputPos] = (operator[0] == operator[1]) ? 1 : 0;
            programPointer += 4;
            break;
        }
        case 99:
            // console.log(`Program execution halted.`);
            programTerminated = true;
            break;
        default:
            console.log(`Error: Opcode ${opcode} at position ${programPointer} not recognized`);
            console.log('Memory state:', program);
            programTerminated = true;
            break;
        }
    }
}

