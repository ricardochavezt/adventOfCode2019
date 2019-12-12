function getParameterValue(paramAddress, paramMode, currentState, relativeBase) {
    switch (paramMode) {
    case 0:
        return (currentState[paramAddress] || 0);
    case 1:
        return paramAddress; // not an address, actually
    case 2:
        return (currentState[paramAddress + relativeBase] || 0);
    }
}

function getParameters(count, currentState, currentPointer, paramModes, relativeBase) {
    let parameters = [];
    for (var i = 0; i < count; i++) {
        let paramMode = paramModes.shift() || 0;
        let operator = currentState[currentPointer+i+1];
        let paramValue = getParameterValue(operator, paramMode, currentState, relativeBase);
        parameters.push(paramValue);
    }
    return parameters;
}

function getParameterWriteAddress(parameter, paramMode, currentState, relativeBase) {
    switch (paramMode) {
    case 0:
        return parameter;
    case 1:
        throw new Error("Invalid address mode for write parameter");
    case 2:
        return parameter + relativeBase;
    }
}

function compileProgram(programText) {
    return programText.split(",").map(s => parseInt(s));
}

function resumeProgram(programState, instructionPointer, inputs, outputBuffer, relBase) {
    let programPointer = instructionPointer || 0;
    let relativeBase = relBase || 0;
    let programTerminated = false;
    let currentOpcode;

    while (programPointer < programState.length && !programTerminated) {
        let opcodeWithParamModes = programState[programPointer] || 0;
        currentOpcode = opcodeWithParamModes % 100;
        opcodeWithParamModes = Math.floor(opcodeWithParamModes / 100);
        let paramModes = [];
        while (opcodeWithParamModes > 0) {
            paramModes.push(opcodeWithParamModes % 10);
            opcodeWithParamModes = Math.floor(opcodeWithParamModes / 10);
        }
        switch (currentOpcode) {
        case 1: {
            let operator = getParameters(2, programState, programPointer, paramModes, relativeBase);
            let outputPos = getParameterWriteAddress(programState[programPointer+3] || 0, paramModes.shift() || 0, programState, relativeBase);
            programState[outputPos] = operator[0] + operator[1];
            programPointer += 4;
            break;
        }
        case 2: {
            let operator = getParameters(2, programState, programPointer, paramModes, relativeBase);
            let outputPos = getParameterWriteAddress(programState[programPointer+3] || 0, paramModes.shift() || 0, programState, relativeBase);
            programState[outputPos] = operator[0] * operator[1];
            programPointer += 4;
            break;
        }
        case 3: {
            let inputStoragePos = getParameterWriteAddress(programState[programPointer+1] || 0, paramModes.shift() || 0, programState, relativeBase);
            let input = inputs.shift();
            if (input == null) {
                console.log("Program awaiting for input");
                programTerminated = true;
            }
            else {
                console.log("Inputting value", input, "into position", inputStoragePos);
                programState[inputStoragePos] = input;
                programPointer += 2;
            }
            break;
        }
        case 4: {
            let operator = getParameters(1, programState, programPointer, paramModes, relativeBase);
            let output = operator[0];
            // console.log(`Output: ${output}`);
            outputBuffer.push(output);
            programPointer += 2;
            break;
        }
        case 5: {
            let operator = getParameters(2, programState, programPointer, paramModes, relativeBase);
            if (operator[0] != 0) {
                programPointer = operator[1];
            }
            else {
                programPointer += 3;
            }
            break;
        }
        case 6: {
            let operator = getParameters(2, programState, programPointer, paramModes, relativeBase);
            if (operator[0] == 0) {
                programPointer = operator[1];
            }
            else {
                programPointer += 3;
            }
            break;
        }
        case 7: {
            let operator = getParameters(2, programState, programPointer, paramModes, relativeBase);
            let outputPos = getParameterWriteAddress(programState[programPointer+3] || 0, paramModes.shift() || 0, programState, relativeBase);
            programState[outputPos] = (operator[0] < operator[1]) ? 1 : 0;
            programPointer += 4;
            break;
        }
        case 8: {
            let operator = getParameters(2, programState, programPointer, paramModes, relativeBase);
            let outputPos = getParameterWriteAddress(programState[programPointer+3] || 0, paramModes.shift() || 0, programState, relativeBase);
            programState[outputPos] = (operator[0] == operator[1]) ? 1 : 0;
            programPointer += 4;
            break;
        }
        case 9: {
            let operator = getParameters(1, programState, programPointer, paramModes, relativeBase);
            relativeBase += operator[0];
            programPointer += 2;
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
                programState: programState,
                relativeBase: relativeBase
            };
        }
    }
    return {
        exitOpcode: currentOpcode,
        instructionPointer: programPointer,
        programState: programState,
        relativeBase: relativeBase
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
