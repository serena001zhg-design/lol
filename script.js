let words = [];

// 从本地或云端加载单词（先用本地空数组）
function loadWords() {
apiKey: "AIzaSyALoOzZu6uPdEuZvbw9PMq3Vxljb8ddL-A",
  authDomain: "lal-001-31ca4.firebaseapp.com",
  projectId: "lal-001-31ca4",
  storageBucket: "lal-001-31ca4.firebasestorage.app",
  messagingSenderId: "779055965092",
  appId: "1:779055965092:web:f334511adc3b6c0ae29731",
    const saved = localStorage.getItem('serbianWords');
    if (saved) words = JSON.parse(saved);
    renderWords();
}
// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const storageRef = storage.ref();
// 保存到浏览器（临时用，后面你再想换云端我再教你）
function saveWords() {
    localStorage.setItem('serbianWords', JSON.stringify(words));
}

// 显示所有单词
function renderWords() {
    const container = document.getElementById('wordsContainer');
    if (!container) return;
    container.innerHTML = '';
    words.forEach((word, index) => {
        const div = document.createElement('div');
        div.className = 'word-card';
        div.innerHTML = `
            <h3>$$ {word.sr} ( $${word.pronounce || ''})</h3>
            <p>${word.cn}</p>
            <p><em>${word.example || ''}</em></p>
            <button onclick="playAudio('${word.audio || ''}')">发音</button>
            <button onclick="deleteWord(${index})">删除</button>
        `;
        container.appendChild(div);
    });
}

// 播放音频
function playAudio(src) {
  if (!src) return alert('没有音频链接');
  const audio = new Audio(src);
  audio.play().catch(e => {
    alert('手机需要先点击页面任意位置才能播放音频哦~（浏览器安全限制）');
  });
// 删除单词
function deleteWord(index) {
    if (confirm('确定删除？')) {
        words.splice(index, 1);
        saveWords();
        renderWords();
    }
}

// 添加新单词（按钮点这里会触发）
window.addWord = function() {
    const sr = prompt('塞尔维亚语单词')?.trim();
    if (!sr) return;
    const pronounce = prompt('发音（可选）')?.trim();
    const cn = prompt('中文意思')?.trim();
    const example = prompt('例句（可选）')?.trim();
    const audio = prompt('音频链接（可选，mp3地址）')?.trim();

    words.push({ sr, pronounce, cn, example, audio });
    saveWords();
    renderWords();
}

// 页面加载完执行
window.onload = loadWords;