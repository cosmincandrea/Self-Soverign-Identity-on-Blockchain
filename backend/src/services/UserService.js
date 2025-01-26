function createUser(name, password, address) {
    var userRepo = global.db_user;
    return userRepo.create({ name: name, password: password, address: address })
        .then(() => true)
        .catch(error => {
            console.error('Error creating user:', error);
            throw new Error('Error creating user');
        });
}


function metamasklogin(address) {
    var userRepo = global.db_user;
    return userRepo.findOne({ where: { address: address } })
        .then(user => {
            return user ? user : false;
        })
        .catch(error => {
            console.error('Error checking credentials:', error);
            throw new Error('Error checking credentials');
        });
}

function checkCredentials(name, password) {
    var userRepo = global.db_user;
    return userRepo.findOne({ where: { name: name, password: password } })
        .then(user => {
            return user ? user : false;
        })
        .catch(error => {
            console.error('Error checking credentials:', error);
            throw new Error('Error checking credentials');
        });
}

function deleteUser(name) {
    var userRepo = global.db_user;
    return userRepo.destroy({ where: { name: name } })
        .then(result => {
            return result > 0;
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            throw new Error('Error deleting user');
        });
}
function getAllUsers() {
    var userRepo = global.db_user;
    return userRepo.findAll()
        .then(users => {
            return users;
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            throw new Error('Error fetching users');
        });
}


function getUsernameForAccount(address) {
    var userRepo = global.db_user;
    return userRepo.findOne({ where: { address: address } })
        .then(user => {
            return user ? user.name : null;
        })
        .catch(error => {
            console.error('Error fetching username for account:', error);
            throw new Error('Error fetching username for account');
        });
}

function getAccountForUsername(name) {
    var userRepo = global.db_user;
    return userRepo.findOne({ where: { name: name } })
        .then(user => {
            return user ? user.address : null;
        })
        .catch(error => {
            console.error('Error fetching account for username:', error);
            throw new Error('Error fetching account for username');
        });
}

module.exports = {
    createUser,
    checkCredentials,
    deleteUser,
    getAllUsers,
    metamasklogin,
    getUsernameForAccount,
    getAccountForUsername
};
