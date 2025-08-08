const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:(res, file, cb)=>{
        cb(null, 'src/uploads/');
    },
    filename:(res,file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({storage});

module.exports = upload;