import axios from "axios";
import { HousesType } from "../store/store";

export const getHouses: (limit: number) => Promise<HousesType[] | []> = async (
  limit = 10
) => {
  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/house?limit=${limit}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const setFavorite: (id: number, favorite: boolean) => void = async (
  id,
  favorite
) => {
  try {
    const { data } = await axios.post(`http://localhost:5000/api/house`, {
      id,
      favorite,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const setHook: () => Promise<string> = async () => {
  try {
    const { data } = await axios.post(
      `http://localhost:5000/api/house/hook`,
      {}
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
