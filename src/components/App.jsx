import React, { useEffect, useState } from 'react';
import { hot } from 'react-hot-loader';
import BowlingPins from './BowlingPins';
import CellList from './CellList';
import '../assets/App.css';

const App = () => {
  /*
    gameState variable keeps track of board status and previous frames' strikes and spares.
    gameProgress variable keeps track of current progress of the game

    /////////////////////////////////////////////////////////////////////////////

    scenario) game started and user clicked the button with text content of '5';
      i.e. bowler knocked down 5 bowls in the first frame.

    single iteration =
      1) check gameProgress variable
        // frame = 1
        // roll = firstRoll
        // frameScore = 0
      2) update gameState
        // firstRoll: previous frame score(if exists) + 5
        // secondRoll: '' (not its turn yet)
        // frameScore: 5 + secondRoll
      3) render
      4) update gameProgress variable
        // frame = 1
        // roll = secondRoll
        // frameScore = 5

    scenario) bowler is currently at first roll of third frame
      1) check gameProgress varaible
        // frame = 3
        // roll = firstRoll
        // frameScore = 28
      2) update gameState
        //firstRoll:
          1) did strike two frames ago ? update accordingly
          2) did strike one frame ago ? update accordingly
          3) did spare one frame ago ? update accordingly
        //frameScore: # of knockedPins + secondRoll
      3) render
      4) update gameProgress variable
        // frame = 3
        // roll = secondRoll
        // frameScore = 28 + # of knocked pins

    //////////////////////////////////////////////////////////////////////////////
  */

  // states
  const [gameStarted, startGame] = useState(false);
  const [gameState, updateGameState] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      frame: i + 1,
      firstRoll: 0,
      secondRoll: 0,
      thirdRoll: 0,
      frameScore: 0,
      remainingPins: 10,
    })),
  );
  const [gameProgress, updateProgress] = useState({
    gameOver: false,
    frame: 0,
    firstRoll: true,
    secondRoll: false,
    thirdRoll: false,
  });

  // update gameProgress based on previous roll
  useEffect(() => {
    const {
      frame, firstRoll, secondRoll, thirdRoll,
    } = gameProgress;

    const {
      strike, spare,
    } = gameState[frame];

    if (!gameStarted) {
      startGame(true);
    } else if (frame === 9) {
      // gameover logic
      if ((!strike && !spare && secondRoll) || (thirdRoll)) {
        updateProgress({
          ...gameProgress,
          gameOver: true,
        });
      } else {
        // 10th frame logic
        updateProgress({
          ...gameProgress,
          frame,
          firstRoll: !!secondRoll && !!thirdRoll,
          secondRoll: !!firstRoll,
          thirdRoll: !!secondRoll && (spare || strike),
        });
      }
    } else {
      // general
      updateProgress({
        ...gameProgress,
        frame: ((secondRoll || strike) ? frame + 1 : frame),
        firstRoll: (strike ? firstRoll : !!secondRoll),
        secondRoll: (strike ? secondRoll : !!firstRoll),
      });
    }
  }, [gameState]);

  // update gameState based on user's roll
  const changeFrame = (e) => {
    const knockedPins = Number(e.target.value);
    const {
      frame, firstRoll, secondRoll, thirdRoll,
    } = gameProgress;
    const newGameState = [...gameState];
    const prevFrame = newGameState[frame - 1];
    const prevPrevFrame = newGameState[frame - 2];
    const currFrame = newGameState[frame];

    // if current frame's first roll
    if (firstRoll) {
      // if user striked
      if (currFrame.remainingPins === knockedPins) {
        currFrame.strike = true;
      }
      // anyway update first roll so that it can be displayed
      currFrame.firstRoll = knockedPins;
    }

    if (secondRoll) {
      if (currFrame.remainingPins === knockedPins) {
        // in case where it's tenth frame and user striked first frame
        if (!(currFrame.frame === 10 && currFrame.firstRoll === 10)) {
          currFrame.spare = true;
        }
      }
      currFrame.secondRoll = knockedPins;
    }

    // only happens in tenth frame
    if (thirdRoll) {
      // if user striked
      if (currFrame.remainingPins === knockedPins) {
        // only if user didn't strike or spare during the second roll
        if (!(currFrame.secondRoll === 10 || currFrame.firstRoll + currFrame.secondRoll === 10)) {
          currFrame.spare = true;
        }
      }
      currFrame.thirdRoll = knockedPins;
    }

    // scoring rules

    // if previous frame exists
    if (prevFrame !== undefined) {
      if (firstRoll) {
        // if there was a spare or strike in previous frame
        if (prevFrame.spare || prevFrame.strike) {
          // if there was a strike two frames ago(this enables a perfect game's score)
          if (prevPrevFrame !== undefined && prevFrame.strike && prevPrevFrame.strike) {
            prevPrevFrame.frameScore += knockedPins;
            prevFrame.frameScore += knockedPins;
          }
          prevFrame.frameScore += knockedPins;
        }

        // update current frame score same as previous frame score + knocked pins
        currFrame.frameScore = prevFrame.frameScore;
      }

      // during second roll no need for considering two frames ago's strike
      if (secondRoll) {
        if (prevFrame.strike) {
          prevFrame.frameScore += knockedPins;
          currFrame.frameScore += knockedPins;
        }
      }
    }

    // each frame's state also keeps track of how many pins are left
    // therefore during tenth frame there is an exception
    if (currFrame.frame === 10) {
      if (firstRoll && currFrame.strike) {
        currFrame.remainingPins = 10;
      } else if ((secondRoll && currFrame.spare) || currFrame.secondRoll === 10) {
        currFrame.remainingPins = 10;
      } else {
        currFrame.remainingPins -= knockedPins;
      }
    } else {
      currFrame.remainingPins -= knockedPins;
    }

    currFrame.frameScore += knockedPins;
    updateGameState(newGameState);
  };

  return (
    <div className="globalContainer">
      <CellList frames={gameState} />
      <div className="bowlingPinContainer">
        {(gameProgress.gameOver ? null : <h2> How many pins would you like to knock over?</h2>)}
        {(!gameProgress.gameOver
          ? Array.from({ length: gameState[gameProgress.frame].remainingPins + 1 }, (v, i) => (
            <BowlingPins
              key={(i - 1 + 1).toString()}
              testid={(i - 1 + 1).toString()}
              numPins={i - 1 + 1}
              changeFrame={changeFrame}
            />
          )) : <h1>game over!</h1>)}
      </div>
    </div>
  );
};

export default hot(module)(App);
