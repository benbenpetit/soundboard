import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { position, text } from 'assets/styles/global';
import { Keyboard } from 'react-native';
import ListItem from './ListItem';

// Usage:

// <List
//   items={sounds}
//   handlePrimaryAction={(id) => playSound(id)}
//   handleSecondaryAcrion={(id) => openSoundOptions(id)}
//   emptyTitle='No result'
//   emptyDesc='Search any sound by keyword'
// />

const List = ({
  items,
  handlePrimaryAction,
  handleSecondaryAcrion,
  emptyTitle,
  emptyDesc
}) => {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <ListItem
          item={item}
          handlePrimaryAction={handlePrimaryAction}
          handleSecondaryAcrion={handleSecondaryAcrion}
        />
      )}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={(
        <View style={[{ flex: 1, paddingBottom: 100 }, position.columnCenter]}>
          {emptyTitle && <Text style={[text.h1, { textAlign: 'center' }]}>{emptyTitle}</Text>}
          {emptyDesc && <Text style={[text.itemTitle, { textAlign: 'center', marginTop: 10 }]}>{emptyDesc}</Text>}
        </View>
      )}
      keyExtractor={item => item.id}
      onScrollBeginDrag={Keyboard.dismiss}
      ListFooterComponent={<View style={{ width: '100%', height: 145 }} />}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default List;
