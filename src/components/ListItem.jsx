import React from 'react';
import { Image, Keyboard, Platform, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { position, text } from 'assets/styles/global';
import { formatDuration } from 'utils/formatting';
import LinesEllipsis from 'react-lines-ellipsis';

// Usage:

// <ListItem
//   item={item}
//   handlePrimaryAction={handlePrimaryAction}
//   handleSecondaryAction={handleSecondaryAction}
// />

const ListItem = ({
  item,
  handlePrimaryAction,
  handleSecondaryAction,
  showOptions,
  showPlus
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        handlePrimaryAction(item);
        Keyboard.dismiss();
      }}
      onLongPress={() => handleSecondaryAction(item)}
      activeOpacity={0.8}
      style={[position.rowSpace, { flex: 1, paddingVertical: 7 }]}
    >
      <Image
        style={{ width: 52, height: 52, borderRadius: 6, backgroundColor: '#fff' }}
        source={item.cover ? { uri: item.cover } : require('../assets/img/default-cover.jpg')}
      />
      <View style={{ flex: 1, marginHorizontal: 14 }}>
        {Platform.OS === 'web'
          ? <>
            <LinesEllipsis
              text={item.description}
              maxLine='1'
              ellipsis='...'
              trimRight
              basedOn='letters'
              style={{ marginBottom: 4, fontSize: 16, color: '#fff' }}
            />
            <LinesEllipsis
              text={`${formatDuration(item.duration).toString()} • ${item.title.toString()}`}
              maxLine='1'
              ellipsis='...'
              trimRight
              basedOn='letters'
              style={{ color: '#bbb', fontSize: 12 }}
            />
          </>
          : <>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginBottom: 4, fontSize: 16, color: '#fff' }}>{item.description}</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' style={text.itemSubtitle}>{formatDuration(item.duration)} • {item.title}</Text>
          </>
        }
      </View>
      {showOptions &&
        <TouchableOpacity
          onPress={() => handleSecondaryAction(item)}
          activeOpacity={0.8}
          style={[{ height: '100%' }, position.columnCenter]}
        >
          {showPlus ? (
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="#fff">
              <Path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z" />
            </Svg>
          ) : (
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="#fff">
              <Path d="M6 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </Svg>
          )}
        </TouchableOpacity>
      }
    </TouchableOpacity >
  )
}

export default ListItem;
