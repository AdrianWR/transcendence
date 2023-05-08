/* eslint-disable quotes */
import {
  IconAbacus,
  IconAlien,
  IconBallFootball,
  IconBoxMultiple3,
  IconBrandWindows,
  IconCircleNumber3,
  IconCircleNumber5,
  IconCrown,
  IconFall,
  IconHandStop,
  IconMicrophone2,
  IconUfo,
} from '@tabler/icons-react';
import { IUserStats } from '.';

export interface AchievementItem {
  icon: JSX.Element;
  name: string;
  description: string;
  xp: number;
}

export const achievementsDict = {
  game3: {
    icon: <IconCircleNumber3 stroke={1} color='white' size={42} />,
    name: 'Triple',
    description: 'Play 3 games',
    xp: 40,
  },
  game5: {
    icon: <IconCircleNumber5 stroke={1} color='blue' size={42} />,
    name: 'Put 5 On It!',
    description: 'Play 5 games',
    xp: 65,
  },
  game10: {
    icon: <IconBallFootball color='yellow' size={42} />,
    name: 'Pelé',
    description: 'Play 10 games',
    xp: 100,
  },
  game22: {
    icon: <IconMicrophone2 stroke={1} color='violet' size={42} />,
    name: "But I'm feeling 22",
    description: 'Play 22 games',
    xp: 180,
  },
  game42: {
    icon: <IconAlien color='cyan' size={42} />,
    name: "Don't Panic",
    description: 'Play 42 games',
    xp: 242,
  },
  win3: {
    icon: <IconBoxMultiple3 color='grey' size={42} />,
    name: 'Rookie',
    description: 'Win 3 games',
    xp: 50,
  },
  win5: {
    icon: <IconHandStop stroke={1} color='green' size={42} />,
    name: 'Give me five',
    description: 'Win 5 games',
    xp: 100,
  },
  win10: {
    icon: <IconBrandWindows color='orange' size={42} />,
    name: 'Win10',
    description: 'Win 10 games',
    xp: 208,
  },
  win22: {
    icon: <IconAbacus stroke={1} color='pink' size={42} />,
    name: 'Just a nice number',
    description: 'Win 22 games',
    xp: 220,
  },
  win42: {
    icon: <IconUfo color='lightBlue' size={42} />,
    name: '42',
    description: 'Win 42 games',
    xp: 420,
  },
  loss1: {
    icon: <IconFall color='red' size={42} />,
    name: 'It happens',
    description: 'Lose 1 game',
    xp: 200,
  },
  loss10: {
    icon: <IconCrown color='purple' size={42} />,
    name: 'King of loss',
    description: 'Lose 10 games',
    xp: 175,
  },
};

export const levelsDict = {
  1: { from: 0, to: 99 },
  2: { from: 100, to: 199 },
  3: { from: 200, to: 399 },
  4: { from: 400, to: 599 },
  5: { from: 600, to: 899 },
  6: { from: 900, to: 999 },
  7: { from: 1000, to: 1199 },
  8: { from: 1200, to: 1399 },
  9: { from: 1400, to: 1699 },
  10: { from: 1700, to: 2000 },
};

export const createAchievementsList = (userStats: IUserStats) => {
  const achievementsList = [] as AchievementItem[];
  const { gamesPlayed, wins, losses } = userStats;

  if (gamesPlayed >= 3) achievementsList.push(achievementsDict.game3);
  if (gamesPlayed >= 5) achievementsList.push(achievementsDict.game5);
  if (gamesPlayed >= 10) achievementsList.push(achievementsDict.game10);
  if (gamesPlayed >= 22) achievementsList.push(achievementsDict.game22);
  if (gamesPlayed >= 42) achievementsList.push(achievementsDict.game42);
  if (wins >= 3) achievementsList.push(achievementsDict.win3);
  if (wins >= 5) achievementsList.push(achievementsDict.win5);
  if (wins >= 10) achievementsList.push(achievementsDict.win10);
  if (wins >= 22) achievementsList.push(achievementsDict.win22);
  if (wins >= 42) achievementsList.push(achievementsDict.win42);
  if (losses >= 1) achievementsList.push(achievementsDict.loss1);
  if (losses >= 10) achievementsList.push(achievementsDict.loss10);

  return achievementsList;
};
