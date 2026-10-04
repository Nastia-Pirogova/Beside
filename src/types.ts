export type UserRole = 'family' | 'helper';

export type Screen =
  | 'welcome'
  | 'familyRegister'
  | 'addRelative'
  | 'familyHome'
  | 'createRequest'
  | 'published'
  | 'tracking'
  | 'completedTask'
  | 'familyRequests'
  | 'messages'
  | 'profile'
  | 'trustSafety'
  | 'helperOnboarding'
  | 'helperHome'
  | 'requestDetails'
  | 'helperActiveTask'
  | 'helperTasks'
  | 'helperMessages'
  | 'helperProfile';

export type Relationship = 'mother' | 'father' | 'grandmother' | 'grandfather' | 'other';

export type Category =
  | 'grocery'
  | 'pharmacy'
  | 'household'
  | 'walk'
  | 'companionship'
  | 'documents'
  | 'transport'
  | 'cooking'
  | 'delivery'
  | 'other'
  | 'care'
  | 'medical'
  | 'rehab';

export type ServiceType = 'basic' | 'specialized';

export type RequestStatus =
  | 'searching'
  | 'accepted'
  | 'on_the_way'
  | 'in_progress'
  | 'completed'
  | 'reviewed'
  | 'cancelled';

export interface ElderlyRelative {
  id: string;
  name: string;
  age: number;
  city: string;
  address: string;
  phone: string;
  relationship: Relationship;
}

export interface FamilyUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  relative: ElderlyRelative;
}

export interface HelperUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  rating: number;
  completedTasks: number;
  verified: boolean;
  trained: boolean;
  bio: string;
  distanceKm: number;
  available: boolean;
  specialties: Category[];
  qualifications: string[];
  qualified: boolean;
}

export interface HelpRequest {
  id: string;
  category: Category;
  description: string;
  date: string;
  time: string;
  address: string;
  approximateArea: string;
  duration: string;
  reward: number;
  elderlyName: string;
  elderlyAge: number;
  elderlyCity: string;
  distanceKm: number;
  status: RequestStatus;
  serviceType: ServiceType;
  helperId?: string;
  photoUrl?: string;
  shoppingList?: string[];
  helperNote?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  requestId: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export interface Conversation {
  id: string;
  personName: string;
  personAvatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unread: number;
  messages: ChatMessage[];
}
