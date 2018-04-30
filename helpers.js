//helper variables
var chosenGroup, chosenUser, option, menuCallback;

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports = {
    rl,
    option,
    chosenUser,
    chosenGroup,
    menuCallback
};