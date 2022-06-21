import { BlurView } from "expo-blur";
import ReactNativeModal from "react-native-modal";
import List from "components/List";
import { useSelector } from "react-redux";
import { userLibrarySelector } from "reducers/userLibraryReducer";
import TopIndicator from "./TopIndicator";

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
      <TopIndicator />
      <List
        items={sounds}
        handlePrimaryAction={(item) => handlePrimaryAction(item)}
        handleSecondaryAction={(item) => handleSecondaryAction(item)}
        emptyTitle='No result'
        emptyDesc='Go to search engine to find a sound'
        showPlus={true}
      />
    </ReactNativeModal>
  )
}

export default AddSampleModal;
