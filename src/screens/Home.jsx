import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View, Platform } from 'react-native';
import { position, text, wrapper } from 'assets/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import LinesEllipsis from 'react-lines-ellipsis';
import { useDispatch, useSelector } from 'react-redux';
import { addSoundBoard, boardSelector, updateSoundBoard } from 'reducers/boardReducer';
import AddSampleModal from 'components/AddSampleModal';
import SampleModifyModal from 'components/SampleModifyModal';
import { setShow, setSound } from 'reducers/playbarReducer';
import { setAudio } from 'utils/audio';
import { useDebounce } from 'use-debounce';

const Pad = ({ sample, handlePress, handleLongPress }) => {
  return (
    <View style={{ flex: 1 / 3 }}>
      <TouchableOpacity
        onLongPress={handleLongPress}
        onPress={handlePress}
        activeOpacity={0.8}
        style={{ margin: 10 }}
      >
        <LinearGradient
          style={[position.rowCenter, { width: '100%', borderRadius: 10, aspectRatio: 1 / 1, padding: 14 }]}
          colors={['rgba(188, 109, 201, 1)', 'rgba(39, 111, 177, 0.62)']}
          start={{ x: 0.65, y: 0 }}
          end={{ x: 1.2, y: 1 }}
        >
          {Platform.OS === 'web'
            ? <LinesEllipsis
              text={sample.description}
              maxLine='4'
              ellipsis='...'
              trimRight
              basedOn='letters'
              style={{ textAlign: 'center', color: '#fff', fontSize: 15, width: '100%' }}
            />
            : <Text numberOfLines={4} style={{ textAlign: 'center', color: '#fff', fontSize: 15 }}>{sample.description}</Text>
          }
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

const AddButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ margin: 10, flexGrow: 1 }}
    >
      <LinearGradient
        style={[position.rowCenter, { borderRadius: 10, padding: 20, borderColor: 'rgba(255, 255, 255, 0.6)', borderWidth: 1 }]}
        colors={['rgba(188, 109, 201, 1)', 'rgba(39, 111, 177, 0.62)']}
        start={{ x: 0.65, y: 0 }}
        end={{ x: 1.2, y: 1 }}
      >
        <Svg width={16} height={16} viewBox="0 0 20 20">
          <Path fill="#fff" d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z" />
        </Svg>
        <Text style={{ marginLeft: 6, color: '#fff', fontSize: 16 }}>Add song</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const ClearPlayingSamplesButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ margin: 0, display: 'flex' }}
    >
      <LinearGradient
        style={[position.rowCenter, { margin: 10, marginLeft: 0, flex: 1, borderRadius: 50, paddingHorizontal: 20, borderColor: 'rgba(255, 255, 255, 0.6)', borderWidth: 1 }]}
        colors={['rgba(100, 50, 100, 1)', 'rgba(255, 255, 255, 0.62)']}
        start={{ x: 0.65, y: 0 }}
        end={{ x: 1.2, y: 1 }}
      >
        <Svg width={22} height={22} viewBox="0 0 20 20" fill="#fff">
          <Path d="M9.383 3.076A1 1 0 0 1 10 4v12a1 1 0 0 1-1.707.707L4.586 13H2a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2.586l3.707-3.707a1 1 0 0 1 1.09-.217zm2.91 4.217a1 1 0 0 1 1.414 0L15 8.586l1.293-1.293a1 1 0 1 1 1.414 1.414L16.414 10l1.293 1.293a1 1 0 0 1-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 0 1-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 0 1 0-1.414z" />
        </Svg>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const Home = () => {
  const [isShowAddSampleModal, setIsShowAddSampleModal] = useState(false);
  const [isShowSampleModifyModal, setIsShowSampleModifyModal] = useState(false);
  const [selectedSound, setSelectedSound] = useState(null);
  const [playingSamples, setPlayingSamples] = useState([]);
  const samples = useSelector(boardSelector).board;
  const [sliderValue, setSliderValue] = useState(0.5);
  const [sliderValueDebounced] = useDebounce(sliderValue, 100);
  const [trackName, setTrackName] = useState('');
  const [trackNameDebounced] = useDebounce(trackName, 300);
  const [isLooping, setIsLooping] = useState(false);
  const [isLoopingDebounced] = useDebounce(isLooping, 200);
  const [sliderValues, setSliderValues] = useState([0, 0]);
  const [sliderValuesDebounced] = useDebounce(sliderValues, 50);
  const dispatch = useDispatch();

  const openAddSample = () => {
    setIsShowAddSampleModal(true);
  }

  const openSampleModify = (sound) => {
    setSelectedSound(sound);
    setIsShowSampleModifyModal(true);
  }

  const playGlobalSound = (sound) => {
    dispatch(setSound(sound));
    dispatch(setShow(true));
  }

  const addSongToBoard = (sound) => {
    setIsShowAddSampleModal(false);
    dispatch(addSoundBoard(sound));
  }

  const playSample = async (sample) => {
    const audio = await setAudio(sample);
    await audio.setStatusAsync({
      positionMillis: sample.duration * 1000 * sample.positionStart,
      volume: sample.volume,
      isLooping: sample.isLooping
    })
    await audio.playAsync();
    audio.setOnPlaybackStatusUpdate(async status => {
      if (status.positionMillis > sample.duration * 1000 * sample.positionEnd) {
        await audio.unloadAsync();
      }
    });
    setPlayingSamples([
      ...playingSamples,
      audio
    ]);
  }

  const clearAllPlayingSamples = async () => {
    playingSamples?.map(async audio => {
      await audio.unloadAsync();
    });
    setPlayingSamples([]);
  };

  useEffect(() => {
    setTrackName(selectedSound?.description);
    setSliderValue(selectedSound?.volume);
    setIsLooping(selectedSound?.isLooping);
    setSliderValues([selectedSound?.positionStart, selectedSound?.positionEnd]);
  }, [selectedSound]);

  useEffect(() => {
    dispatch(updateSoundBoard({
      ...selectedSound,
      description: trackName,
      volume: sliderValue,
      isLooping: isLooping,
      positionStart: sliderValues[0],
      positionEnd: sliderValues[1]
    }));
  }, [sliderValueDebounced, trackNameDebounced, isLoopingDebounced, sliderValuesDebounced]);

  return (
    <>
      <View style={wrapper}>
        <Text style={text.h1}>Sampl.io</Text>
        <SafeAreaView style={{ marginTop: 10, marginHorizontal: -10, flex: 1 }}>
          <FlatList
            data={samples}
            renderItem={({ item }) => (
              <Pad
                sample={item}
                handlePress={() => playSample(item)}
                handleLongPress={() => openSampleModify(item)}
              />
            )}
            keyExtractor={sample => sample.id}
            numColumns={3}
            ListHeaderComponent={<View style={{ display: 'flex', alignItems: 'stretch', flexDirection: 'row' }}>
              <AddButton onPress={openAddSample} />
              <ClearPlayingSamplesButton onPress={clearAllPlayingSamples} />
            </View>}
            stickyHeaderIndices={[0]}
            ListEmptyComponent={<Text style={{ fontSize: 16, textAlign: 'center', marginTop: 20, color: '#fff' }}>No sample yet. Go search and add one!</Text>}
            ListFooterComponent={<View style={{ width: '100%', height: 145 }} />}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </View>
      <AddSampleModal
        isShowModal={isShowAddSampleModal}
        handleCloseModal={() => setIsShowAddSampleModal(false)}
        handlePrimaryAction={(sound) => playGlobalSound(sound)}
        handleSecondaryAction={(sound) => addSongToBoard(sound)}
      />
      <SampleModifyModal
        isShowModal={isShowSampleModifyModal}
        handleCloseModal={() => setIsShowSampleModifyModal(false)}
        sample={selectedSound}
        trackName={trackName}
        setTrackName={setTrackName}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        isLooping={isLooping}
        setIsLooping={setIsLooping}
        sliderValues={sliderValues}
        setSliderValues={setSliderValues}
      />
    </>
  )
}

export default Home;
