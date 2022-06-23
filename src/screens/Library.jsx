import { position, text, wrapper } from 'assets/styles/global';
import List from 'components/List';
import OptionsModal from 'components/OptionsModal';
import RecordModal from 'components/RecordModal';
import React, { useState } from 'react'
import { ActivityIndicator, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { setShow, setSound } from 'reducers/playbarReducer';
import { addSoundLibrary, removeSoundLibrary, setFilterLibrary, userLibrarySelector } from 'reducers/userLibraryReducer';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import getMp3Duration from 'react-native-get-mp3-duration';
import uuid from 'react-native-uuid';

const FILTERBY_DATA = [
  { key: 'DATE_ASC', label: 'Rencently added' },
  { key: 'ALPHABET_ASC', label: 'Alphabetical order' },
  { key: 'DURATION_ASC', label: 'Duration ascending' },
  { key: 'DURATION_DESC', label: 'Duration descending' }
];

const SpecialListItem = ({ action, label, icon }) => {
  return (
    <TouchableOpacity
      onPress={action}
      activeOpacity={0.8}
      style={[position.rowSpace, { paddingVertical: 7 }]}
    >
      <LinearGradient
        style={[position.rowCenter, { width: 52, height: 52, borderRadius: 6 }]}
        colors={['rgba(188, 109, 201, 1)', 'rgba(39, 111, 177, 0.62)']}
        start={{ x: 0.65, y: 0 }}
        end={{ x: 1.2, y: 1 }}
      >
        {icon}
      </LinearGradient>
      <View style={{ flex: 1, marginHorizontal: 14 }}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginBottom: 4, fontSize: 16, color: '#fff' }}>{label}</Text>
      </View>
    </TouchableOpacity>
  )
}

const Library = () => {
  const dispatch = useDispatch();
  const [isShowSoundOptionsModal, setIsShowSoundOptionsModal] = useState(false);
  const [isShowFilterOptionsModal, setIsShowFilterOptionsModal] = useState(false);
  const [isShowRecordModal, setIsShowRecordModal] = useState(false);
  const [selectedSound, setSelectedSound] = useState(null);
  const [isLoadingImport, setIsLoadingImport] = useState(false);
  const userLibrary = useSelector(userLibrarySelector).userLibrary;

  const sortSounds = (sounds) => {
    sounds = [...sounds];
    switch (userLibrary.filterBy) {
      case 'DATE_ASC':
        return sounds.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
      case 'ALPHABET_ASC':
        return sounds.sort((a, b) => a.description.localeCompare(b.description));
      case 'DURATION_ASC':
        return sounds.sort((a, b) => a.duration - b.duration);
      case 'DURATION_DESC':
        return sounds.sort((a, b) => b.duration - a.duration);
      default:
        break;
    }
  }

  const getFilterbyLabel = (key) => {
    return FILTERBY_DATA.find(filter => filter.key === key).label;
  }

  const playSound = (sound) => {
    dispatch(setSound(sound));
    dispatch(setShow(true));
  }

  const openSoundOptions = (sound) => {
    setSelectedSound(sound);
    setIsShowSoundOptionsModal(true);
  }

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    setIsLoadingImport(true);
    let duration;

    if (result?.type === 'success') {
      if (Platform.OS === 'web') {
        duration = await getMp3Duration(result.uri, 'seconds');
      } else {
        try {
          const base64 = await FileSystem.readAsStringAsync(result.uri, { encoding: FileSystem.EncodingType.Base64 });
          duration = await getMp3Duration(base64, 'seconds');
        } catch (e) {
          console.log(e);
        }
      }

      if (duration) {
        dispatch(addSoundLibrary({
          id: uuid.v4(),
          description: result.name,
          title: 'Imported sound',
          url: blob,
          duration: duration
        }));
      }
    }

    setIsLoadingImport(false);
  }

  return (
    <View style={wrapper}>
      <Text style={text.h1}>Library</Text>
      <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 16 }}>Filter by:</Text>
        <TouchableOpacity
          onPress={() => setIsShowFilterOptionsModal(true)}
          activeOpacity={0.6}
          style={[position.rowCenter, { marginLeft: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
        >
          <Text style={{ color: '#fff' }}>{userLibrary.filterBy ? getFilterbyLabel(userLibrary.filterBy) : ''}</Text>
          <Svg style={{ marginLeft: 8 }} width={9} height={9} viewBox="0 0 9 9" fill="none">
            <Path fill="#fff" d="M4.128 8.087.751 4.334a.5.5 0 0 1 .372-.834h6.754a.5.5 0 0 1 .372.834L4.872 8.087a.5.5 0 0 1-.744 0z" />
          </Svg>
        </TouchableOpacity>
      </View>
      <SafeAreaView style={{ marginTop: 20, flex: 1 }}>
        <SpecialListItem
          action={pickDocument}
          label='Add sound from files'
          icon={!isLoadingImport ? (
            <Svg width={24} height={24} fill='#fff' viewBox="0 0 20 20">
              <Path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z" />
            </Svg>
          ) : (
            <ActivityIndicator color='#fff' />
          )}
        />
        <SpecialListItem
          action={() => setIsShowRecordModal(true)}
          label='Record sound'
          icon={(
            <Svg width={24} height={24} fill="none">
              <Circle cx={12} cy={12} r={7} fill="#fff" />
              <Circle cx={12} cy={12} r={11} strokeWidth={2} stroke="#fff" />
            </Svg>
          )}
        />
        <List
          items={userLibrary.sounds ? sortSounds(userLibrary.sounds) : null}
          handlePrimaryAction={(sound) => playSound(sound)}
          handleSecondaryAction={(sound) => openSoundOptions(sound)}
          emptyTitle='No sound yet'
          emptyDesc='Add any sound from search, device file, or recording'
        />
      </SafeAreaView>
      <OptionsModal
        isShowModal={isShowFilterOptionsModal}
        handleCloseModal={() => setIsShowFilterOptionsModal(false)}
        actions={[
          ...FILTERBY_DATA.map(filterBy => ({ label: filterBy.label, function: () => dispatch(setFilterLibrary(filterBy.key)) })),
          { label: 'Cancel' }
        ]}
      />
      <OptionsModal
        sound={selectedSound}
        isShowModal={isShowSoundOptionsModal}
        handleCloseModal={() => setIsShowSoundOptionsModal(false)}
        actions={[
          { label: 'Delete', function: () => dispatch(removeSoundLibrary(selectedSound.id)) },
          { label: 'Cancel' }
        ]}
      />
      <RecordModal
        isShowModal={isShowRecordModal}
        handleCloseModal={() => setIsShowRecordModal(false)}
      />
    </View>
  )
}

export default Library;
