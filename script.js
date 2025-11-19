// ================= Vercel KV (Upstash Redis) 完整版 =================
// 自动从 Vercel 环境变量读取（你已经在后台加好了 UPSTASH_URL 和 UPSTASH_TOKEN）
const UPSTASH_URL   = import.meta.env.VITE_UPSTASH_URL || window.VITE_UPSTASH_URL;
const UPSTASH_TOKEN = import.meta.env.VITE_UPSTASH_TOKEN || window.VITE_UPSTASH_TOKEN;

let words = [];

// ================ 从云端加载单词本 ================
async function loadWords() {
  // 如果没配环境变量，就用本地空数组（防止报错）
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.log('未配置 Upstash，当前仅本地模式');
    renderWords();
    return;
  }

  try {
    const res = await fetch(`${UPSTASH_URL}/get/serbian-words`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const json = await res.json();
    if (json.result !== null) {
      words = JSON.parse(json.result);
    } else {
      words = [];
    }
  } catch (e) {
    console.log('云端加载失败，可能是第一次使用', e);
    words = [];
  }
  renderWords();
}

// ================ 保存到云端 ================
async function saveWords() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.log('未配置 Upstash，跳过云端保存');
    return;
  }

  try {
    await fetch(`${UPSTASH_URL}/set/serbian-words`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(words)
    });
    console.log('✅ 已成功同步到云端（Vercel KV）');
  } catch (e) {
    console.error('云端保存失败', e);
  }
}

// ================ 渲染单词卡片 ================
function renderWords() {
  const container = document.getElementById('wordsContainer');
  if (!container) return;
  container.innerHTML = '';
  words.forEach((word, index) => {
    const div = document.createElement('div');
    div.className = 'word-card';
    div.innerHTML = `
      <h3>${word.sr} <small>(${word.pronounce || ''})</small></h3>
      <p><strong>中文：</strong>${word.cn}</p>
      ${word.example ? `<p><em>例句：${word.example}</em></p>` : ''}
      <button onclick="playAudio('${word.audio || ''}')">🔊 发音</button>
      <button onclick="deleteWord(${index})" style="background:red;color:white;margin-left:8px;">删除</button>
    `;
    container.appendChild(div);
  });
}

// ================ 播放音频（手机兼容版） ================
function playAudio(src) {
  if (!src) return alert('没有音频链接');
  const audio = new Audio(src);
  audio.play().catch(() => {
    alert('手机安全限制：请先点击页面任意位置，再点发音按钮');
  });
}

// ================ 删除单词 ================
function deleteWord(index) {
  if (confirm('确定删除这个单词？')) {
    words.splice(index, 1);
    saveWords();   // 自动同步云端
    renderWords();
  }
}

// ================ 添加新单词 ================
window.addWord = function () {
  const sr = prompt('塞尔维亚语单词')?.trim();
  if (!sr) return;
  const pronounce = prompt('发音（可选）')?.trim();
  const cn = prompt('中文意思')?.trim();
  const example = prompt('例句（可选）')?.trim();
  const audio = prompt('音频链接（可选，mp3地址）')?.trim();

  words.push({ sr, pronounce, cn, example, audio });
  saveWords();   // 自动同步云端
  renderWords();
};

// ================ 页面加载就从云端拉数据 ================
window.onload = loadWords;