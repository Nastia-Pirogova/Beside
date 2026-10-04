export type UserRole = 'customer' | 'helper';

export type Screen =
  | 'welcome'
  | 'register'
  | 'login'
  | 'resetPassword'
  | 'roleChoice'
  | 'familyHome'
  | 'createRequest'
  | 'addRelative'
  | 'editRelative'
  | 'familyRequests'
  | 'tracking'
  | 'completedTask'
  | 'published'
  | 'messages'
  | 'profile'
  | 'editProfile'
  | 'trustSafety'
  | 'helperOnboarding'
  | 'helperHome'
  | 'requestDetails'
  | 'helperActiveTask'
  | 'helperTasks'
  | 'helperMessages'
  | 'helperProfile'
  | 'helperEditProfile';

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

export type OrderStatus = 'open' | 'accepted' | 'on_the_way' | 'in_progress' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  userId: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string | null;
  city: string;
}

export interface Relative {
  id: string;
  customerId: string;
  name: string;
  age: number;
  phone: string;
  city: string;
  address: string;
  relationship: Relationship;
  notes: string | null;
}

export interface HelperProfile {
  id: string;
  userId: string;
  bio: string;
  city: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  phoneVerified: boolean;
  identityVerified: boolean;
  trainingCompleted: boolean;
  qualificationVerified: boolean;
  rating: number;
  completedOrders: number;
}

export interface Order {
  id: string;
  customerId: string;
  relativeId: string | null;
  helperId: string | null;
  category: Category;
  title: string;
  description: string;
  city: string;
  address: string;
  scheduledDate: string | null;
  scheduledTime: string;
  estimatedDuration: string;
  paymentAmount: number;
  attachmentUrl: string | null;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  acceptedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  relative?: Relative | null;
  customerProfile?: Profile | null;
  helperProfile?: Profile | null;
  helperHelperProfile?: HelperProfile | null;
}

export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  helperId: string;
  rating: number;
  comment: string;
  createdAt: string;
  authorName?: string;
}
