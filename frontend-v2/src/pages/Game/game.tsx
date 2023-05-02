import { Flex } from '@mantine/core';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FCWithLayout } from '../../App';
import GameCanvas from '../../components/Game/Canvas';
import { IMatch } from '../../context/GameContext';
import api from '../../services/api';

const GamePage: FCWithLayout = () => {
  const { gameId } = useParams(); // id of the game
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<IMatch>(`/game/${gameId}`)
      .then((response) => {
        if (response.data.status === 'finished' || response.data.status === 'aborted') {
          navigate('/game/finished');
        }
      })
      .catch((error) => {
        if (error instanceof AxiosError && error.response?.status === 404) {
          navigate('/not-found');
        }
      });
  }, []);

  return (
    <Flex
      style={{ flex: 1 }}
      direction={{ base: 'column', sm: 'row' }}
      justify='space-around'
      align='center'
      mx={32}
      p={{ base: 32, sm: 0 }}
    >
      <GameCanvas />
    </Flex>
  );
};

export default GamePage;
