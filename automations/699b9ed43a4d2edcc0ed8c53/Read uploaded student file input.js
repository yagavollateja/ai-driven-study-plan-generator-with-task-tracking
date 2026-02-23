// This step reads the uploaded file from environment variable and passes the content to the next step
const fs = require("fs")

try {
  // The Turbotic platform automatically sets the file path to this env variable
  const STUDENT_FILE_PATH = process.env.STUDENT_FILE_PATH
  if (!STUDENT_FILE_PATH) {
    throw new Error("Missing STUDENT_FILE_PATH environment variable. Please upload the student file and set the env variable.")
  }
  console.log("Reading uploaded file at:", STUDENT_FILE_PATH)
  const fileContent = fs.readFileSync(STUDENT_FILE_PATH, "utf8")
  setContext("fileContent", fileContent)
  console.log("File content loaded and set in context")
} catch (e) {
  console.error("Error reading uploaded file:", e.message)
  process.exit(1)
}
