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

let inputs = process.argv.slice(2).map(s => parseInt(s));
let feedbackMode = inputs.shift();
let phaseSettings;
if (feedbackMode) {
    phaseSettings = generatePhaseSettings(5, 10);
}
else {
    phaseSettings = generatePhaseSettings(0, 5);
}

function runAmplifierControllerSoftware(code, phaseSetting, inputSignal) {
    let inputs = [phaseSetting, inputSignal];
    let outputs = [];
    intcodeComputer(code, inputs, outputs);
    return outputs[0];
}

if (inputs.length > 0) {
    rl.on("line", line => {
        let maxThrusterSignal = 0;
        phaseSettings.forEach(phaseSetting => {
            // console.log("Trying combination", phaseSetting);
            let buffer = [inputs[0]];
            let finalOutput = phaseSetting.reduce((acum, ampSetting) => {
                let ampOutput = runAmplifierControllerSoftware(line, ampSetting, buffer.shift());
                buffer.push(ampOutput);
                return ampOutput;
            }, 0);
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
