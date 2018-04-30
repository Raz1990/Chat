//helper variables
var chosenGroup, chosenUser, option, menuCallback;
const menuStart = '\nWelcome to ChatRoullete 2.0! Here are your options:\n1) Users options\n2) Groups options\n3) Groups and their Users\n4) Exit';
const menuUsers = '\n1) Add new User\n2) Delete User\n3) Update User\n4) Show Users\n5) Return to main menu';
const menuGroups = '\n1) Add new Group\n2) Delete Group\n3) Show Groups\n4) Return to main menu';
const menuAsso = '\n1) Add user to a group\n2) remove a user from a group\n3) Show groups and their users\n4) Return to main menu';

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
    menuCallback,
    menuStart,
    menuUsers,
    menuGroups,
    menuAsso,
};