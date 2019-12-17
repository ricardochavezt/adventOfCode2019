const readline = require('readline');
const intcodeComputer = require('./intcodeComputer.js');

const rl = readline.createInterface({ input: process.stdin });
rl.on("line", line => {
    let outputs = [];
    let robotPosition = {x: 0, y:0};
    let robotDirection = "up";
    let paintedPanels = {};
    let programState = intcodeComputer.compileAndRun(line, [0], outputs);
    while (programState.exitOpcode != 99) {
        paintedPanels[`${robotPosition.x},${robotPosition.y}`] = outputs.shift();
        // primero giramos
        let turnDirection = outputs.shift();
        switch (robotDirection) {
        case "up":
            robotDirection = turnDirection == 1 ? "right" : "left";
            break;
        case "right":
            robotDirection = turnDirection == 1 ? "down" : "up";
            break;
        case "down":
            robotDirection = turnDirection == 1 ? "left" : "right";
            break;
        case "left":
            robotDirection = turnDirection == 1 ? "up" : "down";
            break;
        }
        // console.log("Position", robotPosition, ", paint it", outputs[0], ", move", robotDirection);
        // luego avanzamos en base a la nueva dirección
        switch (robotDirection) {
        case "up":
            robotPosition = {x: robotPosition.x, y: robotPosition.y+1};
            break;
        case "right":
            robotPosition = {x: robotPosition.x+1, y: robotPosition.y};
            break;
        case "down":
            robotPosition = {x: robotPosition.x, y: robotPosition.y-1};
            break;
        case "left":
            robotPosition = {x: robotPosition.x-1, y: robotPosition.y};
            break;
        }
        let currentColor = paintedPanels[`${robotPosition.x},${robotPosition.y}`] || 0;
        // console.log("Color at", robotPosition, ":", currentColor);
        programState = intcodeComputer.resumeProgram(programState.programState, programState.instructionPointer, [currentColor], outputs, programState.relativeBase);
    }
    console.log(Object.keys(paintedPanels).length);
});
