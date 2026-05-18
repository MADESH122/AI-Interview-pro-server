const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume } = require('../controllers/questionController');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/upload', upload.single('resume'), uploadResume);

module.exports = router;