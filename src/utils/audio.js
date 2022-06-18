export const setAudio = async (uri) => {
  const { sound } = await Audio.Sound.createAsync({ uri: uri });
  return sound;
}

export const playAudio = async (audio) => {
  await audio.playAsync();
}
