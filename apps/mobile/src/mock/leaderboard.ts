import { BoardType, RankItem } from '../types';

export const buildMockItems = (type: BoardType): RankItem[] =>
  Array.from({ length: 30 }).map((_, index) => ({
    id: `${type}-${index + 1}`,
    rank: index + 1,
    nickname: index === 6 ? 'Pilot Zero' : `指挥官 ${index + 1}`,
    score: 2200 - index * 21,
    primaryValue: type === 'invite' ? 42 - index : 2153 - index * 10,
    secondaryValue: type === 'team' ? 30 + (index % 5) : undefined,
    badge:
      index < 3 ? (index === 0 ? '命运冠冕' : index === 1 ? '命运荣光' : '命运星辉') : undefined,
  }));
