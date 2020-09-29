/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import moment from 'moment';

import {
  getCurrentGame,
  setPowerups,
  setCorrectAnswer,
  addScoreAction,
  startGame,
  updateName,
  updateGame,
  updateCode,
  setGameTimes,
  roundOver,
  newRound,
  setGameScores,
} from '../actions';

export const createGameThunk = (rounds, difficulty, history) => (dispatch) => axios
  .post('/game/createGame', { rounds, difficulty })
  .then(({ data }) => {
    // console.log('data', data);
    const gameSessionId = data.id;
    axios.put('/game/player', { gameSessionId })
      .then(({ data }) => {
        dispatch(updateGame(data));
        history.push(`/waiting/${gameSessionId}`);
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .catch((e) => {
    console.log(e);
  });

export const updateGameCodeThunk = (code) => (dispatch) => axios
  .put('/game/newGameCode', { code })
  .then(({ data }) => {
    dispatch(updateCode(data));
  })
  .catch((e) => {
    console.log('failed to update code', e);
  });

export const updateGameThunk = (rounds, difficulty) => (dispatch) => {
  console.log(rounds);
  return axios
    .post('/game/updateGame', { rounds, difficulty })
    .then((game) => {
      dispatch(updateGame(game.data));
    })
    .catch((e) => {
      console.log(e);
    });
};

export const joinGameThunk = (code, history) => (dispatch) => axios.put('/game/addplayer', { code })
  .then(({ data }) => {
    dispatch(updateGame(data));
    const { id } = data;
    history.push(`/waiting/${id}`);
  })
  .catch((e) => {
    dispatch(updateGame('failed'));
    console.log(e);
  });

export const getCurrentGameThunk = (id) => (dispatch) => {
  if (id) {
    axios.get(`/game/current/${id}`)
      .then(({ data }) => {
        dispatch(getCurrentGame(data));
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

export const usePowerUpThunk = (powerUp) => (dispatch) => {
  // make an if statement for each powerUP
  if (powerUp.name === 'Minimize') {
    dispatch(null);
  }
};

// export const findRandomGameThunk = (currentGameId) => (dispatch) => axios
//   .post('/game/findRandomGame', { currentGameId })
//   .then(({ data }) => {
//     dispatch(data);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

export const getPromptThunk = (difficulty, id) => (dispatch) => axios
  .get(`/game/prompt/${difficulty}`)
  .then(({ data }) => {
    axios.put(`/game/prompt/${id}`, { data })
      .then(({ data }) => {
        dispatch(newRound(data));
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .catch((e) => {
    console.log(e);
  });

export const getPowerUpsThunk = () => (dispatch) => axios
  .get('/game/powerups')
  .then(({ data }) => {
    dispatch(setPowerups(data));
  })
  .catch((e) => {
    console.log(e);
  });

export const updateNameThunk = (name) => (dispatch) => axios
  .put('/session/updateName', { name })
  .then((res) => {
    dispatch(updateName(res.data));
  })
  .catch((e) => {
    console.log(e);
  });

export const setCorrect = (id) => (dispatch) => {
  axios.put(`/session/correct/${id}`)
    .then(({ data }) => {
      dispatch(setCorrectAnswer());
      dispatch(roundOver(data));
    })
    .catch((e) => {
      console.log(e);
    });
};

export const addScore = (score) => (dispatch) => {
  axios.put('/session/score', { score })
    .then(({ data }) => {
      dispatch(addScoreAction(data.score));
      dispatch(setGameScores(data.players));
    });
};

export const setRoundTimesThunk = (id) => (dispatch) => {
  const year = moment().year();
  const month = moment().month();
  const day = moment().date();
  let hour = moment().hour();
  const minute = moment().minute();
  const seconds = moment().seconds();
  const roundEndUnix = moment().unix() + 65;
  const roundStartUnix = moment().unix();

  let newMin = minute + 1;
  if (newMin > 59) {
    hour += 1;
    newMin -= 60;
  }

  let newSec = seconds + 6;
  if (newSec > 59) {
    newMin += 1;
    newSec -= 60;
  }

  const roundEnd = `${year}-${month + 1}-${day} ${hour}:${newMin}:${newSec}`;

  axios.put(`/game/game-times/${id}`, { roundStartUnix, roundEnd, roundEndUnix })
    .then(() => {
      dispatch(setGameTimes(roundStartUnix, roundEnd, roundEndUnix));
    });
};

export const startGameThunk = (currentGameId) => (dispatch) => axios
  .put('/game/startGame', { currentGameId })
  .then((res) => {
    dispatch(startGame(res.data));
  })
  .catch((e) => {
    console.log(e);
  });

export const roundReset = (id) => () => axios
  .put(`/session/reset-correct/${id}`)
  .catch((e) => {
    console.log(e);
  });
