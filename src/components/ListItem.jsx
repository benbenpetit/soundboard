import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { position, text } from 'assets/styles/global';

// Usage:

// <ListItem
//   item={item}
//   handlePrimaryAction={handlePrimaryAction}
//   handleSecondaryAcrion={handleSecondaryAcrion}
// />

const ListItem = ({
  item,
  handlePrimaryAction,
  handleSecondaryAcrion
}) => {
  const formatDuration = (duration) => {
    if (!duration.toString().includes('.')) {
      return `${duration.toString()}:00`;
    }

    const durationSplit = duration.toString().split('.');

    return `${durationSplit[0]}:${durationSplit[1].slice(0, 2)}`;
  }

  return (
    <TouchableOpacity
      onPress={() => handlePrimaryAction(item.id)}
      onLongPress={() => handleSecondaryAcrion(item.id)}
      activeOpacity={0.8}
      style={[position.rowSpace, { flex: 1, paddingVertical: 7 }]}
    >
      <Image
        style={{ width: 52, height: 52, borderRadius: 6, backgroundColor: '#fff' }}
        source={{ uri: item.cover }}
      />
      <View style={{ flex: 1, marginHorizontal: 14 }}>
        <Text numberOfLines={1} ellipsizeMode='tail' style={[text.itemTitle, { marginBottom: 4 }]}>{item.description}</Text>
        <Text numberOfLines={1} ellipsizeMode='tail' style={text.itemSubtitle}>{formatDuration(item.duration)} • {item.title}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleSecondaryAcrion(item.id)}
        activeOpacity={0.8}
        style={[{ height: '100%' }, position.columnCenter]}
      >
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="#fff">
          <Path d="M6 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        </Svg>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default ListItem;
