// 1. Import Multer module
import multer from 'multer';

// 2. Configure storage settings for Multer

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // specify the destination directory
    },
    filename: function (req, file, cb) {
        cb(null,new Date().toISOString().replace(/:/g, '_') + file.originalname); // specify the file name
    }
});


export const  upload = multer({ storage: storage });
