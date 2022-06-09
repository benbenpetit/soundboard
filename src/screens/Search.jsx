import React, { useState } from 'react';
import { FlatList, Keyboard, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { text, wrapper, searchInput } from 'assets/styles/global';
import Svg, { Path } from 'react-native-svg';

const SearchResult = ({ sound, handlePress }) => {
  return (
    <TouchableOpacity
      onPress={() => handlePress(sound.id)}
      activeOpacity={0.6}
      style={{ flex: 1 }}
    >

    </TouchableOpacity >
  )
}

const Search = () => {
  const [searchTextInput, setSearchTextInput] = useState('');

  const sounds = [
    {
      id: 1,
      name: 'Doubi'
    },
    {
      id: 2,
      name: 'She3esh'
    },
    {
      id: 3,
      name: 'She3esh'
    },
    {
      id: 4,
      name: 'She3esh'
    },
    {
      id: 5,
      name: 'She3esh'
    }
  ];

  const playSound = (id) => {
    console.log(id);
  }

  return (
    <View style={wrapper}>
      <Text style={text.h1}>Search</Text>
      <View style={[searchInput, { marginTop: 10 }]}>
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
        <TouchableOpacity onPress={() => {
          setSearchTextInput('');
          Keyboard.dismiss();
        }}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
      <SafeAreaView style={{ marginTop: 20, marginHorizontal: -10, flex: 1 }}>
        <FlatList
          data={sounds}
          renderItem={({ item }) => <SearchResult sound={item} handlePress={(id) => playSound(id)} />}
          keyExtractor={sound => sound.id}
          onScrollBeginDrag={Keyboard.dismiss}
        />
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
