//helper variables
var chosenGroup, chosenUser, option;

const menuStart = '\nWelcome to ChatRoullete 2.0! Here are your options:\n1) Users options\n2) Groups options\n3) Groups and their Users\n4) Exit';
const menuUsers = '\n1) Add new User\n2) Delete User\n3) Update User\n4) Show Users\n5) Return to main menu\n6) Exit';
const menuGroups = '\n1) Add new Group\n2) Delete Group\n3) Show Groups\n4) Return to main menu\n5) Exit';

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
    menuStart,
    menuUsers,
    menuGroups
};