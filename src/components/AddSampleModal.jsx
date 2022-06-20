import { BlurView } from "expo-blur";
import ReactNativeModal from "react-native-modal";
import List from "components/List";
import { useSelector } from "react-redux";
import { userLibrarySelector } from "reducers/userLibraryReducer";
import { View } from "react-native";
import { position } from "assets/styles/global";

const AddSampleModal = ({ isShowModal, handleCloseModal, handlePrimaryAction, handleSecondaryAction = null, props }) => {
  const sounds = useSelector(userLibrarySelector).userLibrary.sounds;

  return (
    <ReactNativeModal
      isVisible={isShowModal}
      onBackdropPress={handleCloseModal}
      onSwipeComplete={handleCloseModal}
      swipeDirection="down"
      backdropOpacity={1}
      propagateSwipe={true}
      customBackdrop={(
        <BlurView intensity={10} style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' }} />
      )}
      {...props}
    >
      <View style={[position.rowCenter, { paddingTop: 50, paddingBottom: 15 }]}>
        <View style={{ height: 4, width: '50%', borderRadius: 50, backgroundColor: 'rgba(255, 255, 255, 0.75)' }} />
      </View>
      <List
        items={sounds}
        handlePrimaryAction={(item) => handlePrimaryAction(item)}
        handleSecondaryAction={(item) => handleSecondaryAction(item)}
        emptyTitle='No result'
        emptyDesc='Search any sound by keyword'
        showPlus={true}
      />
    </ReactNativeModal>
  )
}

export default AddSampleModal;
