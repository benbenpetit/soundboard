import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import Home from 'screens/Home';
import Search from 'screens/Search';
import Library from 'screens/Library';
import TabIcon from 'components/TabIcon';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          tabBar={(props) => (
            <LinearGradient
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0
              }}
              colors={['rgba(45, 41, 74, 1)', 'rgba(45, 41, 74, 1)', 'rgba(45, 41, 74, 0.4)']}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
            >
              <BottomTabBar {...props} />
            </LinearGradient>
          )}
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              height: 90,
              paddingTop: 10,
            },
            tabBarItemStyle: {
              justifyContent: 'center'
            },
            tabBarLabelStyle: {
              fontSize: 11
            },
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: '#bdbdbd',
            tabBarIcon: ({ focused }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home-full' : 'home-outline';
              } else if (route.name === 'Search') {
                iconName = focused ? 'search-full' : 'search-outline';
              } else if (route.name === 'Library') {
                iconName = focused ? 'library-full' : 'library-outline';
              }

              return <TabIcon name={iconName} />
            }
          })}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Search" component={Search} />
          <Tab.Screen name="Library" component={Library} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style='light' />
    </>
  );
}
