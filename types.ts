
export type TrackCategory = 
  | 'initial' 
  | 'clinical' 
  | 'psychological' 
  | 'nutrition' 
  | 'molecular' 
  | 'complication' 
  | 'hospital' 
  | 'regional';

export interface JourneyNode {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: TrackCategory;
  wechatId: string;
  qrCodeUrl?: string;
}

export interface TrackDefinition {
  id: TrackCategory;
  title: string;
  description: string;
  theme: {
    bg: string;
    border: string;
    text: string;
    icon: string;
    lightBg: string;
  };
  nodes: JourneyNode[];
}
