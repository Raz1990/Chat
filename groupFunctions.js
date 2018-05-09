//object of Group.
//has the following: group_name, parent_group, count, list_of_users OR list_of_groups (but not both!)
var Group = {getGroupName: getGroupName};

//a "beginning" which will hold all of the groups within it. a "root" of sorts
const beginning = Object.assign({},Group);
beginning.group_name = 'beginning';
beginning.parent_group = null;
beginning.list_of_groups = [];
beginning.list_of_users = [];

//helper variables
var newGroupName, foundGroup, groupToDelete, groupToDeleteParent, groupsArray;

//imports
const helpers = require('./helpers');

//GROUPS AREA

//OPTION 1 OF GROUP MENU - ADDING A NEW GROUP

function addNewGroup() {
    console.log('\nVery well, lets add a new group!');
    helpers.rl.question('\nEnter group name (must be unique!): ', dealWithInputGROUPNAME);
    return;
}

function deleteAGroup() {
    //if there are no groups...
    if (beginning.list_of_groups.length === 0) {
        console.info('\nThere appears to be no groups... Nothing to delete!\n');
        helpers.menuCallback();
        return;
    }
    helpers.rl.question('K. Whats the group name? ', dealWithGroupDELETE);
}

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
        if (checkIfGroupExists(newGroupName)) {
            console.error('It appears this group name is already taken!');
        }
        else {
            addGroupToGroup(beginning, newGroupName);
        }
        helpers.menuCallback();
    }
}

//answer = sub - group name
function dealWithSubGroup(answer) {
    //find a group from a list of already created groups
    //console.log('Among these groups with the name ' + answer +', which is the correct path?');
    getGroupByName(answer, continueSubGroup);
}

function continueSubGroup(findings) {
    foundGroup = findings;
    //if found something!
    if (foundGroup) {
        //first check if the name of the new group is already taken inside that group parent
        if (checkIfGroupExists(newGroupName,foundGroup)) {
            console.error('It appears this group name is already taken!');
            helpers.menuCallback();
            //helpers.rl.question('Enter new group name (must be unique!): ', dealWithInputGROUPNAME);
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
        //console.log('no such group found. try again\n');
        //dealWithGroupLocation('y');
        helpers.menuCallback();
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

    console.log('New group named' , groupName , 'added successfully\n');
}

//OPTION 2 OF GROUP MENU - DELETE A GROUP

//answer = group name
function dealWithGroupDELETE(answer) {
    getGroupByName(answer,continueDelete);
}

function continueDelete(findings) {

    groupToDelete = findings;

    if (!groupToDelete)  {
        console.error('Sorry, no such group found!');
        helpers.menuCallback();
        return;
    }

    groupToDeleteParent = getParentGroup(groupToDelete);

    //case 1: it has users and can flatten. Ask the user if wishes to do so
    if (groupToDelete.list_of_users.length > 0 && groupToDeleteParent.list_of_groups.length === 1) {
        //ask if user wants to flatten or simply delete the group and it's users
        helpers.rl.question('This group holds users! Would you like to move them up a level? y/n ', dealWithFlatten);
    }
    else {
        continueDeleteGroupProcess(true);
    }
}

//answer = y or n
function dealWithFlatten(answer) {
    if (answer.toLowerCase() === 'y') {
        groupToDeleteParent.list_of_users = groupToDelete.list_of_users.slice(0);
        console.log('The users within this group were moved to this group: ' + groupToDeleteParent.group_name);
        continueDeleteGroupProcess(false);
    }
    else {
        continueDeleteGroupProcess(true);
    }

}

function continueDeleteGroupProcess(losingUsers) {
    //case 2: it has no users OR it has users but it isn't possible to flatten it due to other subgroups or simply not wanting to
    if (losingUsers) {
        console.log('please note: the users within this group were not moved to a different group');
        lowerCountInGroups(groupToDelete);
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

//print all the groups in the tree
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
                    console.log(separator, user.getUserInfo());
                });
            }
            separator = separator.slice(0, separator.length - 1);
        }//if users
    });
}

function showGroups(withUsers) {
    //print without details about users
    printGroups(withUsers);
    helpers.menuCallback();
}

//OPTION 4 OF GROUPS MENU - SEARCH FOR GROUP

//searches for a group and returns full paths to it
function searchGroup(groupName) {

    var pathStrForGroups = [];
    var pathStr;
    var groups = getAllGroupsByName(groupName);

    groups.forEach(function (subGroup) {
        pathStr = subGroup.group_name;
        var parent = getParentGroup(subGroup);
        //as long as there is a parent
        while (parent && parent !== beginning) {
            pathStr = parent.group_name + ' -> ' + pathStr;
            parent = getParentGroup(parent);
        }
        pathStrForGroups.push(pathStr);
    });

    return pathStrForGroups;
}

function showGroupPath(groupName){
    printGroupPath(groupName);
    helpers.menuCallback();
}

function printGroupPath(groupName) {

    var paths = searchGroup(groupName);

    for (var i=0; i< paths.length;i++){
        console.log((i+1)+') '+paths[i]);
    }

}


//OPTION 5 OF USERS MENU - GET GROUPS A USER IS IN
//answer = user name
function showUsersGroups(userToSearch) {

    var array = getGroupsListForUsers(userToSearch);

    if (array.length > 0) {
        console.log(userToSearch.getUserName() + ' is found in the following groups: ');
        array.forEach(function (group) {
            console.log(group.group_name);
        });
    }
    else {
        console.log(userToSearch.getUserName() + ' is not found in any groups');
    }
    helpers.menuCallback();
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

    return newGroup;
}

//supply a name, and get back every single group in the tree with that name
function getAllGroupsByName(groupName,group,foundGroups) {
    foundGroups = foundGroups || [];

    group = group || beginning;

    var foundGroup;
    if (group.list_of_groups.length > 0) {
        foundGroup = group.list_of_groups.find(o => o.group_name === groupName);
    }
    if (foundGroup) {
        foundGroups.push(foundGroup);
    }

    group.list_of_groups.forEach(function (subGroup) {
        if (subGroup.list_of_groups.length > 0) {
            getAllGroupsByName(groupName,subGroup,foundGroups);
        }
    });

    return foundGroups;
}

function getGroupByName(groupName, callback){
    //get all groups with the corresponding name, put in the global variable
    groupsArray = getAllGroupsByName(groupName);

    if (groupsArray.length === 0) {
        console.log('no such groups found');
        callback();
        return;
    }

    //show the user the available options
    printGroupPath(groupName);

    helpers.rl.question('Where is the group located? ', function (choice) {
        helpers.chosenGroup = groupsArray[choice-1];
        callback(helpers.chosenGroup);
    });
}

function getFirstGroupByName(groupName,group) {
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
                    getGroupByName(groupName, subGroup);
                    if (helpers.chosenGroup) {
                        return helpers.chosenGroup;
                    }
                }
            }
        }
    }

    return foundGroup;
}

function deleteUserInSingleGroup(userToSearch, group) {
    //console.log('Okay, we will remove ' + userToSearch.getUserName() + ' from ' + subGroup.group_name);

    lowerCountInGroups(group, 1);

    //get the index of the user in the group
    var index = group.list_of_users.indexOf(userToSearch);

    //remove the user in the correct index from the group
    group.list_of_users.splice(index, 1);
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

            deleteUserInSingleGroup(userToSearch,subGroup);

        }
        //otherwise, user is not in the group, and cannot be removed
        else {
            console.log(userToSearch.getUserName(), 'is not in', subGroup.group_name, '!');
        }
    });
}

function lowerCountInGroups(group, amountToRemove) {
    amountToRemove = amountToRemove || group.list_of_users.length;
    while (group && group !== beginning) {
        group.count -= amountToRemove;
        group = getParentGroup(group);
    }
}

function checkIfGroupExists(groupName, holderGroup){

    holderGroup = holderGroup || beginning;

    var found = holderGroup.list_of_groups.find(o => o.getGroupName() === groupName);
    if (found) {
        return true;
    }
    else {
        return false;
    }
}

//returns the sub-groups a group has.
function getGroupsListInGroup(group){
    group = group || beginning;

    return group.list_of_groups;
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
    return parent;
}

function getGroupName(){
    return this.group_name;
}

//END GROUP

//exports
module.exports = {
    deleteUserInSingleGroup,
    deleteUserInGroups,
    getAllGroupsByName,
    getGroupByName,
    checkIfGroupExists,
    getGroupsListInGroup,
    showUsersGroups,
    getGroupsListForUsers,
    addItemToGroup,
    getGroupName,
    showGroups,
    showGroupPath,
    addNewGroup,
    deleteAGroup,
};