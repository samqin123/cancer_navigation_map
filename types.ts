
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
  wechatId: string; // Main contact ID or Group ID name
  
  // Images configuration
  qrImageUrl?: string;       // Path to Group QR. If present, this takes precedence (Direct Join Mode)
  adminQrCodes?: string[];   // Array of Admin QR image paths. Used if qrImageUrl is missing (Admin Add Mode)
  adminWechatIds?: string[]; // Array of Admin WeChat IDs, corresponding to adminQrCodes
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
