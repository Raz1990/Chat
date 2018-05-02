//helper variables
const menuAsso = '\n1) Add user to a group\n2) remove a user from a group\n3) Show groups and their users\n4) Return to main menu';

//imports
const helpers = require('./helpers');
const userFuncs = require('./userFunctions');
const groupFuncs = require('./groupFunctions');

//GROUPS AND USERS TOGETHER

function showUserToGroupMenu(){
    helpers.rl.question('\nIn the Association menu. Now what? ', dealWithAssoInput);
    console.log(menuAsso);
}

function dealWithAssoInput (answer){
    try {
        helpers.option = parseInt(answer);
    }
    catch (e){
        console.error('Woah! Numbers only, man!');
        helpers.rl.question('Now get it right, please! ', dealWithAssoInput);
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
            helpers.menuCallback();
            break;
        default:
            console.log('ah? normal numbers, please');
            helpers.rl.question('Now get in range, please! ', dealWithAssoInput);
            break;
    }
}

//ADD/REMOVE USER TO/FROM A GROUP

function dealWithUserActionASSO(action) {
    if (groupFuncs.getGroupsListInGroup().length === 0) {
        console.error('There are no groups to do actions with....\n');
        helpers.menuCallback();
        return;
    }
    if (action === 'ADD') {
        console.log('\nVery well, lets add a user to a group!');
        helpers.rl.question('\nEnter the group name first: ', dealWithASSOaddGROUPNAME);
    }
    if (action === 'REMOVE') {
        console.log('\nVery well, lets remove a user from a group!');
        helpers.rl.question('\nEnter the group name first: ', dealWithASSOdeleteGROUPNAME);
    }
}

//ADD USER TO GROUP

//answer = group name
function dealWithASSOaddGROUPNAME(answer) {
    helpers.chosenGroup = groupFuncs.getGroupByName(answer);
    //if group does not exist
    if (!helpers.chosenGroup) {
        console.error('It appears this group does not exist!');
        helpers.menuCallback();
        return;
    }
    //if there are groups inside the group
    if (groupFuncs.getGroupsListInGroup(answer).length > 0) {
        console.error('this group is a holder of groups, and cannot add users to it');
        helpers.menuCallback();
    }
    else {
        helpers.rl.question('Ok, enter the user name you want to add to '+ answer +': ', checkUserInGroupTOADD);
    }
}

//answer = user name
function checkUserInGroupTOADD(answer) {
    //if the user name is not in use, it must mean it's not in the db
    if (!userFuncs.checkIfUserExists(answer)) {
        console.log('No user with that user name found. Returning to main menu');
        helpers.menuCallback();
        return;
    }
    //if the user is already in the group
    if (helpers.chosenGroup.list_of_users.find(o => o.user_name === answer)){
        console.log('\nThis user is already in the group! What kind of sick game youre playing here?!\n');
        helpers.rl.question('Try again!', checkUserInGroupTOADD);
    }
    //otherwise, it's ok to add the user to the group
    else{
        helpers.chosenUser = userFuncs.getUser(answer);
        groupFuncs.addItemToGroup(helpers.chosenGroup,helpers.chosenUser);
        console.log(helpers.chosenUser.user_name, 'was added to', helpers.chosenGroup.group_name + '\n');
        helpers.menuCallback();
    }
}

//answer = group name
function dealWithASSOdeleteGROUPNAME(answer) {
    //if group does not exist
    if (!groupFuncs.checkIfGroupExists(answer)) {
        console.error('It appears this group does not exist!');
        helpers.menuCallback();
    }
    else {
        helpers.chosenGroup = groupFuncs.getGroupByName(answer);
        helpers.rl.question('Ok, enter the user name you want remove from '+ answer +': ', checkUserInGroupTOREMOVE);
    }
}

//answer = user name
function checkUserInGroupTOREMOVE(answer) {
    //if the user name is not in use, it must mean it's not in the db
    if (!userFuncs.getUser(answer)) {
        console.error('No user with that user name found.');
        helpers.menuCallback();
        return;
    }
    //if the user is in the group
    if (helpers.chosenGroup.list_of_users.find(o => o.user_name === answer)){
        console.log('Okay, we will remove ' + answer + ' from ' + helpers.chosenGroup.group_name);

        //get the index of the user in the group
        var index = helpers.chosenGroup.list_of_users.indexOf(helpers.chosenUser);
        //remove the user in the correct index from the group
        helpers.chosenGroup.list_of_users.splice(index, 1);

        console.log('Going back to the main menu now...\n');
        helpers.menuCallback();
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
    helpers.menuCallback();
}

//exports
module.exports = {
    showUserToGroupMenu,
};