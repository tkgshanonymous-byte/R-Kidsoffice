document.addEventListener('DOMContentLoaded', () => {
  console.log('德光匿名的孩子們 Archives - 動畫初始化完成');

  // 自動替動態元素加上 reveal 監聽類別
  const animateTargets = document.querySelectorAll('.card, .hotlist, section.file h2, section.file p, .contact-box, .allow, .deny');
  animateTargets.forEach(el => el.classList.add('reveal'));

  // IntersectionObserver 滾動監聽設定
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // 播放完即解除監聽
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('danmakuContainer');
  if (!container) return;

  const rawTextList = [
    "💬 現在的德光是不是校長一人獨大然後整個學務處都是他的人",
    "👀 意見很多週刊路過～～發現這裡意見很多，消息也很多～～",
    "🏫 學校對於學生意見的反饋機制到底有沒有在運作？",
    "📢 為什麼許多校園議題討論到最後都無疾而終？",
    "🎓 希望學校能更多聽聽學生的真實心聲",
    "❓ 關於校園規章與服儀規定，大家怎麼看？",
    "🏛️ 歡迎來到德光匿名的孩子們！",
    "💭 自由表達屬於我們的聲音，紀錄校園真實動態",
    "🌟 感謝所有關注校園公共議題的同學",
    "🔍 校園資訊透明化需要大家一起關注",
    "💡 有任何想法都歡迎在討論區留言！"
  ];

  const trackCount = 5; // 5 個軌道
  const MIN_GAP = 60;   // 同軌道兩條彈幕之間的【最小安全像素距離】(px)
  
  // 記錄每個軌道目前【最靠右（最後發射）】的那條彈幕 DOM 元素
  const lastItemInTrack = new Array(trackCount).fill(null);

  let availableTexts = [];

  function getUniqueText() {
    if (availableTexts.length === 0) {
      availableTexts = [...rawTextList].sort(() => Math.random() - 0.5);
    }
    return availableTexts.pop();
  }

  // 嘗試在隨機軌道發射彈幕
  function trySpawn() {
    const containerWidth = container.clientWidth;
    const availableTracks = [];

    // 檢查哪些軌道有足夠的安全距離
    for (let i = 0; i < trackCount; i++) {
      const lastItem = lastItemInTrack[i];
      if (!lastItem) {
        availableTracks.push(i); // 軌道是空的，可以直接發射
      } else {
        // 取得前一條彈幕目前的右邊界座標
        const rect = lastItem.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const lastItemRight = rect.right - containerRect.left;

        // 前一條彈幕的尾巴已經進入螢幕，且距離右邊界大於 MIN_GAP，才允許發射下一條
        if (lastItemRight < containerWidth - MIN_GAP) {
          availableTracks.push(i);
        }
      }
    }

    if (availableTracks.length === 0) return; // 全部軌道都太擠，暫不發射

    // 隨機選一個有安全車距的軌道
    const track = availableTracks[Math.floor(Math.random() * availableTracks.length)];

    const item = document.createElement('div');
    item.className = 'danmaku-item';
    item.textContent = getUniqueText();

    // 垂直高度
    const topPosition = 10 + track * 16;
    item.style.top = `${topPosition}%`;

    // 視覺屬性
    const opacity = 0.5 + Math.random() * 0.35;
    const fontSize = 0.85 + Math.random() * 0.2;
    item.style.setProperty('--opacity', opacity);
    item.style.setProperty('--size', `${fontSize}rem`);

    // 初始位置：剛好在螢幕右邊界外面
    let xPos = containerWidth;
    item.style.transform = `translate3d(${xPos}px, 0, 0)`;

    container.appendChild(item);
    lastItemInTrack[track] = item; // 更新該軌道最後發射的彈幕

    // 統一移動速度（像素/秒），速度完全一致就【絕對不會追撞】
    const speed = 120 + Math.random() * 30; // 120px ~ 150px / 秒
    let lastTime = performance.now();

    function animate(now) {
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      xPos -= speed * deltaTime;
      item.style.transform = `translate3d(${xPos}px, 0, 0)`;

      // 如果完全離開螢幕左側，刪除元素
      if (xPos < -item.offsetWidth - 50) {
        if (lastItemInTrack[track] === item) {
          lastItemInTrack[track] = null;
        }
        item.remove();
      } else {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  // 定時檢查發射 (每 1.2 秒檢查一次)
  setInterval(trySpawn, 1200);

  // 初始發射
  trySpawn();
});

function updateClock() {
  const now = new Date();
  
  // 日期格式化：YYYY-MM-DD
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  
  // 時間格式化：HH:MM:SS
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateElem = document.getElementById('currentDate');
  const timeElem = document.getElementById('currentTime');

  if (dateElem) dateElem.textContent = `${year}-${month}-${date}`;
  if (timeElem) timeElem.textContent = `${hours}:${minutes}:${seconds}`;
}

// 每秒更新一次
setInterval(updateClock, 1000);
updateClock(); // 初始呼叫

async function fetchViewCount() {
  const countElem = document.getElementById('viewCount');
  if (!countElem) return;

  // 建議將 'anonymous-tkgsh-site' 替換成你網站專屬的域名或唯一識別名稱
  const namespace = 'anonymous-tkgsh-site'; 
  const key = 'visits';

  try {
    const res = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
    const data = await res.json();
    countElem.textContent = data.value.toLocaleString(); // 加上千分位標點
  } catch (err) {
    countElem.textContent = '---';
  }
}

fetchViewCount();

// -----------------------------------
// 辦公室即時搜尋/查詢功能
// -----------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('keyup', () => {
            const query = searchInput.value.trim().toLowerCase();
            const searchableItems = document.querySelectorAll('.searchable-item');

            searchableItems.forEach(item => {
                const text = item.innerText.toLowerCase();
                
                if (query === '' || text.includes(query)) {
                    item.classList.remove('hidden-item');
                } else {
                    item.classList.add('hidden-item');
                }
            });
        });
    }
});