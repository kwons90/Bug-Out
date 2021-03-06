/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Text, Box, Select, FormControl, Input, FormLabel, Button,
} from '@chakra-ui/core';
import { getCurrentGameThunk, joinGameThunk } from '../store/thunks/gameThunks';

const JoinGame = (props) => {
  const [gameCode, setGameCode] = useState('');
  const [gameFound, setGameFound] = useState(true);
  const host = window.location.hostname;
  const PORT = process.env.PORT || 3000;

  const { game, joinGame } = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          w="100%"
          bg="#4287f5"
          p={4}
          borderWidth="3px"
          borderStyle="solid"
          maxW="sm"
          rounded="lg"
        >
          <Text fontSize="6xl" color="white">Join Game</Text>
          <FormControl>
            <Input
              placeholder="Enter Game Code"
              type="text"
              focusBorderColor="teal"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
            />
            {!gameFound ? <Text> Game not found </Text> : null}
            <Button
              width="200px"
              variantColor="red"
              margin="5px"
              onClick={() => {
                joinGame(gameCode);
              }}
            >
              Join Game!
            </Button>
          </FormControl>
          <Box>
            <Button
              width="200px"
              variantColor="green"
              margin="5px"
              onClick={() => props.history.push('/')}
            >
              Main Page
            </Button>
          </Box>
          <Box>
            <Button
              width="200px"
              variantColor="purple"
              margin="5px"
            >How to Play
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  getCurrentGame: () => dispatch(getCurrentGameThunk()),
  joinGame: (code) => dispatch(joinGameThunk(code)),

});

export default connect(mapStateToProps, mapDispatchToProps)(JoinGame);
