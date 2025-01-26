var express = require('express');
var router = express.Router();
const ethService = require('../services/ethService')
const fileService = require('../services/fileService')

const indexRouter = express.Router();

indexRouter.get('/get', async function (req, res, next) {
    res.send("test");
});

indexRouter.get('/getImage', async function (req, res, next) {
    var ret = await fileService.getImage('QmNkUoNPCmLuGLKbEZxbHw6wLNvKzTtZrUc9iGL8NcDACj');
    res.send(ret);
});

router.use('/index', indexRouter);

module.exports = router;
