import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import { position, text } from 'assets/styles/global';

const Playbar = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <BlurView
      intensity={40}
      tint='dark'
      style={[position.rowSpace, { position: 'absolute', bottom: 100, left: 10, right: 10, borderColor: 'rgba(255, 255, 255, 0.4)', borderWidth: 0.2, backgroundColor: 'rgba(59, 55, 94, 0.48)', paddingLeft: 20, paddingRight: 12, paddingVertical: 16, borderRadius: 8, overflow: 'hidden' }]}
    >
      <Image
        style={{ width: 40, height: 40, borderRadius: 6, backgroundColor: '#222' }}
        source={{ uri: 'https://cdn.freesound.org/displays/539/539592_11822799_wave_bw_M.png' }}
      />
      <View style={{ flex: 1, marginHorizontal: 14 }}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={[text.itemTitle, { marginBottom: 4 }]}>An effected trumpet</Text>
        <Text numberOfLines={1} ellipsizeMode='tail' style={text.itemSubtitle}>25:45 • Trumpet1.wav</Text>
      </View>
      <TouchableOpacity
        onPress={() => setIsPlaying(!isPlaying)}
        activeOpacity={0.6}
        style={{ padding: 8 }}
      >
        {isPlaying ? (
          <Svg width={24} height={24} viewBox="0 0 16 16" fill={"#fff"}>
            <Path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
          </Svg>
        ) : (
          <Svg width={24} height={24} viewBox="0 0 16 16" fill={"#fff"}>
            <Path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
          </Svg>
        )}
      </TouchableOpacity>
    </BlurView>
  )
}

export default Playbar;
