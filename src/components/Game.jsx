import React, { useState } from "react";
import MainMap from "./MainMap";
import MapSelectionForm from "./MapSelectionForm";
import ResultsMap from "./ResultsMap";
import dataService from "../services/DataService";

export default function Game({
  gameData,
  fetchGameData,
  playedLevelIds,
  setPlayedLevelIds,
}) {
  let [currentGuess, setCurrentGuess] = useState(null);
  let [totalScore, setTotalScore] = useState(0);
  let [totalPlayedGames, setTotalPlayedGames] = useState(0);

  async function restartGame() {
    let gameIds = [...playedLevelIds, gameData.PanoramaId];
    if (gameIds.length === dataService.getData().length) {
      gameIds = [];
    }
    setPlayedLevelIds(gameIds);
    setTotalPlayedGames((prev) => prev + 1);
    setCurrentGuess(null);
    await fetchGameData(gameIds);
  }

  return (
    <div>
      {gameData && (
        <>
          <div
            style={{
              position: "absolute",
              bottom: "1%",
              left: "0.5%",
              visibility: currentGuess && "collapse",
            }}
          >
            <MapSelectionForm setGuess={setCurrentGuess} currentGuess={currentGuess} gameData={gameData} />
          </div>
          <MainMap
            gameData={gameData}
            totalScore={totalScore}
            currentGuess={currentGuess}
            totalPlayedGames={totalPlayedGames}
          />
        </>
      )}

      {currentGuess && (
        <div
          style={{
            height: "60vh",
            width: "80vh",
            position: "absolute",
            top: "40%",
            left: "50%",
            translate: "-50% -50%",
          }}
        >
          <ResultsMap
            gameData={gameData}
            guessData={currentGuess}
            setGuess={setCurrentGuess}
            restartGame={restartGame}
            setTotalScore={setTotalScore}
          />
        </div>
      )}
    </div>
  );
}
