import multer from "multer";
// this inbuild package of node core module 
// import path from 'path';

// console.log(path.extname("abcd.txt"))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Math.floor(Math.random()*100) + file.originalname)
    }
  })
  
export const upload = multer({ storage: storage });

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/dp')
  },
  filename: function (req, file, cb) {
    cb(null, Math.floor(Math.random()*100) + file.originalname)
  }
})

export const upload2 = multer({ storage: storage2 });