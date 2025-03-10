import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "../styles/ResultsMap.css";

export default function ResultsMap({
  gameData,
  guessData,
  setGuess,
  restartGame,
  setTotalScore,
}) {
  const [distance, setDistance] = useState(0);

  function calculateScore(distance) {
    const maxScore = 5000;
    if (distance === 0) return maxScore;

    const decayFactor = 0.0003;
    const score = maxScore * Math.exp(-decayFactor * distance);

    return Math.round(score);
  }

  function getColor(score) {
    if (score >= 4000) return "green";
    if (score >= 2000) return "yellow";
    if (score >= 1000) return "orange";
    return "red";
  }

  useEffect(() => {
    function toRadians(degrees) {
      return (degrees * Math.PI) / 180;
    }

    function greatCircleDistance(lat1, lon1, lat2, lon2) {
      const R = 6371;

      lat1 = toRadians(lat1);
      lon1 = toRadians(lon1);
      lat2 = toRadians(lat2);
      lon2 = toRadians(lon2);

      const deltaLon = lon2 - lon1;

      const distance =
        Math.acos(
          Math.sin(lat1) * Math.sin(lat2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.cos(deltaLon)
        ) * R;

      return Math.round(distance * 100) / 100;
    }

    if (
      gameData &&
      guessData &&
      gameData.Lat != null &&
      gameData.Long != null &&
      guessData.lat != null &&
      guessData.lng != null
    ) {
      setDistance(
        greatCircleDistance(
          gameData.Lat,
          gameData.Long,
          guessData.lat,
          guessData.lng
        )
      );
    } else {
      console.warn("Invalid gameData or guessData:", { gameData, guessData });
    }
  }, [gameData, guessData]);

  const FitBounds = ({ bounds }) => {
    const map = useMap();
    useEffect(() => {
      map.fitBounds(bounds);
    }, [bounds, map]);
    return null;
  };

  const bounds = [
    [-90, -180],
    [90, 180],
  ];

  if (
    !gameData ||
    !guessData ||
    gameData.Lat == null ||
    gameData.Long == null ||
    guessData.lat == null ||
    guessData.lng == null
  ) {
    return <p>Loading map data...</p>;
  }

  const score = calculateScore(distance);
  const lineColor = getColor(score);

  return (
    <>
      <div className="results-card">
        <div className="results-content">
          <h1>Overview</h1>
          <span className="distance">{distance} km</span>
          <br />
          <br />
          <span className="score">{score} pts</span>
        </div>
      </div>

      <div id="map" className="map-container">
        <MapContainer
          center={[
            (gameData.Lat + guessData.lat) / 2,
            (gameData.Long + guessData.lng) / 2,
          ]}
          zoom={1}
          scrollWheelZoom={false}
          zoomControl={false}
          maxBounds={bounds}
          maxBoundsViscosity={1.0}
          dragging={false}
          className="leaflet-map"
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />
          <Marker
            position={[gameData.Lat, gameData.Long]}
            icon={L.icon({
              iconUrl:
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
              iconSize: [21, 34],
              iconAnchor: [10, 34],
              popupAnchor: [0, -34],
            })}
          />
          <Marker position={[guessData.lat, guessData.lng]} />
          <Polyline
            positions={[
              [gameData.Lat, gameData.Long],
              [guessData.lat, guessData.lng],
            ]}
            pathOptions={{ color: lineColor }}
          />
          <FitBounds
            bounds={[
              [gameData.Lat, gameData.Long],
              [guessData.lat, guessData.lng],
            ]}
          />
        </MapContainer>
      </div>

      <div className="button-container">
        <button
          onClick={async () => {
            setTotalScore((prev) => prev + calculateScore(distance));
            setDistance(null);
            await restartGame();
            setGuess(null);
          }}
          className="play-again-button"
        >
          Play Again
        </button>
      </div>
    </>
  );
}
