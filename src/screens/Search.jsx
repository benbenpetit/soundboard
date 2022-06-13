import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { text, wrapper, searchInput, position } from 'assets/styles/global';
import Svg, { Path } from 'react-native-svg';
import { useDebounce } from 'use-debounce';

const SearchResult = ({ sound, handleSongPress, handleOptionsPress }) => {
  const formatDuration = (duration) => {
    if (!duration.toString().includes('.')) {
      return `${duration.toString()}:00`;
    }

    const durationSplit = duration.toString().split('.');

    return `${durationSplit[0]}:${durationSplit[1].slice(0, 2)}`;
  }

  return (
    <TouchableOpacity
      onPress={() => handleSongPress(sound.id)}
      onLongPress={() => handleOptionsPress(sound.id)}
      activeOpacity={0.8}
      style={[position.rowSpace, { flex: 1, paddingVertical: 7 }]}
    >
      <Image
        style={{ width: 52, height: 52, borderRadius: 6 }}
        source={{ uri: sound.cover }}
      />
      <View style={{ flex: 1, marginHorizontal: 14 }}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={[text.itemTitle, { marginBottom: 4 }]}>{sound.description}</Text>
        <Text numberOfLines={1} ellipsizeMode='tail' style={text.itemSubtitle}>{formatDuration(sound.duration)} • {sound.title}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleOptionsPress(sound.id)}
        activeOpacity={0.8}
        style={[{ height: '100%' }, position.columnCenter]}
      >
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="#fff">
          <Path d="M6 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        </Svg>
      </TouchableOpacity>
    </TouchableOpacity >
  )
}

const Search = () => {
  const [sounds, setSounds] = useState();
  const [searchTextInput, setSearchTextInput] = useState('');
  const [searchTextInputDebounced] = useDebounce(searchTextInput, 600);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFreesoundApi = async (query) => {
    const baseUrl = 'https://freesound.org/apiv2';
    const token = 'bn7aVBxK6UImjuoZY5pc4erzFbkvwRvi8MtEPGug';
    setIsLoading(true);

    try {
      const result = await fetch(`${baseUrl}/search/text/?token=${token}&query=${query}`);
      const json = await result.json();
      const soundsId = json.results.map(sound => sound.id);
      const sounds = await Promise.all(soundsId.map(async soundId => {
        try {
          const result = await fetch(`${baseUrl}/sounds/${soundId}/?token=${token}`);
          const sound = await result.json();
          return {
            id: sound.id,
            description: sound.description,
            title: sound.name,
            duration: sound.duration,
            url: sound.previews['preview-hq-mp3'],
            cover: sound.images.waveform_bw_m
          }
        } catch (error) {
          console.log('Error', error);
          return undefined;
        }
      }));
      setSounds(sounds);
    } catch (error) {
      console.log('Erreur', error);
    }

    setIsLoading(false);
    console.log(isLoading);
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

  const playSound = (id) => {
    console.log('Play', id);
  }

  const openSoundOptions = (id) => {
    console.log('Options', id);
  }

  return (
    <View style={wrapper}>
      <Text style={text.h1}>Search</Text>
      <View style={[searchInput, { marginTop: 20 }]}>
        <Svg width={22} height={23} fill="none">
          <Path fill="rgba(0, 0, 0, 0.7)" d="M9.677.606C4.348.606 0 4.864 0 10.15c0 5.286 4.347 9.545 9.677 9.545a9.724 9.724 0 0 0 6.077-2.117l4.477 4.478a1.028 1.028 0 1 0 1.455-1.454l-4.469-4.47a9.42 9.42 0 0 0 2.137-5.982c0-5.288-4.347-9.546-9.677-9.546zm-7.62 9.545c0-4.121 3.397-7.489 7.62-7.489 4.223 0 7.62 3.368 7.62 7.489 0 4.12-3.397 7.488-7.62 7.488-4.223 0-7.62-3.367-7.62-7.49v.002z" />
        </Svg>
        <TextInput
          style={[styles.textInput, { flex: 1, marginHorizontal: 10 }]}
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
      </View>
      <SafeAreaView style={{ marginTop: 20, flex: 1 }}>
        {!isLoading ?
          <FlatList
            data={sounds}
            renderItem={({ item }) => (
              <SearchResult
                sound={item}
                handleSongPress={(id) => playSound(id)}
                handleOptionsPress={(id) => openSoundOptions(id)}
              />
            )}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={(
              <View style={[{ flex: 1, paddingBottom: 100 }, position.columnCenter]}>
                <Text style={[text.itemTitle, { textAlign: 'center' }]}>No result</Text>
                <Text style={[text.h1, { textAlign: 'center', marginTop: 10 }]}>Search any sound by keyword</Text>
              </View>
            )}
            keyExtractor={sound => sound.id}
            onScrollBeginDrag={Keyboard.dismiss}
            ListFooterComponent={<View style={{ width: '100%', height: 60 }} />}
            showsVerticalScrollIndicator={false}
          />
          : <ActivityIndicator style={{ marginTop: 20 }} />}
      </SafeAreaView>
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
