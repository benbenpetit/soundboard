import { global, position, text, wrapper } from 'assets/styles/global';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Modal from "react-native-modal";
import Svg, { Path } from 'react-native-svg';

const Library = () => {
  const [isShowFilterModal, setIsShowFilterModal] = useState(false);

  return (
    <View style={wrapper}>
      <Text style={text.h1}>Library</Text>
      <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 16 }}>Filter by:</Text>
        <TouchableOpacity
          onPress={() => setIsShowFilterModal(true)}
          activeOpacity={0.6}
          style={[position.rowCenter, { marginLeft: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
        >
          <Text style={{ color: '#fff' }}>Recently added</Text>
          <Svg style={{ marginLeft: 8 }} width={9} height={9} viewBox="0 0 9 9" fill="none">
            <Path fill="#fff" d="M4.128 8.087.751 4.334a.5.5 0 0 1 .372-.834h6.754a.5.5 0 0 1 .372.834L4.872 8.087a.5.5 0 0 1-.744 0z" />
          </Svg>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isShowFilterModal}
        onBackdropPress={() => setIsShowFilterModal(false)}
        onSwipeComplete={() => setIsShowFilterModal(false)}
        swipeDirection="down"
        backdropOpacity={1}
        customBackdrop={(
          <BlurView intensity={10} style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />
        )}
      >
        <View style={[position.columnCenter, { flex: 1 }]}>
          <Image
            style={[{ width: 200, height: 200, backgroundColor: '#fff' }, global.shadow]}
            source={{ uri: 'https://www.bedetheque.com/media/Couvertures/OGGYETLESCAFARDS_01_106456.jpg' }}
          />
          <View style={[position.columnCenter, { marginTop: 14 }]}>
            <Text numberOfLines={1} ellipsizeMode='tail' style={[text.itemTitle, { marginBottom: 4 }]}>O.G et les cafards</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' style={text.itemSubtitle}>3:25 • Zack</Text>
          </View>
          <View style={[position.columnCenter, { marginTop: 20 }]}>
            <TouchableOpacity onPress={() => setIsShowFilterModal(false)} style={{ marginTop: 6, paddingVertical: 8, paddingHorizontal: 20 }}>
              <Text style={text.h2}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsShowFilterModal(false)} style={{ marginTop: 6, paddingVertical: 8, paddingHorizontal: 20 }}>
              <Text style={text.h2}>Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsShowFilterModal(false)} style={{ marginTop: 6, paddingVertical: 8, paddingHorizontal: 20 }}>
              <Text style={text.h2}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default Library;
