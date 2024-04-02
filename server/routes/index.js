const Router = require("express");
const router = new Router();
const houseRouter = require("./houseRouter");

router.use("/house", houseRouter);

module.exports = router;
