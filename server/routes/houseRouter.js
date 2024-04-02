const Router = require("express");
const router = new Router();
const HouseController = require("../controllers/HouseController");

router.post("/", HouseController.setFavorite);
router.get("/", HouseController.getAll);
router.post("/hook", HouseController.setHook);

module.exports = router;
