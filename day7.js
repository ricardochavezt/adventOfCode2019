const readline = require('readline');
const intcodeComputer = require('./intcodeComputer');

const rl = readline.createInterface({ input: process.stdin });

let inputs = process.argv.slice(2).map(s => parseInt(s));

function runAmplifierControllerSoftware(code, phaseSetting, inputSignal) {
    let inputs = [phaseSetting, inputSignal];
    let outputs = [];
    intcodeComputer(code, inputs, outputs);
    return outputs[0];
}

if (inputs.length > 0) {
    rl.on("line", line => {
        let maxThrusterSignal = 0;
        for (var a = 0; a < 5; a++) {
            for (var b = 0; b < 5; b++) {
                if (a == b) {
                    continue;
                }
                for (var c = 0; c < 5; c++) {
                    if (c == a || c == b) {
                        continue;
                    }
                    for (var d = 0; d < 5; d++) {
                        if (d == a || d == b || d == c) {
                            continue;
                        }
                        for (var e = 0; e < 5; e++) {
                            if (e == a || e == b || e == c || e == d) {
                                continue;
                            }
                            let outputA = runAmplifierControllerSoftware(line, a, inputs[0]);
                            let outputB = runAmplifierControllerSoftware(line, b, outputA);
                            let outputC = runAmplifierControllerSoftware(line, c, outputB);
                            let outputD = runAmplifierControllerSoftware(line, d, outputC);
                            let outputE = runAmplifierControllerSoftware(line, e, outputD);
                            if (outputE > maxThrusterSignal) {
                                maxThrusterSignal = outputE;
                                console.log("Combination ", a, b, c, d, e, "gives max thruster signal", maxThrusterSignal);
                            }
                        }
                    }
                }
            }
        }
    }).on("close", () => console.log("Fin"));
}
else {
    console.log("Not enough inputs");
}
