const express = require('express');
const userService = require('../services/UserService');

const router = express.Router();
const userRouter = express.Router();

userRouter.post('/register', async function (req, res, next) {
    const { name, password, address } = req.body;

    try {
        const result = await userService.createUser(name, password, address);
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

userRouter.post('/metamasklogin', async function (req, res, next) {
    const { address } = req.body;

    console.log(address);
    try {
        const user = await userService.metamasklogin(address);
        console.log(user);
        if (user) {
            res.status(200).json({ success: true, message: 'Login successful', user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


userRouter.post('/login', async function (req, res, next) {
    const { name, password } = req.body;

    try {
        const user = await userService.checkCredentials(name, password);
        if (user) {
            res.status(200).json({ success: true, message: 'Login successful', user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

userRouter.delete('/delete/:id', async function (req, res, next) {
    const userId = req.params.id;

    try {
        const result = await userService.deleteUser(userId);
        if (result) {
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

userRouter.get('/users', async function (req, res, next) {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

userRouter.post('/getUsernameForAccount', async function (req, res, next) {
    const { address } = req.body;

    try {
        const username = await userService.getUsernameForAccount(address);
        if (username) {
            res.status(200).json({ success: true, username });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

userRouter.post('/getAccountForUsername', async function (req, res, next) {
    const { name } = req.body;

    try {
        const address = await userService.getAccountForUsername(name);
        if (address) {
            res.status(200).json({ success: true, address });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.use('/user', userRouter);

module.exports = router;
