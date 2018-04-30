//imports
const helpers = require('./../Models/helpers');

//object of User.
//has the following: user_name, password, age
var User = {};

var newUser;

function getCreatedUser() {
    return newUser;
}

function createNewUser() {
    //create a new instance of a User
    newUser = Object.assign({},User);
    helpers.rl.question('\nEnter user name (must be unique!): ', dealWithInputUSERNAME);
}

function dealWithInputUSERNAME(answer) {
    //check if the name is taken or not
    /*
    if (usersFuncs.checkUserNameExistence(answer)){
        console.error('It appears this user name is already taken! Please choose another!');
        helpers.rl.question('Enter new user name (must be unique!): ', dealWithInputUSERNAME);
    }
    */
    //else {
        newUser.user_name = answer;
        helpers.rl.question('\nEnter user password: ', dealWithInputUSERPASSWORD);
    //}
}

function dealWithInputUSERPASSWORD(answer) {
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
}


function deleteExistingUser() {
    helpers.rl.question('K. Whats the user name? ', dealWithUserDELETE);
}


//exports
module.exports = {
    createNewUser,
    getCreatedUser,
};

