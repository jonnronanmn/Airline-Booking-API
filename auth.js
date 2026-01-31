const jwt = require("jsonwebtoken");
require("dotenv").config();
// [SECTION] Token Creation
// Analogy: Pack the gift and lock it with a secret key
module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
  };

  // Generate a JSON Web Token
  return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

// [SECTION] Token Verification
/*
  Analogy:
  Receive the gift and unlock it with the secret key to verify
  that the sender is legitimate and the data was not tampered with.
*/
module.exports.verify = (req, res, next) => {
  console.log(req.headers.authorization);

  let token = req.headers.authorization;

  if (typeof token === "undefined") {
    return res.send({ auth: "Failed. No Token" });
  } else {
    console.log(token);
    token = token.slice(7, token.length); // remove "Bearer "
    console.log(token);

    // Token Decryption
    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
      if (err) {
        return res.status(403).send({
          auth: "Failed",
          message: err.message,
        });
      } else {
        console.log("result from verify method:");
        console.log(decodedToken);

        // Attach decoded user info to req.user
        req.user = decodedToken;

        // Proceed to next middleware/route handler
        next();
      }
    });
  }
};
