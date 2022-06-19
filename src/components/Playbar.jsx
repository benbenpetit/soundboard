import React, { useEffect, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { position, text } from 'assets/styles/global';
import { useDispatch } from 'react-redux';
import { setPlay } from 'reducers/playbarReducer';
import { formatDuration } from 'utils/formatting';
import { playAudio, playAudioAtPosition, setAudio, stopAudio } from 'utils/audio';

const Playbar = ({ isShow, isPlaying, sound }) => {
  const dispatch = useDispatch();
  const [playingSound, setPlayingSound] = useState(null);
  const appearAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isShow) return;

    Animated.timing(
      appearAnim,
      {
        toValue: 1,
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0, 1),
        useNativeDriver: true
      }
    ).start();
  }, [isShow]);

  const onAudioUpdate = async (audioStatus) => {
    if (!audioStatus.isLoaded) {
      if (audioStatus.error) {
        console.log(`Encountered a fatal error during playback: ${audioStatus.error}`);
      }
    } else {
      if (audioStatus.isPlaying) {
        dispatch(setPlay(true));
      } else {
        dispatch(setPlay(false));
      }

      if (audioStatus.didJustFinish && !audioStatus.isLooping) {
        // dispatch(setPlay(false));
        setPlayingSound(null);
      }
    }
  }

  const playSelectedSound = async () => {
    if (playingSound) {
      await playingSound.audio.stopAsync();
      await playingSound.audio.unloadAsync();
    }

    const audio = await setAudio({
      url: sound.url,
      onPlaybackStatusUpdate: onAudioUpdate
    });
    if (audio) {
      await playAudio(audio);
      setPlayingSound({
        id: sound.id,
        audio: audio
      });
    }
  }

  const togglePlay = async () => {
    if (isPlaying) {
      await playingSound.audio.pauseAsync();
    } else {
      await playAudioAtPosition(playingSound.audio);
    }
  }

  useEffect(() => {
    if (sound) {
      playSelectedSound();
    }
  }, [sound]);

  return (
    <Animated.View
      style={{
        opacity: appearAnim,
        transform: [{
          translateY: appearAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 0]
          })
        }]
      }}
    >
      <BlurView
        intensity={40}
        tint='dark'
        style={[position.rowSpace, { position: 'absolute', bottom: 100, left: 10, right: 10, borderColor: 'rgba(255, 255, 255, 0.4)', borderWidth: 0.2, backgroundColor: 'rgba(59, 55, 94, 0.48)', paddingLeft: 20, paddingRight: 12, paddingVertical: 16, borderRadius: 8, overflow: 'hidden' }]}
      >
        <Image
          style={{ width: 40, height: 40, borderRadius: 6, backgroundColor: '#222' }}
          source={{ uri: sound.cover }}
        />
        <View style={{ flex: 1, marginHorizontal: 14 }}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={[text.itemTitle, { marginBottom: 4 }]}>{sound.description}</Text>
          <Text numberOfLines={1} ellipsizeMode='tail' style={text.itemSubtitle}>{formatDuration(sound.duration)} • {sound.title}</Text>
        </View>
        <TouchableOpacity
          onPress={togglePlay}
          activeOpacity={0.6}
          style={{ padding: 8 }}
        >
          {isPlaying ? (
            <Svg width={24} height={24} viewBox="0 0 16 16" fill={"#fff"}>
              <Path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
            </Svg>
          ) : (
            <Svg width={24} height={24} viewBox="0 0 16 16" fill={"#fff"}>
              <Path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
            </Svg>
          )}
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  )
}

export default Playbar;
