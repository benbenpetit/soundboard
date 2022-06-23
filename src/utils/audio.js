import { Audio } from "expo-av";

export const setAudio = async ({
  url,
  initialParams = {},
  onPlaybackStatusUpdate = null,
  downloadFirst = false
}) => {
  try {
    const { sound } = await Audio.Sound.createAsync({ uri: url }, initialParams, onPlaybackStatusUpdate, downloadFirst);
    return sound;
  } catch (e) {
    return null;
  }
}

export const playAudio = async (audio) => {
  await audio.playAsync();
}

export const replayAudio = async (audio) => {
  await audio.replayAsync();
}

export const stopAudio = async (audio) => {
  await audio.pauseAsync();
}

export const unloadAudio = async (audio) => {
  await audio.unloadAsync();
}

export const playAudioAtPosition = async (audio) => {
  const status = await audio.getStatusAsync();
  await audio.setStatusAsync({positionMillis: status.positionMillis});
  await audio.playAsync();
}
