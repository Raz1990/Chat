//helper variables
const menuStart = '\nWelcome to ChatRoullete 2.0! Here are your options:\n1) Users options\n2) Groups options\n3) Groups and their Users\n4) Exit';
const menuUsers = '\n1) Add new User\n2) Delete User\n3) Update User\n4) Show Users\n5) Get User\'s groups\n6) Return to main menu';
const menuGroups = '\n1) Add new Group\n2) Delete Group\n3) Show Groups\n4) Search Group\n5) Return to main menu';
const menuAsso = '\n1) Add user to a group\n2) remove a user from a group\n3) Show groups and their users\n4) Return to main menu';

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
            showUserMenu();
            break;
        case 2:
            showGroupMenu();
            break;
        case 3:
            showUserToGroupMenu();
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

//USERS MENU

function showUserMenu() {
    helpers.rl.question('\nIn the Users menu. Now what? ', dealWithUserInput);
    console.log(menuUsers);
}

function dealWithUserInput(answer) {
    try {
        helpers.option = parseInt(answer);
    }
    catch (e) {
        console.error('Woah! Numbers only, man!');
        helpers.rl.question('Now get it right, please! ', dealWithUserInput);
        return;
    }

    switch (helpers.option) {
        case 1:
            dealWithUserActionUSER('ADD');
            break;
        case 2:
            dealWithUserActionUSER('REMOVE');
            break;
        case 3:
            userFuncs.updateUser();
            break;
        case 4:
            userFuncs.showUsers();
            break;
        case 5:
            helpers.rl.question('\nOk, please enter the user name ', showUsersGroups);
            break;
        case 6:
            console.log('Ok, going back to main menu now\n');
            mainMenu();
            break;
        default:
            console.log('ah? normal numbers, please');
            helpers.rl.question('Now get in range, please! ', dealWithUserInput);
            break;
    }
}

function dealWithUserActionUSER(action) {
    if (action === 'ADD') {
        userFuncs.addNewUser();
    }
    if (action === 'REMOVE') {
        helpers.rl.question('K. Whats the user name? ', dealWithUserDELETE);
    }
}

//answer = user name
function dealWithUserDELETE(answer) {
    
    //check if the user in question exists at all
    if (userFuncs.checkIfUserExists(answer)) {

        //first, check if the user is in a group(s)
        //if any are found, they will be removed
        groupFuncs.deleteUserInGroups(userFuncs.getUser(answer));

        //then proceed to delete it
        userFuncs.deleteAUser(answer);
    }
    else {
        console.info('\nNo user found to delete!\n');
        mainMenu();
    }
}

//answer = user name
function showUsersGroups(answer) {
    var user = userFuncs.getUser(answer);
    groupFuncs.showUsersGroups(user);
}

function getUsersGroups(userName) {
    var user = getUser(userName);
    var array = groupFuncs.getGroupsListForUsers(user);
    return array;
}

//GROUPS MENU

function showGroupMenu() {
    helpers.rl.question('\nIn the Groups menu. Now what? ', dealWithGroupInput);
    console.log(menuGroups);
}

function dealWithGroupInput(answer) {
    try {
        helpers.option = parseInt(answer);
    }
    catch (e) {
        console.error('Woah! Numbers only, man!');
        helpers.rl.question('Now get it right, please! ', dealWithGroupInput);
        return;
    }

    switch (helpers.option) {
        case 1:
            dealWithUserActionGROUP('ADD');
            break;
        case 2:
            dealWithUserActionGROUP('REMOVE');
            break;
        case 3:
            groupFuncs.showGroups();
            break;
        case 4:
            helpers.rl.question('Please enter group name to search: ', groupFuncs.printGroupPath);
            break;
        case 5:
            console.log('Ok, going back to main menu now\n');
            mainMenu();
            break;
        default:
            console.log('ah? numbers in range, please');
            helpers.rl.question('Now get in range, please! ', dealWithGroupInput);
            break;
    }
}

function dealWithUserActionGROUP(action) {
    if (action === 'ADD') {
        groupFuncs.addNewGroup();
    }
    
    if (action === 'REMOVE') {
        groupFuncs.deleteAGroup();
    }
}

//ASSOCIATION

function showUserToGroupMenu() {
    helpers.rl.question('\nIn the Association menu. Now what? ', dealWithAssoInput);
    console.log(menuAsso);
}

function dealWithAssoInput(answer) {
    try {
        helpers.option = parseInt(answer);
    }
    catch (e) {
        console.error('Woah! Numbers only, man!');
        helpers.rl.question('Now get it right, please! ', dealWithAssoInput);
        return;
    }

    switch (helpers.option) {
        case 1:
            assoFuncs.dealWithUserActionASSO('ADD');
            break;
        case 2:
            assoFuncs.dealWithUserActionASSO('REMOVE');
            break;
        case 3:
            assoFuncs.showGroupsAndUsers();
            break;
        case 4:
            console.log('Ok, going back to main menu now\n');
            mainMenu();
            break;
        default:
            console.log('ah? normal numbers, please');
            helpers.rl.question('Now get in range, please! ', dealWithAssoInput);
            break;
    }
}

//END MAIN MENU

//exports
module.exports = {
    mainMenu,
    dealWithOption,
};