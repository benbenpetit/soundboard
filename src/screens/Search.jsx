import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { text, wrapper, searchInput } from 'assets/styles/global';
import Svg, { Path } from 'react-native-svg';
import { useDebounce } from 'use-debounce';
import List from 'components/List';
import { getSoundsByName } from 'services/freeSound';
import { useDispatch, useSelector } from 'react-redux';
import { setPlay, setShow, setSound } from 'reducers/playbarReducer';
import OptionsModal from 'components/OptionsModal';
import { addSoundLibrary, removeSoundLibrary, userLibrarySelector } from 'reducers/userLibraryReducer';

const Search = () => {
  const dispatch = useDispatch();
  const [sounds, setSounds] = useState();
  const [selectedSound, setSelectedSound] = useState(null);
  const [searchTextInput, setSearchTextInput] = useState('');
  const [searchTextInputDebounced] = useDebounce(searchTextInput, 600);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowSoundOptionsModal, setIsShowSoundOptionsModal] = useState(false);
  const inputRef = useRef(null);
  const userLibrary = useSelector(userLibrarySelector).userLibrary;

  const fetchFreesoundApi = async (query) => {
    setIsLoading(true);
    setSounds(await getSoundsByName(query));
    setIsLoading(false);
  };

  useEffect(() => {
    if (searchTextInput.trim() === '') {
      return;
    }

    fetchFreesoundApi(searchTextInput);
  }, [searchTextInputDebounced]);

  useEffect(() => {
    if (searchTextInput.trim() === '') {
      setSounds([]);
    }
  }, [searchTextInput]);

  const playSound = (sound) => {
    dispatch(setSound(sound));
    dispatch(setShow(true));
  }

  const openSoundOptions = (sound) => {
    setSelectedSound(sound);
    setIsShowSoundOptionsModal(true);
  }

  return (
    <View style={wrapper}>
      <Text style={text.h1}>Search</Text>
      <TouchableOpacity
        onPress={() => inputRef.current.focus()}
        style={[searchInput, { marginTop: 20 }]}
        activeOpacity={1}
      >
        <Svg width={22} height={23} fill="none">
          <Path fill="rgba(0, 0, 0, 0.7)" d="M9.677.606C4.348.606 0 4.864 0 10.15c0 5.286 4.347 9.545 9.677 9.545a9.724 9.724 0 0 0 6.077-2.117l4.477 4.478a1.028 1.028 0 1 0 1.455-1.454l-4.469-4.47a9.42 9.42 0 0 0 2.137-5.982c0-5.288-4.347-9.546-9.677-9.546zm-7.62 9.545c0-4.121 3.397-7.489 7.62-7.489 4.223 0 7.62 3.368 7.62 7.489 0 4.12-3.397 7.488-7.62 7.488-4.223 0-7.62-3.367-7.62-7.49v.002z" />
        </Svg>
        <TextInput
          ref={inputRef}
          style={[styles.textInput, { flex: 1, minWidth: 0, marginHorizontal: 10 }]}
          onChangeText={setSearchTextInput}
          value={searchTextInput}
          placeholder="Sound, instrument, tag..."
          placeholderTextColor="#444"
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
      </TouchableOpacity>
      <SafeAreaView style={{ marginTop: 20, flex: 1 }}>
        {!isLoading ? (
          <List
            items={sounds}
            handlePrimaryAction={(sound) => playSound(sound)}
            handleSecondaryAcrion={(sound) => openSoundOptions(sound)}
            emptyTitle='No result'
            emptyDesc='Search any sound by keyword'
          />
        ) : <ActivityIndicator style={{ marginTop: 20 }} />}
      </SafeAreaView>
      <OptionsModal
        sound={selectedSound}
        isShowModal={isShowSoundOptionsModal}
        handleCloseModal={() => setIsShowSoundOptionsModal(false)}
        actions={[
          { label: 'Add to library', function: () => dispatch(addSoundLibrary(selectedSound)) },
          { label: 'Delete', function: () => dispatch(removeSoundLibrary(selectedSound)) },
          { label: 'Cancel' }
        ]}
      />
    </View>
  )
}

export default Search;

const styles = {
  textInput: {
    color: '#111',
    fontSize: 16
  }
};
