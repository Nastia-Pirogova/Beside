import { supabase } from './lib/supabase';
import type { Order, Relative, HelperProfile, Review, Profile, Category, OrderStatus, Relationship } from './types';

// ============================================================
// Relatives
// ============================================================

export async function fetchRelatives(): Promise<Relative[]> {
  const { data, error } = await supabase
    .from('relatives')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToRelative);
}

export async function createRelative(rel: Omit<Relative, 'id' | 'customerId'>): Promise<Relative> {
  const { data, error } = await supabase
    .from('relatives')
    .insert({
      name: rel.name,
      age: rel.age,
      phone: rel.phone,
      city: rel.city,
      address: rel.address,
      relationship: rel.relationship,
      notes: rel.notes,
    })
    .select('*')
    .single();
  if (error) throw error;
  return rowToRelative(data);
}

export async function updateRelative(id: string, rel: Partial<Relative>): Promise<void> {
  const { error } = await supabase
    .from('relatives')
    .update({
      name: rel.name,
      age: rel.age,
      phone: rel.phone,
      city: rel.city,
      address: rel.address,
      relationship: rel.relationship,
      notes: rel.notes,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteRelative(id: string): Promise<void> {
  const { error } = await supabase.from('relatives').delete().eq('id', id);
  if (error) throw error;
}

// ============================================================
// Orders
// ============================================================

export async function fetchCustomerOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToOrder);
}

export async function fetchOpenOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToOrder);
}

export async function fetchHelperOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .not('helper_id', 'is', null)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToOrder);
}

export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToOrder(data) : null;
}

export async function fetchOrderWithHelper(id: string): Promise<Order | null> {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!order) return null;
  const result = rowToOrder(order);

  // Fetch helper profile if assigned
  if (result.helperId) {
    const [{ data: helperProfile }, { data: helperHelperProfile }] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', result.helperId).maybeSingle(),
      supabase.from('helper_profiles').select('*').eq('user_id', result.helperId).maybeSingle(),
    ]);
    if (helperProfile) result.helperProfile = rowToProfile(helperProfile);
    if (helperHelperProfile) result.helperHelperProfile = rowToHelperProfile(helperHelperProfile);
  }

  // Fetch relative if attached
  if (result.relativeId) {
    const { data: relative } = await supabase
      .from('relatives')
      .select('*')
      .eq('id', result.relativeId)
      .maybeSingle();
    if (relative) result.relative = rowToRelative(relative);
  }

  return result;
}

export async function createOrder(order: {
  relativeId: string | null;
  category: Category;
  title: string;
  description: string;
  city: string;
  address: string;
  scheduledDate: string | null;
  scheduledTime: string;
  estimatedDuration: string;
  paymentAmount: number;
  attachmentUrl?: string | null;
}): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      relative_id: order.relativeId,
      category: order.category,
      title: order.title,
      description: order.description,
      city: order.city,
      address: order.address,
      scheduled_date: order.scheduledDate,
      scheduled_time: order.scheduledTime,
      estimated_duration: order.estimatedDuration,
      payment_amount: order.paymentAmount,
      attachment_url: order.attachmentUrl ?? null,
      status: 'open',
    })
    .select('*')
    .single();
  if (error) throw error;
  return rowToOrder(data);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const updates: Record<string, unknown> = { status };
  if (status === 'accepted') updates.accepted_at = new Date().toISOString();
  if (status === 'in_progress') updates.started_at = new Date().toISOString();
  if (status === 'completed') updates.completed_at = new Date().toISOString();

  const { error } = await supabase.from('orders').update(updates).eq('id', id);
  if (error) throw error;

  // Insert status history
  await supabase.from('order_status_history').insert({
    order_id: id,
    status,
  });
}

export async function acceptOrder(id: string): Promise<{ error: string | null }> {
  // Atomic accept: only update if status is still 'open'
  const { data, error } = await supabase
    .from('orders')
    .update({
      helper_id: (await supabase.auth.getUser()).data.user?.id,
      status: 'accepted',
      accepted_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('status', 'open')
    .select('*')
    .maybeSingle();

  if (error) return { error: error.message };
  if (!data) return { error: 'Це замовлення вже взяв інший помічник' };

  await supabase.from('order_status_history').insert({
    order_id: id,
    status: 'accepted',
  });

  return { error: null };
}

export async function cancelOrder(id: string): Promise<void> {
  await updateOrderStatus(id, 'cancelled');
}

// ============================================================
// Helper Profiles
// ============================================================

export async function fetchHelperProfile(userId: string): Promise<HelperProfile | null> {
  const { data, error } = await supabase
    .from('helper_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToHelperProfile(data) : null;
}

export async function createHelperProfile(profile: {
  bio: string;
  city: string;
}): Promise<HelperProfile> {
  const { data, error } = await supabase
    .from('helper_profiles')
    .insert({
      bio: profile.bio,
      city: profile.city,
      verification_status: 'pending',
    })
    .select('*')
    .single();
  if (error) throw error;
  return rowToHelperProfile(data);
}

export async function updateHelperProfile(userId: string, updates: Partial<HelperProfile>): Promise<void> {
  const { error } = await supabase
    .from('helper_profiles')
    .update({
      bio: updates.bio,
      city: updates.city,
    })
    .eq('user_id', userId);
  if (error) throw error;
}

// ============================================================
// Reviews
// ============================================================

export async function fetchReviewsForHelper(helperId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('helper_id', helperId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToReview);
}

export async function fetchReviewForOrder(orderId: string): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToReview(data) : null;
}

export async function createReview(review: {
  orderId: string;
  helperId: string;
  rating: number;
  comment: string;
}): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      order_id: review.orderId,
      helper_id: review.helperId,
      rating: review.rating,
      comment: review.comment,
    })
    .select('*')
    .single();
  if (error) throw error;

  // Update helper rating
  const reviews = await fetchReviewsForHelper(review.helperId);
  if (reviews.length > 0) {
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await supabase
      .from('helper_profiles')
      .update({
        rating: Math.round(avg * 100) / 100,
        completed_orders: reviews.length,
      })
      .eq('user_id', review.helperId);
  }

  return rowToReview(data);
}

// ============================================================
// Profile helpers
// ============================================================

export async function createProfile(role: UserRole, firstName: string, lastName: string, phone: string, city: string): Promise<void> {
  const { error } = await supabase.from('profiles').insert({
    role,
    first_name: firstName,
    last_name: lastName,
    phone,
    city,
  });
  if (error) throw error;
}

// ============================================================
// Row mappers
// ============================================================

function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    role: row.role as UserRole,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    phone: row.phone as string,
    avatarUrl: row.avatar_url as string | null,
    city: row.city as string,
  };
}

function rowToRelative(row: Record<string, unknown>): Relative {
  return {
    id: row.id as string,
    customerId: row.customer_id as string,
    name: row.name as string,
    age: row.age as number,
    phone: row.phone as string,
    city: row.city as string,
    address: row.address as string,
    relationship: row.relationship as Relationship,
    notes: row.notes as string | null,
  };
}

function rowToHelperProfile(row: Record<string, unknown>): HelperProfile {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    bio: row.bio as string,
    city: row.city as string,
    verificationStatus: row.verification_status as 'pending' | 'verified' | 'rejected',
    phoneVerified: row.phone_verified as boolean,
    identityVerified: row.identity_verified as boolean,
    trainingCompleted: row.training_completed as boolean,
    qualificationVerified: row.qualification_verified as boolean,
    rating: Number(row.rating),
    completedOrders: row.completed_orders as number,
  };
}

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    customerId: row.customer_id as string,
    relativeId: row.relative_id as string | null,
    helperId: row.helper_id as string | null,
    category: row.category as Category,
    title: row.title as string,
    description: row.description as string,
    city: row.city as string,
    address: row.address as string,
    scheduledDate: row.scheduled_date as string | null,
    scheduledTime: row.scheduled_time as string,
    estimatedDuration: row.estimated_duration as string,
    paymentAmount: row.payment_amount as number,
    attachmentUrl: row.attachment_url as string | null,
    status: row.status as OrderStatus,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    acceptedAt: row.accepted_at as string | null,
    startedAt: row.started_at as string | null,
    completedAt: row.completed_at as string | null,
  };
}

function rowToReview(row: Record<string, unknown>): Review {
  return {
    id: row.id as string,
    orderId: row.order_id as string,
    customerId: row.customer_id as string,
    helperId: row.helper_id as string,
    rating: row.rating as number,
    comment: row.comment as string,
    createdAt: row.created_at as string,
  };
}
