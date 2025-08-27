import multer from 'multer';

const logRequest = (req, res, next) => {
  console.log(`${req.method} ${req.path} at ${new Date().toISOString()}`);
  next();
};

const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, and PDF files are allowed'), false);
  }
}});

export { logRequest, upload };