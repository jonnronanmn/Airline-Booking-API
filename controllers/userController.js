const User = require("../models/User")
const bcrypt = require("bcrypt");
const auth = require("../auth")

module.exports.registerUser = async (req,res) => {
    try{
        const {firstName, lastName, email, password, mobileNum } = req.body

        if(!firstName || !lastName || !email || !password || !mobileNum){
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            mobileNum
        })

        await newUser.save()

        res.status(201).json({
            message:"User registered successfully",
            User: {
                id: newUser._id
            }
        })

  } catch (err) {
    console.error("Error registering user:", err.message);

    res.status(500).json({
      message: "Something went wrong while registering the user.",
      error: err.message,
    });
  }
};



module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    const token = auth.createAccessToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports.getUserDetails = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select("-password")
    
        if(!user){
            res.status(400).json({ message: "User not found"})
        }

        res.status(200).json({ user });
    }catch(err){
        return res.status(500).json({ error: err.message })
    }
}

