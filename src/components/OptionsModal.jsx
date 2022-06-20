import { position, text } from "assets/styles/global";
import { BlurView } from "expo-blur";
import LinesEllipsis from "react-lines-ellipsis";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { default as ReactNativeModal } from "react-native-modal";
import { formatDuration } from "utils/formatting";

const OptionsModal = ({
  actions,
  sound,
  isShowModal,
  handleCloseModal,
  props
}) => {
  return (
    <ReactNativeModal
      isVisible={isShowModal}
      onBackdropPress={handleCloseModal}
      onSwipeComplete={handleCloseModal}
      swipeDirection="down"
      backdropOpacity={1}
      customBackdrop={(
        <BlurView intensity={10} style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />
      )}
      {...props}
    >
      <View style={[position.columnCenter, { flex: 1 }]}>
        {sound && (
          <>
            <Image
              style={[{ width: 180, height: 180, backgroundColor: '#fff' }, global.shadow]}
              source={sound.cover ? { uri: sound.cover } : require('../assets/img/default-cover.jpg')}
            />
            <View style={[position.columnCenter, { marginTop: 14 }]}>
              {Platform.OS === 'web'
                ? <>
                  <LinesEllipsis
                    text={sound.description}
                    maxLine='1'
                    ellipsis='...'
                    trimRight
                    basedOn='letters'
                    style={{ marginBottom: 4, fontSize: 16, color: '#fff' } }
                  />
                  <LinesEllipsis
                    text={`${formatDuration(sound.duration).toString()} • ${sound.title.toString()}`}
                    maxLine='1'
                    ellipsis='...'
                    trimRight
                    basedOn='letters'
                    style={{ color: '#bbb', fontSize: 12 }}
                  />
                </>
                : <>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginBottom: 4, fontSize: 16, color: '#fff' } }>{sound.description}</Text>
                  <Text numberOfLines={1} ellipsizeMode='tail' style={text.itemSubtitle}>{formatDuration(sound.duration)} • {sound.title}</Text>
                </>
              }
            </View>
          </>
        )}
        <View style={[position.columnCenter, { marginTop: 20 }]}>
          {actions.map((action, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                handleCloseModal();
                action.function && action.function();
              }}
              style={{ marginTop: 6, paddingVertical: 8, paddingHorizontal: 20 }}
            >
              <Text style={text.h2}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ReactNativeModal>
  )
};

export default OptionsModal;
