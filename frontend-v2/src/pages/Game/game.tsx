import { Flex } from '@mantine/core';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FCWithLayout } from '../../App';
import GameCanvas from '../../components/Game/Canvas';
import GameInstructions from '../../components/Game/GameInstructions';
import { IMatch } from '../../context/GameContext';
import { useSocket } from '../../hooks/socket';
import api from '../../services/api';

const GamePage: FCWithLayout = () => {
  const { socket, updateSocketUserStatus } = useSocket();
  const { gameId } = useParams(); // id of the game
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<IMatch>(`/matches/${gameId}`)
      .then((response) => {
        if (response.data.status === 'aborted') {
          navigate('/not-found');
        }
      })
      .catch((error) => {
        if (
          (error instanceof AxiosError && error.response?.status === 404) ||
          error.response?.status === 400
        ) {
          navigate('/not-found');
        }
      });
  }, []);

  useEffect(() => {
    if (socket) updateSocketUserStatus('game');
  }, [socket]);

  return (
    <>
      <Flex
        style={{ flex: 1 }}
        direction={{ base: 'column', sm: 'row' }}
        justify='space-around'
        align='center'
        mx={32}
        p={{ base: 32, sm: 0 }}
      >
        <GameCanvas />
        <GameInstructions />
      </Flex>
    </>
  );
};

export default GamePage;
