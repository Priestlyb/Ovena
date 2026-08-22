/**
 * data/mockOps.ts
 *
 * Mock data for Operations tab. Delete once real endpoints exist.
 */

import { Banner } from '@/types/ops';

export const MOCK_BANNERS: Banner[] = [
  {
    id: 'BNR-001',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    title: 'Weekend Flash Sale',
    status: 'active',
    scheduledStart: null,
    scheduledEnd: null,
    createdAt: '2026-08-01T09:00:00Z',
  },
  {
    id: 'BNR-002',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    title: 'New Restaurant Onboarding',
    status: 'scheduled',
    scheduledStart: '2026-08-10T00:00:00Z',
    scheduledEnd: '2026-08-17T00:00:00Z',
    createdAt: '2026-08-05T14:20:00Z',
  },
  {
    id: 'BNR-003',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    title: 'Referral Program',
    status: 'disabled',
    scheduledStart: null,
    scheduledEnd: null,
    createdAt: '2026-07-20T11:00:00Z',
  },
];