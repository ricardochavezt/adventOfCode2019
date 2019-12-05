const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin });

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

function main(programText) { // old school name :)
    let program = programText.split(",").map(s => parseInt(s));
    let inputs = process.argv.slice(2).map(s => parseInt(s));

    let programPointer = 0;
    let programTerminated = false;
    while (programPointer < program.length && !programTerminated) {
        let opcodeWithParamModes = program[programPointer];
        let opcode = opcodeWithParamModes % 100;
        let paramModes = Math.floor(opcodeWithParamModes / 100);
        switch (opcode) {
        case 1:
        case 2:
            let operator = getParameters(2, program, programPointer, paramModes);
            let result = opcode == 1 ? operator[0] + operator[1] : operator[0] * operator[1];
            let outputPos = program[programPointer+3];
            program[outputPos] = result;
            programPointer += 4;
            break;
        case 3:
            let inputStoragePos = program[programPointer+1];
            let input = inputs.shift();
            if (input) {
                program[inputStoragePos] = input;
            }
            else {
                console.log("Program execution aborted, not enough inputs");
                programTerminated = true;
            }
            programPointer += 2;
            break;
        case 4:
            let outputStoragePos = program[programPointer+1];
            let output = program[outputStoragePos];
            console.log(`Output: ${output}`);
            programPointer += 2;
            break;
        case 99:
            console.log(`Program execution halted.\nValue at position 0: ${program[0]}`);
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

rl.on('line', line => main(line)).on('close', () => console.log("Program finished"));
