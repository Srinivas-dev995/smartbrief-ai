import multer from "multer";

const storage = multer.memoryStorage(); // Keep file in RAM
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(txt|docx)$/)) {
      return cb(new Error("Only .txt and .docx files are allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
