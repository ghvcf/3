/* ==========================================================================
   data.js —— 站点静态数据（岗位 / 术语 / 站点信息）
   说明：岗位为「示例数据」，依据 JobsDB、LinkedIn、Indeed 上公开 JD 的常见
   结构与措辞编写，用于演示界面与匹配逻辑，并非真实在招职位。
   ========================================================================== */

const SITE = {
  name: '职桥 JobBridge',
  tagline: '港硕内地生跨境求职助手',
  version: '0.9 演示版'
};

/* --------------------------------------------------------------------------
   岗位数据
   字段：id / title / company / sector / loc / type / salary / salaryMin /
        posted / source / lang / fresh / skills / tags / jd
   -------------------------------------------------------------------------- */
const JOBS = [
  {
    id: 'J01',
    title: '数据分析师 Graduate Data Analyst',
    company: '汇凯金融科技',
    sector: '金融',
    loc: '金钟',
    type: '全职',
    salary: 'HK$22,000–28,000',
    salaryMin: 22000,
    posted: '今天',
    source: 'JobsDB',
    lang: ['普通话', '英语', '粤语（优先）'],
    fresh: true,
    skills: ['Excel', 'SQL', 'Python', 'Tableau', '数据分析'],
    tags: ['应届可投', 'IANG 欢迎', '五天工作', '有花红'],
    jd: `职位：数据分析师（应届 / Graduate Data Analyst）
部门：风险管理及数据分析
工作地点：金钟

主要职责：
1. 从核心系统提取并按日／周维护业务数据，使用 SQL 与 Python 完成清洗与自动化报表；
2. 用 Tableau 制作管理层仪表板，每月与业务部门「睇数」，解释指标波动原因；
3. 协助建立客户分层模型，输出 KPI 追踪表并跟进异常；
4. 与 IT、合规、前线团队沟通需求，撰写简要分析文档。

任职要求：
- 统计学、数据科学、商科或相关学科本科或硕士学历；
- 熟悉 Excel（pivot table、VLOOKUP）与 SQL，会 Python 或 R 者优先；
- 良好的中英文书写能力，能以粤语沟通者为 advantage；
- 欢迎持 IANG 签证的应届毕业生申请，公司可协助办理工作签注；
- 细心、主动，能在期限内独立交付。

薪酬及福利：月薪 HK$22,000–28,000；年终酌情花红（discretionary bonus）；
医疗保险；MPF；5 天工作；试用期 3 个月。`
  },
  {
    id: 'J02',
    title: '市场营销助理 Marketing Assistant',
    company: '澄明零售集团',
    sector: '市场',
    loc: '尖沙咀',
    type: '全职',
    salary: 'HK$18,000–22,000',
    salaryMin: 18000,
    posted: '昨天',
    source: 'LinkedIn',
    lang: ['普通话', '粤语', '英语'],
    fresh: true,
    skills: ['社交媒体', '小红书', '文案', 'Photoshop', 'GA4'],
    tags: ['应届可投', '内容方向', '需周末活动'],
    jd: `职位：市场营销助理 Marketing Assistant（社交媒体）
工作地点：尖沙咀

主要职责：
- 负责小红书、Instagram 及微信视频号的内容策划与发布，每月产出 12–16 条图文／短视频；
- 撰写中文文案，配合设计师完成素材 brief，必要时参与拍摄与剪辑；
- 使用 GA4 与后台数据复盘内容表现，每星期 report 一次；
- 协助 KOL 合作洽谈、寄样与内容审核；
- 支援线下活动落地（每月 1–2 次，多在周末）。

任职要求：
- 市场、传播、中文或相关学科毕业，欢迎应届生；
- 熟悉小红书／抖音生态，有个人账号运营经验者优先；
- 具备基础 Photoshop 或 Canva 能力；
- 良好中文书写，英文能读能写；
- 能接受活动期间加班（OT 可补假）。

薪酬：HK$18,000–22,000；试用期 3 个月；医疗福利。`
  },
  {
    id: 'J03',
    title: '管理培训生 Management Trainee 2026',
    company: '恒泰银行（香港）',
    sector: '金融',
    loc: '中环',
    type: '全职',
    salary: 'HK$25,000–32,000',
    salaryMin: 25000,
    posted: '2 天前',
    source: 'JobsDB',
    lang: ['普通话', '英语'],
    fresh: true,
    skills: ['金融', '沟通', '项目管理', 'Excel'],
    tags: ['应届可投', '轮岗 18 个月', '需在港工作资格'],
    jd: `职位：管理培训生 Management Trainee（2026 届）
工作地点：中环

计划内容：
- 18 个月轮岗：零售银行、企业银行、风险管理、数码渠道各 4–5 个月；
- 轮岗期间需完成指定项目并作结项汇报（presentation）；
- 需通过内部考核（KPI 与行为评估）方可定岗。

任职要求：
- 大学本科或以上，任何学科，2025／2026 年毕业；
- 中英文流利，普通话必需，粤语可于入职后培训；
- 具领导潜质、抗压能力与团队协作经验；
- 需持有效在港工作资格（IANG 或受养人签证）。

薪酬及福利：HK$25,000–32,000；年终花红；五天工作；14 天年假（AL）；医疗保险。`
  },
  {
    id: 'J04',
    title: '供应链专员 Supply Chain Officer',
    company: '百川国际物流',
    sector: '供应链',
    loc: '葵涌',
    type: '全职',
    salary: 'HK$20,000–25,000',
    salaryMin: 20000,
    posted: '3 天前',
    source: 'Indeed',
    lang: ['普通话', '英语'],
    fresh: false,
    skills: ['供应链', '采购', '库存管理', '报关', 'SAP', 'Excel'],
    tags: ['需 2 年经验', '需出差', '双粮'],
    jd: `职位：供应链专员 Supply Chain Officer
工作地点：葵涌

主要职责：
- 跟进海外供应商订单，处理采购、报关文件与到货安排；
- 使用 SAP 维护库存数据，每周「埋数」并与仓库核对差异；
- 与内地工厂及香港仓沟通，需以普通话及简单英语往来邮件；
- 制作库存周转与成本分析报表（Excel 为主）。

任职要求：
- 物流、供应链、国际贸易或商科背景；
- 2 年以上相关经验，熟悉进出口流程者优先；
- 细心、责任心强，能同时处理多张订单；
- 需偶尔「出 trip」到东莞／深圳工厂（每月 1–2 次）。

薪酬：HK$20,000–25,000；双粮（13th month）；医疗福利；银行假。`
  },
  {
    id: 'J05',
    title: '教育科技产品助理 Product Assistant',
    company: '启学科技',
    sector: '教育',
    loc: '观塘',
    type: '全职',
    salary: 'HK$18,000–24,000',
    salaryMin: 18000,
    posted: '4 天前',
    source: 'LinkedIn',
    lang: ['粤语', '普通话', '英语'],
    fresh: true,
    skills: ['产品设计', '需求文档', '用户研究', 'Figma', '数据分析', '课程设计'],
    tags: ['应届可投', 'STEM 方向', '弹性上班'],
    jd: `职位：教育科技产品助理 Product Assistant（EdTech）
工作地点：观塘

主要职责：
- 协助设计中学 STEM 课程配套的数码学习工具，撰写需求文档（PRD）与用户流程；
- 与教师用户访谈，整理课堂使用反馈，转化为产品迭代清单；
- 使用 Figma 完成低保真原型，配合工程团队验收；
- 分析平台使用数据（完成率、停留时间），每月出一次 report。

任职要求：
- 教育、心理、计算机或相关学科毕业，对教学设计有基本理解；
- 会用 Figma 或同类工具，能写清楚的需求文档；
- 具备数据分析基础（Excel 必须，SQL 加分）；
- 粤语流利（需进入学校与老师沟通）。

薪酬：HK$18,000–24,000；弹性上班；14 天 AL；医疗福利。`
  },
  {
    id: 'J06',
    title: '合规助理 Compliance Assistant',
    company: '骏升证券',
    sector: '专业服务',
    loc: '中环',
    type: '全职',
    salary: 'HK$22,000–28,000',
    salaryMin: 22000,
    posted: '5 天前',
    source: 'JobsDB',
    lang: ['英语', '普通话'],
    fresh: true,
    skills: ['合规', 'KYC', 'AML', 'IFRS', '英语'],
    tags: ['应届可投', '金融合规', '五天工作'],
    jd: `职位：合规助理 Compliance Assistant
工作地点：中环

主要职责：
- 协助执行 KYC 与客户尽职审查（CDD），整理开户文件；
- 按内部指引筛查可疑交易，撰写并提交 AML 报告；
- 维护合规台账，跟进监管条例更新（SFC、HKMA 通函）；
- 支援内部审计与培训材料准备。

任职要求：
- 法律、金融、会计或商科背景，应届可；
- 熟悉基本金融产品与监管框架，认识 IFRS 与 HKFRS 者优先；
- 英文书写严谨，中文表达清楚；
- 细心、守时，能处理大量文件而不出错。

薪酬：HK$22,000–28,000；年终花红；医疗保险；MPF。`
  },
  {
    id: 'J07',
    title: '社交媒体营运 Social Media Executive',
    company: '原色创意代理',
    sector: '市场',
    loc: '湾仔',
    type: '全职',
    salary: 'HK$16,000–20,000',
    salaryMin: 16000,
    posted: '1 周前',
    source: 'Indeed',
    lang: ['粤语', '普通话'],
    fresh: false,
    skills: ['社交媒体', '剪辑', '文案', 'SEO', 'KOL', 'Premiere'],
    tags: ['需作品集', '代理商节奏', '周末拍摄'],
    jd: `职位：社交媒体营运 Social Media Executive
工作地点：湾仔

主要职责：
- 独立营运客户品牌账号（IG、Facebook、小红书），每周 5–8 条内容；
- 拍摄及剪辑 15–60 秒短视频，使用 Premiere 或 CapCut；
- 配合 SEO／SEM 团队优化落地页文案；
- 与 KOL 及媒体对接，跟进报价与排期；
- 每周提交数据报告（触达、互动率、转化）。

任职要求：
- 1 年以上社交媒体经验，应届但有作品集可考虑；
- 熟悉剪辑与基础设计，能独立完成一条龙内容；
- 中文创意文案能力强，英文可日常沟通；
- 需接受不定期周末拍摄。

薪酬：HK$16,000–20,000；按表现发放花红。`
  },
  {
    id: 'J08',
    title: '研究助理 Research Assistant',
    company: '香港中文大学 教育研究项目',
    sector: '教育',
    loc: '沙田',
    type: '合约',
    salary: 'HK$18,000–22,000',
    salaryMin: 18000,
    posted: '1 周前',
    source: 'LinkedIn',
    lang: ['普通话', '英语'],
    fresh: true,
    skills: ['Python', 'R', 'SPSS', '数据分析', '数据可视化', '英语'],
    tags: ['合约 12 个月', '可续约', '约满酬金'],
    jd: `职位：研究助理 Research Assistant（合约 12 个月，可续约）
工作地点：沙田

主要职责：
- 支援教育数据研究项目，负责数据清理、描述统计与可视化；
- 使用 Python 或 R 处理学习平台日志，用 SPSS 做问卷分析；
- 协助撰写研究论文与报告，整理文献；
- 与教授及研究团队定期开会，汇报进度。

任职要求：
- 硕士或以上，教育、心理、统计、计算机相关；
- 熟悉至少一种统计工具（R／Python／SPSS）；
- 英文读写能力强，能独立阅读英文文献；
- 有量化研究经验者优先。

薪酬：HK$18,000–22,000（按经验）；约满酬金（gratuity）；MPF；14 天 AL。`
  },
  {
    id: 'J09',
    title: 'UX/UI 设计实习生',
    company: '邻里生活 App（初创）',
    sector: '科技',
    loc: '数码港',
    type: '实习',
    salary: 'HK$8,000–12,000／月',
    salaryMin: 8000,
    posted: '2 天前',
    source: 'Indeed',
    lang: ['粤语', '普通话'],
    fresh: true,
    skills: ['Figma', '用户研究', '产品设计'],
    tags: ['每周 3 天', '在读可投', '有作品集要求'],
    jd: `职位：UX/UI 设计实习生（3–6 个月）
工作地点：数码港

主要职责：
- 参与本地生活服务 App 的用户研究与界面设计；
- 使用 Figma 制作 wireframe 与高保真稿，维护设计组件库；
- 协助整理用户访谈记录与可用性测试结果；
- 与产品经理、工程师沟通设计落地细节。

任职要求：
- 设计、传播、计算机或相关学科在读；
- 熟练 Figma，了解基础交互原则；
- 必须有作品集（课程作业亦可）；
- 粤语沟通优先（用户访谈多为本地用户）。

津贴：每月 HK$8,000–12,000；每周至少 3 天；表现良好可转兼职留用。`
  },
  {
    id: 'J10',
    title: '审计助理 Audit Associate',
    company: '四大会计师事务所（香港）',
    sector: '专业服务',
    loc: '中环',
    type: '全职',
    salary: 'HK$20,000–24,000',
    salaryMin: 20000,
    posted: '6 天前',
    source: 'JobsDB',
    lang: ['英语', '粤语'],
    fresh: true,
    skills: ['审计', '会计', 'IFRS', 'Excel', '英语', 'HKICPA'],
    tags: ['应届可投', '考试假', '旺季高强度加班'],
    jd: `职位：审计助理 Audit Associate（2026 入职）
工作地点：中环

主要职责：
- 参与上市公司及跨国企业年度审计，执行实质性测试；
- 编制工作底稿（working paper），核对 HKFRS 与 IFRS 报表披露；
- 与客户财务团队沟通差异，跟进调整事项；
- 使用 Excel 处理大额数据抽样。

任职要求：
- 会计、金融、商科本科或以上；
- 通过 HKICPA 或 ACCA 部分科目者优先；
- 英文书写准确，能阅读英文准则；
- 旺季（1–4 月）需接受高强度加班，晚上及周末工作常见。

薪酬：HK$20,000–24,000；考试假；医疗；MPF；第五年可考虑晋升 Senior。`
  },
  {
    id: 'J11',
    title: '商务拓展 BD Executive',
    company: '择优跨境电商',
    sector: '市场',
    loc: '荃湾',
    type: '全职',
    salary: 'HK$18,000 + 佣金',
    salaryMin: 18000,
    posted: '3 天前',
    source: 'LinkedIn',
    lang: ['普通话', '英语'],
    fresh: false,
    skills: ['BD', '销售', '商务谈判', 'CRM', '项目管理'],
    tags: ['目标导向', '佣金制', '需出差'],
    jd: `职位：商务拓展 BD Executive（跨境电商）
工作地点：荃湾

主要职责：
- 开发内地及东南亚品牌客户，完成签约与上架；
- 以底薪加佣金形式计算收入，月目标由 KPI 决定，需定期「跑数」；
- 与内地客户以普通话沟通，「出 trip」到深圳、广州拜访；
- 维护 CRM 记录，每周向主管提交 pipeline 报告。

任职要求：
- 1–3 年销售或 BD 经验，应届生须证明销售能力；
- 普通话流利，英文可沟通，粤语非必需；
- 抗压、外向、目标导向。

薪酬：底薪 HK$18,000 + 佣金（收入约 40% 来自 commission only 部分，上不封顶）；
试用期首月不设佣金保障。`
  },
  {
    id: 'J12',
    title: '行政助理 Admin Assistant',
    company: '永安保险顾问',
    sector: '行政',
    loc: '旺角',
    type: '全职',
    salary: 'HK$15,000–17,000',
    salaryMin: 15000,
    posted: '1 周前',
    source: 'Indeed',
    lang: ['粤语'],
    fresh: true,
    skills: ['Excel', '客户服务', '文案'],
    tags: ['粤语必须', '五天半', '入门岗位'],
    jd: `职位：行政助理 Admin Assistant
工作地点：旺角

主要职责：
- 处理日常文书、档案管理与会议安排；
- 接听电话及接待访客，需以粤语应对本地客户；
- 协助部门处理报销、采购与办公室物资；
- 支援上司临时交办事项，一人多岗情况常见。

任职要求：
- 中五或以上学历，熟悉 MS Office；
- 粤语必须，普通话及英文可沟通；
- 细心、有耐性，能接受重复性工作。

薪酬：HK$15,000–17,000；五天半工作（5.5 days）；银行假；MPF。
备注：急聘，能即时到岗（immediately available）者优先。`
  },
  {
    id: 'J13',
    title: '人力资源助理 HR Assistant',
    company: '鸿图集团',
    sector: '行政',
    loc: '九龙湾',
    type: '全职',
    salary: 'HK$17,000–21,000',
    salaryMin: 17000,
    posted: '4 天前',
    source: 'JobsDB',
    lang: ['粤语', '普通话', '英语'],
    fresh: true,
    skills: ['HR', '招聘', 'Excel', '沟通'],
    tags: ['应届可投', '五天工作', '14 天年假'],
    jd: `职位：人力资源助理 HR Assistant
工作地点：九龙湾

主要职责：
- 负责招聘流程：发布 JD、筛选 CV、安排面试、跟进 offer；
- 维护员工档案与假期记录，协助计粮与 MPF 申报；
- 使用 HRIS 或 Excel 制作人力报表；
- 筹办员工活动与培训。

任职要求：
- 人力资源、心理、商科背景，应届可；
- 熟悉香港《雇佣条例》基本规定者优先；
- 中英文书写良好，粤语沟通流利；
- 细心、保密意识强。

薪酬：HK$17,000–21,000；14 天 AL；医疗；五天工作。`
  },
  {
    id: 'J14',
    title: 'AI 应用开发实习生',
    company: '深蓝智能 DeepBlue AI',
    sector: '科技',
    loc: '科学园',
    type: '实习',
    salary: 'HK$10,000–14,000／月',
    salaryMin: 10000,
    posted: '今天',
    source: 'LinkedIn',
    lang: ['普通话', '英语'],
    fresh: true,
    skills: ['Python', 'LLM', 'NLP', 'Git', '机器学习'],
    tags: ['每周 3–5 天', '可转正', 'LLM 项目'],
    jd: `职位：AI 应用开发实习生
工作地点：科学园

主要职责：
- 参与构建面向客户的对话式助手，接入 LLM API 并调优提示；
- 使用 Python 做数据预处理与效果评估，维护简单的前端界面；
- 以 Git 协作开发，参与每周代码评审；
- 撰写技术文档与实验记录。

任职要求：
- 计算机、数据科学、电子工程相关学科在读或应届；
- 熟悉 Python，了解 NLP／LLM 基础概念；
- 有个人项目或 GitHub 作品者优先；
- 英文阅读能力良好。

津贴：HK$10,000–14,000／月；每周 3–5 天；表现良好可转正。`
  },
  {
    id: 'J15',
    title: '中英翻译／内容编辑',
    company: '山海出版',
    sector: '教育',
    loc: '北角',
    type: '合约',
    salary: '时薪 HK$120–150',
    salaryMin: 120,
    posted: '5 天前',
    source: 'Indeed',
    lang: ['中文', '英语'],
    fresh: false,
    skills: ['翻译', '文案', '英语'],
    tags: ['合约 6 个月', '按项目结算', '无医疗福利'],
    jd: `职位：中英翻译／内容编辑（合约 6 个月）
工作地点：北角（可部分远程）

主要职责：
- 翻译市场推广材料、新闻稿与网站内容（中英双向）；
- 校对英文文案，确保语气与品牌一致；
- 协助整理术语表，维护翻译记忆库；
- 按项目计，需在期限内交付。

任职要求：
- 翻译、语言、新闻或相关学科毕业；
- 中英文俱佳，具 CAT 工具经验者优先；
- 细心，能接受反复修改；
- 可即时到岗（immediately available）者优先。

薪酬：时薪 HK$120–150；按项目结算；无医疗福利；不提供工作签证担保。`
  }
];

/* --------------------------------------------------------------------------
   术语库：t 术语 / cat 分类 / zh 中文释义 / ex 语境示例 / tip 港硕应对建议
   -------------------------------------------------------------------------- */
const TERMS = [
  /* ---- 缩写 ---- */
  { t: 'JD', cat: '缩写', zh: '职位描述（Job Description）', ex: '“Please quote the JD reference number in your application.”', tip: '把 JD 存成 PDF，逐条对照自己的经历写履历；面试前用 JD 关键词练习自我介绍。' },
  { t: 'CV', cat: '缩写', zh: '履历（Curriculum Vitae），香港多指 1–2 页的简历', ex: '“Send your CV and expected salary to hr@company.com.”', tip: '香港履历通常附照片、列明签证状态与到岗时间；写「expected salary」时给区间而非单点。' },
  { t: 'KPI', cat: '缩写', zh: '关键绩效指标（Key Performance Indicator）', ex: '“Your KPI includes monthly sales volume and customer retention.”', tip: '面试时被问 KPI，要能说清「指标—我的动作—结果」三段，而不是只报数字。' },
  { t: 'OKR', cat: '缩写', zh: '目标与关键结果（Objectives and Key Results）', ex: '“The team sets OKRs every quarter.”', tip: '初创与科技公司常用；回答时可把课业项目包装成「目标＋可量化结果」。' },
  { t: 'ASAP', cat: '缩写', zh: '尽快（As Soon As Possible）', ex: '“Please reply ASAP.”', tip: '港式邮件高频词；回信时给出具体时间点（如「今日 6 点前」）比只说 ASAP 更专业。' },
  { t: 'COB', cat: '缩写', zh: '下班前（Close of Business），通常指当日 18:00 前', ex: '“Please send the file by COB Friday.”', tip: '等同「今日收工前」；若来不及，提前半天说明并给新时间。' },
  { t: 'EOD', cat: '缩写', zh: '今日结束前（End of Day）', ex: '“I need the draft by EOD.”', tip: '与 COB 近似，但 EOD 可延到深夜，港企加班文化下常见。' },
  { t: 'FYI', cat: '缩写', zh: '供你参考（For Your Information）', ex: '“FYI, the client changed the deadline.”', tip: '只作告知、不需回复；若要对方行动，应写「Action required」。' },
  { t: 'CC', cat: '缩写', zh: '抄送（Carbon Copy）', ex: '“Please CC your supervisor.”', tip: '香港职场极重视抄送礼仪：越级沟通前先 CC 直属上司。' },
  { t: 'OT', cat: '缩写', zh: '加班（Overtime）', ex: '“OT is expected during peak season.”', tip: '面试务必问清「OT 有无补假或津贴」；写进合约的补假安排才算数。' },
  { t: 'AL', cat: '缩写', zh: '年假（Annual Leave）', ex: '“14 days AL plus medical coverage.”', tip: '香港法定年假最低 7 天，14 天属中上水平；留意「试用期内不可放 AL」的条款。' },
  { t: 'WFH', cat: '缩写', zh: '居家办公（Work From Home）', ex: '“Hybrid model: 2 days WFH per week.”', tip: '问清 WFH 是否写入合约，以及是否需自备电脑（BYOD）。' },
  { t: 'MPF', cat: '薪酬福利', zh: '强制性公积金，雇主与雇员各供款 5%', ex: '“MPF and medical insurance provided.”', tip: '月薪低于 HK$7,100 雇员免供、雇主仍须供；实习与合约岗位也要确认是否供 MPF。' },
  { t: 'HKID', cat: '缩写', zh: '香港身份证（Hong Kong Identity Card）', ex: '“HKID holders preferred.”', tip: '「HKID holder」通常暗示只招本地居民；持 IANG 者有 HKID 但属非永久居民，投递前先确认。' },
  { t: 'IANG', cat: '薪酬福利', zh: '非本地毕业生留港／回港就业安排（Immigration Arrangements for Non-local Graduates）', ex: '“IANG graduates are welcome to apply.”', tip: '港硕毕业可申请 24 个月 IANG 签注，不受行业与配额限制；求职时主动说明「可自行办理 IANG」。' },
  { t: 'TTPS', cat: '薪酬福利', zh: '高端人才通行证计划（「高才通」）', ex: '“Candidates under TTPS are also considered.”', tip: '面向高学历／高收入人才，获批后 24 个月在港工作不受限；与 IANG 不冲突，按自身条件选一。' },
  { t: 'QMAS', cat: '薪酬福利', zh: '优秀人才入境计划（「优才」）', ex: '“QMAS quota is granted on a points-based system.”', tip: '需计分与审批，周期长；应届港硕一般走 IANG 更快。' },
  { t: 'SFC', cat: '金融合规', zh: '证券及期货事务监察委员会（香港证监会）', ex: '“Ensure licensing compliance with SFC requirements.”', tip: '投金融岗前查清职位是否属「受规管活动」，需否持牌（Type 1/4/9 等）。' },
  { t: 'HKMA', cat: '金融合规', zh: '香港金融管理局（央行机构）', ex: '“Follow HKMA circulars on AML.”', tip: '银行合规岗常引用 HKMA 通函；面试提到具体通函编号会显著加分。' },
  { t: 'KYC', cat: '金融合规', zh: '认识你的客户（Know Your Customer），开户与持续审查流程', ex: '“Perform KYC and CDD checks on new clients.”', tip: '合规／银行岗高频；准备一个「如何发现资料异常」的例子。' },
  { t: 'AML', cat: '金融合规', zh: '反洗钱（Anti-Money Laundering）', ex: '“Report suspicious transactions under AML policy.”', tip: '常与 KYC 并列出现；了解 STR（可疑交易报告）流程即可应对基础提问。' },
  { t: 'IFRS', cat: '金融合规', zh: '国际财务报告准则（International Financial Reporting Standards）', ex: '“Prepare statements in accordance with IFRS.”', tip: '香港本地准则为 HKFRS，与 IFRS 基本趋同；审计岗笔试题常考收入确认。' },
  { t: 'HKICPA', cat: '金融合规', zh: '香港会计师公会，亦指其执业资格（CPA）', ex: '“HKICPA student member preferred.”', tip: '四大审计岗通常资助考 QP；面试可主动问「考试假与资助安排」。' },
  { t: 'ACCA', cat: '金融合规', zh: '特许公认会计师公会资格', ex: '“ACCA finalists are welcome.”', tip: '与 HKICPA 互认有路径；已考科目记得写在履历「专业资格」栏。' },
  { t: 'Big 4', cat: '金融合规', zh: '四大会计师事务所（PwC、Deloitte、EY、KPMG）', ex: '“Big 4 experience is a plus.”', tip: '港硕进四大审计是常见跳板；1–4 月旺季强度高，需提前评估体力与考证节奏。' },
  { t: 'Bloomberg', cat: '金融合规', zh: '彭博终端（Bloomberg Terminal），金融市场数据与交易系统', ex: '“Bloomberg Terminal proficiency required.”', tip: '可在学校图书馆预约终端练手，履历写「会做 BDP/历史数据导出」比只写会用更实。' },
  { t: 'Wind', cat: '金融合规', zh: '万得（Wind）金融数据终端，内地券商与研究机构常用', ex: '“Familiar with Wind and Bloomberg.”', tip: '回内地发展时 Wind 更吃香；两边都会写，跨境求职更有弹性。' },
  { t: 'DCF', cat: '金融合规', zh: '现金流折现估值（Discounted Cash Flow）', ex: '“Build DCF models for valuation.”', tip: '面试常要求现场搭简版 DCF；把 WACC 假设说清楚比算得漂亮更重要。' },
  { t: 'term sheet', cat: '金融合规', zh: '条款清单，投资／合作谈判的核心条款文件', ex: '“We spent two weeks negotiating the term sheet.”', tip: '港式口语「倾 term sheet」＝谈条款；面试可讲你如何梳理双方分歧点。' },
  { t: 'due diligence', cat: '金融合规', zh: '尽职调查，交易或投资前的核查程序', ex: '“Assist in financial due diligence.”', tip: '会计／投行岗常见；准备「查过哪些资料、发现什么问题」的具体例子。' },
  { t: 'P&L', cat: '缩写', zh: '损益表（Profit and Loss statement），口语指「赚钱能力」', ex: '“You will own the P&L of the new category.”', tip: '被问「own P&L」意味着要对收入与成本负责，回答时谈预算与取舍。' },
  { t: 'ROI', cat: '缩写', zh: '投资回报率（Return on Investment）', ex: '“Report campaign ROI weekly.”', tip: '市场岗常用；能算「投入—产出—归因方式」三件事就够了。' },
  { t: 'SEO', cat: '缩写', zh: '搜索引擎优化（Search Engine Optimization）', ex: '“Optimise landing pages for SEO.”', tip: '与 SEM（付费广告）常并列；面试能区分两者就赢一半。' },
  { t: 'SEM', cat: '缩写', zh: '搜索引擎营销（Search Engine Marketing），通常指付费关键字广告', ex: '“Manage SEM budget across Google and Baidu.”', tip: '答得出「SEO 靠内容与结构，SEM 靠出价与落地页」即可。' },
  { t: 'GA4', cat: '缩写', zh: 'Google Analytics 4，网站与应用行为分析工具', ex: '“Track conversions in GA4.”', tip: '可自学并考取 Google 官方证书，是市场岗较具性价比的加分项。' },
  { t: 'CRM', cat: '缩写', zh: '客户关系管理系统（如 Salesforce、HubSpot）', ex: '“Maintain client records in CRM.”', tip: '写清具体系统名（如「用 HubSpot 管理 200 个 lead」）比写「熟悉 CRM」更有说服力。' },
  { t: 'ATS', cat: '缩写', zh: '招聘管理系统（Applicant Tracking System）', ex: '“Your application will be screened by our ATS.”', tip: 'ATS 按关键词筛履历；把 JD 原词（如「stakeholder management」）原样写进履历。' },
  { t: 'shortlisted', cat: '招聘流程', zh: '进入候选名单（初筛通过）', ex: '“Only shortlisted candidates will be contacted.”', tip: '投递后 2–3 周无消息可礼貌追问一次（follow-up email），香港 HR 通常接受。' },
  { t: 'offer', cat: '招聘流程', zh: '录用通知，亦指薪资条件', ex: '“We will issue the offer next week.”', tip: '收到 offer 先确认职位、薪资结构、试用期、到岗日与签证安排，再签字。' },
  { t: 'counter-offer', cat: '招聘流程', zh: '挽留加价，现雇主为留人所提的更好条件', ex: '“She accepted a counter-offer from her current firm.”', tip: '用 counter-offer 抬价在香港常见，但要评估「留下后信任成本」。' },
  { t: 'probation', cat: '招聘流程', zh: '试用期，香港常见 1–3 个月', ex: '“3-month probation with review.”', tip: '试用期内通知期通常较短（7 天）；签约前确认试用期薪资是否打折。' },
  { t: 'notice period', cat: '招聘流程', zh: '离职通知期', ex: '“One month notice period required.”', tip: '在职求职要算清通知期；签新 offer 前先确认「可到岗日」不会违约。' },
  { t: 'onboarding', cat: '招聘流程', zh: '入职引导流程', ex: '“Onboarding starts on the first Monday.”', tip: '入职首周通常要交证件、签合约、开 MPF 户口；提前备好 HKID 与签证文件。' },
  { t: 'headcount', cat: '招聘流程', zh: '人员编制／名额，简称 HC', ex: '“We only have one headcount this quarter.”', tip: '「HC 冻结」意味着岗位可能随时关闭，面试流程要抓紧推进。' },
  { t: 'stakeholder', cat: '缩写', zh: '持份者／利益相关方', ex: '“Manage stakeholders across finance and operations.”', tip: '港企高频词；回答时点名「哪几方、诉求差在哪、我怎么协调」。' },
  { t: 'deliverable', cat: '缩写', zh: '交付物（项目需产出的具体成果）', ex: '“Key deliverables include a monthly dashboard.”', tip: '把课业项目的「交付物＋时间＋验收标准」写进履历，能直接对上这个词。' },
  /* ---- 薪酬福利 ---- */
  { t: 'package', cat: '薪酬福利', zh: '薪酬包（月薪、花红、津贴、福利的总和）', ex: '“Competitive package offered.”', tip: '只谈月薪会被压价；把 13 薪、花红、医疗、假期折算成年包再比较。' },
  { t: 'allowance', cat: '薪酬福利', zh: '津贴（交通、膳食、轮班、通讯等）', ex: '“Shift allowance provided.”', tip: '轮班岗的 allowance 可占收入两成，务必问清计算方式与是否计入 MPF。' },
  { t: 'discretionary bonus', cat: '薪酬福利', zh: '酌情花红，非保证发放', ex: '“Discretionary bonus based on performance.”', tip: '「酌情」＝可为零；谈 offer 时应问过去三年实际发放月数。' },
  { t: 'double pay', cat: '薪酬福利', zh: '双粮，农历新年前多发一个月薪金（亦写作 13th month）', ex: '“Double pay after one year of service.”', tip: '常要求服务满一年才按比例发放；中途离职可能需退还。' },
  { t: 'bank holiday', cat: '薪酬福利', zh: '银行假，比法定假日多（约 17 天）', ex: '“Bank holidays and 12 days AL.”', tip: '银行假与「劳工假」（13 天）不同；合约写 bank holiday 对雇员更有利。' },
  { t: '5.5 days', cat: '薪酬福利', zh: '五天半工作周（周六上午上班）', ex: '“5.5 days work week.”', tip: '零售、保险、行政岗常见；等于每周多半天，年工时差约 200 小时，谈薪时要折算。' },
  { t: 'shift', cat: '薪酬福利', zh: '轮班（早／夜／通宵班）', ex: '“Shift duties including nights and weekends.”', tip: '轮班打乱作息与社交；问清轮班周期、夜班津贴与调班弹性。' },
  { t: 'on-call', cat: '薪酬福利', zh: '待命（非上班时间需随时响应）', ex: '“On-call support during weekends.”', tip: '「on-call」并非无薪加班，需问清是否有 standby allowance 与响应时限。' },
  { t: 'gratuity', cat: '薪酬福利', zh: '约满酬金，合约完成后一次性发放', ex: '“Contract gratuity of 10% upon completion.”', tip: '合约研究助理常见；提前离职通常一分不给，规划读博或转正时间要算进去。' },
  { t: 'commission only', cat: '薪酬福利', zh: '纯佣金／佣金占主要收入', ex: '“Commission only, no basic salary.”', tip: '收入波动大且不受最低工资保障；如接受，务必确认佣金计算与发放周期。' },
  /* ---- 港式用语 ---- */
  { t: '睇数', cat: '港式用语', zh: '看数据／看业绩报表', ex: '“每星期同老板睇数。”', tip: '面试说「我习惯每周睇数复盘」会显得懂本地节奏；书面履历仍用「数据分析」等标准表述。' },
  { t: '跑数', cat: '港式用语', zh: '追业绩指标（sales-driven 的日常说法）', ex: '“每月都要跑数，压力唔细。”', tip: '听到「跑数」要意识到是高压力销售岗，问清目标设定与达标率。' },
  { t: '埋数', cat: '港式用语', zh: '结账／月末结算（closing the books）', ex: '“月尾埋数最忙。”', tip: '会计、供应链岗常见；月末与年结前后加班几乎是常态。' },
  { t: '出 trip', cat: '港式用语', zh: '出差（business trip）', ex: '“下个月要出 trip 去深圳。”', tip: '问清出差频率、交通住宿报销标准，以及是否占用周末。' },
  { t: '执生', cat: '港式用语', zh: '临场应变、自行设法解决', ex: '“现场无人理，你自己执生啦。”', tip: '反映岗位支援少、要求独立；面试可举「资源不足仍交付」的例子。' },
  { t: '写字楼', cat: '港式用语', zh: '办公室（office）', ex: '“写字楼喺中环，返九点。”', tip: '「返九点」＝九点上班；港企普遍 9:00–18:00，午膳一小时。' },
  { t: '放工', cat: '港式用语', zh: '下班', ex: '“通常七点先放工。”', tip: '面试问「同事一般几点放工」比问「要不要加班」更容易得到真话。' },
  { t: '唔该', cat: '港式用语', zh: '劳驾／谢谢（粤语礼貌用语，适用范围比「谢谢」广）', ex: '“唔该帮我睇睇呢份文件。”', tip: '不会粤语也可用这一句破冰；面试开场一句「唔该晒」能拉近距离。' },
  { t: 'KOL', cat: '港式用语', zh: '关键意见领袖（网红／达人）', ex: '“Coordinate with KOLs for product seeding.”', tip: '市场岗高频；能说出香港本地 KOL 生态（IG 图文 vs 小红书种草）会加分。' },
  { t: 'CDD', cat: '金融合规', zh: '客户尽职审查（Customer Due Diligence）', ex: '“Conduct CDD on corporate accounts.”', tip: '与 KYC 配套；面试可能问「受益拥有人（UBO）如何核查」。' },
  { t: 'UBO', cat: '金融合规', zh: '最终受益拥有人（Ultimate Beneficial Owner）', ex: '“Identify the UBO behind the holding company.”', tip: '合规岗必考概念：通常指持股 25% 以上的自然人。' },
  { t: 'pivot table', cat: '缩写', zh: '数据透视表（Excel）', ex: '“Pivot table skills are required.”', tip: 'JD 写 Excel 时八成指透视表＋VLOOKUP；用一个真实报表截图放进作品集最有效。' },
  { t: 'VLOOKUP', cat: '缩写', zh: 'Excel 纵向查找函数', ex: '“Use VLOOKUP to reconcile data.”', tip: '现多用 XLOOKUP；两者都会写，显得跟得上版本。' },
  { t: 'working paper', cat: '金融合规', zh: '审计工作底稿', ex: '“Prepare working papers for review.”', tip: '审计岗核心产出；讲清「底稿结构、证据来源、复核意见」三件事。' },
  { t: 'wireframe', cat: '缩写', zh: '线框原型（低保真界面草图）', ex: '“Deliver wireframes before hi-fi design.”', tip: '作品集里展示「线框→高保真→用户反馈」的迭代链，比只放成品图更受青睐。' },
  { t: 'PRD', cat: '缩写', zh: '产品需求文档（Product Requirements Document）', ex: '“Write PRD for the new feature.”', tip: '产品岗硬通货；用一页写清「用户问题—方案—验收指标」即可作为作品。' },
  { t: 'pipeline', cat: '缩写', zh: '销售管道／候选管道（进展中的商机或流程）', ex: '“Update your pipeline weekly.”', tip: 'BD 岗面试会问 pipeline 转化率；准备各阶段数量与转化逻辑。' },
  { t: 'reference check', cat: '招聘流程', zh: '背景调查（联系前雇主核实）', ex: '“Offer is subject to reference check.”', tip: '港企常打给前上司；入职前先跟推荐人打好招呼，并确认对方可用英语／粤语沟通。' }
];

/* 术语分类顺序（用于抽屉筛选） */
const TERM_CATS = ['全部', '缩写', '港式用语', '薪酬福利', '招聘流程', '金融合规'];
