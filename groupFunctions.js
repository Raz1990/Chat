//object of Group.
//has the following: group_name, parent_group, count, list_of_users OR list_of_groups (but not both!)
var Group = {getGroupName: getGroupName};

//will hold group names to check for uniqueness
var group_Names = {'beginning' : true};

//a "beginning" which will hold all of the groups within it. a "root" of sorts
const beginning = Object.assign({},Group);
beginning.group_name = 'beginning';
beginning.parent_group = null;
beginning.list_of_groups = [];

//helper variables
const menuGroups = '\n1) Add new Group\n2) Delete Group\n3) Show Groups\n4) Search Group\n5) Return to main menu';
var newGroupName, foundGroup, groupToDelete, groupToDeleteParent;

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
            helpers.rl.question('Please enter group name to search: ', printGroupPath);
            break;
        case 5:
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
        helpers.rl.question('enter the group name to add the new group to: ', dealWithSubGroup);
    }
    //otherwise, add it as a primary group in the beginning
    else {
        addGroupToGroup(beginning,newGroupName);
        helpers.menuCallback();
    }
}

//answer = sub - group name
function dealWithSubGroup(answer) {
    //find a group from a list of already created groups
    foundGroup = getGroupByName(answer);

    //if found something!
    if (foundGroup) {
        //first check if the name of the new group is already taken inside that group parent
        if (checkIfGroupExists(newGroupName)) {
            helpers.rl.question('Enter new group name (must be unique!): ', dealWithInputGROUPNAME);
            console.error('It appears this group name is already taken! Please choose another!');
            return;
        }
        //otherwise, continue as normal
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

//answer = new group name
function movingUsersToNewGroup(answer) {
    //create new group to house the users
    var newGroup = createNewGroup(answer, foundGroup);

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

    groupToAdd = groupToAdd || createNewGroup(groupName, hostingGroup);
    /*
    //point to the parent
    groupToAdd.parent_group = hostingGroup;
    */
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

    groupToDelete = getGroupByName(answer);

    groupToDeleteParent = getParentGroup(groupToDelete);

    //erase the group name from the db to free its use for others.
    group_Names[groupToDeleteParent.group_name+'-'+answer] = false;


    //case 1: it has users and can flatten. Ask the user if wishes to do so
    if (groupToDelete.list_of_users.length > 0 && groupToDeleteParent.list_of_groups.length === 1) {
        //ask if user wants to flatten or simply delete the group and it's users
        helpers.rl.question('This group holds users! Would you like to move them up a level? y/n ', dealWithFlatten);
    }
    else {
        continueDeleteGroupProcess();
    }
}

//answer = y or n
function dealWithFlatten(answer) {
    if (answer.toLowerCase() === 'y') {
        console.log('The users within this group were moved to this group: ' + groupToDeleteParent.group_name);
        groupToDeleteParent.list_of_users = groupToDelete.list_of_users.slice(0);
    }
    continueDeleteGroupProcess();
}

function continueDeleteGroupProcess() {
    //case 2: it has no users OR it has users but it isn't possible to flatten it due to other subgroups or simply not wanting to
    if (groupToDelete.list_of_users.length === 0 || groupToDeleteParent.list_of_groups.length > 1) {
        if (groupToDeleteParent.list_of_groups.length > 1) {
            console.log('please note: the users within this group were not moved to a different group');
            lowerCountInGroups(groupToDeleteParent);
        }
    }

    deleteGroup(groupToDelete, groupToDeleteParent);

    console.log(groupToDelete.group_name, 'deleted!');
    console.log('Going back to the main menu now...\n');
    helpers.menuCallback();
}

//gets a group to delete and deletes it from it's parent (providing a parent is optional, will default to beginning if none provided)
function deleteGroup(deletedGroup, holderGroup) {

    holderGroup = holderGroup || beginning;

    //get the index of the group in the array
    var index = holderGroup.list_of_groups.indexOf(deletedGroup);

    //remove the group in the correct index
    holderGroup.list_of_groups.splice(index, 1);

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
                    console.log(separator , user.returnUserInfo());
                });
            }
            separator = separator.slice(0, separator.length - 1);
        }//if users
    });
}

function showGroups() {
    //print without details about users
    printGroups(false);
    helpers.menuCallback();
}

//OPTION 4 OF GROUPS MENU - SEARCH FOR GROUP
function printGroupPath(groupName) {

    var path = searchGroup(groupName,'');

    console.log(path);

    helpers.menuCallback();
}

//searches for a specific group and returns the full path to it
function searchGroup(groupName, pathStr) {

    pathStr = pathStr || '';

    var group = getGroupByName(groupName);

    //if there is a parent that is not the beginning root
    if (group.parent_group !== beginning) {
        pathStr += searchGroup(group.parent_group.group_name,pathStr);
        pathStr += ' -> ' + group.group_name;
    }
    //else we have reached the beginning
    else {
        return group.group_name;
    }

    return pathStr;
}

//helper functions
//creates a new group with a given group name. parentGroup is optional.
function createNewGroup(groupName, parentGroup) {
    var newGroup = Object.assign({},Group);
    newGroup.group_name = groupName;
    newGroup.list_of_groups = [];
    newGroup.list_of_users = [];
    newGroup.count = 0;
    if (parentGroup) {
        newGroup.parent_group = parentGroup;
    }
    else {
        newGroup.parent_group = null;
    }
    group_Names[parentGroup.group_name+'-'+groupName] = true;

    return newGroup;
}

function getGroupByName(groupName,group){
    //if no group provided, start with beginning.
    group = group || beginning;

    if (beginning.list_of_groups.length === 0 && group === beginning){
        //console.log('there are no groups');
        return beginning;
    }

    var foundGroup;

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

function deleteUserInGroups(userToSearch, group) {

    //if group is not provided, default to beginning
    group = group || beginning;

    group.list_of_groups.forEach(function (subGroup) {
        //if a group has groups within it
        if (subGroup.list_of_groups.length > 0) {
            deleteUserInGroups(userToSearch, subGroup);
        }
        else if (subGroup.list_of_users.find(o => o.getUserName() === userToSearch.getUserName())) {
            helpers.chosenGroup = subGroup;
            helpers.chosenUser = userToSearch;

            console.log('Okay, we will remove ' + userToSearch.getUserName() + ' from ' + subGroup.group_name);

            lowerCountInGroups(subGroup,1);

            //get the index of the user in the group
            var index = subGroup.list_of_users.indexOf(userToSearch);

            //remove the user in the correct index from the group
            subGroup.list_of_users.splice(index, 1);
        }
        //otherwise, user is not in the group, and cannot be removed
        else {
            console.log(userToSearch.getUserName(), 'is not in', subGroup.group_name, '!');
        }
    });
}

function lowerCountInGroups(group, amountToRemove) {
    amountToRemove = amountToRemove || group.list_of_users.length;
    while (group) {
        group.count -= amountToRemove;
        group = getParentGroup(group);
    }
}

function checkIfGroupExists(groupName){
    var tempGroup = getGroupByName(groupName);
    //if nothing is found
    if (!tempGroup) {
        return false;
    }
    //if its the very beginning
    if (tempGroup === beginning) {
        return group_Names[beginning.group_name+'-'+groupName];
    }
    var parentGroup = tempGroup.parent_group;
    return group_Names[parentGroup.group_name+'-'+groupName];
}

//returns the sub-groups a group has.
function getGroupsListInGroup(groupName){
    if (groupName) {
        return getGroupByName(groupName).list_of_groups;
    }
    else {
        return beginning.list_of_groups;
    }
}

/* currently not used, perhaps in the future
//returns a user list of a group
function getUsersListInGroup(groupName){
    if (groupName) {
        return getGroupByName(groupName).list_of_users;
    }
    else {
        return beginning.list_of_users;
    }
}
*/

//gets a user object, and returns an array with every group that user is associated with.
function getGroupsListForUsers(user, group, groupsArrayHoldingUsers) {

    group = group || beginning;

    groupsArrayHoldingUsers = groupsArrayHoldingUsers || [];

    group.list_of_groups.forEach(function (subGroup) {

        if (subGroup.list_of_groups.length > 0) {
            getGroupsListForUsers(user, subGroup, groupsArrayHoldingUsers);
        }

        if (subGroup.list_of_users.find(o => o.getUserName() === user.getUserName())) {
            groupsArrayHoldingUsers.push(subGroup);
        }
    });

    return groupsArrayHoldingUsers;
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

function getGroupName(){
    return this.group_name;
}

//END GROUP

//exports
module.exports = {
    showGroupMenu,
    printGroups,
    deleteUserInGroups,
    getGroupByName,
    checkIfGroupExists,
    getGroupsListInGroup,
    getGroupsListForUsers,
    addItemToGroup,
    getGroupName,
};