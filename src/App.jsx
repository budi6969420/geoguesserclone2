import { useEffect, useState } from "react";
import Game from "./components/Game";
import dataService from "./services/DataService";

function App() {
  let [playedLevelIds, setPlayedLevelIds] = useState([]);
  let [data, setData] = useState();

  async function getNewGameData(playedGamesIds) {
    await dataService.loadData();
    let availableLevels = dataService.getData();
    
    availableLevels = availableLevels.filter(x => !playedGamesIds.includes(x.PanoramaId));
    
    if (availableLevels.length > 0) {
        setData(availableLevels[Math.floor(Math.random() * availableLevels.length)]);
    }
}

  useEffect(() => {
    const fetchDataOnMount = async () => {
      await getNewGameData([]);
    };

    fetchDataOnMount();
  }, []);

  return (
    <Game
      gameData={data}
      fetchGameData={getNewGameData}
      playedLevelIds={playedLevelIds}
      setPlayedLevelIds={setPlayedLevelIds}
    />
  );
}

export default App;
