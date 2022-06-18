import { position, text, wrapper } from 'assets/styles/global';
import List from 'components/List';
import OptionsModal from 'components/OptionsModal';
import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Path } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { setPlay, setShow, setSound } from 'reducers/playbarReducer';
import { setFilterLibrary, userLibrarySelector } from 'reducers/userLibraryReducer';

const FILTERBY_DATA = [
  { key: 'DATE_ASC', label: 'Rencently added' },
  { key: 'ALPHABET_ASC', label: 'Alphabetical order' },
  { key: 'DURATION_ASC', label: 'Duration ascending' },
  { key: 'DURATION_DESC', label: 'Duration descending' }
];

const Library = () => {
  const dispatch = useDispatch();
  const [isShowSoundOptionsModal, setIsShowSoundOptionsModal] = useState(false);
  const [isShowFilterOptionsModal, setIsShowFilterOptionsModal] = useState(false);
  const [selectedSound, setSelectedSound] = useState(null);
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
    dispatch(setPlay(true));
  }

  const openSoundOptions = (sound) => {
    setSelectedSound(sound);
    setIsShowSoundOptionsModal(true);
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
          <Text style={{ color: '#fff' }}>{getFilterbyLabel(userLibrary.filterBy)}</Text>
          <Svg style={{ marginLeft: 8 }} width={9} height={9} viewBox="0 0 9 9" fill="none">
            <Path fill="#fff" d="M4.128 8.087.751 4.334a.5.5 0 0 1 .372-.834h6.754a.5.5 0 0 1 .372.834L4.872 8.087a.5.5 0 0 1-.744 0z" />
          </Svg>
        </TouchableOpacity>
      </View>
      <SafeAreaView style={{ marginTop: 20, flex: 1 }}>
        <List
          items={sortSounds(userLibrary.sounds)}
          handlePrimaryAction={(sound) => playSound(sound)}
          handleSecondaryAcrion={(sound) => openSoundOptions(sound)}
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
          { label: 'Modify', function: () => console.log('Modifier') },
          { label: 'Delete', function: () => console.log('Supprimer') },
          { label: 'Cancel' }
        ]}
      />
    </View>
  )
}

export default Library;
