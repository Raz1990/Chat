//helper variables
const menuStart = '\nWelcome to ChatRoullete 2.0! Here are your options:\n1) Users options\n2) Groups options\n3) Groups and their Users\n4) Exit';

//imports
const helpers = require('./helpers');
const userFuncs = require('./userFunctions');
const groupFuncs = require('./groupFunctions');
const assoFuncs = require('./assoFunctions');

//MAIN MENU AREA

//here it where it all starts...
mainMenu();

function mainMenu() {
    //set the main menu as a callback function to be used throughout the program
    helpers.menuCallback = mainMenu;
    console.log(menuStart);

    helpers.rl.question('Choose your destiny...: ', dealWithOption);
}

function dealWithOption(answer) {
    try {
        helpers.option = parseInt(answer);
    }
    catch (e){
        console.error('Woah! Numbers only, man!');
        helpers.rl.question('Now get it right, please! ', dealWithOption);
        return;
    }
    switch (helpers.option) {
        case 1:
            userFuncs.showUserMenu();
            break;
        case 2:
            groupFuncs.showGroupMenu();
            break;
        case 3:
            assoFuncs.showUserToGroupMenu();
            break;
        case 4:
            console.log('ok... byeeee');
            helpers.rl.close();
            break;
        default:
            console.log('ah? numbers in range, please');
            helpers.rl.question('Now get in range, please! ', dealWithOption);
            break;
    }
}

//END MAIN MENU

//exports
module.exports = {
    mainMenu,
    dealWithOption,
};