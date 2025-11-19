// ========= Vercel KV 最终安全版（用环境变量）=========
const UPSTASH_URL   = import.meta.env.VITE_UPSTASH_URL;
const UPSTASH_TOKEN = import.meta.env.VITE_UPSTASH_TOKEN;
let words = [];

// 加载和保存代码完全不变！！！
async function loadWords() {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.log('环境变量未配置');
    renderWords(); 
    return;
  }
  try {
    const res = await fetch(`${UPSTASH_URL}/get/serbian-words`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const json = await res.json();
    if (json.result) words = JSON.parse(json.result);
  } catch (e) {
    words = [];
  }
  renderWords();
}

async function saveWords() {
  try {
    await fetch(`${UPSTASH_URL}/set/serbian-words`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(words)
    });
    console.log('云端同步成功！');
  } catch (e) {
    alert('保存失败');
  }
}

// 其他代码（renderWords、addWord、deleteWord、playAudio）完全不动

window.onload = loadWords;