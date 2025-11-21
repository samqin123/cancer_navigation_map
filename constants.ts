
import type { JourneyNode, TrackDefinition } from './types';

/**
 * Helper to create nodes easily.
 * 
 * Now updated to AUTOMATICALLY generate 3 admins for every node 
 * to satisfy the requirement: "All QRs should use the switching way".
 * 
 * @param id - Unique ID
 * @param category - Track category
 * @param title - Node title
 * @param subtitle - Subtitle description
 * @param baseWechatId - Base ID string used to generate admin IDs
 * @param options - Configuration overrides
 */
const mockNode = (
  id: string, 
  category: JourneyNode['category'], 
  title: string, 
  subtitle: string, 
  baseWechatId: string,
  options: { groupQr?: string; admins?: string[]; adminIds?: string[] } = {}
): JourneyNode => {
  
  // Auto-generate 3 admins if not provided manually
  // This ensures the "Switching" UI appears for ALL nodes
  const defaultAdmins = [
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Admin_1_For_${id}&color=1e293b`,
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Admin_2_For_${id}&color=0f172a`,
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Admin_3_For_${id}&color=334155`
  ];

  const defaultAdminIds = [
    `${baseWechatId}_01`,
    `${baseWechatId}_02`,
    `${baseWechatId}_03`
  ];

  return {
    id,
    title,
    subtitle,
    category,
    wechatId: baseWechatId, // Fallback
    // If groupQr is provided, it takes precedence (Direct Join).
    // Otherwise, use provided admins OR fallback to generated defaults (Admin Switch Mode).
    qrImageUrl: options.groupQr, 
    adminQrCodes: options.admins || defaultAdmins,
    adminWechatIds: options.adminIds || defaultAdminIds
  };
};

// --- 1. 初始入口 ---
export const INITIAL_NODES: JourneyNode[] = [
  mockNode('A', 'initial', '早筛咨询群', '未确诊/高危人群', 'screen_helper'),
  mockNode('B', 'initial', '心理支持小队', '全阶段情绪陪伴', 'psy_helper'),
  mockNode('C', 'initial', '营养管理小队', '全阶段饮食指导', 'nutri_helper')
];

// --- 2. 临床治疗主线 ---
const CLINICAL_NODES: JourneyNode[] = [
  mockNode('D', 'clinical', '首诊指导群', '确诊后治疗方向', 'first_diag'),
  mockNode('E', 'clinical', '基础治疗群', '手术/放化疗期', 'basic_tx'),
  mockNode('F', 'clinical', '专业进阶治疗群', '靶向/免疫治疗', 'adv_tx'),
  mockNode('G', 'clinical', '后线治疗群', '耐药/复发后', 'later_tx'),
];

// --- 2.1 分子分型分支 ---
const MOLECULAR_NODES: JourneyNode[] = [
  mockNode('H', 'molecular', 'KRAS-G12D突变群', '特定突变交流', 'g12d_helper'),
  mockNode('I', 'molecular', 'KRAS-G12V突变群', '特定突变交流', 'g12v_helper'),
  mockNode('K_12R', 'molecular', 'KRAS-12R突变群', '特定突变交流', 'g12r_helper'), // 新增节点
  mockNode('J', 'molecular', 'KRAS非12D/V突变群', '罕见KRAS突变', 'rare_kras'),
  mockNode('K', 'molecular', 'KRAS野生型群', '无特定突变', 'wild_kras'),
  mockNode('L', 'molecular', 'HER2/3分型专群', 'HER2/3扩增/突变', 'her2_helper'),
];

// --- 2.2 并发症管理分支 ---
const COMPLICATION_NODES: JourneyNode[] = [
  mockNode('M', 'complication', '疼痛管理小队', '疼痛缓解指导', 'pain_care'),
  mockNode('N', 'complication', '消化道出血小队', '终末期关怀', 'gi_bleed'),
  mockNode('CO', 'complication', '消化道梗阻小队', '梗阻处理指导', 'gi_obstruct'),
  mockNode('CI', 'complication', '感染并发症小队', '感染控制指导', 'infect_care'),
];

// --- 3. 心理支持主线 ---
const PSYCH_NODES: JourneyNode[] = [
  mockNode('O', 'psychological', '心理互助群', '同病种经验分享', 'psy_mutual'),
  mockNode('O_PC', 'psychological', '微光成炬-安宁闪耀', '安宁疗护/生命关怀', 'hospice_care'), // 新增节点
];

// --- 4. 营养管理主线 ---
const NUTRI_NODES: JourneyNode[] = [
  mockNode('P', 'nutrition', '治疗期营养群', '放化疗饮食调理', 'tx_diet'),
  mockNode('Q', 'nutrition', '康复期营养群', '治疗后体质恢复', 'recover_diet'),
];

// --- 5. 地域病友分支 ---
export const REGIONAL_NODES: JourneyNode[] = [
  mockNode('RE1', 'regional', '微光成炬-华东PRO群', '按地域同行互助', 'region_east'),
  mockNode('RE2', 'regional', '微光成炬-燕赵PRO群', '按地域同行互助', 'region_north'),
  mockNode('RE3', 'regional', '微光成炬-湾区病友基础群', '按地域同行互助', 'region_bay'),
  mockNode('RE4', 'regional', '微光成炬-西南病友基础群', '按地域同行互助', 'region_west'),
];

// --- 6. 三甲医院专属群 ---
export const HOSPITAL_NODES: JourneyNode[] = [
  mockNode('R', 'hospital', '复肿 & 小胰宝患者公益群', '携手蓝马甲服务患者关怀', 'fudan_help'),
  mockNode('S', 'hospital', '金医生 & 小胰宝患者公益群', '携手蓝马甲服务患者关怀', 'doc_jin_help'),
  mockNode('S', 'hospital', '上海中山 & 小胰宝患者公益群', '携手蓝马甲服务患者关怀', 'zhongshan_help'),
];

export const TRACKS: TrackDefinition[] = [
  {
    id: 'clinical',
    title: '临床治疗',
    description: '从确诊到后线治疗的全程医疗支持',
    theme: { bg: 'bg-blue-500', border: 'border-blue-200', text: 'text-blue-600', icon: 'activity', lightBg: 'bg-blue-50' },
    nodes: CLINICAL_NODES
  },
  {
    id: 'molecular',
    title: '分子分型分支',
    description: '针对特定基因突变的精准治疗交流',
    theme: { bg: 'bg-purple-500', border: 'border-purple-200', text: 'text-purple-600', icon: 'dna', lightBg: 'bg-purple-50' },
    nodes: MOLECULAR_NODES
  },
  {
    id: 'complication',
    title: '并发症管理分支',
    description: '针对特定症状的护理与缓解指导',
    theme: { bg: 'bg-orange-500', border: 'border-orange-200', text: 'text-orange-600', icon: 'shield', lightBg: 'bg-orange-50' },
    nodes: COMPLICATION_NODES
  },
  {
    id: 'psychological',
    title: '心理支持',
    description: '全病程的情绪陪伴与互助',
    theme: { bg: 'bg-rose-500', border: 'border-rose-200', text: 'text-rose-600', icon: 'heart', lightBg: 'bg-rose-50' },
    nodes: PSYCH_NODES
  },
  {
    id: 'nutrition',
    title: '营养管理',
    description: '科学饮食，为治疗保驾护航',
    theme: { bg: 'bg-emerald-500', border: 'border-emerald-200', text: 'text-emerald-600', icon: 'coffee', lightBg: 'bg-emerald-50' },
    nodes: NUTRI_NODES
  }
];
