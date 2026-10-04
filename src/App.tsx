import { AppProvider, useApp } from './store';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { FamilyRegisterScreen } from './screens/FamilyRegisterScreen';
import { AddRelativeScreen } from './screens/AddRelativeScreen';
import { FamilyHomeScreen } from './screens/FamilyHomeScreen';
import { CreateRequestScreen } from './screens/CreateRequestScreen';
import { AvailableHelpersScreen } from './screens/AvailableHelpersScreen';
import { TrackingScreen } from './screens/TrackingScreen';
import { CompletedTaskScreen } from './screens/CompletedTaskScreen';
import { FamilyRequestsScreen } from './screens/FamilyRequestsScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TrustSafetyScreen } from './screens/TrustSafetyScreen';
import { HelperOnboardingScreen } from './screens/HelperOnboardingScreen';
import { HelperHomeScreen } from './screens/HelperHomeScreen';
import { RequestDetailsScreen } from './screens/RequestDetailsScreen';
import { HelperActiveTaskScreen } from './screens/HelperActiveTaskScreen';
import { HelperTasksScreen } from './screens/HelperTasksScreen';
import { HelperProfileScreen } from './screens/HelperProfileScreen';
import type { Screen } from './types';

const noNavScreens: Screen[] = [
  'welcome',
  'familyRegister',
  'addRelative',
  'helperOnboarding',
];

const familyScreens: Screen[] = [
  'familyHome',
  'createRequest',
  'availableHelpers',
  'tracking',
  'completedTask',
  'familyRequests',
  'messages',
  'profile',
  'trustSafety',
];

const helperScreens: Screen[] = [
  'helperHome',
  'requestDetails',
  'helperActiveTask',
  'helperTasks',
  'helperMessages',
  'helperProfile',
  'trustSafety',
];

function ScreenRouter() {
  const { screen, role } = useApp();

  const showBottomNav = !noNavScreens.includes(screen) &&
    ((role === 'family' && familyScreens.includes(screen)) ||
     (role === 'helper' && helperScreens.includes(screen)));

  // Map helperMessages to messages screen
  const renderScreen = (): React.ReactNode => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'familyRegister':
        return <FamilyRegisterScreen />;
      case 'addRelative':
        return <AddRelativeScreen />;
      case 'familyHome':
        return <FamilyHomeScreen />;
      case 'createRequest':
        return <CreateRequestScreen />;
      case 'availableHelpers':
        return <AvailableHelpersScreen />;
      case 'tracking':
        return <TrackingScreen />;
      case 'completedTask':
        return <CompletedTaskScreen />;
      case 'familyRequests':
        return <FamilyRequestsScreen />;
      case 'messages':
      case 'helperMessages':
        return <MessagesScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'trustSafety':
        return <TrustSafetyScreen />;
      case 'helperOnboarding':
        return <HelperOnboardingScreen />;
      case 'helperHome':
        return <HelperHomeScreen />;
      case 'requestDetails':
        return <RequestDetailsScreen />;
      case 'helperActiveTask':
        return <HelperActiveTaskScreen />;
      case 'helperTasks':
        return <HelperTasksScreen />;
      case 'helperProfile':
        return <HelperProfileScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-md mx-auto min-h-screen bg-cream-100 relative">
        {renderScreen()}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ScreenRouter />
    </AppProvider>
  );
}
