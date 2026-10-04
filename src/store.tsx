import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  Screen,
  UserRole,
  FamilyUser,
  HelperUser,
  HelpRequest,
  Review,
  Conversation,
  Category,
} from './types';
import {
  demoFamilyUser,
  demoHelpers,
  demoRequests,
  demoReviews,
  demoConversations,
  demoAvailableRequests,
  demoHelperActiveRequests,
  demoHelperConversations,
} from './data';

interface AppState {
  screen: Screen;
  role: UserRole | null;
  familyUser: FamilyUser | null;
  helperUser: HelperUser | null;
  requests: HelpRequest[];
  availableRequests: HelpRequest[];
  helperActiveRequests: HelpRequest[];
  helpers: HelperUser[];
  reviews: Review[];
  conversations: Conversation[];
  helperConversations: Conversation[];
  activeRequestId: string | null;
  activeHelperId: string | null;
  selectedCategory: Category | null;
  pendingRequest: Partial<HelpRequest> | null;
  onboardingStep: number;
  onboardingComplete: boolean;

  navigate: (screen: Screen) => void;
  setRole: (role: UserRole) => void;
  registerFamily: (user: FamilyUser) => void;
  registerHelper: (user: HelperUser) => void;
  setActiveRequest: (id: string | null) => void;
  setActiveHelper: (id: string | null) => void;
  setSelectedCategory: (cat: Category | null) => void;
  setPendingRequest: (req: Partial<HelpRequest> | null) => void;
  createRequest: (req: HelpRequest) => void;
  publishRequest: (req: HelpRequest) => void;
  updateRequestStatus: (id: string, status: HelpRequest['status']) => void;
  addReview: (review: Review) => void;
  setOnboardingStep: (step: number) => void;
  setOnboardingComplete: (complete: boolean) => void;
  acceptRequest: (id: string) => void;
  cancelRequest: (id: string) => void;
  updateHelperRequestStatus: (id: string, status: HelpRequest['status']) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [familyUser, setFamilyUser] = useState<FamilyUser | null>(demoFamilyUser);
  const [helperUser, setHelperUser] = useState<HelperUser | null>(demoHelpers[0]);
  const [requests, setRequests] = useState<HelpRequest[]>(demoRequests);
  const [availableRequests, setAvailableRequests] = useState<HelpRequest[]>(demoAvailableRequests);
  const [helperActiveRequests, setHelperActiveRequests] = useState<HelpRequest[]>(demoHelperActiveRequests);
  const [helpers] = useState<HelperUser[]>(demoHelpers);
  const [reviews, setReviews] = useState<Review[]>(demoReviews);
  const [conversations] = useState<Conversation[]>(demoConversations);
  const [helperConversations] = useState<Conversation[]>(demoHelperConversations);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [activeHelperId, setActiveHelperId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [pendingRequest, setPendingRequest] = useState<Partial<HelpRequest> | null>(null);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const navigate = useCallback((s: Screen) => {
    setScreen(s);
    if (typeof window !== 'undefined') window.scrollTo(0, 0);
  }, []);

  const setRole = useCallback((r: UserRole) => {
    setRoleState(r);
  }, []);

  const registerFamily = useCallback((user: FamilyUser) => {
    setFamilyUser(user);
  }, []);

  const registerHelper = useCallback((user: HelperUser) => {
    setHelperUser(user);
  }, []);

  const createRequest = useCallback((req: HelpRequest) => {
    setRequests((prev) => [req, ...prev]);
  }, []);

  const publishRequest = useCallback((req: HelpRequest) => {
    setRequests((prev) => [req, ...prev]);
    setAvailableRequests((prev) => [req, ...prev]);
    setPendingRequest(req);
  }, []);

  const updateRequestStatus = useCallback((id: string, status: HelpRequest['status']) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const updateHelperRequestStatus = useCallback((id: string, status: HelpRequest['status']) => {
    setHelperActiveRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const addReview = useCallback((review: Review) => {
    setReviews((prev) => [review, ...prev]);
  }, []);

  const acceptRequest = useCallback((id: string) => {
    const req = availableRequests.find((r) => r.id === id);
    if (!req) return;

    setAvailableRequests((prev) => prev.filter((r) => r.id !== id));
    const acceptedReq = { ...req, status: 'accepted' as const, helperId: 'h1' };
    setHelperActiveRequests((prev) => [acceptedReq, ...prev]);
    setActiveRequestId(id);

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'accepted' as const, helperId: 'h1' } : r))
    );
  }, [availableRequests]);

  const cancelRequest = useCallback((id: string) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const } : r)));
    setAvailableRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const resetApp = useCallback(() => {
    setScreen('welcome');
    setRoleState(null);
    setActiveRequestId(null);
    setActiveHelperId(null);
    setSelectedCategory(null);
    setPendingRequest(null);
    setOnboardingStep(0);
    setOnboardingComplete(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        screen,
        role,
        familyUser,
        helperUser,
        requests,
        availableRequests,
        helperActiveRequests,
        helpers,
        reviews,
        conversations,
        helperConversations,
        activeRequestId,
        activeHelperId,
        selectedCategory,
        pendingRequest,
        onboardingStep,
        onboardingComplete,
        navigate,
        setRole,
        registerFamily,
        registerHelper,
        setActiveRequest: setActiveRequestId,
        setActiveHelper: setActiveHelperId,
        setSelectedCategory,
        setPendingRequest,
        createRequest,
        publishRequest,
        updateRequestStatus,
        addReview,
        setOnboardingStep,
        setOnboardingComplete,
        acceptRequest,
        cancelRequest,
        updateHelperRequestStatus,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
