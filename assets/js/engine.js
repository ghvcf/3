/* ==========================================================================
   engine.js —— 规则引擎（本地运行，可离线）
   1) parseJD()      把 JD 文本拆成「硬技能 / 软技能 / 隐性偏好 / 风险信号」
   2) matchScore()   岗位与求职画像的技能覆盖率
   3) highlight()    在 JD 中标注术语，点击即查释义
   说明：全部为本地关键词与正则规则，不调用任何付费 API；如配置了大模型
   接口（见 app.js），会优先使用模型结果，失败则自动回退到本引擎。
   ========================================================================== */
const Engine = (function () {
  'use strict';

  const norm = function (s) {
    return String(s == null ? '' : s).toLowerCase().replace(/\s+/g, ' ').trim();
  };

  /* ---------------- 词典 ---------------- */
  // n = 规范名称；a = 同义／英文写法（小写）
  const HARD = [
    { n: 'Excel', a: ['excel', '试算表', 'spreadsheet', 'vlookup', 'pivot table', '数据透视', 'xlookup'] },
    { n: 'Word', a: ['ms word', 'word 文档', 'microsoft word'] },
    { n: 'PowerPoint', a: ['powerpoint', 'ppt', '简报制作'] },
    { n: 'SQL', a: ['sql', 'mysql', 'postgres', '数据库查询'] },
    { n: 'Python', a: ['python', 'pandas', 'numpy'] },
    { n: 'R', a: ['r 语言', 'r语言', 'rstudio', 'r studio'] },
    { n: 'SAS', a: ['sas'] },
    { n: 'SPSS', a: ['spss'] },
    { n: 'Stata', a: ['stata'] },
    { n: 'Tableau', a: ['tableau'] },
    { n: 'Power BI', a: ['power bi', 'powerbi'] },
    { n: 'Looker', a: ['looker', 'looker studio'] },
    { n: 'GA4', a: ['ga4', 'google analytics', '网站分析'] },
    { n: 'SEO', a: ['seo', '搜索引擎优化'] },
    { n: 'SEM', a: ['sem', '关键字广告', '搜索广告'] },
    { n: 'CRM', a: ['crm', '客户关系管理'] },
    { n: 'Salesforce', a: ['salesforce'] },
    { n: 'HubSpot', a: ['hubspot'] },
    { n: 'SAP', a: ['sap'] },
    { n: 'ERP', a: ['erp'] },
    { n: 'Bloomberg', a: ['bloomberg'] },
    { n: 'Wind', a: ['wind', '万得'] },
    { n: '财务建模', a: ['财务建模', 'financial model', 'financial modelling', '估值模型'] },
    { n: '估值', a: ['估值', 'valuation', 'dcf', '可比公司'] },
    { n: '尽职调查', a: ['尽职调查', 'due diligence', 'dd report'] },
    { n: '合规', a: ['合规', 'compliance'] },
    { n: 'KYC', a: ['kyc', 'cdd', '尽职审查'] },
    { n: 'AML', a: ['aml', '反洗钱', '可疑交易'] },
    { n: 'IFRS', a: ['ifrs', 'hkfrs', '会计准则'] },
    { n: '审计', a: ['审计', 'audit', 'working paper', '工作底稿'] },
    { n: '会计', a: ['会计', 'accounting', 'accountant', '记账'] },
    { n: '税务', a: ['税务', 'tax'] },
    { n: '数据分析', a: ['数据分析', 'data analysis', 'data analytics', '数据处理', '统计分析', '描述统计'] },
    { n: '数据可视化', a: ['数据可视化', 'data visualization', '仪表板', 'dashboard'] },
    { n: '机器学习', a: ['机器学习', 'machine learning', '模型训练'] },
    { n: 'NLP', a: ['nlp', '自然语言处理'] },
    { n: 'LLM', a: ['llm', 'large language model', '大模型', '提示工程', 'prompt'] },
    { n: 'Docker', a: ['docker', '容器化'] },
    { n: 'Kubernetes', a: ['kubernetes', 'k8s'] },
    { n: 'AWS', a: ['aws', 'amazon web services'] },
    { n: 'GCP', a: ['gcp', 'google cloud'] },
    { n: 'Azure', a: ['azure'] },
    { n: 'Java', a: ['java '] },
    { n: 'JavaScript', a: ['javascript', 'typescript', 'js '] },
    { n: 'React', a: ['react', 'vue', 'next.js'] },
    { n: 'Node.js', a: ['node.js', 'nodejs'] },
    { n: 'Git', a: ['git', 'github', 'gitlab'] },
    { n: 'Figma', a: ['figma', 'sketch', '原型工具'] },
    { n: 'Photoshop', a: ['photoshop', 'ps ', 'canva'] },
    { n: 'Illustrator', a: ['illustrator', 'ai 绘图'] },
    { n: 'Premiere', a: ['premiere', 'capcut', '剪映', 'final cut'] },
    { n: '剪辑', a: ['剪辑', '短片', '短视频', 'video editing'] },
    { n: '文案', a: ['文案', 'copywriting', '撰写中文', 'creative writing'] },
    { n: '社交媒体', a: ['社交媒体', 'social media', 'ig', 'instagram', 'facebook', '视频号'] },
    { n: '小红书', a: ['小红书', 'xiaohongshu', 'rednote'] },
    { n: '抖音', a: ['抖音', 'tiktok', 'douyin'] },
    { n: '微信', a: ['微信', 'wechat', '公众号'] },
    { n: 'KOL', a: ['kol', '网红', '达人', 'influencer'] },
    { n: '内容营销', a: ['内容营销', 'content marketing', '种草'] },
    { n: '活动策划', a: ['活动策划', 'event', '线下活动'] },
    { n: '项目管理', a: ['项目管理', 'project management', '排期'] },
    { n: 'Agile', a: ['agile', 'scrum', '敏捷'] },
    { n: 'JIRA', a: ['jira', 'confluence'] },
    { n: '供应链', a: ['供应链', 'supply chain'] },
    { n: '采购', a: ['采购', 'procurement', 'sourcing', '供应商'] },
    { n: '物流', a: ['物流', 'logistics', '仓储', '货运'] },
    { n: '库存管理', a: ['库存', 'inventory', '存货'] },
    { n: '报关', a: ['报关', 'customs', '进出口'] },
    { n: '国际贸易', a: ['国际贸易', 'international trade', '跨境电商'] },
    { n: '客户服务', a: ['客户服务', 'customer service', '客服', '接待'] },
    { n: '销售', a: ['销售', 'sales', '业务开发', '签单'] },
    { n: 'BD', a: ['bd', 'business development', '商务拓展'] },
    { n: '商务谈判', a: ['谈判', 'negotiation', '洽谈'] },
    { n: '教学', a: ['教学', 'teaching', '课堂', '授课'] },
    { n: '课程设计', a: ['课程设计', 'curriculum', '教学设计', 'stem 课程'] },
    { n: '产品设计', a: ['产品设计', 'product design', '产品经理', 'product manager'] },
    { n: '需求文档', a: ['需求文档', 'prd', 'user story'] },
    { n: '用户研究', a: ['用户研究', 'user research', '用户访谈', '可用性测试'] },
    { n: '翻译', a: ['翻译', 'translation', '中英双向', 'cat 工具'] },
    { n: '英语', a: ['英文', 'english', '中英', '雅思', 'ielts'] },
    { n: '粤语', a: ['粤语', 'cantonese', '广东话'] },
    { n: '普通话', a: ['普通话', 'mandarin', '国语'] },
    { n: 'CPA', a: ['cpa'] },
    { n: 'ACCA', a: ['acca'] },
    { n: 'CFA', a: ['cfa'] },
    { n: 'HKICPA', a: ['hkicpa', 'qp'] },
    { n: '金融', a: ['金融', 'finance', 'financial', '银行', '证券', '基金'] },
    { n: '保险', a: ['保险', 'insurance', '承保', '理赔'] },
    { n: '风险管理', a: ['风险管理', 'risk management', '风控'] },
    { n: 'HR', a: ['hr', '人力资源', '人事', '招聘流程', 'hris'] },
    { n: '招聘', a: ['招聘', 'recruitment', '筛选 cv', '面试安排'] }
  ];

  const SOFT = [
    { n: '沟通表达', a: ['沟通', 'communicat', '表达', '对接'] },
    { n: '团队协作', a: ['团队', 'teamwork', '协作', '合作'] },
    { n: '跨部门协调', a: ['跨部门', 'cross-functional', '协调', 'stakeholder'] },
    { n: '主动性', a: ['主动', 'proactive', 'self-motivat', '自驱'] },
    { n: '抗压能力', a: ['抗压', 'stress', '高压', 'pressure'] },
    { n: '细心严谨', a: ['细心', 'detail-oriented', '严谨', '准确'] },
    { n: '责任心', a: ['责任心', 'responsible', '守时', '独立交付'] },
    { n: '解决问题', a: ['解决问题', 'problem solving', 'troubleshoot'] },
    { n: '时间管理', a: ['时间管理', 'time management', '期限', 'deadline', '多任务', '同时处理'] },
    { n: '汇报展示', a: ['汇报', 'presentation', '简报', '演讲'] },
    { n: '领导潜质', a: ['领导', 'leadership', '带队'] },
    { n: '客户导向', a: ['客户导向', 'customer-centric', '服务意识'] },
    { n: '学习能力', a: ['学习能力', 'quick learner', 'fast learner', '愿意学习'] },
    { n: '保密意识', a: ['保密', 'confidential'] },
    { n: '适应能力', a: ['适应', 'adaptable', '灵活', 'flexib'] }
  ];

  /* ---------------- 工具 ---------------- */
  const reEscape = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
  const isAscii = function (s) { return /^[\x20-\x7E]+$/.test(s); };

  // 在文本中查找 alias，拉丁字母需整词匹配，避免 "ai" 命中 "email"
  function countHits(text, alias) {
    const hay = norm(text);
    const needle = norm(alias);
    if (!needle) return 0;
    if (!isAscii(needle)) {
      let c = 0, i = hay.indexOf(needle);
      while (i !== -1) { c++; i = hay.indexOf(needle, i + needle.length); }
      return c;
    }
    const re = new RegExp('(^|[^a-z0-9])' + reEscape(needle) + '(?=[^a-z0-9]|$)', 'g');
    const m = hay.match(re);
    return m ? m.length : 0;
  }

  function uniq(arr) {
    const seen = Object.create(null), out = [];
    arr.forEach(function (x) { const k = norm(x); if (k && !seen[k]) { seen[k] = 1; out.push(x); } });
    return out;
  }

  /* ---------------- JD 解析 ---------------- */
  function parseJD(text) {
    const body = String(text || '');
    const lower = norm(body);

    const hard = [], soft = [];
    HARD.forEach(function (item) {
      let hits = 0;
      item.a.forEach(function (al) { hits += countHits(lower, al); });
      if (hits > 0) hard.push({ name: item.n, hits: hits });
    });
    SOFT.forEach(function (item) {
      let hits = 0;
      item.a.forEach(function (al) { hits += countHits(lower, al); });
      if (hits > 0) soft.push({ name: item.n, hits: hits });
    });
    hard.sort(function (a, b) { return b.hits - a.hits; });
    soft.sort(function (a, b) { return b.hits - a.hits; });

    /* 隐性偏好 */
    const hidden = [];
    const pushH = function (label, detail) { hidden.push({ label: label, detail: detail }); };

    if (/粤语|cantonese|广东话/.test(lower)) {
      pushH('语种：粤语', 'JD 提到粤语，多因团队日常沟通或客户在前线；即使写作「优先」，面试仍可能以粤语进行。');
    }
    if (/(中英|英文|english|fluent)/.test(lower)) {
      pushH('语种：英语', '英文书写／准则阅读是硬门槛；准备一份英文版履历，并练习 2 分钟英文自我介绍。');
    }
    if (/普通话|mandarin/.test(lower)) {
      pushH('语种：普通话', '面向内地客户或内地团队的岗位会把普通话列为必需项，这是内地生的直接优势。');
    }

    let years = 0;
    const yRe = /(\d+)\s*(?:年|years?)(?:\s*以上|或以上|或以上经验|以上经验)?/g;
    let ym;
    while ((ym = yRe.exec(lower)) !== null) { const v = parseInt(ym[1], 10); if (v > years && v < 30) years = v; }
    if (years >= 1) {
      pushH('经验：约 ' + years + ' 年', years >= 3
        ? '要求 ' + years + ' 年经验，应届生通常需要以实习＋项目证据替代，投递前先确认是否接受应届。'
        : '要求 ' + years + ' 年左右经验，可用 2–3 段实习或毕业项目对应其职责逐条回应。');
    }
    if (/硕士|master|研究生|博士|phd/.test(lower)) {
      pushH('学历：硕博偏好', '学历门槛偏向研究生；港硕背景在此是加分项，可在履历首段直接写明学位与毕业时间。');
    }
    if (/应届|fresh grad|graduate|trainee|实习生/.test(lower)) {
      pushH('招聘对象：应届／培训生', '明确接受应届，是港硕主投区间；重点展示可迁移技能与到岗时间。');
    }
    if (/iang|受养人|工作签注|签证|visa|right to work|工作资格/.test(lower)) {
      pushH('身份：签证条件', 'JD 提及签证／在港工作资格，投递前先自查 IANG 或受养人签注状态，并在求职信主动说明。');
    }
    if (/asap|immediately available|即时到岗|立即到岗|急聘|urgent/.test(lower)) {
      pushH('到岗时间：越快越好', '急聘岗位流程较快、决策周期短；如可即时到岗，建议在履历顶部注明最快到岗日期。');
    }
    if (/ot\b|加班|overtime|轮班|shift|on-call|周末/.test(lower)) {
      pushH('工时：存在加班／轮班', '工时弹性较低；建议在面试中确认旺季平均每周工时、补假与津贴安排。');
    }
    if (/出 trip|出差|travel|拜访/.test(lower)) {
      pushH('出差：有外地行程', '需往返内地或东南亚；宜确认差旅报销标准、频率，以及是否占用周末。');
    }
    if (/kpi|target|佣金|commission|跑数|达标/.test(lower)) {
      pushH('考核：结果导向', '收入或评价与指标挂钩；宜问清目标设定方式与历史达标率。');
    }
    if (/本地经验|local experience|香港经验|本地客户/.test(lower)) {
      pushH('经验：偏好本地背景', '「本地经验」是内地生的相对短板；可用香港课程项目、本地实习或粤语沟通案例补足。');
    }
    if (/一人多岗|multi-?task|ad hoc|临时交办|wear many hats/.test(lower)) {
      pushH('职责：边界较模糊', '岗位可能兼做行政与支援性事务；建议在面试中确认典型一周的工作分配。');
    }
    if (/作品集|portfolio|github/.test(lower)) {
      pushH('材料：需作品集', '除履历外需提交作品集／GitHub；建议 3 个案例，每个写清问题、动作、结果。');
    }
    if (/五天半|5\.5|half day/.test(lower)) {
      pushH('工时：五天半', '每周多半天，年工时约多 200 小时；谈薪时宜将这半天折算进时薪比较。');
    }

    /* 风险信号 */
    const risks = [];
    const pushR = function (level, label, detail) { risks.push({ level: level, label: label, detail: detail }); };

    if (/(no|not)[^.]{0,18}(visa|work permit|sponsorship)|不提供[^。]{0,8}签证|不担保签证|需自行(办理|申请)[^。]{0,8}(签证|工作)/.test(lower)) {
      pushR('high', '签证不担保', '明确不提供工作签证担保。内地生须先持有 IANG／受养人签注才可合法受雇，否则无法入职。');
    }
    if (/unpaid|无薪|不设津贴|义务实习/.test(lower)) {
      pushR('high', '无薪或零津贴', '无薪实习在香港的保障有限，且难以计入相关工作经验；建议优先选择提供津贴的岗位。');
    }
    if (/commission only|纯佣金|不设底薪|无底薪|首月不设佣金/.test(lower)) {
      pushR('high', '收入结构风险', '收入高度依赖佣金且可能无底薪保障；签约前应确认底薪、佣金计算方式与发放周期。');
    }
    if (years >= 3 && /助理|assistant|junior|trainee/.test(lower)) {
      pushR('high', '资历错配', '岗位名为初级／助理，却要求 ' + years + ' 年以上经验；投递回报率较低，可先致函询问是否接受应届毕业生。');
    }
    if (/粤语必须|必须粤语|must speak cantonese|cantonese is a must/.test(lower)) {
      pushR('mid', '粤语为准入门槛', '粤语被列为必要条件而非加分项；若听说能力不足，面试与日常工作都会吃力。');
    }
    if (/旺季|peak season|高强度加班|通宵|night shift|轮班/.test(lower)) {
      pushR('mid', '高强度工时', '存在旺季高强度加班或轮班；需评估体力、通勤与考证／读博计划的时间冲突。');
    }
    if (/合约[^。]{0,10}(3|6|9|12)\s*个月|contract[^.]{0,16}(3|6|9|12)\s*months|可续约/.test(lower)) {
      pushR('mid', '短期合约', '合约为期较短且续约不确定；若目标是留港长期发展，需确认转正（permanent）路径。');
    }
    if (/无医疗|不设医疗|no medical/.test(lower)) {
      pushR('low', '福利缺项', '不提供医疗保险；香港门诊与住院自费成本高，需自行买保险或计入薪酬比较。');
    }
    if (/急聘|urgent|即时到岗|立即到岗/.test(lower)) {
      pushR('mid', '急聘信号', '急聘常意味着前任快速离职或项目仓促启动；建议在面试中询问岗位空缺原因。');
    }
    if (/一人多岗|临时交办|ad hoc/.test(lower)) {
      pushR('low', '职责边界模糊', '工作内容可能被临时扩充；入职前以书面确认职责范围与汇报线。');
    }
    if (/5\.5|五天半/.test(lower)) {
      pushR('low', '五天半工作', '每周六上午上班，实际工时高于五天工作制，折算时薪后可能低于预期。');
    }

    /* 加分项 */
    const plus = [];
    if (/iang|非本地毕业生/.test(lower)) plus.push('欢迎 IANG 毕业生');
    if (/应届|fresh grad|graduate/.test(lower)) plus.push('接受应届');
    if (/可协助|协助办理|sponsor/.test(lower)) plus.push('协助办理签证');
    if (/培训|training|导师|mentor/.test(lower)) plus.push('提供培训');
    if (/弹性|flexi|hybrid|wfh/.test(lower)) plus.push('弹性／混合办公');
    if (/五天工作|5 天工作|5-day/.test(lower)) plus.push('五天工作');
    if (/年假|al\b|annual leave/.test(lower)) plus.push('明确年假');
    if (/花红|bonus|双粮|13th/.test(lower)) plus.push('有花红／双粮');

    return {
      hard: hard.slice(0, 14),
      soft: soft.slice(0, 10),
      hidden: hidden,
      risks: risks,
      plus: plus,
      meta: { chars: body.length, years: years }
    };
  }

  /* ---------------- 匹配度 ---------------- */
  function matchScore(jobSkills, mySkills) {
    const js = uniq(jobSkills || []);
    if (!js.length) return 60;
    const mine = Object.create(null);
    (mySkills || []).forEach(function (s) { mine[norm(s)] = 1; });
    let hit = 0;
    js.forEach(function (s) { if (mine[norm(s)]) hit++; });
    return Math.round((hit / js.length) * 100);
  }

  function gap(jobSkills, mySkills) {
    const mine = Object.create(null);
    (mySkills || []).forEach(function (s) { mine[norm(s)] = 1; });
    return uniq(jobSkills || []).filter(function (s) { return !mine[norm(s)]; });
  }

  function matched(jobSkills, mySkills) {
    const mine = Object.create(null);
    (mySkills || []).forEach(function (s) { mine[norm(s)] = 1; });
    return uniq(jobSkills || []).filter(function (s) { return mine[norm(s)]; });
  }

  /* ---------------- 术语标注 ---------------- */
  // 返回 HTML 片段（已转义），命中的术语包成 <button class="term-hit" data-term="…">
  function highlight(text, terms) {
    const src = String(text || '');
    if (!src) return '';
    const lower = src.toLowerCase();
    const occ = [];

    (terms || []).forEach(function (item) {
      const keys = [item.t].concat(item.a || []);
      keys.forEach(function (key) {
        const needle = String(key).toLowerCase();
        if (!needle) return;
        let idx = lower.indexOf(needle);
        while (idx !== -1) {
          const before = idx > 0 ? lower.charAt(idx - 1) : ' ';
          const after = idx + needle.length < lower.length ? lower.charAt(idx + needle.length) : ' ';
          const w0 = /[a-z0-9]/.test(needle.charAt(0));
          const w1 = /[a-z0-9]/.test(needle.charAt(needle.length - 1));
          const okBefore = !w0 || !/[a-z0-9]/.test(before);
          const okAfter = !w1 || !/[a-z0-9]/.test(after);
          if (okBefore && okAfter) occ.push({ s: idx, e: idx + needle.length, term: item.t });
          idx = lower.indexOf(needle, idx + 1);
        }
      });
    });

    occ.sort(function (a, b) { return a.s - b.s || (b.e - b.s) - (a.e - a.s); });

    let html = '', cursor = 0;
    occ.forEach(function (o) {
      if (o.s < cursor) return;
      html += esc(src.slice(cursor, o.s));
      html += '<button type="button" class="term-hit" data-term="' + esc(o.term) + '">' +
              esc(src.slice(o.s, o.e)) + '</button>';
      cursor = o.e;
    });
    html += esc(src.slice(cursor));
    return html;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------------- 术语查询 ---------------- */
  function findTerm(key) {
    const k = norm(key);
    for (let i = 0; i < TERMS.length; i++) {
      const item = TERMS[i];
      if (norm(item.t) === k) return item;
      if ((item.a || []).some(function (a) { return norm(a) === k; })) return item;
    }
    // 模糊：包含关系
    for (let i = 0; i < TERMS.length; i++) {
      const item = TERMS[i];
      if (norm(item.t).indexOf(k) !== -1 || k.indexOf(norm(item.t)) !== -1) return item;
    }
    return null;
  }

  function searchTerms(q) {
    const k = norm(q);
    if (!k) return TERMS.slice();
    return TERMS.filter(function (item) {
      return norm(item.t).indexOf(k) !== -1 ||
        norm(item.zh).indexOf(k) !== -1 ||
        norm(item.ex).indexOf(k) !== -1 ||
        norm(item.tip).indexOf(k) !== -1;
    });
  }

  return {
    parseJD: parseJD,
    matchScore: matchScore,
    gap: gap,
    matched: matched,
    highlight: highlight,
    esc: esc,
    findTerm: findTerm,
    searchTerms: searchTerms,
    HARD: HARD,
    SOFT: SOFT
  };
})();
