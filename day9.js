const readline = require('readline');
const intcodeComputer = require('./intcodeComputer.js');

let inputs = process.argv.slice(2).map(s => parseInt(s));

if (inputs.length > 0) {
    const rl = readline.createInterface({ input: process.stdin });
    let inputSignal = inputs.shift();
    rl.on("line", line => {
        let inputs = [inputSignal];
        let outputs = [];
        let finishState = intcodeComputer.compileAndRun(line, inputs, outputs);
        console.log("BOOST program output:", outputs, "exit code", finishState.exitOpcode);
    }).on("close", () => console.log("BOOST program complete"));
}
else {
    console.error("not enough inputs");
    console.log("Usage: node day9.js [input signal]");
}
