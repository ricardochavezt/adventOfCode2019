const readline = require('readline');
const intcodeComputer = require('./intcodeComputer');

const rl = readline.createInterface({ input: process.stdin });

function generatePhaseSettings(lowerPhaseSetting, upperPhaseSetting) {
    let phaseSettings = [];
    for (var a = lowerPhaseSetting; a < upperPhaseSetting; a++) {
        for (var b = lowerPhaseSetting; b < upperPhaseSetting; b++) {
            if (a == b) {
                continue;
            }
            for (var c = lowerPhaseSetting; c < upperPhaseSetting; c++) {
                if (c == a || c == b) {
                    continue;
                }
                for (var d = lowerPhaseSetting; d < upperPhaseSetting; d++) {
                    if (d == a || d == b || d == c) {
                        continue;
                    }
                    for (var e = lowerPhaseSetting; e < upperPhaseSetting; e++) {
                        if (e == a || e == b || e == c || e == d) {
                            continue;
                        }
                        phaseSettings.push([a, b, c, d, e]);
                    }
                }
            }
        }
    }
    return phaseSettings;
}

function runAmplifierControllerSoftware(code, phaseSetting, inputSignal) {
    let inputs = [phaseSetting, inputSignal];
    let outputs = [];
    intcodeComputer.compileAndRun(code, inputs, outputs);
    return outputs[0];
}

function runPhaseSettingSequence(sequence, code, buffer) {
    let finalOutput = sequence.reduce((acum, ampSetting) => {
        let ampOutput = runAmplifierControllerSoftware(code, ampSetting, buffer.shift());
        buffer.push(ampOutput);
        return ampOutput;
    }, 0);
    return finalOutput;
}

function runInFeedbackMode(sequence, code, buffer) {
    let amplifierPrograms = sequence.map(s => {
        return {
            programState: intcodeComputer.compileProgram(code),
            initialInputs: [s]
        };
    });
    let i = 0;
    do {
        let inputs;
        if (amplifierPrograms[i].initialInputs) {
            inputs = amplifierPrograms[i].initialInputs;
            inputs.push(buffer.shift());
        }
        else {
            inputs = buffer;
        }
        let outputs = [];
        // console.log("Amplifier", i, "inputs:", inputs);
        let nextProgramState = intcodeComputer.resumeProgram(amplifierPrograms[i].programState,
                                                             amplifierPrograms[i].instructionPointer,
                                                             inputs, outputs);
        // console.log("Amplifier", i, "outputs:", outputs, "exit code", nextProgramState.exitOpcode);
        amplifierPrograms[i] = nextProgramState;
        buffer = buffer.concat(outputs);
        i += 1;
        if (i >= amplifierPrograms.length) {
            i = 0;
        }
    } while (amplifierPrograms.some(p => p.exitOpcode != 99));
    return buffer[buffer.length-1];
}

let inputs = process.argv.slice(2).map(s => parseInt(s));
let feedbackMode = inputs.shift();
let phaseSettings;
if (feedbackMode) {
    phaseSettings = generatePhaseSettings(5, 10);
}
else {
    phaseSettings = generatePhaseSettings(0, 5);
}

if (inputs.length > 0) {
    rl.on("line", line => {
        let maxThrusterSignal = 0;
        phaseSettings.forEach(phaseSetting => {
            let buffer = [inputs[0]];
            let finalOutput;
            if (feedbackMode) {
                finalOutput = runInFeedbackMode(phaseSetting, line, buffer);
            }
            else {
                finalOutput = runPhaseSettingSequence(phaseSetting, line, buffer);
            }
            if (finalOutput > maxThrusterSignal) {
                maxThrusterSignal = finalOutput;
                console.log("Combination ", phaseSetting, "gives max thruster signal", maxThrusterSignal);
            }
        });
    }).on("close", () => console.log("Fin"));
}
else {
    console.log("Not enough inputs");
}
