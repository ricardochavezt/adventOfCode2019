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

function compileProgram(programText) {
    return programText.split(",").map(s => parseInt(s));
}

function resumeProgram(programState, instructionPointer, inputs, outputBuffer) {
    let programPointer = instructionPointer || 0;
    let programTerminated = false;
    let currentOpcode;

    while (programPointer < programState.length && !programTerminated) {
        let opcodeWithParamModes = programState[programPointer];
        currentOpcode = opcodeWithParamModes % 100;
        let paramModes = Math.floor(opcodeWithParamModes / 100);
        switch (currentOpcode) {
        case 1: {
            let operator = getParameters(2, programState, programPointer, paramModes);
            let outputPos = programState[programPointer+3];
            programState[outputPos] = operator[0] + operator[1];
            programPointer += 4;
            break;
        }
        case 2: {
            let operator = getParameters(2, programState, programPointer, paramModes);
            let outputPos = programState[programPointer+3];
            programState[outputPos] = operator[0] * operator[1];
            programPointer += 4;
            break;
        }
        case 3: {
            let inputStoragePos = programState[programPointer+1];
            let input = inputs.shift();
            if (input == null) {
                programTerminated = true;
            }
            else {
                programState[inputStoragePos] = input;
                programPointer += 2;
            }
            break;
        }
        case 4: {
            let operator = getParameters(2, programState, programPointer, paramModes);
            let output = operator[0];
            // console.log(`Output: ${output}`);
            outputBuffer.push(output);
            programPointer += 2;
            break;
        }
        case 5: {
            let operator = getParameters(2, programState, programPointer, paramModes);
            if (operator[0] != 0) {
                programPointer = operator[1];
            }
            else {
                programPointer += 3;
            }
            break;
        }
        case 6: {
            let operator = getParameters(2, programState, programPointer, paramModes);
            if (operator[0] == 0) {
                programPointer = operator[1];
            }
            else {
                programPointer += 3;
            }
            break;
        }
        case 7: {
            let operator = getParameters(2, programState, programPointer, paramModes);
            let outputPos = programState[programPointer+3];
            programState[outputPos] = (operator[0] < operator[1]) ? 1 : 0;
            programPointer += 4;
            break;
        }
        case 8: {
            let operator = getParameters(2, programState, programPointer, paramModes);
            let outputPos = programState[programPointer+3];
            programState[outputPos] = (operator[0] == operator[1]) ? 1 : 0;
            programPointer += 4;
            break;
        }
        case 99:
            // console.log(`Program execution halted.`);
            programTerminated = true;
            break;
        default:
            console.log(`Error: Opcode ${currentOpcode} at position ${programPointer} not recognized`);
            console.log('Memory state:', programState);
            return {
                exitOpcode: -1,
                errorOpcode: currentOpcode,
                instructionPointer: programPointer,
                programState: programState
            };
        }
    }
    return {
        exitOpcode: currentOpcode,
        instructionPointer: programPointer,
        programState: programState
    };
}

function main(programText, inputs, outputBuffer) { // old school name :)
    let programState = compileProgram(programText);
    return resumeProgram(programState, 0, inputs, outputBuffer);
}

module.exports = {
    compileProgram: compileProgram,
    resumeProgram: resumeProgram,
    compileAndRun: main
}
