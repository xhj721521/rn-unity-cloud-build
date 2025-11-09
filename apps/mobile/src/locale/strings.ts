export type TemplateParams = Record<string, string | number>;

const zhCN = {
  'my.cta.invite': '邀请队友',
  'my.cta.export': '导出战报',
  'my.cta.viewAll': '查看全部',
  'my.network.stable': '网络：稳定',
  'my.hero.title': '指挥中心 · {name}',
  'my.hero.subtitle': 'Pilot Zero',
  'my.hero.level': 'Lv.{level}',
  'my.hero.asset.arc': 'ARC',
  'my.hero.asset.ore': '矿石',
  'my.stats.section': '作战指标',
  'my.stats.miners': '矿工',
  'my.stats.miners.active': '在岗 {active} / {total}',
  'my.stats.nft': 'NFT',
  'my.stats.nft.subtitle': '装备完好',
  'my.stats.maps': '地图（已解锁）',
  'my.stats.maps.subtitle': '完成度',
  'my.stats.maps.value': '{unlocked} / {total}',
  'my.stats.shards.rare': '稀有碎片',
  'my.stats.shards.subtitle': 'Rare Shards',
  'my.stats.chain': '链鉴中心',
  'my.stats.chain.subtitle': '链上数据中枢',
  'my.matrix.section': '功能矩阵',
  'my.entry.team.title': '我的团队',
  'my.entry.team.desc': '成员状态与权益',
  'my.entry.storage.title': '我的仓库',
  'my.entry.storage.desc': '装备与 NFT',
  'my.entry.invite.title': '我的邀请',
  'my.entry.invite.desc': '邀请好友同行',
  'my.entry.member.title': '会员中心',
  'my.entry.member.desc': '尊享特权服务',
  'my.entry.member.badge.inactive': '非会员',
  'my.entry.member.badge.active': 'VIP',
  'my.entry.reports.title': '战报中心',
  'my.entry.reports.desc': '查看作战记录',
  'my.entry.highlights.title': '收藏亮点',
  'my.entry.highlights.desc': '保留精彩时刻',
  'my.highlights.section': '收藏亮点',
  'my.highlights.tag.collect': '收藏',
  'my.highlights.tag.report': '战报',
  'my.highlights.tag.reward': '奖励',
  'my.highlights.viewAll': '查看全部',
  'my.highlights.empty': '暂无收藏，稍后回来看看。',
  'my.highlights.mock1': '星际军械 Lv.3',
  'my.highlights.mock2': '战术演练 · Alpha',
  'my.highlights.mock3': '量化勋章 · ARC x80',
  'my.banner.kyc': '未实名，部分功能受限（提现、会员升级等）',
  'my.banner.kyc.cta': '去实名',
  'my.settings.section': '系统设置',
  'my.settings.kyc': '实名信息 KYC',
  'my.settings.language': '语言 Language',
  'my.settings.language.status': '当前：{lang}',
  'my.settings.notifications': '通知与战报推送',
  'my.settings.theme': '个性化外观主题',
  'my.settings.records': '资金记录',
  'my.settings.soon': '即将上线',
  'settings.title': '系统与支持',
  'settings.preferences': '偏好设置',
  'settings.account': '账户与资产',
  'settings.contact': '联系我们',
  'settings.contact.error': '无法打开链接，请稍候重试',
  'member.title': '会员中心',
  'member.non': '非会员',
  'member.status': '当前状态：{status}',
  'member.vip': '会员',
  'member.perks': '权益：掉率加成 / 盲盒折扣 / 专属头像框',
  'member.cta': '立即开通',
  'wallet.title': '资产中心',
  'wallet.topup': '充值',
  'wallet.withdraw': '提现',
  'wallet.history': '资金记录',
  'wallet.notice': '提现需实名。当前状态：{status}',
  'wallet.settle': '当日18:00统一结算',
  'wallet.empty': '还没有流水，完成一笔操作后即可查看。',
  'wallet.topup.desc': '支持链上/法币快速充值，后续版本开放。',
  'wallet.withdraw.desc': '提现将在实名通过后开放，可设定 18:00 统一结算。',
  'wallet.history.desc': '流水会在充值/提现后出现，当前暂无记录。',
  'reports.title': '战报中心',
  'reports.desc': '接入链上战报前，暂以示例条目占位。',
  'reports.cta': '导出战报',
  'reports.alert': '链上报表仍在整理，敬请期待。',
  'highlights.title': '收藏亮点',
  'highlights.desc': '未来将展示来自 Unity 的高光瞬间。',
  'kyc.title': '实名信息',
  'kyc.desc': '完成实名即可开通提现与会员升级。',
  'kyc.cta': '开始认证',
  'kyc.alert': 'KYC SDK 集成中，请稍后再试。',
  'kyc.alert.title': '实名流程',
  'my.language.sheetTitle': '选择语言',
  'my.language.toast': '语言切换功能将在后续版本上线。',
  'my.placeholder.entrySoon': '该入口即将上线，敬请期待。',
  'member.alert': '会员购买通道即将开启。',
  'my.error.title': '暂时无法加载我的数据',
  'common.notice': '提示',
  'common.cancel': '取消',
} as const;

export type LocaleKey = keyof typeof zhCN;

const dictionary: Record<string, string> = zhCN;

const formatTemplate = (template: string, params?: TemplateParams) => {
  if (!params) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    if (params[token] === undefined || params[token] === null) {
      return '';
    }
    return String(params[token]);
  });
};

export const translate = (key: LocaleKey | string, params?: TemplateParams, fallback?: string) => {
  const template = dictionary[key] ?? fallback ?? key;
  return formatTemplate(template, params);
};

export const supportedLanguages = ['zh-CN', 'en', 'vi', 'ms', 'th', 'ar', 'pt-BR'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const languageLabels: Record<SupportedLanguage, string> = {
  'zh-CN': '简体中文',
  en: 'English',
  vi: 'Tiếng Việt',
  ms: 'Bahasa Melayu',
  th: 'ไทย',
  ar: 'العربية',
  'pt-BR': 'Português (BR)',
};
