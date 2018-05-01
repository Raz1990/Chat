//object of Group.
//has the following: group_name, parent_group, count, list_of_users OR list_of_groups (but not both!)
var Group = {};

//will hold group names to check for uniqueness
var group_Names = {'beginning' : true};

//array of groups, will be filled with Group objects
var Groups = [];

//a "beginning" which will hold all of the groups within it
const beginning = Object.assign({},Group);
beginning.group_name = 'beginning';
beginning.list_of_groups = [];


//helper variables
const menuGroups = '\n1) Add new Group\n2) Delete Group\n3) Show Groups\n4) Return to main menu';
var newGroupName, foundGroup;

//imports
const helpers = require('./helpers');

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
            helpers.menuCallback();
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
        return;
    }
    //if there are no groups...
    if (beginning.list_of_groups.length === 0){
        console.info('\nThere appears to be no groups... Nothing to delete!\n');
        helpers.menuCallback();
        return;
    }
    if (action === 'REMOVE') {
        helpers.rl.question('K. Whats the group name? ', dealWithGroupDELETE);
    }
}

//OPTION 1 OF GROUP MENU - ADDING A NEW GROUP

//answer = group name
function dealWithInputGROUPNAME(answer) {

    //if the name is taken
    if (checkIfGroupExists(answer)) {
        console.error('It appears this group name is already taken! Please choose another!');
        helpers.rl.question('Enter new group name (must be unique!): ', dealWithInputGROUPNAME);
        return;
    }

    newGroupName = answer;

    //if its the very first group, it will be added to beginning regardless
    if (beginning.list_of_groups.length === 0) {
        addGroupToGroup(beginning,newGroupName);
        helpers.menuCallback();
    }
    //if there is at least one group, ask where to put the new group.
    //ALONGSIDE an existing one in the beginning, or INSIDE one (to act as sub group).
    else{
        helpers.rl.question('\nWould you want to add the group as a sub-group? y/n ', dealWithGroupLocation);
    }
}

//answer = location, y or n
function dealWithGroupLocation(answer) {
    //if yes, ask in which group to add the new group
    if (answer.toLowerCase() === 'y'){
        //print the options
        console.log('Please choose between these groups');
        printGroups();
        helpers.rl.question('enter group name to add the new group to: ', dealWithSubGroup);
    }
    //otherwise, add it as a primary group in the beginning
    else {
        addGroupToGroup(beginning,newGroupName);
        helpers.menuCallback();
    }
}

//answer = sub - group name
function dealWithSubGroup(answer) {
    foundGroup = getGroupByName(answer);
    //if found something!
    if (foundGroup) {
        //if it has users, deal with them first
        if (foundGroup.list_of_users.length > 0){
            helpers.rl.question('this group has some members in it! Please provide a new group name to move them to: ', movingUsersToNewGroup);
        }
        //otherwise, add the group as normal
        else {
            addGroupToGroup(foundGroup, newGroupName);
            helpers.menuCallback();
        }
    }
    else {
        console.log('no such group found. try again\n');
        dealWithGroupLocation('y');
    }
}

function createNewGroup(name) {
    var newGroup = Object.assign({},Group);
    newGroup.group_name = name;
    newGroup.list_of_groups = [];
    newGroup.list_of_users = [];
    newGroup.count = 0;
    newGroup.parent_group = null;
    group_Names[name] = true;

    return newGroup;
}

//answer = new group name
function movingUsersToNewGroup(answer) {
    //create new group to house the users
    var newGroup = createNewGroup(answer);

    //point to the user array of the former group
    newGroup.list_of_users = foundGroup.list_of_users.slice(0);

    //change the counter of users within the new group
    newGroup.count = newGroup.list_of_users.length;

    //"reset" former group's users array
    foundGroup.list_of_users = [];

    //add the newly created group, containing the users
    addGroupToGroup(foundGroup, answer, newGroup);

    //and then proceed as normal
    addGroupToGroup(foundGroup, newGroupName);

    helpers.menuCallback();
}

function addGroupToGroup(hostingGroup, groupName, groupToAdd) {

    groupToAdd = groupToAdd || createNewGroup(groupName);

    //point to the parent
    groupToAdd.parent_group = hostingGroup;

    hostingGroup.list_of_groups.push(groupToAdd);

    console.log('New group named' , groupName , 'Added successfully\n');
}

//OPTION 2 OF GROUP MENU - DELETE A GROUP

//answer = group name
function dealWithGroupDELETE(answer) {
    //if the group name is not in use, it must mean it's not in the db
    if (!checkIfGroupExists(answer)) {
        console.error('Sorry, no such group found!');
        helpers.menuCallback();
        return;
    }
    //erase the group name from the db to free its use for others.
    group_Names[answer] = false;

    var groupToDelete = getGroupByName(answer);

    var groupToDeleteParent = groupToDelete.parent_group;

    //case 1: it has users and can flatten
    if (groupToDelete.list_of_users.length > 0 && groupToDeleteParent.list_of_groups.length === 1) {
        console.log('please note: the users within this group were moved to this group: ' + groupToDeleteParent.group_name);
        groupToDeleteParent.list_of_users = groupToDelete.list_of_users.slice(0);
    }

    //case 2: it has no users OR it has users but it isn't possilbe to flatten it due to other subgroups
    else if (groupToDelete.list_of_users.length === 0 || groupToDeleteParent.list_of_groups.length > 1) {
        if (groupToDeleteParent.list_of_groups.length > 1) {
            console.log('please note: the users within this group could not be moved to a different group');

            lowerCountInGroups(groupToDeleteParent);

        }
    }

    //get the index of the group in the array
    var index = groupToDeleteParent.list_of_groups.indexOf(groupToDelete);

    //remove the group in the correct index
    groupToDeleteParent.list_of_groups.splice(index, 1);

    console.log(groupToDelete.group_name, 'deleted!');
    console.log('Going back to the main menu now...\n');
    helpers.menuCallback();
}

//OPTION 3 OF GROUPS MENU - SHOW GROUPS

function printGroups(withUsers, group, separator){

    //if no group provided, start with beginning.
    group = group || beginning;

    if (group === beginning && beginning.list_of_groups.length === 0){
        console.log('there are no groups');
        return;
    }

    withUsers = withUsers || false;

    separator ? separator+='-' : separator = '-';

    group.list_of_groups.forEach(function (subGroup) {
        console.log(separator , subGroup.group_name , '(' + subGroup.count + ')');

        if (subGroup.list_of_groups.length > 0) {
            printGroups(withUsers, subGroup, separator);
        }

        if (withUsers && subGroup.list_of_groups.length === 0) {
            separator+='-';
            if (subGroup.list_of_users.length===0) {
                console.log(separator , 'which is empty');
            }
            else {
                console.log(separator , 'with the members:');
                subGroup.list_of_users.forEach(function (user) {
                    console.log(separator , user);
                });
            }
            separator = separator.slice(0, separator.length - 1);;
        }//if users
    });
}

function showGroups() {
    //print without details about users
    printGroups(false);
    helpers.menuCallback();
}

//helper functions
function deleteUserInGroups(userToSearch, group) {

    //if group is not provided, default to beginning
    group = group || beginning;

    group.list_of_groups.forEach(function (subGroup) {
        //if a group has groups within it
        if (group.list_of_groups.length > 0) {
            deleteUserInGroups(userToSearch, subGroup);
        }
        if (subGroup.list_of_users.find(o => o.user_name === userToSearch.user_name)) {
            helpers.chosenGroup = subGroup;
            helpers.chosenUser = userToSearch;

            console.log('Okay, we will remove ' + userToSearch.user_name + ' from ' + subGroup.group_name);

            lowerCountInGroups(subGroup,1);

            //get the index of the user in the group
            var index = subGroup.list_of_users.indexOf(userToSearch);

            //remove the user in the correct index from the group
            subGroup.list_of_users.splice(index, 1);
        }
        //otherwise, user is not in the group, and cannot be removed
        else {
            console.log(userToSearch.user_name, 'is not in', subGroup.group_name, '!');
        }
    });
}

//helper functions
function lowerCountInGroups(group, amountToRemove) {
    amountToRemove = amountToRemove || group.list_of_users.length;
    while (group) {
        group.count -= amountToRemove;
        group = getParentGroup(group);
    }
}

function checkIfGroupExists(groupName){
    return group_Names[groupName];
}

function getGroupsSize(groupName){
    if (groupName) {
        return getGroupByName(groupName).list_of_groups.length;
    }
    else {
        return beginning.list_of_groups.length;
    }
}

function getGroupByName(groupName,group){
    var foundGroup;

    if (group === beginning && beginning.list_of_groups.length === 0){
        console.log('there are no groups');
        return null;
    }

    //if no group provided, start with beginning.
    group = group || beginning;

    if (group.list_of_groups.length > 0) {
        foundGroup = group.list_of_groups.find(o => o.group_name === groupName);

        if (foundGroup) {
            return foundGroup;
        }

        else {
            for (var i = 0; i< group.list_of_groups.length;i++) {
                var subGroup = group.list_of_groups[i];
                if (subGroup.list_of_groups.length > 0) {
                    foundGroup = getGroupByName(groupName, subGroup);
                    if (foundGroup) {
                        return foundGroup;
                    }
                }
            }
        }
    }

    return foundGroup;
}

function getUsersListInGroup(groupName){
    var group = getGroupByName(groupName);
    if (group) {
        return getGroupByName(groupName).list_of_users;
    }
}

function getGroupsListInGroup(groupName){
    var group = getGroupByName(groupName);
    if (group) {
        return getGroupByName(groupName).list_of_groups;
    }
}

function addItemToGroup(group, item){
    group.list_of_users.push(item);
    group.count++;
    var parent = getParentGroup(group);
    while(parent){
        parent.count++;
        parent = getParentGroup(parent);
    }
}

function getParentGroup(childGroup){
    var parent = childGroup.parent_group;
    if (parent.group_name === 'beginning') {
        return null;
    }
    return parent;
}

//END GROUP

//exports
module.exports = {
    showGroupMenu,
    printGroups,
    deleteUserInGroups,
    getGroupByName,
    checkIfGroupExists,
    getGroupsSize,
    getUsersListInGroup,
    getGroupsListInGroup,
    addItemToGroup,
};