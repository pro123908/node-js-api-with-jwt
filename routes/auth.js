const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");

const { registerValidation, loginValidation } = require("../validation/JOI");

router.post("/register", async (req, res) => {
  let { name, email, password } = req.body;

  const { error } = registerValidation({ name, email, password });
  if (error) return res.status(400).send(error.details[0].message);

  const userExists = await User.findOne({ email });

  if (userExists)
    return res.status(400).send("User already exists with this email");

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    const savedUser = await newUser.save();

    res.status(200).send({ user: savedUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginValidation({ email, password });

  if (error) return res.status(400).send(error.details[0].message);

  const userExists = await User.findOne({ email });
  if (!userExists)
    return res.status(400).send("User doesn't exist with this email");

  const isValidPass = await bcryptjs.compare(password, userExists.password);

  if (!isValidPass) return res.status(400).send("Incorrect Password");

  const token = jwt.sign({ _id: userExists._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
