import { position, searchInput, text } from "assets/styles/global";
import { Audio } from "expo-av";
import { BlurView } from "expo-blur";
import { useRef, useState, useEffect } from "react";
import { Alert, Dimensions, Keyboard, Platform, ScrollView, Text, TextInput } from "react-native";
import { Animated, StyleSheet, TouchableOpacity, View, Easing } from "react-native";
import ReactNativeModal from "react-native-modal";
import TopIndicator from "./TopIndicator";
import uuid from "react-native-uuid";
import getMp3Duration from "react-native-get-mp3-duration";
import Svg, { Path } from "react-native-svg";
import * as FileSystem from "expo-file-system";
import { playAudio, setAudio } from "utils/audio";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { formatDuration } from "utils/formatting";
import { useDispatch } from "react-redux";
import { addSoundLibrary } from "reducers/userLibraryReducer";
import { LinearGradient } from "expo-linear-gradient";
import base64 from 'react-native-base64'

const RecordModal = ({ isShowModal, handleCloseModal, props }) => {
  const window = Dimensions.get('window');
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState(false);
  const [record, setRecord] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSound, setPlayingSound] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [sliderValues, setSliderValues] = useState([0, 1]);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackName, setTrackName] = useState('');
  const recordAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.timing(recordAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(recordAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
        useNativeDriver: true
      }).start();
    }
  }, [isRecording]);

  const startRecord = async () => {
    setCurrentSound(undefined);

    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const record = new Audio.Recording();
      await record.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await record.startAsync();
      setIsRecording(true);
      setRecord(record);
    } catch (error) {
      setRecord(undefined);
      setIsRecording(false);
      Alert.alert('Error while trying to record');
      console.log(error);
    }
  }

  const stopRecord = async () => {
    setIsRecording(false);
    await record.stopAndUnloadAsync();
    const uri = await record.getURI();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });

    let duration;
    if (Platform.OS === 'web') {
      const base = base64.encode(uri);
      console.log(base);
      console.log(base64.decode(base));
      duration = await getMp3Duration(base, 'seconds');
    } else {
      try {
        const base = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        duration = await getMp3Duration(base, 'seconds');
      } catch (e) {
        console.log(e);
      }
    }

    console.log(duration);

    setCurrentSound({
      id: uuid.v4(),
      url: uri,
      duration: duration * 10,
      positionStart: 0,
      positionEnd: 1,
      title: 'Recorded sound'
    });
    setSliderValues([0, 1]);
    setRecord(undefined);
  }

  const toggleRecord = async () => {
    if (isRecording) {
      stopRecord();
    } else {
      startRecord();
    }
  }

  const startPlaying = async () => {
    const audio = await setAudio({
      url: currentSound.url,
      initialParams: {
        positionMillis: sliderValues[0] * currentSound.duration * 1000,
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

          if (status.positionMillis > currentSound.duration * 1000 * sliderValues[1]) {
            await audio.unloadAsync();
            setIsPlaying(false);
            setPlayingSound(null);
          }
        }
      });

      setPlayingSound(audio);
    }
  }

  const stopPlaying = async () => {
    if (playingSound) {
      await playingSound.unloadAsync();
      setPlayingSound(null);
      setIsPlaying(false);
    }
  }

  const togglePlay = async () => {
    if (isPlaying) {
      stopPlaying();
    } else {
      startPlaying();
    }
  }

  return (
    <ReactNativeModal
      isVisible={isShowModal}
      onBackdropPress={handleCloseModal}
      onSwipeComplete={handleCloseModal}
      onModalWillHide={stopPlaying}
      swipeDirection="down"
      backdropOpacity={1}
      customBackdrop={(
        <BlurView intensity={10} style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />
      )}
      {...props}
    >
      <TopIndicator />
      <ScrollView
        onScrollBeginDrag={Keyboard.dismiss}
        onTouchStart={Keyboard.dismiss}
        contentContainerStyle={[position.columnCenter, { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20, paddingHorizontal: 20 }]}
      >
        {currentSound && (
          <View style={[searchInput, { marginBottom: 50, width: '100%', paddingVertical: 16 }]}>
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
        )}
        <TouchableOpacity
          onPress={toggleRecord}
          activeOpacity={0.8}
          style={style.recordWrapper}
        >
          <Animated.View
            style={[
              style.recordOutside,
              {
                borderRadius: recordAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['100%', '10%']
                })
              }
            ]}
          />
          <Animated.View
            style={[
              style.recordInside,
              {
                borderRadius: recordAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['100%', '10%']
                })
              }
            ]}
          />
        </TouchableOpacity>
        {currentSound && <>
          <View style={[position.columnCenter, { marginTop: 50 }]}>
            <Text style={text.h2}>Trim</Text>
            <MultiSlider
              values={sliderValues}
              sliderLength={window.width - (22 + 20 + 10) * 2}
              onValuesChange={setSliderValues}
              onValuesChangeStart={stopPlaying}
              min={0}
              max={1}
              step={0.001}
              selectedStyle={{ backgroundColor: '#fff', height: 4 }}
              unselectedStyle={{ backgroundColor: '#666', height: 4, borderRadius: 20 }}
            />
            <View style={[position.rowSpace, { paddingHorizontal: 20, width: '100%' }]}>
              <Text style={text.itemSubtitle}>{formatDuration(sliderValues[0] * currentSound.duration)}</Text>
              <Text style={[text.h2, { flex: 1, textAlign: 'center' }]}>{formatDuration(currentTime / 1000)}</Text>
              <Text style={text.itemSubtitle}>{formatDuration(sliderValues[1] * currentSound.duration)}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={togglePlay}
            style={{ marginTop: 30, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 100, borderColor: '#fff', borderWidth: 1 }}
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
          <TouchableOpacity
            onPress={() => {
              dispatch(addSoundLibrary({
                ...currentSound,
                description: trackName || 'Default trackname',
                positionStart: sliderValues[0],
                positionEnd: sliderValues[1],
              }));
              handleCloseModal();
              stopPlaying();
            }}
            style={{ marginTop: 50, width: '80%' }}
          >
            <LinearGradient
              style={[position.rowCenter, { borderRadius: 10, paddingVertical: 16, paddingHorizontal: 20 }]}
              colors={['rgba(188, 109, 201, 1)', 'rgba(39, 111, 177, 0.62)']}
              start={{ x: 0.65, y: 0 }}
              end={{ x: 1.2, y: 1 }}
            >
              <Text style={text.h2}>Add sound</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>}
      </ScrollView>
    </ReactNativeModal>
  )
};

export default RecordModal;

const style = StyleSheet.create({
  recordWrapper: {
    width: 120,
    height: 120,
  },
  recordOutside: {
    width: '100%',
    height: '100%',
    padding: 20,
    backgroundColor: '#ff001f',
    borderRadius: '100%',
    opacity: 0.2
  },
  recordInside: {
    margin: 16,
    backgroundColor: '#ff001f',
    borderRadius: '100%',
    ...StyleSheet.absoluteFillObject
  }
});
