import { position } from "assets/styles/global";
import { View } from "react-native";

const TopIndicator = () => {
  return (
    <View style={[position.rowCenter, { paddingTop: 50, paddingBottom: 15 }]}>
      <View style={{ height: 4, width: '50%', borderRadius: 50, backgroundColor: 'rgba(255, 255, 255, 0.75)' }} />
    </View>
  )
};

export default TopIndicator;
