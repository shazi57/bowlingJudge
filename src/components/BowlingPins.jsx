import React from 'react';
import '../assets/BowlingPins.css';

const BowlingPins = (props) => {
  const { numPins, changeFrame, testid } = props;
  return (
    <button type="button" className="pin" value={numPins} data-testid={testid} onClick={changeFrame}>
      {numPins}
    </button>
  );
};

export default BowlingPins;
