// Celebration Module: Falling Confetti Ribbons & Toast Notification

export function triggerCelebration(message) {
  // Toast Popup Banner
  let toast = document.querySelector('.celebration-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'celebration-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);

  // Spawn Falling Confetti Ribbons
  const palette = ['#2373F4', '#578EF5', '#65D0F4', '#25d325', '#facc15', '#ff4757'];
  for (let i = 0; i < 30; i++) {
    const ribbon = document.createElement('div');
    ribbon.className = 'confetti-ribbon';

    const width = Math.random() * 8 + 6;   // Width: 6px - 14px
    const height = Math.random() * 16 + 12; // Height: 12px - 28px
    const color = palette[Math.floor(Math.random() * palette.length)];
    const left = Math.random() * 100;      // Random horizontal position (0-100vw)
    const delay = Math.random() * 0.4;     // Random animation delay

    ribbon.style.width = `${width}px`;
    ribbon.style.height = `${height}px`;
    ribbon.style.backgroundColor = color;
    ribbon.style.left = `${left}vw`;
    ribbon.style.animationDelay = `${delay}s`;

    document.body.appendChild(ribbon);

    // Clean up particle from DOM
    setTimeout(() => {
      ribbon.remove();
    }, 2200);
  }
}
