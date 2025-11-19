// ========= Vercel KV (Upstash Redis) 最终版 =========
// 直接把下面两行改成你刚复制的！！！
const UPSTASH_URL   = 'KV_REST_API_URL="***************"';           // ← 粘贴第3行的网址
const UPSTASH_TOKEN = 'KV_REST_API_TOKEN="*****************"';     // ← 粘贴第2行的整串 token

let words = [];

// 从云端加载单词本
async function loadWords() {
  try {
    const res = await fetch(`${UPSTASH_URL}/get/serbian-words`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const json = await res.json();
    if (json.result) {
      words = JSON.parse(json.result);
    }
  } catch (e) {
    console.log('第一次使用，初始化为空');
    words = [];
  }
  renderWords();
}

// 保存到云端
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

// 你原来的 renderWords / playAudio / deleteWord / addWord 全部保持不动！
// 只要它们最后调用 saveWords() 就行

window.onload = loadWords;