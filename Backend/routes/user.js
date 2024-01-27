const express = require("express");

const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User } = require("../db");

// signIn route
// use zod validation
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const user = await User.fintOne({
    username: req.body.username,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
    return res.status(200).json({
      token: token,
    });
  }

  return res.status(411).json({
    message: "Error while loggin in",
  });
});

// signUp route
// use zod validation
const signupData = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});
router.post("/signup", async (req, res) => {
  const { success } = signupData.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Email already exists / Incorrect E-mail",
    });
  }

  const existingUser = await User.fintOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken/Incorrect inputs",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = user._id;
  const token = jwt.sign({ userId }, JWT_SECRET);
  res.json.status({
    message: "User was created successfully",
    token,
  });
  
});

// update
app.get("/getProfile", {});
app.post("/updateProfile", {});

module.exports = router;
