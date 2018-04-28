//helper variables
var chosenGroup, chosenUser, option;

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports = {
    rl: rl,
    option: option,
    chosenUser: chosenUser,
    chosenGroup: chosenGroup
};