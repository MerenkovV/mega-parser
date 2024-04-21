import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

export type HousesType = {
  id: number;
  description: string;
  number: number;
  address: string;
  price: string;
  right: boolean;
  favorite: boolean;
  images: Array<{ link: string; id: number } | null>;
  X: string;
  Y: string;
  createdAt: any;
  updatedAt: any;
};

interface IStore {
  _houses: HousesType[] | [];
  _isFetching: boolean;
}

class store implements IStore {
  _houses: HousesType[] | [];
  _isFetching: boolean;
  constructor() {
    this._houses = [];
    this._isFetching = false;
    makeAutoObservable(this);
  }

  setHouses = (housesArr: HousesType[] | []) => {
    this._houses = housesArr;
  };

  changeFavorite = (id: number) => {
    this._houses = this._houses.map((house) => {
      if (house.id === id) return { ...house, favorite: !house.favorite };
      else return house;
    });
  };

  setIsFetching = (isFetching: boolean) => {
    this._isFetching = isFetching;
  };

  public get houses() {
    return this._houses;
  }

  public get isFetching() {
    return this._isFetching;
  }
}

export const StoreContext = createContext<store | null>(null);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === null) {
    throw new Error(
      "You have forgotten to wrap your root component with RootStoreProvider"
    );
  }
  return context;
};

export default store;
