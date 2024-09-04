import React, { useEffect, useState } from "react";
import "./App.css";

let clickOrder = 0;
let allBoxesClicked = false;

const App = () => {
  const [positions, setPositions] = useState(generateRandomPositions()); // Set initial positions with a random layout
  const [boxes, setBoxes] = useState(initializeBoxes("initial", positions));

  useEffect(() => {
    const anyBoxNotClicked = boxes.some((box) => !box.clicked);
    allBoxesClicked = !anyBoxNotClicked;

    if (allBoxesClicked) {
      boxes.forEach((box, idx) => {
        setTimeout(() => {
          const updatedBoxes = [...boxes];
          updatedBoxes[idx].clicked = false;
          setBoxes(updatedBoxes);
        }, 1000 * (idx + 1));
      });
    }
  }, [boxes]);

  // Function to generate random positions within a 3x3 grid
  function generateRandomPositions() {
    const availablePositions = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        availablePositions.push({ row, col });
      }
    }

    // Shuffle the positions and select a random number of them
    const shuffledPositions = availablePositions.sort(
      () => Math.random() - 0.5
    );
    const randomPositions = shuffledPositions.slice(0, 7); // Pick 7 random positions
    return randomPositions;
  }

  function initializeBoxes(mode, positions) {
    let boxList = [];
    const grid = Array(3)
      .fill(0)
      .map((_, row) =>
        Array(3)
          .fill(0)
          .map((_, col) => {
            const position = positions.find(
              (pos) => pos.row === row && pos.col === col
            );
            if (position) {
              if (mode === "initial") {
                return boxList.push({
                  row,
                  col,
                  clicked: false,
                  clickOrder: null,
                });
              }

              return (
                <div
                  key={`${row}-${col}`}
                  onClick={() => handleBoxClick(row, col)}
                  style={{
                    backgroundColor: boxes?.find(
                      (box) => box.row === row && box.col === col
                    )?.clicked
                      ? "green"
                      : "",
                  }}
                  className="box"
                ></div>
              );
            }
            return <div key={`${row}-${col}`}></div>;
          })
      );

    if (mode === "initial") {
      return boxList;
    }

    return grid;
  }

  const handleBoxClick = (row, col) => {
    const updatedBoxes = [...boxes];
    const targetBox = updatedBoxes.find(
      (box) => box.row === row && box.col === col
    );
    targetBox.clicked = true;
    targetBox.clickOrder = ++clickOrder;
    updatedBoxes.sort((a, b) => (a.clickOrder > b.clickOrder ? 1 : -1));
    setBoxes(updatedBoxes);
  };

  // Function to handle generating a new random layout
  const handleGenerateNewLayout = () => {
    const newPositions = generateRandomPositions();
    setPositions(newPositions);
    setBoxes(initializeBoxes("initial", newPositions));
  };

  return (
    <div className="main-container">
      <button
        onClick={handleGenerateNewLayout}
        className="btn"
      >
        Generate New Layout
      </button>
      <div className="box-container">{initializeBoxes("", positions)}</div>
    </div>
  );
};

export default App;
