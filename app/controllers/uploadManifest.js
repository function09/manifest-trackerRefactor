import { checkIfManifestExists, saveManifest } from "../services/databaseFunctions.js";

/* 
Before uploading, check if:
a file was selected,  
document # already exists in db,
if the file is a pdf file,

CLEAN EVERYTHING UP!!!!
*/

// use early returns
const verifyFileInput = (req) => {
  const { file } = req;
  let check = false;

  if (!file) {
    check = true;
  }
  return check;
};

// use early returns
const verifyFileSignature = (req) => {
  const { buffer } = req.file;
  const bufferToString = Buffer.from(buffer).toString();
  const byteArray = [...bufferToString].slice(0, 5);
  let check = false;

  // File must contain the unique signature of %PDF- in it's buffer
  if (byteArray.toString() === "%,P,D,F,-") {
    check = true;
  }
  return check;
};

// Refactor this to work as false
// Respond with appropriate HTTP codes, appropriate JSON, clean this up, and handle errors appropriately
const uploadDocumentController = async (req, res) => {
  switch (true) {
    case verifyFileInput(req):
      res.status(200).json({ result: "No file has been selected" });
      break;
    case verifyFileSignature(req):
      try {
        if (await checkIfManifestExists(req.file.buffer)) {
          res.status(200).json({ result: "Document number already exists" });
        } else {
          await saveManifest(req.file.buffer);
          res.status(200).json({
            result: "Document saved successfully",
          });
        }
      } catch (error) {
        console.log(error);
      }
      break;
    default:
      res.status(200).json({ result: "Error processing file: Verify that the correct file type has been submitted (.pdf)" });
  }
};

export default uploadDocumentController;
