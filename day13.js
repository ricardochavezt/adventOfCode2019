const readline = require('readline');
const fs = require('fs');
const intcodeComputer = require("./intcodeComputer.js");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let gameSoftware = fs.readFileSync(process.argv[2], "utf8");

rl.question("Insert quarter? (y/n): ", (answer) => {
    switch (answer.trim().toLowerCase()) {
    case "y": {
        // TODO play game (b'-')b'
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
