//imports
const helpers = require('./../Models/helpers');
const usersFuncs = require('./../Models/Users');
//const groupFuncs = require('./../Models/Groups');

//MAIN MENU AREA

mainMenu();

function mainMenu() {
    //set the main menu as a callback function to be used throughout the program
    helpers.menuCallback = mainMenu;
    console.log(helpers.menuStart);

    helpers.rl.question('Choose your destiny...: ', dealWithMainMenuOption);
}

function dealWithMainMenuOption(answer) {
    try {
        helpers.option = parseInt(answer);
    }
    catch (e){
        console.error('Woah! Numbers only, man!');
        helpers.rl.question('Now get it right, please! ', dealWithMainMenuOption);
        return;
    }
    switch (helpers.option) {
        case 1:
            showUserMenu();
            break;
        case 2:
            //showGroupMenu();
            break;
        case 3:
            //showUserToGroupMenu();
            break;
        case 4:
            console.log('ok... byeeee');
            helpers.rl.close();
            break;
        default:
            console.log('ah? numbers in range, please');
            helpers.rl.question('Now get in range, please! ', dealWithMainMenuOption);
            break;
    }
}

// USERS AREA

function showUserMenu() {
    helpers.rl.question('\nIn the Users menu. Now what? ', dealWithUserInput);
    console.log(helpers.menuUsers);
}

function dealWithUserInput (answer){
    try {
        helpers.option = parseInt(answer);
    }
    catch (e){
        console.error('Woah! Numbers only, man!');
        helpers.rl.question('Now get it right, please! ', dealWithUserInput);
        return;
    }

    switch (helpers.option){
        case 1:
            usersFuncs.dealWithUserActionUSER('ADD');
            break;
        case 2:
            usersFuncs.dealWithUserActionUSER('REMOVE');
            break;
        case 3:
            //updateUser();
            break;
        case 4:
            //showUsers();
            break;
        case 5:
            console.log('Ok, going back to main menu now\n');
            //indexFuncs.mainMenu();
            break;
        case 6:
            //return to the main menu and input the exit option
            //indexFuncs.dealWithOption(4);
            break;
        default:
            console.log('ah? normal numbers, please');
            helpers.rl.question('Now get in range, please! ', dealWithUserInput);
            break;
    }
}

