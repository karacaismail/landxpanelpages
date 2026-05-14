import { describe, expect, it } from 'vitest';
import { can, routeAllowed } from '@/lib/permissions/rbac';

describe('rbac', () => {
  it('admin can manage rules', () => {
    expect(can('admin', 'rule', 'manage')).toBe(true);
  });
  it('buyer cannot create listing', () => {
    expect(can('buyer', 'listing', 'create')).toBe(false);
  });
  it('seller can update own listing', () => {
    expect(can('seller', 'listing', 'update')).toBe(true);
  });
  it('routeAllowed gates admin routes', () => {
    expect(routeAllowed('buyer', '/admin/users')).toBe(false);
    expect(routeAllowed('admin', '/admin/users')).toBe(true);
  });
});
