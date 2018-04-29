//object of Group.
//has the following: group_name, list_of_users
var Group = {};

//will hold group names to check for uniqueness
var group_Names = {};

//array of groups, will be filled with Group objects
var Groups = [];

//helper variables
const menuGroups = '\n1) Add new Group\n2) Delete Group\n3) Show Groups\n4) Return to main menu\n5) Exit';

//imports
const helpers = require('./helpers');
const indexFuncs = require('./index');
const userFuncs = require('./userFunctions');
const assoFuncs = require('./assoFunctions');

/*
//sanity check
Group.group_name = 'AAA';
Group.list_of_users = [];
Groups[0] = Object.assign({},Group);

Group.group_name = 'BBB';
Group.list_of_users = [];
Groups[1] = Object.assign({},Group);

group_Names = {'AAA': true,'BBB':true};
*/

//GROUPS AREA

function showGroupMenu() {
    helpers.rl.question('\nIn the Groups menu. Now what? ', dealWithGroupInput);
    console.log(menuGroups);
}

function dealWithGroupInput (answer){
    try {
        helpers.option = parseInt(answer);
    }
    catch (e){
        console.error('Woah! Numbers only, man!');
        helpers.rl.question('Now get it right, please! ', dealWithGroupInput);
        return;
    }

    switch (helpers.option){
        case 1:
            dealWithUserActionGROUP('ADD');
            break;
        case 2:
            dealWithUserActionGROUP('REMOVE');
            break;
        case 3:
            showGroups();
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
            console.log('ah? numbers in range, please');
            helpers.rl.question('Now get in range, please! ', dealWithGroupInput);
            break;
    }
}

function dealWithUserActionGROUP(action) {
    if (action === 'ADD') {
        console.log('\nVery well, lets add a new group!');
        helpers.rl.question('\nEnter group name (must be unique!): ', dealWithInputGROUPNAME);
    }
    if (action === 'REMOVE') {
        helpers.rl.question('K. Whats the group name? ', dealWithGroupDELETE);
    }
}

//OPTION 1 OF GROUP MENU - ADDING A NEW GROUP

//answer = group name
function dealWithInputGROUPNAME(answer) {
    if (group_Names[answer]) {
        console.error('It appears this group name is already taken! Please choose another!');
        helpers.rl.question('Enter new group name (must be unique!): ', dealWithInputGROUPNAME);
    }
    else {
        Group.group_name = answer;
        Group.list_of_users = [];
        group_Names[answer] = true;

        console.log('New group named' , answer , 'Added successfully\n');
        Groups.push(Object.assign({},Group));
        console.log(Group);
        indexFuncs.mainMenu();
    }
}

//OPTION 2 OF GROUP MENU - DELETE A GROUP

function dealWithGroupDELETE(answer) {
    //if there are no groups...
    if (Groups.length === 0){
        console.info('\nThere appears to be no such group... Nothing to delete!\n');
        return;
    }
    //if the group name is not in use, it must mean it's not in the db
    if (!group_Names[answer]) {
        console.error('Sorry, no such group found!');
        indexFuncs.mainMenu();
        return;
    }
    //erase the group name from the db to free its use for others.
    group_Names[answer] = false;
    //find the group in the array using the group_name provided
    var groupToDelete = Groups.find(o => o.group_name === answer);
    //get the index of the group in the array
    var index = Groups.indexOf(groupToDelete);
    //remove the group in the correct index
    Groups.splice(index, 1);
    console.log(groupToDelete.group_name, 'deleted!');
    console.log('Going back to the main menu now...\n');
    indexFuncs.mainMenu();
}

//OPTION 3 OF GROUPS MENU - SHOW GROUPS

function printGroups(withUsers){
    if (Groups.length === 0){
        console.info('\nThere appears to be no groups...\n');
    }
    else {
        console.info('there are ' + Groups.length + ' active groups in the system');
        Groups.forEach(function (group) {
            console.log('group name :', group.group_name);
            if (withUsers) {
                if (group.list_of_users.length===0) {
                    console.log('which has no members in it yet. Try adding some!');
                }
                else {
                    console.log(group.group_name, 'has the following users in it:');
                    group.list_of_users.forEach(function (user) {
                        console.log(user.user_name, 'with the age of', user.age);
                    });
                }
                console.log();
            }//if
        });//forEach Groups
    } //else
}

function showGroups() {
    //print without details about users
    printGroups(false);
    indexFuncs.mainMenu();
}

//helper functions
function checkUserInGroup(userToSearch){
    Groups.forEach(function (group) {
        if (group.list_of_users.find(o => o.user_name === userToSearch.user_name)) {
            helpers.chosenGroup = group;
            helpers.chosenUser = userToSearch;
            assoFuncs.checkUserInGroupTOREMOVE(helpers.chosenUser.user_name, true);
        }
    });
}

function checkIfGroupExists(groupName){
    return group_Names[groupName];
}

function getGroup(groupName){
    return Groups.find(o => o.group_name === groupName);
}

function getGroupsSize(){
    return Groups.length===0;
}

//END GROUP

//exports
module.exports = {
    showGroupMenu: showGroupMenu,
    printGroups: printGroups,
    checkUserInGroup: checkUserInGroup,
    checkIfGroupExists: checkIfGroupExists,
    getGroup: getGroup,
    getGroupsSize: getGroupsSize,
};