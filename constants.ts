
import type { JourneyNode, TrackDefinition } from './types';

// Helper to create nodes easily
const mockNode = (
  id: string, 
  category: JourneyNode['category'], 
  title: string, 
  subtitle: string, 
  wechatId: string
): JourneyNode => ({
  id,
  category,
  title,
  subtitle,
  wechatId,
  description: `扫描二维码加入【${title}】互助群，与病友交流经验，获取专业护理建议。`
});

export const INITIAL_NODES: JourneyNode[] = [
  mockNode('A', 'clinical', '早期/未确诊', '筛查诊断建议', 'zs_screen_01'),
  mockNode('B', 'psychological', '心理支持', '确诊期焦虑缓解', 'zs_psy_01'),
  mockNode('C', 'nutrition', '营养初筛', '基础饮食评估', 'zs_nutri_01'),
];

export const TRACKS: TrackDefinition[] = [
  {
    id: 'clinical',
    title: '临床治疗主线',
    description: '从确诊到各阶段治疗方案指引',
    theme: {
      bg: 'bg-blue-600',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'text-blue-600',
      lightBg: 'bg-blue-50',
    },
    nodes: [
      mockNode('D', 'clinical', '病理诊断', '分期与分子病理', 'zs_diag_01'),
      mockNode('E', 'clinical', '手术/化疗', '围术期与辅助化疗', 'zs_surg_01'),
      mockNode('F', 'clinical', '靶向/免疫', '进阶药物治疗', 'zs_target_01'),
      mockNode('G', 'clinical', '复发/耐药', '后线治疗方案', 'zs_adv_01'),
    ]
  },
  {
    id: 'molecular',
    title: '基因突变分型',
    description: '基于基因检测报告的精准圈层',
    theme: {
      bg: 'bg-purple-600',
      border: 'border-purple-200',
      text: 'text-purple-700',
      icon: 'text-purple-600',
      lightBg: 'bg-purple-50',
    },
    nodes: [
      mockNode('H', 'molecular', 'KRAS-G12D', '常见突变交流', 'zs_g12d_01'),
      mockNode('I', 'molecular', 'KRAS-G12V', '常见突变交流', 'zs_g12v_01'),
      mockNode('J', 'molecular', 'KRAS 其他', '少见/非典型突变', 'zs_rare_01'),
      mockNode('K', 'molecular', 'TP53/APC', '常见合并突变', 'zs_p53_01'),
      mockNode('L', 'molecular', 'HER2/MSI', '特定靶点与免疫', 'zs_her2_01'),
    ]
  },
  {
    id: 'complication',
    title: '并发症管理',
    description: '常见副作用与急症护理',
    theme: {
      bg: 'bg-orange-500',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: 'text-orange-600',
      lightBg: 'bg-orange-50',
    },
    nodes: [
      mockNode('M', 'complication', '癌痛管理', '疼痛评估与用药', 'zs_pain_01'),
      mockNode('N', 'complication', '消化道出血', '预防与紧急处理', 'zs_bleed_01'),
      mockNode('O', 'complication', '肠梗阻', '胃肠减压与护理', 'zs_obstruct_01'),
      mockNode('CI', 'complication', '感染发热', '抗感染治疗护理', 'zs_infect_01'),
    ]
  },
  {
    id: 'nutrition',
    title: '全病程营养',
    description: '治疗期与康复期的饮食规划',
    theme: {
      bg: 'bg-emerald-500',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      icon: 'text-emerald-600',
      lightBg: 'bg-emerald-50',
    },
    nodes: [
      mockNode('P', 'nutrition', '治疗期营养', '升白/改善食欲', 'zs_nutri_tx'),
      mockNode('Q', 'nutrition', '康复期营养', '防复发/健康管理', 'zs_nutri_re'),
    ]
  },
  {
    id: 'psychological',
    title: '心理疗愈',
    description: '情绪疏导与家庭支持',
    theme: {
      bg: 'bg-rose-500',
      border: 'border-rose-200',
      text: 'text-rose-700',
      icon: 'text-rose-600',
      lightBg: 'bg-rose-50',
    },
    nodes: [
      mockNode('PS', 'psychological', '正念减压', '改善睡眠与情绪', 'zs_mind_01'),
      mockNode('PE', 'psychological', '家属互助', '照护者心理支持', 'zs_family_01'),
    ]
  },
];

export const REGIONAL_NODES: JourneyNode[] = [
  mockNode('RE1', 'regional', '华东互助圈', '上海/江苏/浙江', 'zs_east_01'),
  mockNode('RE2', 'regional', '华北互助圈', '北京/天津/河北', 'zs_north_01'),
  mockNode('RE3', 'regional', '大湾区互助', '广东/深圳/香港', 'zs_bay_01'),
  mockNode('RE4', 'regional', '西南互助圈', '四川/重庆/云南', 'zs_sw_01'),
];

export const HOSPITAL_NODES: JourneyNode[] = [
  mockNode('R', 'hospital', '复旦肿瘤', '就医流程与互助', 'zs_fudan_01'),
  mockNode('S', 'hospital', '瑞金/长海', '胰腺专科交流', 'zs_ruijin_01'),
];
