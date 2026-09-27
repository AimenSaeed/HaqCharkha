export type Language = 'ur' | 'ps';
export type AudioVoice = 'ur' | 'ps';

export interface SpoolOption {
  id: string;
  spools: number;
  labelUr: string;
  labelPs: string;
  descriptionUr: string;
  descriptionPs: string;
  cost: number; // PKR
  icon: string;
}

export interface DayOption {
  id: string;
  days: number;
  hours: number;
  labelUr: string;
  labelPs: string;
  subUr: string;
  subPs: string;
  iconType: 'sun' | 'suns' | 'week' | 'moon';
  iconCount: number;
}

export interface ComplexityOption {
  id: string;
  multiplier: number;
  labelUr: string;
  labelPs: string;
  patternNameUr: string;
  patternNamePs: string;
  swatchColor: string;
  texturePattern: string;
  descriptionUr: string;
  descriptionPs: string;
}

export interface CurrencyNote {
  denomination: number;
  color: string;
  accentColor: string;
  titleUr: string;
  titlePs: string;
  landmarkUr: string;
  landmarkPs: string;
  count: number;
}
