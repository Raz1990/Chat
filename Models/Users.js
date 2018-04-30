//imports
const helpers = require('./../Models/helpers');
const userFuncs = require('./User');

//will hold user names to check for uniqueness
var user_Names = {};

//array of users, will be filled with User objects
var Users = [];

//returns true if a user has already been created with a user name
function checkUserNameExistence(userName) {
    return user_Names[userName];
}

function addNameToUniqueList(userName) {
    user_Names[userName] = true;
}

//OPTION 1 OF USER MENU - ADDING A NEW USER

function dealWithUserActionUSER(action) {
    if (action === 'ADD') {
        addNewUser();
    }
    if (action === 'REMOVE') {
        helpers.rl.question('K. Whats the user name? ', dealWithUserDELETE);
    }
}

function addNewUser() {
    console.log('\nVery well, lets add a new user!');
    userFuncs.createNewUser();
    var newUser = userFuncs.getCreatedUser();
    console.log('New ' , newUser , ' Added successfully\n');
    Users.push(newUser);
}

function dealWithInputUSERNAME(answer) {
    if (user_Names[answer]) {
        console.error('It appears this user name is already taken! Please choose another!');
        helpers.rl.question('Enter new user name (must be unique!): ', dealWithInputUSERNAME);
    }
    else {
        newUserToAdd = Object.assign({},userFuncs.User);
        newUserToAdd.user_name = answer;
        user_Names[answer] = true;
        helpers.rl.question('\nEnter user password: ', dealWithInputUSERPASSWORD);
    }
}

function dealWithInputUSERPASSWORD(answer) {
    newUserToAdd.password = answer;
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
        newUserToAdd.age = parseInt(answer);
    }
    catch (err) {
        helpers.rl.question('Now get it right, please! ', dealWithInputUSERAGE);
        console.error(err);
        return;
    }

    console.log('New ' , newUserToAdd , ' Added successfully\n');
    Users.push(newUserToAdd);

    indexFuncs.mainMenu();
}

module.exports = {
    dealWithUserActionUSER,
    checkUserNameExistence,
};