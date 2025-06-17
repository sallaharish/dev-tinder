const validator = require('validator');

const validateSignUpData = (req) => {
    console.log("Validating signup data...", req.body);
  const { emailId, password, firstName, lastName } = req.body;
  if(!emailId || !password || !firstName || !lastName) {
    throw new Error("All fields are required");
  }
  else if (validator.isEmail(emailId) === false) {
    throw new Error("Invalid email format");

  }
    else if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }


}
module.exports = {
  validateSignUpData
};