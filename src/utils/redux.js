export const isSoundInList = (id, list) => {
  return list.some(sound => sound.id === id);
};
