//helper variables
const menuAsso = '\n1) Add user to a group\n2) remove a user from a group\n3) Show groups and their users\n4) Return to main menu\n5) Exit';

//imports
const helpers = require('./Models/helpers');
const indexFuncs = require('./index');
const userFuncs = require('./userFunctions');
const groupFuncs = require('./groupFunctions');

//GROUPS AND USERS TOGETHER

function showUserToGroupMenu(){
    helpers.question('\nIn the Association menu. Now what? ', dealWithAssoInput);
    console.log(menuAsso);
}

function dealWithAssoInput (answer){
    try {
        helpers.option = parseInt(answer);
    }
    catch (e){
        console.error('Woah! Numbers only, man!');
        helpers.question('Now get it right, please! ', dealWithAssoInput);
        return;
    }

    switch (helpers.option){
        case 1:
            dealWithUserActionASSO('ADD');
            break;
        case 2:
            dealWithUserActionASSO('REMOVE');
            break;
        case 3:
            showGroupsAndUsers();
            break;
        case 4:
            console.log('Ok, going back to main menu now\n');
            indexFuncs.mainMenu();
            break;
        case 5:
            //return to the main menu and input the exit option
            indexFuncs.dealWithOption(4);
            break;
        default:
            console.log('ah? normal numbers, please');
            helpers.question('Now get in range, please! ', dealWithAssoInput);
            break;
    }
}

//ADD/REMOVE USER TO/FROM A GROUP

function dealWithUserActionASSO(action) {
    if (groupFuncs.getGroupsSize()) {
        console.error('There are no groups to do actions with....\n');
        indexFuncs.mainMenu();
        return;
    }
    if (action === 'ADD') {
        console.log('\nVery well, lets add a user to a group!');
        helpers.question('\nEnter the group name first: ', dealWithASSOaddGROUPNAME);
    }
    if (action === 'REMOVE') {
        console.log('\nVery well, lets remove a user from a group!');
        helpers.question('\nEnter the group name first: ', dealWithASSOdeleteGROUPNAME);
    }
}

//ADD USER TO GROUP

//answer = group name
function dealWithASSOaddGROUPNAME(answer) {
    //if group does not exist
    if (!groupFuncs.getGroup(answer)) {
        console.error('It appears this group does not exist!');
        indexFuncs.mainMenu();
    }
    else {
        helpers.chosenGroup = groupFuncs.getGroup(answer);
        helpers.question('Ok, enter the user name you want to add to '+ answer +': ', checkUserInGroupTOADD);
    }
}

//answer = user name
function checkUserInGroupTOADD(answer) {
    //if the user name is not in use, it must mean it's not in the db
    if (!userFuncs.checkIfUserExists(answer)) {
        console.log('No user with that user name found. Returning to main menu');
        indexFuncs.mainMenu();
        return;
    }
    //if the user is already in the group
    if (helpers.chosenGroup.list_of_users.find(o => o.user_name === answer)){
        helpers.question('Try again!', checkUserInGroupTOADD);
        console.log('\nThis user is already in the group! What kind of sick game youre playing here?!\n');
        return;
    }
    //otherwise, it's ok to add the user to the group
    else{
        helpers.chosenUser = userFuncs.getUser(answer);
        helpers.chosenGroup.list_of_users.push(helpers.chosenUser);
        console.log(helpers.chosenUser.user_name, 'was added to', helpers.chosenGroup.group_name + '\n');
        indexFuncs.mainMenu();
    }
}

//answer = group name
function dealWithASSOdeleteGROUPNAME(answer) {
    //if group does not exist
    if (!groupFuncs.checkIfGroupExists(answer)) {
        console.error('It appears this group does not exist!');
        indexFuncs.mainMenu();
    }
    else {
        helpers.chosenGroup = groupFuncs.getGroup(answer);
        helpers.question('Ok, enter the user name you want remove from '+ answer +':', checkUserInGroupTOREMOVE);
    }
}

//answer = user name
function checkUserInGroupTOREMOVE(answer, check) {
    //if the user name is not in use, it must mean it's not in the db
    if (!userFuncs.getUser(answer)) {
        console.error('No user with that user name found.');
        indexFuncs.mainMenu();
        return;
    }
    //if the user is in the group
    if (check || helpers.chosenGroup.list_of_users.find(o => o.user_name === answer)){
        console.log('Okay, we will remove ' + answer + ' from ' + helpers.chosenGroup.group_name);

        //get the index of the user in the group
        var index = helpers.chosenGroup.list_of_users.indexOf(helpers.chosenUser);
        //remove the user in the correct index from the group
        helpers.chosenGroup.list_of_users.splice(index, 1);

        console.log('Going back to the main menu now...\n');
        indexFuncs.mainMenu();
    }
    //otherwise, user is not in the group, and cannot be removed
    else{
        console.log(helpers.chosenUser.user_name, 'is not in', helpers.chosenGroup.group_name,'!');
    }
}

//OPTION 3 OF ASSOCIATION MENU - PRINT GROUPS AND THEIR USERS

function showGroupsAndUsers() {
    //print with details about users
    groupFuncs.printGroups(true);
    indexFuncs.mainMenu();
}

//exports
module.exports = {
    showUserToGroupMenu: showUserToGroupMenu,
    checkUserInGroupTOREMOVE: checkUserInGroupTOREMOVE,
};