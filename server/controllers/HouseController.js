const { House, Images } = require("../models/models");
const ApiError = require("../errors/ApiError");
const Utils = require("../utils/Ru09Parser");
const { Op } = require("sequelize");

class HouseController {
  async setFavorite(req, res, next) {
    const { id, favorite } = req.body;
    if (!id) return next(ApiError.badRequest("Не введён id квартиры"));
    const isSet = await House.findOne({ where: { id } });
    if (!isSet)
      return next(ApiError.badRequest("Такой квартиры не существует"));
    const type = await House.update({ favorite }, { where: { id } });
    return res.json(type);
  }
  async getAll(req, res, next) {
    let { limit = 10 } = req.query;
    const housesParse = await Utils.getRu09Data();
    if (!housesParse)
      return next(ApiError.badRequest("Превышено время ожидания"));
    const housesParseDB = await Utils.asyncForEach(
      housesParse,
      async (house, i) => {
        let info = await House.create(house);
        info.dataValues.images = [];
        house.image.forEach(async (link) => {
          const madeImg = await Images.create({ link, houseId: info.id });
          info.dataValues.images.push({
            link: madeImg.dataValues.link,
            id: madeImg.dataValues.id,
          });
        });
        return info;
      }
    );
    const filterHousesParseDB = housesParseDB.filter(
      (house) => house.right === true
    );
    const arrLength = filterHousesParseDB.length;
    if (arrLength < limit) {
      const housesDB =
        arrLength > 0
          ? await House.findAndCountAll({
              limit: limit - arrLength,
              where: {
                right: true,
                id: {
                  [Op.lt]: filterHousesParseDB[0].dataValues.id,
                },
              },
              include: [{ model: Images, attributes: ["link", "id"] }],
              order: [["id", "DESC"]],
            })
          : await House.findAndCountAll({
              limit: limit - arrLength,
              where: {
                right: true,
              },
              include: [{ model: Images, attributes: ["link", "id"] }],
              order: [["id", "DESC"]],
            });
      return res.json([...housesDB.rows, ...filterHousesParseDB.reverse()]);
    } else {
      return res.json(filterHousesParseDB.slice(0, limit).reverse());
    }
  }
  async setHook(req, res, next) {
    const { id, favorite } = req.body;
    if (!id) return next(ApiError.badRequest("Не введён id квартиры"));
    const isSet = await House.findOne({ where: { id } });
    if (!isSet)
      return next(ApiError.badRequest("Такой квартиры не существует"));
    const type = await House.update({ favorite }, { where: { id } });
    return res.json(type);
  }
}

module.exports = new HouseController();
