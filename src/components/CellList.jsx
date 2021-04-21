import React from 'react';
import ScoreCell from './ScoreCell';
import '../assets/CellList.css';

const CellList = (props) => {
  const { frames } = props;
  return (
    <div className="scoreCellContainer">
      {frames.map((v) => {
        let firstSign = (v.firstRoll === 0 ? '' : v.firstRoll);
        let secondSign = (v.secondRoll === 0 ? '' : v.secondRoll);
        let thirdSign = (v.thirdRoll === 0 ? '' : v.thirdRoll);
        const frameScore = (v.frameScore !== 0 ? v.frameScore : '');

        // display logic
        if (v.strike) {
          if (v.firstRoll === 10) {
            if (v.frame < 10) {
              firstSign = '';
              secondSign = 'X';
            } else {
              firstSign = 'X';
            }
          }
          if (v.secondRoll === 10) {
            secondSign = 'X';
          }
          if (v.thirdRoll === 10) {
            thirdSign = 'X';
          }
        }
        if (v.spare) {
          if (v.firstRoll === 10) {
            thirdSign = '/';
          } else {
            secondSign = '/';
          }
        }

        return (
          <ScoreCell
            category="frame"
            frame={v.frame}
            key={v.frame.toString()}
            firstRoll={firstSign}
            secondRoll={secondSign}
            thirdRoll={thirdSign}
            frameScore={frameScore}
          />
        );
      })}
    </div>
  );
};

export default CellList;
