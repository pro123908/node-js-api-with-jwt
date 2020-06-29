const router = require("express").Router();
const auth = require("../verifyToken");

router.get("/", auth, (req, res) => {
  res.json({ title: "Post 1", msg: "Protected Content", user: req.user });
});

module.exports = router;
