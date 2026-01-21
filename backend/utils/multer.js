import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const leadsStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "leads_uploads",
    resource_type: "raw",
  },
});

export const uploadLeadsFile = multer({
  storage: leadsStorage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
       "application/octet-stream"
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF or Excel files allowed"));
  },
});
