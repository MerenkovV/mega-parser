const Router = require("express");
const router = new Router();
const HouseController = require("../controllers/HouseController");

router.post("/", HouseController.setFavorite);
router.get("/", HouseController.getAll);

module.exports = router;
