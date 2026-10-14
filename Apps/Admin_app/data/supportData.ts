/**
 * data/supportData.ts
 *
 * Full dummy data for the Support Hub — inbox threads across
 * Drivers, Restaurants, and Customers, each with pre-seeded chat history.
 */

export type SupportCategory = 'drivers' | 'restaurants' | 'customers';
export type ThreadStatus    = 'new' | 'pending' | 'resolved' | 'urgent';

export interface ChatMessage {
  id:        string;
  text:      string;
  fromAdmin: boolean;   // true = outbound (orange), false = inbound (surface)
  time:      string;    // display string e.g. "10:42 AM"
}

export interface SupportThread {
  id:          string;
  category:    SupportCategory;
  name:        string;
  role:        string;          // e.g. "Driver" / "Restaurant" / "Customer"
  avatarUri:   string;
  preview:     string;          // truncated last message shown in inbox
  timeAgo:     string;
  status:      ThreadStatus;
  refCode:     string;          // e.g. "#DRV-8821"
  isOnline:    boolean;
  messages:    ChatMessage[];
}

// ─── Drivers ──────────────────────────────────────────────────────────────────
const DRIVER_THREADS: SupportThread[] = [
  {
    id:       'd1',
    category: 'drivers',
    name:     'Marcus Rivera',
    role:     'Driver',
    avatarUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWjxvjJ2ablfks_q-a6u7XTwPBiHxJWWjMgVC5gQ5JOgEbROMJ_4QDDSfot0K6sjzLxpnIlv_4jX0-vg0KOnfw_Ia3-ByCD9QcvmtkDd74FtX4FAzotUPMWelNW7Zr8oNakT_hYdIBI-P0gGSSF4C9aaYHKOk4C2OkuV-XxHclRZ3a2g0oBSUpLgbB0OcowZR9ehjnBz2ZVw32EtoMx1Lr3CxIe_qvHCcxRTK0ijAvgpx6aUONcZCLjJc6yiXITwAdfUxGIrHLe_4H',
    preview:  'GPS signal lost near Sector 7 drop-off zone...',
    timeAgo:  '2m ago',
    status:   'new',
    refCode:  '#DRV-8821',
    isOnline: true,
    messages: [
      { id: 'm1', text: 'Hi, my GPS signal is completely lost near the Sector 7 drop-off zone. I cannot navigate to the customer.', fromAdmin: false, time: '10:42 AM' },
      { id: 'm2', text: 'Hello Marcus, I can see your last known position. We\'re looking into the GPS issue right now — likely a dead zone in that area.', fromAdmin: true, time: '10:44 AM' },
      { id: 'm3', text: 'Can you try toggling airplane mode off and on? That usually forces a GPS re-lock.', fromAdmin: true, time: '10:44 AM' },
      { id: 'm4', text: 'Tried it — still showing the same spot. The customer is calling me asking where I am.', fromAdmin: false, time: '10:46 AM' },
      { id: 'm5', text: 'I\'ve notified the customer and extended their ETA by 10 minutes. Manual coordinates have been pushed to your app. Please refresh the order.', fromAdmin: true, time: '10:47 AM' },
      { id: 'm6', text: 'GPS signal lost near Sector 7 drop-off zone...', fromAdmin: false, time: '10:48 AM' },
    ],
  },
  {
    id:       'd2',
    category: 'drivers',
    name:     'Sarah Chen',
    role:     'Driver',
    avatarUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD45ESM05idoJch_4yOFjtoMOT8B7MJc-3YmYS76rAg-0x_pjtJkh8zKtk8c5FEus-MEe51Y8XjzI12nODZzjNiqdCmWRn-WJZLkLgAcEEkr9KFIKr2KVMTJVBKC17Oe4qItNKPQMYLuTAAzbqXdS3uCv_hmk_RWIydSNjk453kdnK7sxtMNMVnzGMzYvXe2E_KGEOI9ozgw7md6fjlUybKZeltYrSzf0KYguDkwDbeS1cqv58-zvxdJdnuO7SCzlNgztVMlSrY1S0K',
    preview:  'I have arrived at the restaurant but they say the order...',
    timeAgo:  '15m ago',
    status:   'pending',
    refCode:  '#DRV-9044',
    isOnline: true,
    messages: [
      { id: 'm1', text: 'I have arrived at the restaurant but they say the order hasn\'t been confirmed on their end. I\'ve been waiting 20 minutes.', fromAdmin: false, time: '10:15 AM' },
      { id: 'm2', text: 'Hi Sarah — sorry for the wait. I\'m checking with the restaurant system now.', fromAdmin: true, time: '10:17 AM' },
      { id: 'm3', text: 'It looks like there was a sync delay on their tablet. I\'ve re-sent the order confirmation. They should see it now.', fromAdmin: true, time: '10:18 AM' },
      { id: 'm4', text: 'Yes, they got it! They say it\'ll be ready in 5 minutes. Thank you!', fromAdmin: false, time: '10:20 AM' },
      { id: 'm5', text: 'I have arrived at the restaurant but they say the order is not showing...', fromAdmin: false, time: '10:21 AM' },
    ],
  },
  {
    id:       'd3',
    category: 'drivers',
    name:     'Elena Rodriguez',
    role:     'Driver',
    avatarUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfq1siCjX_lIOJ-ONsCUrEiFFn3mtAWcdgiZnOw6ziRnXHzf-TQkTmMurPzC2Ud4OWUWwdhMIBfXStpqwjGurFtgmd9mtxXMLcjEDUmGozdRvnK46DESp6rxVJarwhFNZpAMXq2b0zPV6INzzzBHEb9qbJKnxDNIXR5VL03d0muWqhPHeBdqGrYkpoqTzeg4tM-BI7w8uUHDCuEdY9HZ3DR_QRlRKBjrw_3GcjwclLvPE1ZiXF4ytZxdE5RW3hS1i8pjZ-OChQAgNk',
    preview:  'The payout for my morning shift is now reflecting...',
    timeAgo:  '1h ago',
    status:   'resolved',
    refCode:  '#DRV-7762',
    isOnline: false,
    messages: [
      { id: 'm1', text: 'Hi, the payout for my morning shift from Tuesday still hasn\'t shown in my wallet.', fromAdmin: false, time: '9:00 AM' },
      { id: 'm2', text: 'Hello Elena, I can see the transaction. It was held for a routine bank verification. Let me trigger a manual release.', fromAdmin: true, time: '9:02 AM' },
      { id: 'm3', text: 'Done — the ₦4,200 should appear within 5-10 minutes.', fromAdmin: true, time: '9:03 AM' },
      { id: 'm4', text: 'It\'s showing now! Thank you so much for the quick fix.', fromAdmin: false, time: '9:11 AM' },
      { id: 'm5', text: 'The payout for my morning shift is now reflecting correctly ✓', fromAdmin: false, time: '9:12 AM' },
    ],
  },
  {
    id:       'd4',
    category: 'drivers',
    name:     'Jordan Smith',
    role:     'Driver',
    avatarUri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5K9M9v5zRRgERGk0F1AR6zWnyPMkNCmAt2IVc9uniEbWpqXon_LzWzFuUf1A3oERD7-ayip_GFkIX6cCtWsXS2xF7xOT2Hc-XxC4oUhGev7uPfd93C3Ge4Xeo-AZ3H1Bfv9Ug2JWnjFDk3vToKElZKq_tlPWPI7G7rIk2PkNnAFqr-Uego0UrB_hz8CplyLhvs0UojzNjS6ISMuWkUVcfmcaEooQ7qVF72zFPoImoYj45PcFodAvR0-5ZKie4etXGkEXcDFCH9G6F',
    preview:  'Accident reported at 5th Ave. Requesting emergency backup...',
    timeAgo:  'Just now',
    status:   'urgent',
    refCode:  '#DRV-1102',
    isOnline: true,
    messages: [
      { id: 'm1', text: 'URGENT: Minor accident at 5th Ave & Oak Street. Vehicle is drivable but I\'m shaken. No injuries. Need to know the protocol.', fromAdmin: false, time: '11:00 AM' },
      { id: 'm2', text: 'Jordan — stay calm, your safety is the priority. Are you physically okay? Is the other party involved okay?', fromAdmin: true, time: '11:01 AM' },
      { id: 'm3', text: 'Yes I\'m fine. Other driver is also fine — just a minor scrape. But I need to file an incident report.', fromAdmin: false, time: '11:02 AM' },
      { id: 'm4', text: 'Good to hear. I\'m sending the incident report form to your app right now. The current delivery has been reassigned. Take all the time you need.', fromAdmin: true, time: '11:03 AM' },
      { id: 'm5', text: 'Accident reported at 5th Ave. Requesting emergency backup and incident documentation.', fromAdmin: false, time: '11:04 AM' },
    ],
  },
];

// ─── Restaurants ──────────────────────────────────────────────────────────────
const RESTAURANT_THREADS: SupportThread[] = [
  {
    id:       'r1',
    category: 'restaurants',
    name:     'Pizza Planet',
    role:     'Restaurant',
    avatarUri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop',
    preview:  'Our tablet is offline, can you re-sync the system?',
    timeAgo:  '8m ago',
    status:   'new',
    refCode:  '#RST-3301',
    isOnline: true,
    messages: [
      { id: 'm1', text: 'Our ordering tablet has gone offline and we\'re missing incoming orders. Can you help re-sync?', fromAdmin: false, time: '11:10 AM' },
      { id: 'm2', text: 'Hi Pizza Planet! I can see your device went offline at 11:05 AM. Let me push a remote restart to the tablet.', fromAdmin: true, time: '11:12 AM' },
      { id: 'm3', text: 'Restart sent. Can you confirm if the tablet screen has come back on?', fromAdmin: true, time: '11:12 AM' },
      { id: 'm4', text: 'Yes it\'s back on! Orders are showing again. Thank you!', fromAdmin: false, time: '11:14 AM' },
    ],
  },
  {
    id:       'r2',
    category: 'restaurants',
    name:     'Sushi Sakura',
    role:     'Restaurant',
    avatarUri: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop',
    preview:  'We need to update our menu — 3 items are out of stock...',
    timeAgo:  '32m ago',
    status:   'pending',
    refCode:  '#RST-3289',
    isOnline: false,
    messages: [
      { id: 'm1', text: 'Hello, we need to mark 3 menu items as out of stock urgently — we\'re getting orders for items we can\'t fulfill.', fromAdmin: false, time: '10:30 AM' },
      { id: 'm2', text: 'Hi Sushi Sakura — which 3 items do you need to pause?', fromAdmin: true, time: '10:31 AM' },
      { id: 'm3', text: 'Salmon Nigiri (x12), Dragon Roll, and the Bento Box Set B.', fromAdmin: false, time: '10:32 AM' },
      { id: 'm4', text: 'All three items have been marked as unavailable on the platform. New orders for those items are now blocked.', fromAdmin: true, time: '10:33 AM' },
      { id: 'm5', text: 'We need to update our menu — 3 items are out of stock and orders are still coming in.', fromAdmin: false, time: '10:34 AM' },
    ],
  },
  {
    id:       'r3',
    category: 'restaurants',
    name:     'The Burger Joint',
    role:     'Restaurant',
    avatarUri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop',
    preview:  'Why was our payout delayed this week?',
    timeAgo:  '2h ago',
    status:   'resolved',
    refCode:  '#RST-3190',
    isOnline: false,
    messages: [
      { id: 'm1', text: 'Our weekly payout is 2 days late. This is the second time this month. Please explain what\'s happening.', fromAdmin: false, time: '8:00 AM' },
      { id: 'm2', text: 'Hi Burger Joint, I sincerely apologize for the delay. There was a hold from our payment processor due to a compliance flag that has since been cleared.', fromAdmin: true, time: '8:05 AM' },
      { id: 'm3', text: 'The full payout of ₦87,400 has been released and should reflect in 24 hours. We\'re also adding a ₦2,000 credit to your account for the inconvenience.', fromAdmin: true, time: '8:06 AM' },
      { id: 'm4', text: 'Okay, thank you for the explanation and the credit. We\'ll look out for it.', fromAdmin: false, time: '8:10 AM' },
    ],
  },
];

// ─── Customers ────────────────────────────────────────────────────────────────
const CUSTOMER_THREADS: SupportThread[] = [
  {
    id:       'c1',
    category: 'customers',
    name:     'Alice Johnson',
    role:     'Customer',
    avatarUri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    preview:  "My promo code isn't applying to the cart...",
    timeAgo:  'Just now',
    status:   'new',
    refCode:  '#CST-5501',
    isOnline: true,
    messages: [
      { id: 'm1', text: "I'm trying to use the code SAVE20 but it says it's invalid even though I got it from your email today.", fromAdmin: false, time: '11:20 AM' },
      { id: 'm2', text: 'Hi Alice! Let me check that code right away.', fromAdmin: true, time: '11:21 AM' },
      { id: 'm3', text: 'I can see the issue — the promo code SAVE20 is only valid for orders above ₦3,000 and your current cart is at ₦2,800. Add ₦200 more to unlock it!', fromAdmin: true, time: '11:22 AM' },
      { id: 'm4', text: "Oh, I didn't notice that. Let me add something else. Thanks!", fromAdmin: false, time: '11:23 AM' },
      { id: 'm5', text: "My promo code isn't applying to the cart — it says invalid.", fromAdmin: false, time: '11:24 AM' },
    ],
  },
  {
    id:       'c2',
    category: 'customers',
    name:     'David Okafor',
    role:     'Customer',
    avatarUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    preview:  'My order was marked delivered but I never received it.',
    timeAgo:  '18m ago',
    status:   'urgent',
    refCode:  '#CST-5498',
    isOnline: true,
    messages: [
      { id: 'm1', text: 'My order #44921 was marked as delivered 30 minutes ago but I\'m still waiting. No one knocked on my door and I was home all day.', fromAdmin: false, time: '10:50 AM' },
      { id: 'm2', text: 'Hi David, I\'m really sorry to hear this. I\'m pulling up the delivery details and GPS data for your driver right now.', fromAdmin: true, time: '10:52 AM' },
      { id: 'm3', text: 'The driver\'s GPS shows they stopped 200m from your address and marked it delivered. This is being flagged as a failed delivery.', fromAdmin: true, time: '10:53 AM' },
      { id: 'm4', text: 'I\'ve initiated a full refund to your wallet and a replacement order is being prepared free of charge.', fromAdmin: true, time: '10:54 AM' },
      { id: 'm5', text: 'My order was marked delivered but I never received it. I want a refund.', fromAdmin: false, time: '10:55 AM' },
    ],
  },
  {
    id:       'c3',
    category: 'customers',
    name:     'Fatima Al-Hassan',
    role:     'Customer',
    avatarUri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    preview:  'How do I change my delivery address for a live order?',
    timeAgo:  '45m ago',
    status:   'resolved',
    refCode:  '#CST-5441',
    isOnline: false,
    messages: [
      { id: 'm1', text: 'Hi, I accidentally put the wrong address for my current order. Is it too late to change it?', fromAdmin: false, time: '10:00 AM' },
      { id: 'm2', text: 'Hi Fatima! The driver hasn\'t been assigned yet so there\'s still time. What is the correct address?', fromAdmin: true, time: '10:01 AM' },
      { id: 'm3', text: '14B Palm Street, Victoria Island, Lagos.', fromAdmin: false, time: '10:02 AM' },
      { id: 'm4', text: 'Done! The delivery address has been updated. Your driver will see the correct address.', fromAdmin: true, time: '10:03 AM' },
      { id: 'm5', text: 'Thank you so much! You\'re a lifesaver.', fromAdmin: false, time: '10:04 AM' },
    ],
  },
  {
    id:       'c4',
    category: 'customers',
    name:     'Emeka Nwosu',
    role:     'Customer',
    avatarUri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    preview:  'Can I get a receipt for my last 3 orders for expense claim?',
    timeAgo:  '3h ago',
    status:   'pending',
    refCode:  '#CST-5388',
    isOnline: false,
    messages: [
      { id: 'm1', text: 'Hello, I need PDF receipts for my last 3 orders for a company expense claim. Can you send them to my email?', fromAdmin: false, time: '8:30 AM' },
      { id: 'm2', text: 'Hi Emeka! Absolutely — I\'m generating those receipts now. Which email should I send them to?', fromAdmin: true, time: '8:32 AM' },
      { id: 'm3', text: 'emeka.nwosu@company.ng please.', fromAdmin: false, time: '8:33 AM' },
      { id: 'm4', text: 'Sent! You should receive 3 PDF receipts in the next 2 minutes.', fromAdmin: true, time: '8:35 AM' },
    ],
  },
];

// ─── All threads combined ─────────────────────────────────────────────────────
export const ALL_THREADS: SupportThread[] = [
  ...DRIVER_THREADS,
  ...RESTAURANT_THREADS,
  ...CUSTOMER_THREADS,
].sort((a, b) => {
  // Sort: urgent first, then new, then pending, then resolved
  const order: Record<ThreadStatus, number> = { urgent: 0, new: 1, pending: 2, resolved: 3 };
  return order[a.status] - order[b.status];
});

export const THREADS_BY_CATEGORY: Record<SupportCategory, SupportThread[]> = {
  drivers:     DRIVER_THREADS,
  restaurants: RESTAURANT_THREADS,
  customers:   CUSTOMER_THREADS,
};

// Stats
export const SUPPORT_STATS = {
  unresolved: ALL_THREADS.filter(t => t.status !== 'resolved').length,
  avgResponse: '4m',
  avgResponseDelta: '-2m',
  unresolvedDelta: '+12%',
};