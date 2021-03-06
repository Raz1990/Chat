//object of User.
//has the following: user_name, password, age
var User = {
    getUserName: getUserName,
    getUserInfo: getUserInfo,
};

//will hold user names to check for uniqueness
var user_Names = {};

//array of users, will be filled with User objects
var Users = [];

//helper variables
var newUser;

//imports
const helpers = require('./helpers');

//sanity check
User.user_name = 'raz';
User.age = 27;
User.password = 'rrr';
Users[0] = Object.assign({},User);

User.user_name = 'bbb';
User.age = 40;
User.password = 'bbb';
Users[1] = Object.assign({},User);

user_Names = {'raz': true, 'bbb': true};


//USERS AREA

//OPTION 1 OF USER MENU - ADDING A NEW USER

function addNewUser() {
    console.log('\nVery well, lets add a new user!');
    helpers.rl.question('\nEnter user name (must be unique!): ', dealWithInputUSERNAME);
}

function deleteAUser(userName) {

    //if the user name is not in use, it must mean it's not in the db
    if (!user_Names[userName]) {
        console.error('Sorry, no such user found!');
        helpers.menuCallback();
        return;
    }
    //find the user in the array using the user_name provided
    var userToDelete = getUser(userName);

    //erase the user name from the db to free its use for others.
    user_Names[userName] = false;

    //get the index of the user in the array
    var index = Users.indexOf(userToDelete);

    //remove the user in the correct index
    Users.splice(index, 1);

    console.log('Sad to see you go,', userToDelete.user_name, '!');
    console.log('Going back to the main menu now...\n');
    helpers.menuCallback();
}

function dealWithInputUSERNAME(answer) {
    var userName = answer.trim();
    if (userName === ''){
        console.error('No empty names! Again!');
        helpers.rl.question('Enter new user name (must be unique!): ', dealWithInputUSERNAME);
    }
    else if (user_Names[userName]) {
        console.error('It appears this user name is already taken! Please choose another!');
        helpers.rl.question('Enter new user name (must be unique!): ', dealWithInputUSERNAME);
    }
    else {
        newUser = Object.assign({},User);
        newUser.user_name = userName;
        user_Names[userName] = true;
        helpers.rl.question('\nEnter user password: ', dealWithInputUSERPASSWORD);
    }
}

function dealWithInputUSERPASSWORD(answer) {
    if (answer === ''){
        console.error('No empty passwords! Again!');
        helpers.rl.question('Enter new user name (must be unique!): ', dealWithInputUSERPASSWORD);
        return;
    }
    newUser.password = answer;
    helpers.rl.question('\nEnter user age: ', dealWithInputUSERAGE);
}

function dealWithInputUSERAGE(answer) {
    try {
        if (isNaN(answer)) {
            throw 'NUMBERS PLEASE';
        }
        if (answer < 1){
            throw 'now this isnt right... age is invalid!';
        }
        newUser.age = parseInt(answer);
    }
    catch (err) {
        helpers.rl.question('Now get it right, please! ', dealWithInputUSERAGE);
        console.error(err);
        return;
    }

    Users.push(Object.assign({},newUser));
    console.log('New ', newUser.getUserInfo() , ' Added successfully\n');

    helpers.menuCallback();
}

//OPTION 2 OF USER MENU - DELETE A USER

//answer = user name
function dealWithUserDELETE(answer) {
    //if there are no users...
    if (Users.length === 0){
        console.info('\nThere appears to be no users here... Nothing to delete!\n');
        return;
    }
    //if the user name is not in use, it must mean it's not in the db
    if (!user_Names[answer]) {
        console.error('Sorry, no such user found!');
        helpers.menuCallback();
        return;
    }
    //find the user in the array using the user_name provided
    var userToDelete = Users.find(o => o.user_name === answer);

    //first, check if the user is in a group(s)
    //if any are found, they will be removed
    groupFuncs.deleteUserInGroups(userToDelete);

    //erase the user name from the db to free its use for others.
    user_Names[answer] = false;

    //get the index of the user in the array
    var index = Users.indexOf(userToDelete);

    //remove the user in the correct index
    Users.splice(index, 1);

    console.log('Sad to see you go,' , userToDelete.user_name, '!');
    console.log('Going back to the main menu now...\n');
    helpers.menuCallback();
}

//OPTION 3 OF USER MENU - SHOW USERS

function printUsers(){
    if (Users.length === 0){
        console.info('\nThere appears to be no users here... lonely much?\n');
    }
    else {
        console.info('there are ' + Users.length + ' active users in the system');
        Users.forEach(function (user) {
            console.log(user.getUserInfo());
        });
    }
}

function showUsers() {
    printUsers();
    helpers.menuCallback();
}

//OPTIONS 4 OF USERS MENU - UPDATE USER

function updateUser(){
    helpers.rl.question('\nEnter user name to update: ', dealWithUserUpdate);
}

//answer = user name
function dealWithUserUpdate(answer){
    //if there are no users...
    if (Users.length === 0){
        console.info('\nThere appears to be no users here... Nothing to update!\n');
        return;
    }
    //if the user name is not in use, it must mean it's not in the db
    if (!user_Names[answer]) {
        console.error('Sorry, no such user found!');
        helpers.menuCallback();
        return;
    }
    //find the user in the array using the user_name provided
    helpers.chosenUser = Users.find(o => o.user_name === answer);
    helpers.rl.question('\nOk, please enter new user password: ', updateUserPassword);
}

//answer = new user name
function updateUserPassword(answer){
    helpers.chosenUser.password = answer;
    helpers.rl.question('\nOk, please enter the new age: ', updateUserAge);
}

//answer = user new age
function updateUserAge(answer){
    try {
        if (isNaN(answer)) {
            throw 'NUMBERS PLEASE';
        }
        if (answer < 1){
            throw 'now this isnt right... age is invalid!';
        }
        helpers.chosenUser.age = parseInt(answer);
    }
    catch (err) {
        helpers.rl.question('Now get it right, please! ', updateUserAge);
        console.error(err);
        return;
    }

    console.log('Updated!\n');

    //get the index of the user in the array
    var index = Users.indexOf(helpers.chosenUser);

    //update the user in the correct index
    Users.splice(index, 1, helpers.chosenUser);

    helpers.menuCallback();
}

//OPTION 5 OF USERS MENU - GET GROUPS A USER IS IN

//answer = user name
function showUsersGroups(answer) {
    var array = getUsersGroups(answer);
    console.log(answer + ' is found in the following groups: ');
    array.forEach(function (group) {
        console.log(group.group_name);
    });
    helpers.menuCallback();
}

function getUsersGroups(userName) {
    var user = getUser(userName);
    var array = groupFuncs.getGroupsListForUsers(user);
    return array;
}


//END USERS

//helper functions
function checkIfUserExists(userName){
    return user_Names[userName];
}

function checkIfUsersExist() {
    return Users.length > 0;
}

function getUser(userName){
    return Users.find(o => o.user_name === userName);
}

function getUserName(){
    return this.user_name;
}

function getUserInfo() {
    return this.user_name + ', ' + this.age + ', with the password ' + this.password;
}

//exports
module.exports = {
    updateUser,
    showUsers,
    checkIfUserExists,
    showUsersGroups,
    getUser,
    getUserName,
    getUserInfo,
    addNewUser,
    deleteAUser
};

