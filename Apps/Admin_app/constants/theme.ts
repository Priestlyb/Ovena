import { StatusBarStyle } from 'react-native';

// ─── Shared non-semantic tokens ───────────────────────────────────────────────
export const Spacing = {
  base: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  gutter: 16,
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FontFamily = {
  heading: 'HankenGrotesk',
  body: 'Inter',
  mono: 'JetBrainsMono',
} as const;

// ─── Semantic color contract ──────────────────────────────────────────────────
// Every key must exist in both dark and light palettes so components never
// need to branch on the current mode — they just read from `colors.*`.

export interface ThemeColors {
  // Backgrounds / surfaces
  background:                 string;
  surface:                    string;
  surfaceContainerLowest:     string;
  surfaceContainerLow:        string;
  surfaceContainer:           string;
  surfaceContainerHigh:       string;
  surfaceContainerHighest:    string;
  surfaceBright:              string;

  // Text
  onBackground:               string;
  onSurface:                  string;
  onSurfaceVariant:           string;
  inverseSurface:             string;
  inverseOnSurface:           string;

  // Primary (Liquid Lava)
  primary:                    string;   // #ffb691 — soft tint for dark text icons
  onPrimary:                  string;   // text on primary bg
  primaryContainer:           string;   // #f56e0f — CTA background, badges
  onPrimaryContainer:         string;   // text on primaryContainer

  // Secondary
  secondary:                  string;
  onSecondary:                string;
  secondaryContainer:         string;
  onSecondaryContainer:       string;

  // Outline / dividers
  outline:                    string;
  outlineVariant:             string;
  border:                     string;   // FFFFFF1A equivalent
  borderSubtle:               string;
  divider:                    string;

  // Semantic states
  error:                      string;
  onError:                    string;
  errorContainer:             string;
  onErrorContainer:           string;
  success:                    string;   // green — positive deltas

  // Status bar
  statusBarStyle:             StatusBarStyle;

  // Tab bar
  tabBarBackground:           string;
  tabBarBorder:               string;
  tabBarActive:               string;
  tabBarInactive:             string;
}

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F2F4F7',
    icon: '#687076',
  },
  dark: {
    text: '#ECEDEE',
    background: '#11181C',
    icon: '#9BA1A6',
  },
} as const;

// ─── Dark palette (default — "Dark Void" design) ─────────────────────────────
export const DarkColors: ThemeColors = {
  background:                 '#141318',
  surface:                    '#141318',
  surfaceContainerLowest:     '#0e0e12',
  surfaceContainerLow:        '#1c1b20',
  surfaceContainer:           '#201f24',
  surfaceContainerHigh:       '#2b292f',
  surfaceContainerHighest:    '#353439',
  surfaceBright:              '#3a383e',

  onBackground:               '#e5e1e8',
  onSurface:                  '#e5e1e8',
  onSurfaceVariant:           '#e0c0b1',
  inverseSurface:             '#e5e1e8',
  inverseOnSurface:           '#313035',

  primary:                    '#ffb691',
  onPrimary:                  '#552000',
  primaryContainer:           '#f56e0f',
  onPrimaryContainer:         '#531f00',

  secondary:                  '#c8c6c5',
  onSecondary:                '#303030',
  secondaryContainer:         '#474746',
  onSecondaryContainer:       '#b7b5b4',

  outline:                    '#a88b7d',
  outlineVariant:             '#594237',
  border:                     'rgba(255,255,255,0.10)',
  borderSubtle:               'rgba(255,255,255,0.06)',
  divider:                    'rgba(255,255,255,0.05)',

  error:                      '#ffb4ab',
  onError:                    '#690005',
  errorContainer:             '#93000a',
  onErrorContainer:           '#ffdad6',
  success:                    '#4ade80',

  statusBarStyle:             'light-content',

  tabBarBackground:           '#0e0e12',
  tabBarBorder:               'rgba(255,255,255,0.08)',
  tabBarActive:               '#f56e0f',
  tabBarInactive:             '#594237',
};

// ─── Light palette ────────────────────────────────────────────────────────────
// Built by inverting the tonal relationships: warm parchment backgrounds,
// charcoal text, the same Liquid Lava orange kept as the primary accent.
export const LightColors: ThemeColors = {
  background:                 '#fdf6f0',
  surface:                    '#fdf6f0',
  surfaceContainerLowest:     '#ffffff',
  surfaceContainerLow:        '#f5ede6',
  surfaceContainer:           '#ede4dc',
  surfaceContainerHigh:       '#e4dbd2',
  surfaceContainerHighest:    '#d9d0c7',
  surfaceBright:              '#ffffff',

  onBackground:               '#1e1a17',
  onSurface:                  '#1e1a17',
  onSurfaceVariant:           '#5c3d2e',
  inverseSurface:             '#353028',
  inverseOnSurface:           '#f5ede6',

  primary:                    '#9e4300',   // deeper lava for contrast on light
  onPrimary:                  '#ffffff',
  primaryContainer:           '#f56e0f',   // kept identical — brand colour
  onPrimaryContainer:         '#ffffff',

  secondary:                  '#4a4746',
  onSecondary:                '#ffffff',
  secondaryContainer:         '#d5d2d1',
  onSecondaryContainer:       '#2e2c2b',

  outline:                    '#8c6a5c',
  outlineVariant:             '#d4b8ae',
  border:                     'rgba(0,0,0,0.10)',
  borderSubtle:               'rgba(0,0,0,0.06)',
  divider:                    'rgba(0,0,0,0.07)',

  error:                      '#ba1a1a',
  onError:                    '#ffffff',
  errorContainer:             '#ffdad6',
  onErrorContainer:           '#410002',
  success:                    '#1a7a3f',

  statusBarStyle:             'dark-content',

  tabBarBackground:           '#ffffff',
  tabBarBorder:               'rgba(0,0,0,0.10)',
  tabBarActive:               '#f56e0f',
  tabBarInactive:             '#a88b7d',
};