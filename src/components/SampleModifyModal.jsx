import { BlurView } from "expo-blur";
import { Keyboard, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View, Vibration, Dimensions } from "react-native";
import ReactNativeModal from "react-native-modal";
import { Switch } from 'react-native-switch';
import TopIndicator from "./TopIndicator";
import Slider from '@react-native-community/slider';
import { position, searchInput, text } from "assets/styles/global";
import { removeSoundBoard } from "reducers/boardReducer";
import { LinearGradient } from "expo-linear-gradient";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useState } from "react";
import { playAudio, setAudio } from "utils/audio";
import Svg, { Path } from "react-native-svg";
import { formatDuration } from "utils/formatting";
import { useDispatch } from "react-redux";

const SampleModifyModal = ({
  isShowModal,
  handleCloseModal,
  sample,
  trackName,
  setTrackName,
  sliderValue,
  setSliderValue,
  isLooping,
  setIsLooping,
  sliderValues,
  setSliderValues
}) => {
  const [playingSound, setPlayingSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const window = Dimensions.get('window');
  const dispatch = useDispatch();

  const playSound = async () => {
    const audio = await setAudio({
      url: sample.url,
      initialParams: {
        positionMillis: sliderValues[0] * sample.duration * 1000,
        progressUpdateIntervalMillis: 100
      }
    });
    if (audio) {
      await playAudio(audio);

      audio.setOnPlaybackStatusUpdate(async status => {
        if (!status.isLoaded) {
          if (status.error) {
            console.log(`Encountered a fatal error during playback: ${status.error}`);
          }
        }
        else {
          if (status.isPlaying) {
            setIsPlaying(true);
            setCurrentTime(status.positionMillis);
          } else {
            setIsPlaying(false);
          }

          if (status.positionMillis > sample.duration * 1000 * sliderValues[1]) {
            await audio.unloadAsync();
            setIsPlaying(false);
            setPlayingSound(null);
          }
        }
      });

      setPlayingSound(audio);
    }
  }

  const stopSound = async () => {
    if (playingSound) {
      await playingSound.unloadAsync();
      setPlayingSound(null);
      setIsPlaying(false);
    }
  }

  return (
    <ReactNativeModal
      isVisible={isShowModal}
      onBackdropPress={() => {
        handleCloseModal();
        stopSound();
      }}
      onSwipeComplete={() => {
        handleCloseModal();
        stopSound();
      }}
      swipeDirection="down"
      backdropOpacity={1}
      propagateSwipe={true}
      customBackdrop={(
        <BlurView intensity={10} style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />
      )}
    >
      <TopIndicator />
      {sample && (
        <ScrollView
          onScrollBeginDrag={Keyboard.dismiss}
          onTouchStart={Keyboard.dismiss}
          contentContainerStyle={[position.columnCenter, { flex: 1, alignItems: 'stretch', justifyContent: 'flex-start', paddingTop: 60, paddingHorizontal: 20 }]}
        >
          <View>
            <Text style={[text.h2, { textAlign: 'center' }]}>Trackname</Text>
            <View style={[searchInput, { marginTop: 10, paddingVertical: 16 }]}>
              <TextInput
                style={{ flex: 1, minWidth: 0, color: '#222', fontSize: 16 }}
                value={trackName}
                onChangeText={setTrackName}
                placeholder='Trackname...'
                placeholderTextColor='#666'
              />
              <TouchableOpacity
                onPress={() => {
                  setTrackName('');
                  Keyboard.dismiss();
                }}
                style={{ padding: 4 }}
              >
                <Text>Erase</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[position.columnCenter, { marginTop: 50 }]}>
            <Text style={text.h2}>Volume : {Number(sliderValue).toFixed(2)}</Text>
            <Slider
              style={{ height: 40, marginTop: 10, width: '100%' }}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#666666"
              value={sliderValue}
              onValueChange={setSliderValue}
            />
          </View>
          <View style={[position.columnCenter, { marginTop: 50 }]}>
            <Text style={[text.h2, { marginBottom: 10 }]}>Loop : {isLooping ? 'true' : 'false'}</Text>
            <Switch
              onValueChange={value => setIsLooping(value)}
              value={isLooping}
              activeText={''}
              inActiveText={''}
              backgroundActive={'rgba(162, 226, 252, 1)'}
              circleBorderActiveColor={'rgba(0, 0, 0, 0.4)'}
            />
          </View>
          <View style={[position.columnCenter, { marginTop: 50 }]}>
            <Text style={text.h2}>Trim</Text>
            <MultiSlider
              values={sliderValues}
              sliderLength={window.width - (22 + 20 + 10) * 2}
              onValuesChange={setSliderValues}
              onValuesChangeStart={stopSound}
              min={0}
              max={1}
              step={0.001}
              selectedStyle={{ backgroundColor: '#fff', height: 4 }}
              unselectedStyle={{ backgroundColor: '#666', height: 4, borderRadius: 20 }}
            />
            <View style={[position.rowSpace, { width: '100%', paddingHorizontal: 20 }]}>
              <Text style={text.itemSubtitle}>{formatDuration(sliderValues[0] * sample.duration)}</Text>
              <Text style={text.h2}>{formatDuration(currentTime / 1000)}</Text>
              <Text style={text.itemSubtitle}>{formatDuration(sliderValues[1] * sample.duration)}</Text>
            </View>
          </View>
          <View style={[position.columnCenter, { marginTop: 20 }]}>
            <TouchableOpacity
              onPress={!isPlaying ? playSound : stopSound}
              style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100, borderColor: '#fff', borderWidth: 1 }}
            >
              {!isPlaying ? (
                <Svg width={24} height={24} viewBox="0 0 16 16" fill="#fff">
                  <Path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
                </Svg>
              ) : (
                <Svg width={24} height={24} viewBox="0 0 20 20" fill="#fff">
                  <Path d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z" />
                </Svg>
              )}
            </TouchableOpacity>
          </View>
          <Pressable
            onPress={() => {
              dispatch(removeSoundBoard(sample));
              handleCloseModal();
              stopSound();
              Vibration.vibrate();
            }}
            style={{ marginTop: 50, width: '80%', marginLeft: '10%' }}
          >
            <LinearGradient
              style={[position.rowCenter, { borderRadius: 10, paddingVertical: 16, paddingHorizontal: 20 }]}
              colors={['rgba(188, 109, 201, 1)', 'rgba(39, 111, 177, 0.62)']}
              start={{ x: 0.65, y: 0 }}
              end={{ x: 1.2, y: 1 }}
            >
              <Text style={text.h2}>Remove sample</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      )}
    </ReactNativeModal>
  )
}

export default SampleModifyModal;
