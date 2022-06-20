import { BlurView } from "expo-blur";
import { Text } from "react-native";
import ReactNativeModal from "react-native-modal";

const SampleModifyModal = ({ isShowModal, handleCloseModal }) => {
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
    >
      <Text>Hey</Text>
    </ReactNativeModal>
  )
}

export default SampleModifyModal;
