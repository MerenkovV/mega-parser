const { default: puppeteer } = require("puppeteer");
const { House } = require("../models/models");
const axios = require("axios");

class Utils {
  async getRu09Data() {
    let Arr;
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
      await page.goto(
        "https://www.tomsk.ru09.ru/realty/?type=2&otype=1&price[min]=15&price[max]=22&rent_type[1]=on&scom[min]=20&floor[notfirst]=on&perpage=50",
        { waitUntil: "load", timeout: 0 }
      );
      Arr = await page.evaluate(() => {
        let lastHousesArray = [];
        const maxLength = [
          ...document.querySelector(".realty").children[0].children,
        ].length;
        for (i = 0; i < maxLength; i++) {
          if (i % 2 === 0) {
            try {
              lastHousesArray.push({
                image: [
                  ...document
                    .querySelector(".realty")
                    .children[0].children[i].querySelector(".first")
                    .querySelectorAll(".slidebox_image"),
                ].map((el) => el.attributes[1].value.split("'")[1]),
                description: [
                  ...document
                    .querySelector(".realty")
                    .children[0].children[i].querySelector(".last")
                    .querySelectorAll("p"),
                ]
                  .map((el) => el.innerText)
                  .join("\n"),
                address: [
                  ...document
                    .querySelector(".realty")
                    .children[0].querySelectorAll(".map_link"),
                ].map((el) => "Томск+" + el.innerText.replace(/ /g, "+"))[
                  i / 2
                ],
                number: document
                  .querySelector(".realty")
                  .children[0].children[i].querySelector(".last")
                  .querySelectorAll(".favorite_icon")[5]
                  .children[0].href.split("=")[2],
                price: document
                  .querySelector(".realty")
                  .children[0].children[i].querySelector(".last")
                  .querySelector("strong").parentElement.innerText,
              });
            } catch (error) {
              console.log("ERROR: " + error);
            }
          }
        }
        return lastHousesArray;
      });
      await browser.close();
    } catch (error) {
      console.log(error);
      await browser.close();
      return null;
    }

    const uncheckedArr = await this.asyncForEach(Arr, async (obj, i) => {
      const isChecked = await House.findOne({ where: { number: obj.number } });
      if (!isChecked) return obj;
    });
    let resultArr = [];
    if (uncheckedArr.length !== 0) {
      resultArr = await this.asyncForEach(uncheckedArr, async (obj, i) => {
        return await axios
          .request(
            `https://geocode-maps.yandex.ru/1.x/?apikey=57068974-3853-403b-bd2f-3ace3cdec4f8&geocode=${obj.address}&format=json`
          )
          .then((response) => {
            const answer = JSON.stringify(
              response.data.response.GeoObjectCollection.featureMember[0]
                .GeoObject.Point.pos
            )
              .slice(1, -1)
              .split(" ");
            if (answer[1] < process.env.NE_Y && answer[1] > process.env.SW_Y) {
              if (
                answer[0] > process.env.NE_X &&
                answer[0] < process.env.SW_X
              ) {
                return { ...obj, right: true, X: answer[0], Y: answer[1] };
              }
            }
            return { ...obj, right: false, X: answer[0], Y: answer[1] };
          })
          .catch((error) => {
            console.log("ERROR : " + error);
          });
      });
    }

    return resultArr;
  }

  async asyncForEach(arr, callback) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const answer = await callback(arr[i], i);
      if (answer) result.push(answer);
    }
    return result;
  }
}

module.exports = new Utils();
