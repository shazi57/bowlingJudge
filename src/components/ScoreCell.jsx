import React from 'react';
import '../assets/ScoreCell.css';

const ScoreCell = (props) => {
  const {
    frame, category, firstRoll, secondRoll, frameScore, thirdRoll,
  } = props;

  return (
    <div className="cell">
      <div className="roundContainer">
        {category === 'frame' ? <h3>{frame}</h3>
          : <h3>{category}</h3>}
      </div>
      <div className="scoreContainer">
        <div className="frameContainer">
          <div className="firstFrame">
            {firstRoll}
          </div>
          <div className="secondFrame">
            {secondRoll}
          </div>
          {frame === 10 ? (<div className="thirdFrame">{thirdRoll}</div>) : null}
        </div>
        <div className="scoreBox">
          {frameScore}
        </div>
      </div>
    </div>
  );
};

export default ScoreCell;
