import { BlurView } from "expo-blur";
import { Keyboard, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View, Vibration } from "react-native";
import ReactNativeModal from "react-native-modal";
import { Switch } from 'react-native-switch';
import TopIndicator from "./TopIndicator";
import Slider from '@react-native-community/slider';
import { position, searchInput, text } from "assets/styles/global";
import { useEffect, useState } from "react";
import { removeSoundBoard, updateSoundBoard } from "reducers/boardReducer";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

const SampleModifyModal = ({ isShowModal, handleCloseModal, sample }) => {
  const dispatch = useDispatch();
  const [sliderValue, setSliderValue] = useState(0.5);
  const [trackName, setTrackName] = useState('');
  const [isLooping, setIsLooping] = useState(false);

  useEffect(() => {
    setTrackName(sample?.description);
    setSliderValue(sample?.volume);
    setIsLooping(sample?.isLooping);
  }, [sample]);

  return (
    <ReactNativeModal
      isVisible={isShowModal}
      onBackdropPress={handleCloseModal}
      onSwipeComplete={handleCloseModal}
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
              />
              <TouchableOpacity
                onPress={() => {
                  setSearchTextInput('');
                  Keyboard.dismiss();
                }}
                style={{ padding: 4 }}
              >
                <Text>Cancel</Text>
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
              onValueChange={value => {
                setSliderValue(value);
                updateSoundBoard({
                  ...sample,
                  volume: value.toFixed()
                });
              }}
            />
          </View>
          <View style={[position.columnCenter, { marginTop: 50 }]}>
            <Text style={[text.h2, { marginBottom: 10 }]}>Loop : {isLooping ? 'true' : 'false'}</Text>
            <Switch
              onValueChange={() => setIsLooping(prevState => !prevState)}
              value={isLooping}
              activeText={''}
              inActiveText={''}
              backgroundActive={'rgba(162, 226, 252, 1)'}
              circleBorderActiveColor={'rgba(0, 0, 0, 0.4)'}
            />
          </View>
          <Pressable
            onPress={() => {
              dispatch(removeSoundBoard(sample));
              handleCloseModal();
              Vibration.vibrate();
            }}
            style={{ backgroundColor: 'rgba(200, 50, 100)', marginTop: 50, width: '80%', marginLeft: '10%' }}
          >
            <LinearGradient
              style={[position.rowCenter, { borderRadius: 10, paddingVertical: 16, paddingHorizontal: 20 }]}
              colors={['rgba(200, 50, 100, 0.8)', 'rgba(255, 255, 255, 1)']}
              start={{ x: 0.4, y: 0 }}
              end={{ x: 2, y: 1.5 }}
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
