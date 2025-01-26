//const fileService = require('../services/fileService');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileService = require('../services/fileService')
const ethService = require('../services/ethService')


var router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadDir = 'uploads/';
      if (!fs.existsSync(uploadDir)){
          fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }

  var attributes = JSON.parse(req.body.attributes);

  fileService.uploadToIpfs("D:\\_Licenta\\Licenta incercarea 2\\uploads\\" + req.file.filename, attributes);
  
  res.send(`File uploaded successfully: ${req.file.filename}`);
});


router.post('/getAttributes', async function (req, res, next) {
  try {
      const {hash} = req.body;
      var retVal = await fileService.getAttributes(hash);
      res.status(200).json({ success: true, retVal });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
})

router.post('/getImage', async function (req, res, next) {
  const { hash } = req.body;
  var ret = await fileService.getImage(hash);
  res.send(ret);
});

router.post('/getImagefromDocHash', async function (req, res, next) {
  const { hash } = req.body;
  var val = await fileService.getImgHash(hash);
  console.log(val);
  var ret = await fileService.getImage(val);
  res.send(ret);
});

module.exports = router;