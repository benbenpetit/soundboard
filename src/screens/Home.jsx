import React, { useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { text, wrapper } from 'assets/styles/global';
import { LinearGradient } from 'expo-linear-gradient';

const Pad = ({ sample, handleLongPress }) => {
  return (
    <TouchableOpacity
      onLongPress={() => handleLongPress(sample.id)}
      activeOpacity={0.8}
      style={{ flex: 1, margin: 10 }}
    >
      <LinearGradient
        style={{ width: '100%', borderRadius: 10, aspectRatio: 1 / 1 }}
        colors={['rgba(188, 109, 201, 1)', 'rgba(39, 111, 177, 0.62)']}
        start={{ x: 0.65, y: 0 }}
        end={{ x: 1.2, y: 1 }}
      />
    </TouchableOpacity >
  )
}

const Home = () => {
  const samples = [
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

  const openSampleOptions = (id) => {
    console.log(id);
  }

  return (
    <View style={wrapper}>
      <Text style={text.h1}>Sampl.io</Text>
      <SafeAreaView style={{ marginTop: 10, marginHorizontal: -10, flex: 1 }}>
        <FlatList
          data={samples}
          renderItem={({ item }) => <Pad sample={item} handleLongPress={(id) => openSampleOptions(id)} />}
          keyExtractor={sample => sample.id}
          numColumns={3}
          ListEmptyComponent={<Text style={{ fontSize: 16, textAlign: 'center', marginTop: 20, color: '#fff' }}>No sample yet. Go search and add one!</Text>}
          ListFooterComponent={<View style={{ width: '100%', height: 145 }} />}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  )
}

export default Home;
