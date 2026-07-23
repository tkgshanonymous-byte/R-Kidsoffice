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
