import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    throw Error('useGame must be used inside an GameContextProvider');
  }

  return context;
};
