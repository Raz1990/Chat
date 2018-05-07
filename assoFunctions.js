//imports
const helpers = require('./helpers');
const userFuncs = require('./userFunctions');
const groupFuncs = require('./groupFunctions');

//GROUPS AND USERS TOGETHER

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
        helpers.rl.question('Ok, enter the user name you want to add to ' + answer + ': ', checkUserInGroupTOADD);
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
    if (helpers.chosenGroup.list_of_users.find(o => o.getUserName() === answer)) {
        console.log('\nThis user is already in the group! What kind of sick game youre playing here?!\n');
        helpers.rl.question('Try again!', checkUserInGroupTOADD);
    }
    //otherwise, it's ok to add the user to the group
    else {
        helpers.chosenUser = userFuncs.getUser(answer);
        groupFuncs.addItemToGroup(helpers.chosenGroup, helpers.chosenUser);
        console.log(helpers.chosenUser.getUserName(), 'was added to', helpers.chosenGroup.getGroupName() + '\n');
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
        if (helpers.chosenGroup.list_of_users.length > 0) {
            helpers.rl.question('Ok, enter the user name you want remove from ' + answer + ': ', checkUserInGroupTOREMOVE);
        }
        else {
            console.info('This group has no users in it...');
            helpers.menuCallback();
        }
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

    var user = helpers.chosenGroup.list_of_users.find(o => o.getUserName() === answer);

    //if the user is in the group
    if (user) {
        //console.log('Okay, we will remove ' + answer + ' from ' + helpers.chosenGroup.getGroupName());
        groupFuncs.deleteUserInSingleGroup(helpers.chosenGroup, user);
    }
    //otherwise, user is not in the group, and cannot be removed
    else {
        console.log(answer, 'is not in', helpers.chosenGroup.getGroupName(), '!');
    }
    helpers.menuCallback();
}

//OPTION 3 OF ASSOCIATION MENU - PRINT GROUPS AND THEIR USERS

function showGroupsAndUsers() {
    //print with details about users
    groupFuncs.printGroups(true);
    helpers.menuCallback();
}

//exports
module.exports = {
    dealWithUserActionASSO,
    showGroupsAndUsers,

};