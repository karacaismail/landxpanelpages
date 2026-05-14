import type { Role } from '@/types/domain';

export type Resource =
  | 'listing' | 'offer' | 'message' | 'viewing' | 'user' | 'role' | 'rule'
  | 'audit' | 'tkgm' | 'notification' | 'settings' | 'modules';
export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';

const MATRIX: Record<Role, Partial<Record<Resource, Action[]>>> = {
  guest: {
    listing: ['read'],
    user: [],
    message: [],
    notification: []
  },
  buyer: {
    listing: ['read'],
    offer: ['create', 'read', 'update'],
    message: ['create', 'read', 'update'],
    viewing: ['create', 'read', 'update'],
    user: ['read', 'update'],
    notification: ['read', 'update']
  },
  seller: {
    listing: ['create', 'read', 'update', 'delete'],
    offer: ['read', 'update'],
    message: ['create', 'read', 'update'],
    viewing: ['read', 'update'],
    user: ['read', 'update'],
    notification: ['read', 'update']
  },
  moderator: {
    listing: ['read', 'update'],
    offer: ['read'],
    message: ['read'],
    viewing: ['read'],
    user: ['read', 'update'],
    notification: ['read'],
    audit: ['read']
  },
  admin: {
    listing: ['create', 'read', 'update', 'delete', 'manage'],
    offer:   ['read', 'update', 'manage'],
    message: ['read', 'manage'],
    viewing: ['read', 'manage'],
    user:    ['create', 'read', 'update', 'delete', 'manage'],
    role:    ['create', 'read', 'update', 'delete', 'manage'],
    rule:    ['create', 'read', 'update', 'delete', 'manage'],
    audit:   ['read'],
    tkgm:    ['read', 'manage'],
    notification: ['read', 'update', 'manage'],
    settings:['read', 'update', 'manage'],
    modules: ['read']
  }
};

export function can(role: Role, resource: Resource, action: Action): boolean {
  const acts = MATRIX[role]?.[resource];
  if (!acts) return false;
  return acts.includes(action) || acts.includes('manage');
}

export function routeAllowed(role: Role, path: string): boolean {
  // Admin routes
  if (path.startsWith('/admin')) return role === 'admin' || role === 'moderator';
  // Seller routes
  if (path.startsWith('/seller')) return role === 'seller' || role === 'admin';
  // Account routes (logged in)
  if (path.startsWith('/account')) return role !== 'guest';
  // Sell
  if (path.startsWith('/sell')) return role !== 'guest';
  return true;
}
