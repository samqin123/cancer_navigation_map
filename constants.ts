
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
  
  // Auto-generate admins if not provided manually (Fallback only)
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
    qrImageUrl: options.groupQr, 
    adminQrCodes: options.admins || defaultAdmins,
    adminWechatIds: options.adminIds || defaultAdminIds
  };
};

// =====================================================================
// 通用配置 / General Config
// =====================================================================
// 统一使用提供的图床链接作为所有二维码的占位图 (因为目前只有这一张真实图片)
const COMMON_QR = 'http://pic.xiaoyibao.com.cn/images/IMG_4891.JPG';

// 辅助函数：生成指定数量的通用二维码图片数组
const getQRs = (count: number) => Array(count).fill(COMMON_QR);

// --- 1. 初始入口 ---
export const INITIAL_NODES: JourneyNode[] = [
  // A: 早筛/基础病友群 -> 对应表中的 "基础病友群" (hengqujushi/Be4T0999/q36004543)
  mockNode('A', 'initial', '早筛咨询群', '未确诊/高危人群', 'basic_helper', {
    admins: getQRs(3),
    adminIds: ['hengqujushi', 'Be4T0999', 'q36004543']
  }),
  
  // B: 心理支持 -> 对应 "小馨宝-社区心理支持群" (weibo1322218790)
  mockNode('B', 'initial', '心理支持小队', '全阶段情绪陪伴', 'psy_helper', {
    admins: getQRs(1),
    adminIds: ['weibo1322218790']
  }),

  // C: 营养管理 -> 对应 "营养快线小队" (cfzrij/wxid_xvgvlugpx6tk12)
  mockNode('C', 'initial', '营养管理小队', '全阶段饮食指导', 'nutri_helper', {
    admins: getQRs(2),
    adminIds: ['cfzrij', 'wxid_xvgvlugpx6tk12']
  })
];

// --- 2. 临床治疗主线 ---
// D-G: 临床相关 -> 对应 "临床小队" (xiaomenglu0929)
const CLINICAL_ADMINS = {
  admins: getQRs(1),
  adminIds: ['qinxiaoqiang2002']
};

const CLINICAL_NODES: JourneyNode[] = [
  mockNode('D', 'clinical', '首诊指导群', '确诊后治疗方向', 'first_diag', {
    admins: getQRs(3),
    adminIds: ['hengqujushi', 'Be4T0999', 'q36004543']
  }),
  mockNode('E', 'clinical', '基础治疗群', '手术/放化疗期', 'basic_tx', {
    admins: getQRs(3),
    adminIds: ['hengqujushi', 'Be4T0999', 'q36004543']
  }),
  mockNode('F', 'clinical', '专业进阶治疗群', '靶向/免疫治疗', 'adv_tx', {
    admins: getQRs(3),
    adminIds: ['xiaomenglu0929', 'Lazio724','zhjing0220']
  }),
  mockNode('G', 'clinical', '后线治疗群', '耐药/复发后', 'later_tx', CLINICAL_ADMINS),
];

// --- 2.1 分子分型分支 ---
const MOLECULAR_NODES: JourneyNode[] = [
  // 一般突变 -> 使用临床小队负责人或基础群管理 (暂用 xiaomenglu0929)
  mockNode('H', 'molecular', 'KRAS-G12D突变群', '特定突变交流', 'g12d_helper', CLINICAL_ADMINS),
  mockNode('I', 'molecular', 'KRAS-G12V突变群', '特定突变交流', 'g12v_helper', CLINICAL_ADMINS),
  mockNode('K_12R', 'molecular', 'KRAS-12R突变群', '特定突变交流', 'g12r_helper', CLINICAL_ADMINS),
  mockNode('J', 'molecular', 'KRAS非12D/V突变群', '罕见KRAS突变', 'rare_kras', CLINICAL_ADMINS),
  
  // K: KRAS野生型 -> 对应 "胰腺KRAS野生小队" (Pruchen)
  mockNode('K', 'molecular', 'KRAS野生型群', '无特定突变', 'wild_kras', {
    admins: getQRs(1),
    adminIds: ['Pruchen']
  }),

  // L: HER2/3 -> 对应 "胰腺Her2突变小队" (anneanhan)
  mockNode('L', 'molecular', 'HER2/3分型专群', 'HER2/3扩增/突变', 'her2_helper', {
    admins: getQRs(1),
    adminIds: ['anneanhan']
  }),
];

// --- 2.2 并发症管理分支 ---
const COMPLICATION_NODES: JourneyNode[] = [
  // M: 疼痛 -> 未在表中详列，使用统筹管理员 (Lazio724)
  mockNode('M', 'complication', '疼痛管理小队', '疼痛缓解指导', 'pain_care', {
    admins: getQRs(1),
    adminIds: ['Lazio724']
  }),

  // N: 出血 -> 对应 "并发症-消化道出血小队" (pandur007)
  mockNode('N', 'complication', '消化道出血小队', '终末期关怀', 'gi_bleed', {
    admins: getQRs(1),
    adminIds: ['pandur007']
  }),

  // CO: 梗阻 -> 类似出血/急症，暂用 pandur007 或 Lazio724 (这里用 pandur007)
  mockNode('CO', 'complication', '消化道梗阻小队', '梗阻处理指导', 'gi_obstruct', {
    admins: getQRs(1),
    adminIds: ['pandur007']
  }),

  // CI: 感染 -> 对应 "并发症-感染小队" (s866838)
  mockNode('CI', 'complication', '感染并发症小队', '感染控制指导', 'infect_care', {
    admins: getQRs(1),
    adminIds: ['s866838']
  }),
];

// --- 3. 心理支持主线 ---
// O/O_PC: 心理/安宁 -> 对应 "安宁疗护群" & "小馨宝" (weibo1322218790)
const PSYCH_ADMINS = {
  admins: getQRs(1),
  adminIds: ['weibo1322218790']
};

const PSYCH_NODES: JourneyNode[] = [
  mockNode('O', 'psychological', '心理互助群', '同病种经验分享', 'psy_mutual', PSYCH_ADMINS),
  mockNode('O_PC', 'psychological', '微光成炬-安宁闪耀', '安宁疗护/生命关怀', 'hospice_care', PSYCH_ADMINS),
];

// --- 4. 营养管理主线 ---
// P/Q: 营养 -> 对应 "营养快线小队" (cfzrij/wxid_xvgvlugpx6tk12)
const NUTRI_ADMINS = {
  admins: getQRs(2),
  adminIds: ['cfzrij', 'wxid_xvgvlugpx6tk12']
};

const NUTRI_NODES: JourneyNode[] = [
  mockNode('P', 'nutrition', '治疗期营养群', '放化疗饮食调理', 'tx_diet', NUTRI_ADMINS),
  mockNode('Q', 'nutrition', '康复期营养群', '治疗后体质恢复', 'recover_diet', NUTRI_ADMINS),
];

// --- 5. 地域病友分支 ---
export const REGIONAL_NODES: JourneyNode[] = [
  // RE1: 华东 -> 对应 "江浙沪徽&新疆西藏群" (xiaomenglu0929/Lazio724)
  mockNode('RE1', 'regional', '微光成炬-华东PRO群', '按地域同行互助', 'region_east', {
    admins: getQRs(2),
    adminIds: ['xiaomenglu0929', 'Lazio724']
  }),
  // RE2: 燕赵 -> 对应 "京津/山河四省群" (zhjing0220)
  mockNode('RE2', 'regional', '微光成炬-燕赵PRO群', '按地域同行互助', 'region_north', {
    admins: getQRs(1),
    adminIds: ['zhjing0220']
  }),
  // RE3: 湾区 -> 对应 "大湾区群" (christinechen0705)
  mockNode('RE3', 'regional', '微光成炬-湾区病友基础群', '按地域同行互助', 'region_bay', {
    admins: getQRs(1),
    adminIds: ['christinechen0705']
  }),
  // RE4: 西南 -> 对应 "西南区域群" (qinxiaoqiang2002)
  mockNode('RE4', 'regional', '微光成炬-西南病友基础群', '按地域同行互助', 'region_west', {
    admins: getQRs(1),
    adminIds: ['qinxiaoqiang2002']
  }),
];

// --- 6. 三甲医院专属群 ---
export const HOSPITAL_NODES: JourneyNode[] = [
  // R: 复肿 -> 位于上海，复用华东/临床管理 (xiaomenglu0929/Lazio724)
  mockNode('R', 'hospital', '复肿 & 小胰宝患者公益群', '携手蓝马甲服务患者关怀', 'fudan_help', {
    admins: getQRs(2),
    adminIds: ['xiaomenglu0929', 'Lazio724']
  }),
  // S: 金医生 -> 对应 "金医生&小胰宝社群" (reniforever/wxid_mqtfn70j44io21)
  mockNode('S', 'hospital', '金医生 & 小胰宝患者公益群', '携手蓝马甲服务患者关怀', 'doc_jin_help', {
    admins: getQRs(2),
    adminIds: ['reniforever', 'wxid_mqtfn70j44io21']
  }),
  // T: 中山 -> 位于上海，复用华东管理 (xiaomenglu0929/Lazio724)
  mockNode('T', 'hospital', '上海中山 & 小胰宝患者公益群', '携手蓝马甲服务患者关怀', 'zhongshan_help', {
    admins: getQRs(2),
    adminIds: ['xiaomenglu0929', 'Lazio724']
  }),
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
