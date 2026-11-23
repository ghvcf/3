/* ==========================================================================
   app.js —— 界面交互
   依赖：data.js（SITE / JOBS / TERMS / TERM_CATS）、engine.js（Engine）
   无框架、无构建步骤、无网络请求（除非用户自行配置大模型接口）。
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------ 基础工具 ------------------------------ */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = Engine.esc;

  var LS_KEY = 'jobbridge.state.v1';
  var DEFAULT_SKILLS = ['Excel', 'SQL', 'Python', '数据分析', '英语', '文案', '项目管理'];

  var state = {
    skills: DEFAULT_SKILLS.slice(),
    track: '全部',
    exp: '应届毕业生（0–1 年）',
    visa: 'IANG（可自行办理）',
    theme: 'light',
    ai: null,
    sub: null,
    filters: { q: '', sector: '全部', type: '全部', source: '全部', sort: 'match' }
  };

  var lastParse = null;      // { data, text, source }
  var expanded = {};         // 展开的岗位 id
  var toastTimer = null;

  function load() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      ['skills', 'track', 'exp', 'visa', 'theme', 'ai', 'sub'].forEach(function (k) {
        if (saved[k] !== undefined && saved[k] !== null) state[k] = saved[k];
      });
      if (!Array.isArray(state.skills) || !state.skills.length) state.skills = DEFAULT_SKILLS.slice();
      if (saved.filters) state.filters = Object.assign(state.filters, saved.filters);
    } catch (e) { /* 忽略：隐私模式下走默认值 */ }
  }

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        skills: state.skills, track: state.track, exp: state.exp, visa: state.visa,
        theme: state.theme, ai: state.ai, sub: state.sub, filters: state.filters
      }));
    } catch (e) { /* 忽略 */ }
  }

  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }

  function postRank(posted) {
    if (!posted) return 99;
    if (posted.indexOf('今天') === 0) return 0;
    if (posted.indexOf('昨天') === 0) return 1;
    var d = /(\d+)\s*天/.exec(posted);
    if (d) return parseInt(d[1], 10);
    var w = /(\d+)\s*周/.exec(posted);
    if (w) return parseInt(w[1], 10) * 7;
    return 99;
  }

  function scoreColor(s) { return s >= 70 ? 'var(--ok)' : (s >= 40 ? 'var(--accent)' : 'var(--danger)'); }

  /* ------------------------------ 主题 ------------------------------ */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    var btn = $('#themeBtn');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀' : '◐';
      btn.setAttribute('aria-label', theme === 'dark' ? '切换浅色模式' : '切换深色模式');
    }
  }

  /* ------------------------------ 首屏 ------------------------------ */
  function renderHero() {
    $('#brandName').textContent = SITE.name;
    $('#brandTag').textContent = SITE.tagline;

    var stats = [
      { n: JOBS.length, t: '示例岗位' },
      { n: TERMS.length, t: '术语词条' },
      { n: '3 个', t: '信息渠道' }
    ];
    $('#statRow').innerHTML = stats.map(function (s) {
      return '<li><b>' + esc(s.n) + '</b><span>' + esc(s.t) + '</span></li>';
    }).join('');

    var top = JOBS.map(function (j) {
      return { j: j, s: Engine.matchScore(j.skills, state.skills) };
    }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3);

    $('#heroPreview').innerHTML = top.map(function (x) {
      return '<div class="mini-job">' +
        '<div><strong>' + esc(x.j.title) + '</strong>' +
        '<small>' + esc(x.j.company) + ' · ' + esc(x.j.loc) + ' · ' + esc(x.j.source) + '</small></div>' +
        '<span class="mini-score" style="color:' + scoreColor(x.s) +
          ';background:color-mix(in srgb, ' + scoreColor(x.s) + ' 12%, transparent)">' + x.s + '%</span></div>';
    }).join('');
  }

  /* ------------------------------ 求职画像 ------------------------------ */
  function skillPool() {
    var count = {};
    JOBS.forEach(function (j) {
      (j.skills || []).forEach(function (s) {
        count[s] = (count[s] || 0) + 1;
      });
    });
    ['Excel', 'SQL', 'Python', '数据分析', '英语', '文案', '项目管理', 'Figma'].forEach(function (s) {
      count[s] = Math.max(count[s] || 0, 0.5);
    });
    return Object.keys(count).sort(function (a, b) {
      return (count[b] - count[a]) || a.localeCompare(b, 'zh');
    }).slice(0, 46);
  }

  function renderProfile() {
    var pool = skillPool();
    var picked = {};
    state.skills.forEach(function (s) { picked[s] = 1; });

    $('#skillPicker').innerHTML = pool.map(function (s) {
      var on = picked[s] ? ' on' : '';
      return '<button type="button" class="chip' + on + '" data-skill="' + esc(s) + '" ' +
        'aria-pressed="' + (picked[s] ? 'true' : 'false') + '">' +
        (picked[s] ? '<span class="x" aria-hidden="true">✓</span>' : '<span aria-hidden="true">＋</span>') +
        esc(s) + '</button>';
    }).join('');

    var sectors = ['全部'];
    JOBS.forEach(function (j) { if (sectors.indexOf(j.sector) === -1) sectors.push(j.sector); });
    $('#trackSel').innerHTML = sectors.map(function (s) {
      return '<option' + (s === state.track ? ' selected' : '') + '>' + esc(s) + '</option>';
    }).join('');

    $('#expSel').value = state.exp;
    $('#visaSel').value = state.visa;

    var n = state.skills.length;
    var tip = '已选 ' + n + ' 项技能。';
    if (n < 4) tip += ' 建议至少选择 4 项，匹配度方具区分度。';
    if (state.visa.indexOf('学生') === 0) tip += ' 学生签注不可受雇，须先申请 IANG 后方可入职。';
    if (state.visa.indexOf('永久') === 0) tip += ' 永久居民不受签证限制，可优先申请要求在港工作资格的岗位。';
    $('#profileHint').innerHTML = esc(tip) + ' <b>说明：</b>解析结果中的硬技能标签可点击加入技能画像。';
  }

  /* ------------------------------ 岗位列表 ------------------------------ */
  function filteredJobs() {
    var f = state.filters;
    var q = (f.q || '').toLowerCase().trim();

    var list = JOBS.filter(function (j) {
      if (f.sector !== '全部' && j.sector !== f.sector) return false;
      if (f.type !== '全部' && j.type !== f.type) return false;
      if (f.source !== '全部' && j.source !== f.source) return false;
      if (state.track !== '全部' && j.sector !== state.track) return false;
      if (!q) return true;
      var hay = [j.title, j.company, j.loc, j.sector, j.type, j.source, (j.tags || []).join(' '), (j.skills || []).join(' '), j.jd]
        .join(' ').toLowerCase();
      return hay.indexOf(q) !== -1;
    }).map(function (j) {
      return { j: j, s: Engine.matchScore(j.skills, state.skills) };
    });

    var sort = f.sort;
    list.sort(function (a, b) {
      if (sort === 'salary') return b.j.salaryMin - a.j.salaryMin;
      if (sort === 'new') return postRank(a.j.posted) - postRank(b.j.posted) || b.s - a.s;
      return b.s - a.s || postRank(a.j.posted) - postRank(b.j.posted);
    });
    return list;
  }

  function jobCardHTML(item) {
    var j = item.j, s = item.s;
    var gap = Engine.gap(j.skills, state.skills);
    var isOpen = !!expanded[j.id];

    var meta = [
      '<span class="pill type">' + esc(j.type) + '</span>',
      '<span class="pill">' + esc(j.sector) + '</span>',
      '<span class="pill">' + esc(j.loc) + '</span>',
      '<span class="pill salary">' + esc(j.salary) + '</span>',
      '<span class="pill">' + esc(j.source) + ' · ' + esc(j.posted) + '</span>'
    ].join('');

    return '<article class="job-card" data-id="' + esc(j.id) + '">' +
      '<div class="job-top">' +
        '<div>' +
          '<h3>' + esc(j.title) + '</h3>' +
          '<p class="job-company">' + esc(j.company) + ' · ' + esc(j.loc) + ' · ' + esc(j.type) + '</p>' +
        '</div>' +
        '<div class="ring" style="--p:' + s + ';--ring-color:' + scoreColor(s) + '" ' +
          'title="与你的技能画像匹配度 ' + s + '%"><span>' + s + '%</span></div>' +
      '</div>' +
      '<div class="job-meta">' + meta + '</div>' +
      '<div class="job-tags">' + (j.tags || []).map(function (t) {
        return '<span class="tag">' + esc(t) + '</span>';
      }).join('') + '</div>' +
      (gap.length ? '<p class="gap-line">缺口：<b>' + gap.map(esc).join('、') + '</b></p>'
                  : '<p class="gap-line">技能全部命中 ✓</p>') +
      '<div class="job-actions">' +
        '<button type="button" class="btn btn-sm btn-primary" data-act="parse">在解析器中打开</button>' +
        '<button type="button" class="btn btn-sm btn-ghost" data-act="expand" aria-expanded="' + (isOpen ? 'true' : 'false') + '">' +
          (isOpen ? '收起 JD' : '查看 JD') + '</button>' +
      '</div>' +
      '<div class="job-jd"' + (isOpen ? '' : ' hidden') + '>' +
        Engine.highlight(j.jd, TERMS) +
      '</div>' +
    '</article>';
  }

  function renderJobs() {
    var list = filteredJobs();
    var grid = $('#jobGrid');
    grid.innerHTML = list.map(jobCardHTML).join('');
    $('#jobEmpty').hidden = list.length > 0;
    $('#jobCount').textContent = String(list.length);
  }

  function buildFilterOptions() {
    var sectors = ['全部'], types = ['全部'], sources = ['全部'];
    JOBS.forEach(function (j) {
      if (sectors.indexOf(j.sector) === -1) sectors.push(j.sector);
      if (types.indexOf(j.type) === -1) types.push(j.type);
      if (sources.indexOf(j.source) === -1) sources.push(j.source);
    });
    var fill = function (sel, arr, key) {
      sel.innerHTML = arr.map(function (v) {
        var label = v === '全部' ? '全部' + (key === 'sector' ? '行业' : key === 'type' ? '类型' : '来源') : v;
        return '<option value="' + esc(v) + '"' + (state.filters[key] === v ? ' selected' : '') + '>' + esc(label) + '</option>';
      }).join('');
    };
    fill($('#sectorSel'), sectors, 'sector');
    fill($('#typeSel'), types, 'type');
    fill($('#sourceSel'), sources, 'source');
    $('#sortSel').value = state.filters.sort;
    $('#qInput').value = state.filters.q;
  }

  /* ------------------------------ JD 解析 ------------------------------ */
  function hardNames(data) {
    return (data.hard || []).map(function (h) { return typeof h === 'string' ? h : h.name; });
  }

  function renderJDResult(data, text, source) {
    lastParse = { data: data, text: text, source: source };

    var hard = hardNames(data);
    var score = Engine.matchScore(hard, state.skills);
    var got = Engine.matched(hard, state.skills);
    var miss = Engine.gap(hard, state.skills);

    var col = function (cls, title, count, body) {
      return '<div class="col ' + cls + '"><h4>' + esc(title) +
        (count != null ? ' <span class="muted">' + count + '</span>' : '') + '</h4>' + body + '</div>';
    };

    var hardBody = hard.length
      ? '<div class="tagline">' + hard.map(function (n) {
          return '<button type="button" class="tchip" data-add="' + esc(n) + '" title="加入我的技能">＋' + esc(n) + '</button>';
        }).join('') + '</div>'
      : '<p class="hint">未识别到明确的技能词，可补充更完整的岗位描述。</p>';

    var softBody = (data.soft || []).length
      ? '<ul>' + data.soft.map(function (s) { return '<li>' + esc(s.name || s) + '</li>'; }).join('') + '</ul>'
      : '<p class="hint">未识别到软技能相关描述。</p>';

    var hiddenBody = (data.hidden || []).length
      ? '<ul>' + data.hidden.map(function (h) {
          return '<li><b>' + esc(h.label) + '</b><span class="d">' + esc(h.detail) + '</span></li>';
        }).join('') + '</ul>'
      : '<p class="hint">未发现明显的隐性偏好。</p>';

    var riskBody = (data.risks || []).length
      ? data.risks.map(function (r) {
          return '<div class="risk-item ' + esc(r.level || 'mid') + '"><b>' + esc(r.label) + '</b>' +
            '<small>' + esc(r.detail) + '</small></div>';
        }).join('')
      : '<p class="hint">未发现明显风险信号；仍建议在面试中确认工时、签证与合约条款。</p>';

    var plusRow = (data.plus || []).length
      ? '<div class="plus-row">' + data.plus.map(function (p) { return '<span class="plus">✓ ' + esc(p) + '</span>'; }).join('') + '</div>'
      : '';

    var gapRow = miss.length
      ? '<div class="tagline" style="margin-bottom:.8rem">' + miss.map(function (m) {
          return '<span class="tchip miss">缺口 · ' + esc(m) + '</span>';
        }).join('') + '</div>'
      : '<p class="hint" style="color:var(--ok)">本岗位所需的技能已全部覆盖。</p>';

    var scoreNote = hard.length
      ? '硬技能命中 ' + got.length + ' / ' + hard.length + ' 项'
      : '文本中技能词不足，匹配度仅供参考';

    $('#jdPlaceholder').hidden = true;
    $('#jdResult').hidden = false;
    $('#jdResult').innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:.5rem;margin-bottom:.6rem">' +
        '<h3 style="margin:0">解析结果</h3>' +
        '<span class="badge-src">' + (source === 'ai' ? '大模型语义解析' : '本地规则引擎') + '</span>' +
      '</div>' +
      '<div class="score-box">' +
        '<div class="score-num" style="color:' + scoreColor(score) + '">' + score + '<small>%</small></div>' +
        '<div style="flex:1">' +
          '<div class="score-meta">与你的画像匹配度 · ' + esc(scoreNote) + '</div>' +
          '<div class="bar"><i style="width:' + score + '%;background:' + scoreColor(score) + '"></i></div>' +
        '</div>' +
      '</div>' +
      plusRow +
      '<div class="cols">' +
        col('hard', '硬技能', hard.length, hardBody) +
        col('soft', '软技能', (data.soft || []).length, softBody) +
        col('hidden-c', '隐性偏好', (data.hidden || []).length, hiddenBody) +
        col('risk', '风险信号', (data.risks || []).length, riskBody) +
      '</div>' +
      '<div style="margin-top:.9rem">' +
        '<h4 style="font-size:.8rem;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);margin:.2rem 0 .5rem">技能缺口与可补强项</h4>' +
        gapRow +
      '</div>' +
      '<details style="margin-top:.6rem">' +
        '<summary style="cursor:pointer;font-size:.85rem;color:var(--ink-2)">查看原文（术语已标注，可点击查询释义）</summary>' +
        '<div class="job-jd" style="max-height:260px;margin-top:.5rem">' + Engine.highlight(text, TERMS) + '</div>' +
      '</details>';
  }

  function localParse(text) {
    var data = Engine.parseJD(text);
    renderJDResult(data, text, 'local');
  }

  /* ---- 可选：大模型解析 ---- */
  var AI_PROMPT = '你是香港求职顾问。请分析以下职位描述（JD），只输出一个 JSON 对象，不要任何解释或 Markdown 标记。' +
    'JSON 结构：{"hard":["硬技能词"],"soft":["软技能词"],' +
    '"hidden":[{"label":"隐性偏好短标签","detail":"一句话说明这对内地来港硕士意味着什么"}],' +
    '"risks":[{"level":"high|mid|low","label":"风险短标签","detail":"一句话说明如何核实或规避"}],' +
    '"plus":["加分项短标签"]}。要求：hard 与 soft 用简洁中文或通用技能名；hidden 关注语言、经验年限、到岗时间、' +
    '本地经验等潜台词；risks 关注签证、薪酬结构、工时、合约期限、职责边界；每项不超过 20 字，detail 不超过 40 字。';

  function aiParse(text) {
    var cfg = state.ai;
    return fetch(cfg.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cfg.key
      },
      body: JSON.stringify({
        model: cfg.model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: AI_PROMPT },
          { role: 'user', content: text }
        ]
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (payload) {
      var content = payload && payload.choices && payload.choices[0] &&
        payload.choices[0].message && payload.choices[0].message.content;
      if (!content) throw new Error('响应缺少 choices[0].message.content');
      var s = content.indexOf('{'), e = content.lastIndexOf('}');
      if (s < 0 || e < 0) throw new Error('返回内容不是 JSON');
      var obj = JSON.parse(content.slice(s, e + 1));
      return {
        hard: (obj.hard || []).map(function (x) { return typeof x === 'string' ? x : String(x.name || ''); }).filter(Boolean),
        soft: (obj.soft || []).map(function (x) { return { name: typeof x === 'string' ? x : String(x.name || '') }; }).filter(function (x) { return x.name; }),
        hidden: (obj.hidden || []).map(function (x) {
          return typeof x === 'string' ? { label: x, detail: '' } : { label: String(x.label || ''), detail: String(x.detail || '') };
        }).filter(function (x) { return x.label; }),
        risks: (obj.risks || []).map(function (x) {
          return typeof x === 'string'
            ? { level: 'mid', label: x, detail: '' }
            : { level: String(x.level || 'mid'), label: String(x.label || ''), detail: String(x.detail || '') };
        }).filter(function (x) { return x.label; }),
        plus: (obj.plus || []).map(String).filter(Boolean)
      };
    });
  }

  function runParse() {
    var text = $('#jdText').value.trim();
    if (!text) { toast('请先粘贴岗位描述文本'); $('#jdText').focus(); return; }

    var btn = $('#parseBtn');
    btn.disabled = true;
    btn.textContent = '解析中…';

    var reset = function () {
      btn.disabled = false;
      btn.textContent = '开始解析';
    };

    if (state.ai && state.ai.endpoint && state.ai.key) {
      aiParse(text).then(function (data) {
        var stillText = $('#jdText').value.trim();
        if (stillText !== text) return;
        renderJDResult(data, text, 'ai');
        toast('已由大模型完成解析');
      }).catch(function (err) {
        localParse(text);
        toast('大模型调用失败（' + err.message + '），已改用本地规则引擎');
      }).then(reset);
    } else {
      localParse(text);
      reset();
    }
  }

  /* ------------------------------ 术语抽屉 ------------------------------ */
  var termFilter = { cat: '全部', q: '' };

  function renderTermCats() {
    $('#termCats').innerHTML = TERM_CATS.map(function (c) {
      return '<button type="button" class="chip' + (termFilter.cat === c ? ' on' : '') +
        '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
    }).join('');
  }

  function renderTermList() {
    var list = Engine.searchTerms(termFilter.q).filter(function (t) {
      return termFilter.cat === '全部' || t.cat === termFilter.cat;
    });

    if (!list.length) {
      $('#termList').innerHTML = '<p class="empty-term">未找到匹配的术语，请更换关键词。</p>';
      return;
    }
    $('#termList').innerHTML = list.map(function (t) {
      return '<button type="button" class="term-item" data-term="' + esc(t.t) + '">' +
        '<b>' + esc(t.t) + '</b><small>' + esc(t.zh) + '</small></button>';
    }).join('');
  }

  function showTerm(key) {
    var t = Engine.findTerm(key);
    var box = $('#termDetail');
    if (!t) {
      box.hidden = false;
      $('#termList').hidden = true;
      box.innerHTML = '<p class="empty-term">术语库暂未收录「' + esc(key) + '」，可结合上下文判断，或更换关键词重新查询。</p>' +
        '<button type="button" class="btn btn-sm btn-ghost" data-back="1">← 回到列表</button>';
      return;
    }
    $('#termList').hidden = true;
    box.hidden = false;
    box.innerHTML =
      '<button type="button" class="btn btn-sm btn-ghost" data-back="1" style="align-self:flex-start">← 回到列表</button>' +
      '<h3>' + esc(t.t) + '</h3>' +
      '<span class="badge-src">' + esc(t.cat) + '</span>' +
      '<div class="term-block"><h4>中文释义</h4><p>' + esc(t.zh) + '</p></div>' +
      '<div class="term-block"><h4>语境示例</h4><p>' + esc(t.ex) + '</p></div>' +
      '<div class="term-block tip"><h4>港硕应对建议</h4><p>' + esc(t.tip) + '</p></div>';
    $('.drawer-body').scrollTop = 0;
  }

  function backToTermList() {
    $('#termDetail').hidden = true;
    $('#termList').hidden = false;
    $('#termSearch').focus();
  }

  function openDrawer() {
    $('#termDrawer').classList.add('open');
    $('#termDrawer').setAttribute('aria-hidden', 'false');
    $('#scrim').hidden = false;
    document.body.style.overflow = 'hidden';
    $('#termDetail').hidden = true;
    $('#termDetail').innerHTML = '';
    $('#termList').hidden = false;
    renderTermCats();
    renderTermList();
    setTimeout(function () { $('#termSearch').focus(); }, 60);
  }

  function closeDrawer() {
    $('#termDrawer').classList.remove('open');
    $('#termDrawer').setAttribute('aria-hidden', 'true');
    $('#scrim').hidden = true;
    document.body.style.overflow = '';
  }

  /* ------------------------------ 订阅 ------------------------------ */
  function subTracks() {
    var arr = [];
    JOBS.forEach(function (j) { if (arr.indexOf(j.sector) === -1) arr.push(j.sector); });
    return arr;
  }

  function renderSubTrackChips() {
    var picked = (state.sub && state.sub.tracks) || [];
    $('#subTracks').innerHTML = subTracks().map(function (s) {
      var on = picked.indexOf(s) !== -1;
      return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-track="' + esc(s) + '" ' +
        'aria-pressed="' + (on ? 'true' : 'false') + '">' + esc(s) + '</button>';
    }).join('');
    if (state.sub) {
      $('#subEmail').value = state.sub.email || '';
      $('#subFreq').value = state.sub.freq || $('#subFreq').options[0].value;
      $('#subState').innerHTML = '已保存：' + esc(state.sub.email) + ' · ' + esc((state.sub.tracks || []).join('、') || '全部方向') +
        ' · ' + esc(state.sub.freq) + '（仅保存在本机）';
    }
  }

  function briefText() {
    var tracks = (state.sub && state.sub.tracks) || [];
    var pool = filteredJobs().filter(function (x) { return !tracks.length || tracks.indexOf(x.j.sector) !== -1; });
    pool = pool.slice(0, 6);
    var today = new Date().toLocaleDateString('zh-HK');
    var lines = ['【' + SITE.name + '】岗位简报 · ' + today, ''];
    pool.forEach(function (x, i) {
      lines.push((i + 1) + '. ' + x.j.title + '｜' + x.j.company + '｜' + x.j.loc + '｜' + x.j.salary +
        '｜匹配 ' + x.s + '%｜' + x.j.source);
    });
    lines.push('');
    lines.push('来源：JobsDB / LinkedIn / Indeed（示例数据，非真实在招职位）');
    return lines.join('\n');
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; });
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return Promise.resolve(ok);
  }

  function downloadCsv() {
    var rows = [['岗位', '公司', '行业', '地点', '类型', '薪酬', '来源', '发布', '匹配度', '缺口技能']];
    filteredJobs().forEach(function (x) {
      rows.push([x.j.title, x.j.company, x.j.sector, x.j.loc, x.j.type, x.j.salary,
        x.j.source, x.j.posted, x.s + '%', Engine.gap(x.j.skills, state.skills).join('/')]);
    });
    var csv = rows.map(function (r) {
      return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\r\n');

    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'jobbridge-岗位清单.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    toast('CSV 文件已导出，可使用 Excel 打开');
  }

  /* ------------------------------ 大模型配置 ------------------------------ */
  function renderAiState() {
    var el = $('#aiState');
    if (state.ai && state.ai.endpoint && state.ai.key) {
      el.textContent = '已配置：' + state.ai.model;
      $('#aiEndpoint').value = state.ai.endpoint;
      $('#aiModel').value = state.ai.model;
      $('#aiKey').value = state.ai.key;
    } else {
      el.textContent = '未配置';
    }
  }

  /* ------------------------------ 事件绑定 ------------------------------ */
  function bindEvents() {
    /* 主题 */
    $('#themeBtn').addEventListener('click', function () {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(state.theme);
      save();
    });

    /* 画像：技能 chip */
    $('#skillPicker').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-skill]');
      if (!btn) return;
      var s = btn.getAttribute('data-skill');
      var i = state.skills.indexOf(s);
      if (i === -1) { state.skills.push(s); } else { state.skills.splice(i, 1); }
      save();
      renderProfile();
      renderJobs();
      renderHero();
      if (lastParse) renderJDResult(lastParse.data, lastParse.text, lastParse.source);
    });

    $('#trackSel').addEventListener('change', function () {
      state.track = this.value; save(); renderJobs(); renderHero();
    });
    $('#expSel').addEventListener('change', function () { state.exp = this.value; save(); });
    $('#visaSel').addEventListener('change', function () { state.visa = this.value; save(); renderProfile(); });

    $('#resetProfile').addEventListener('click', function () {
      state.skills = DEFAULT_SKILLS.slice();
      state.track = '全部';
      state.exp = '应届毕业生（0–1 年）';
      state.visa = 'IANG（可自行办理）';
      save(); renderProfile(); renderJobs(); renderHero();
      if (lastParse) renderJDResult(lastParse.data, lastParse.text, lastParse.source);
      toast('已恢复默认设置');
    });

    /* 筛选 */
    $('#qInput').addEventListener('input', function () {
      state.filters.q = this.value; save(); renderJobs();
    });
    $('#sectorSel').addEventListener('change', function () { state.filters.sector = this.value; save(); renderJobs(); });
    $('#typeSel').addEventListener('change', function () { state.filters.type = this.value; save(); renderJobs(); });
    $('#sourceSel').addEventListener('change', function () { state.filters.source = this.value; save(); renderJobs(); });
    $('#sortSel').addEventListener('change', function () { state.filters.sort = this.value; save(); renderJobs(); });

    /* 岗位卡片 */
    $('#jobGrid').addEventListener('click', function (e) {
      var actBtn = e.target.closest('[data-act]');
      var card = e.target.closest('.job-card');
      if (!card) return;
      var id = card.getAttribute('data-id');
      var job = JOBS.filter(function (j) { return j.id === id; })[0];
      if (!job) return;

      if (actBtn) {
        var act = actBtn.getAttribute('data-act');
        if (act === 'expand') {
          expanded[id] = !expanded[id];
          var box = card.querySelector('.job-jd');
          box.hidden = !expanded[id];
          actBtn.textContent = expanded[id] ? '收起 JD' : '查看 JD';
          actBtn.setAttribute('aria-expanded', expanded[id] ? 'true' : 'false');
        } else if (act === 'parse') {
          $('#jdText').value = job.jd;
          $('#jd').scrollIntoView({ behavior: 'smooth', block: 'start' });
          runParse();
          toast('已载入「' + job.title + '」的岗位描述');
        }
        return;
      }

      var termBtn = e.target.closest('.term-hit');
      if (termBtn) {
        openDrawer();
        showTerm(termBtn.getAttribute('data-term'));
      }
    });

    /* JD 解析 */
    $('#parseBtn').addEventListener('click', runParse);
    $('#sampleBtn').addEventListener('click', function () {
      $('#jdText').value = JOBS[0].jd;
      runParse();
    });
    $('#clearBtn').addEventListener('click', function () {
      $('#jdText').value = '';
      lastParse = null;
      $('#jdResult').hidden = true;
      $('#jdResult').innerHTML = '';
      $('#jdPlaceholder').hidden = false;
      $('#jdText').focus();
    });
    $('#jdText').addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runParse(); }
    });

    /* 结果里的技能 chip → 加入画像 */
    $('#jdResult').addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      if (add) {
        var s = add.getAttribute('data-add');
        if (state.skills.indexOf(s) === -1) {
          state.skills.push(s); save(); renderProfile(); renderJobs();
          if (lastParse) renderJDResult(lastParse.data, lastParse.text, lastParse.source);
          toast('已将「' + s + '」加入技能画像');
        } else {
          toast('技能画像中已包含「' + s + '」');
        }
        return;
      }
      var hit = e.target.closest('.term-hit');
      if (hit) {
        openDrawer();
        showTerm(hit.getAttribute('data-term'));
      }
    });

    /* 大模型配置 */
    $('#aiSave').addEventListener('click', function () {
      var endpoint = $('#aiEndpoint').value.trim();
      var model = $('#aiModel').value.trim();
      var key = $('#aiKey').value.trim();
      if (!endpoint || !model || !key) { toast('请完整填写三项配置后再启用'); return; }
      state.ai = { endpoint: endpoint, model: model, key: key };
      save(); renderAiState(); toast('大模型解析已启用，配置仅保存在本机');
    });
    $('#aiClear').addEventListener('click', function () {
      state.ai = null; save(); renderAiState();
      $('#aiEndpoint').value = ''; $('#aiModel').value = ''; $('#aiKey').value = '';
      toast('已清除大模型配置');
    });

    /* 订阅 */
    $('#subForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('#subEmail').value.trim();
      if (!email || email.indexOf('@') < 0) { toast('请输入有效的邮箱地址'); $('#subEmail').focus(); return; }
      var tracks = $$('#subTracks .chip.on').map(function (b) { return b.getAttribute('data-track'); });
      state.sub = { email: email, tracks: tracks, freq: $('#subFreq').value, at: Date.now() };
      save(); renderSubTrackChips(); toast('订阅设置已保存至本机');
    });
    $('#subTracks').addEventListener('click', function (e) {
      var chip = e.target.closest('[data-track]');
      if (!chip) return;
      chip.classList.toggle('on');
      var on = chip.classList.contains('on');
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $('#copyBrief').addEventListener('click', function () {
      copyText(briefText()).then(function (ok) {
        toast(ok ? '简报已复制，可直接粘贴至邮件或即时通讯工具' : '复制失败，请手动选取文本');
      });
    });
    $('#downloadCsv').addEventListener('click', downloadCsv);

    /* 术语抽屉 */
    $('#termBtn').addEventListener('click', openDrawer);
    $('#termFab').addEventListener('click', openDrawer);
    $('#drawerClose').addEventListener('click', closeDrawer);
    $('#scrim').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('#termDrawer').classList.contains('open')) closeDrawer();
    });
    $('#termSearch').addEventListener('input', function () {
      termFilter.q = this.value;
      $('#termDetail').hidden = true;
      $('#termList').hidden = false;
      renderTermList();
    });
    $('#termCats').addEventListener('click', function (e) {
      var chip = e.target.closest('[data-cat]');
      if (!chip) return;
      termFilter.cat = chip.getAttribute('data-cat');
      renderTermCats(); renderTermList();
    });
    $('#termDrawer').addEventListener('click', function (e) {
      var item = e.target.closest('.term-item');
      if (item) { showTerm(item.getAttribute('data-term')); return; }
      if (e.target.closest('[data-back]')) backToTermList();
    });
  }

  /* ------------------------------ 启动 ------------------------------ */
  function init() {
    load();
    applyTheme(state.theme);
    renderHero();
    renderProfile();
    buildFilterOptions();
    renderJobs();
    renderSubTrackChips();
    renderTermCats();
    renderTermList();
    renderAiState();
    bindEvents();

    if (!state.skills.length) {
      state.skills = DEFAULT_SKILLS.slice();
      renderProfile();
    }
    console.info('%c' + SITE.name + ' ' + SITE.version + ' 已就绪：' + JOBS.length + ' 个示例岗位、' + TERMS.length + ' 条术语。',
      'color:#0f766e;font-weight:600');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
