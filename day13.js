const readline = require('readline');
const fs = require('fs');
const intcodeComputer = require("./intcodeComputer.js");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let gameSoftware = fs.readFileSync(process.argv[2], "utf8");

function processGameScreen(gameMemory) {
    let gameData = {blocksRemaining: 0, emptySpaces: 0};
    gameMemory.forEach((cell, i) => {
        if (cell == -1) {
            gameData.score = gameMemory[i+2];
        }
        if (i % 3 == 0) {
            switch(gameMemory[i+2]) {
            case 0:
                gameData.emptySpaces += 1;
                break;
            case 2:
                gameData.blocksRemaining += 1;
                break;
            case 3:
                gameData.paddlePosition = {x: gameMemory[i], y: gameMemory[i+1]};
                break;
            case 4:
                gameData.ballPosition = {x: gameMemory[i], y: gameMemory[i+1]};
                break;
            }
        }
    });
    return gameData;
}

rl.question("Insert quarter? (y/n): ", (answer) => {
    switch (answer.trim().toLowerCase()) {
    case "y": {
        // TODO play game (b'-')b'
        let output = [];
        let programState = intcodeComputer.compileProgram(gameSoftware);
        programState[0] = 2;
        programState = intcodeComputer.resumeProgram(programState, 0, [], output);
        let gameState = processGameScreen(output);
        while (programState.exitOpcode != 99) {
            let input;
            if (gameState.paddlePosition.x < gameState.ballPosition.x) {
                input = [1];
            }
            else if (gameState.paddlePosition.x > gameState.ballPosition.x) {
                input = [-1];
            }
            else {
                input = [0];
            }
            programState = intcodeComputer.resumeProgram(programState.programState, programState.instructionPointer, input, output, programState.relativeBase);
            let updatedState = processGameScreen(output);
            gameState.ballPosition = updatedState.ballPosition;
            if (updatedState.paddlePosition) {
                gameState.paddlePosition = updatedState.paddlePosition;
            }
            if (updatedState.score) {
                gameState.score = updatedState.score;
            }
            gameState.blocksRemaining -= updatedState.emptySpaces;
            if (gameState.blocksRemaining == 0) {
                break;
            }
        }
        console.log("Game over");
        console.log(gameState);
        rl.close();
        break;
    }
    case "n": {
        let output = [];
        intcodeComputer.compileAndRun(gameSoftware, [], output);
        console.log("Number of blocks: ", output.filter((elem, i) => i % 3 == 2 && elem == 2).length);
        rl.close();
        break;
    }
    }
});
