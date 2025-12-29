export interface User {
  id: string;
  phone: string;
  display_name: string;
  age_range: '18-22' | '23-25' | '26-30' | '31+';
  city: string;
  interests: string[];
  avatar_url?: string;
  trust_flags: Record<string, any>;
  created_at: Date;
  last_seen: Date;
  is_active: boolean;
  is_banned: boolean;
}

export interface Group {
  id: string;
  title: string;
  description?: string;
  lat: number;
  lng: number;
  radius_m: number;
  group_type: 'public' | 'request' | 'invite_only';
  start_time: Date;
  end_time?: Date;
  capacity?: number;
  created_by: string;
  tags: string[];
  created_at: Date;
  is_active: boolean;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'member' | 'organizer';
  joined_at: Date;
  left_at?: Date;
}

export interface Message {
  id: string;
  group_id: string;
  sender_id: string;
  body: string;
  media_url?: string;
  created_at: Date;
  is_deleted: boolean;
}

export interface Report {
  id: string;
  reported_by: string;
  target_type: 'user' | 'group' | 'message';
  target_id: string;
  reason: 'harassment' | 'spam' | 'safety' | 'inappropriate' | 'other';
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  created_at: Date;
  resolved_at?: Date;
  resolved_by?: string;
  resolution_notes?: string;
}

export interface Block {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: Date;
}

// API Request/Response types
export interface CreateGroupRequest {
  title: string;
  description?: string;
  lat: number;
  lng: number;
  radius_m: number;
  group_type: 'public' | 'request' | 'invite_only';
  start_time: string;
  end_time?: string;
  capacity?: number;
  tags: string[];
}

export interface GetGroupsQuery {
  lat: number;
  lng: number;
  radius?: number;
  tags?: string[];
  time?: 'now' | 'upcoming';
  limit?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
