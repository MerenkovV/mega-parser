import React, { useEffect, useState } from "react";
import "./style/AppStyle.css";
import { HousesType, useStore } from "./store/store";
import Card from "./components/Card";
import { getHouses } from "./api/housesApi";
import { observer } from "mobx-react-lite";

const getSetData = async (
  setHouses: (housesArr: HousesType[] | []) => void,
  setIsFetching: (isFetching: boolean) => void
) => {
  setIsFetching(true);
  const data = await getHouses(10);
  console.log(data);
  setHouses(data);
  setIsFetching(false);
};

const App = observer(() => {
  const [reload, setReload] = useState<boolean>(false);
  const { houses, isFetching, setHouses, setIsFetching } = useStore();
  useEffect(() => {
    getSetData(setHouses, setIsFetching);
  }, [setHouses, setIsFetching, reload]);
  return (
    <div className="App">
      <button onClick={() => setReload((prev) => !prev)}>Reload</button>
      {isFetching
        ? "Loading..."
        : houses?.map((house, id) => <Card key={id} {...house} />)}
    </div>
  );
});

export default App;
