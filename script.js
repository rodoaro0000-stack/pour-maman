(() => {
  const $ = (selector) => document.querySelector(selector);
  const body = document.body;
  const envelope = $('#envelope');
  const replayBtn = $('#replayBtn');
  const letterCard = $('#letterCard');
  const letterBody = $('#letterBody');
  const letterHint = $('#letterHint');
  const fxLayer = $('#fxLayer');
  const starsLayer = $('#starsLayer');
  const sparkLayer = $('#sparkLayer');
  const bgMusic = $('#bgMusic');
  const musicToggle = $('#musicToggle');

  const LETTER = `Ma maman,\n\nAujourd'hui, c'est ton anniversaire, et j'avais envie de prendre un moment pour te dire quelque chose que je ne dis peut-être pas assez souvent : merci.\n\nMerci pour ta présence, ta patience, tes conseils, tes encouragements et toutes ces petites choses que tu fais parfois sans même y penser. Tu as une façon unique de rendre les journées plus belles et les moments difficiles un peu plus légers.\n\nJe te souhaite une année remplie de douceur, de beaux souvenirs, de rires, de santé et de tout ce qui peut te rendre heureuse. Tu mérites de recevoir autant de bonheur que tu en donnes autour de toi.\n\nJoyeux anniversaire Maman. Profite de cette journée, elle est à ton image : précieuse et pleine de lumière.\n\nJe t'aime très fort. 🤍`;

  let timers = [];
  let runId = 0;
  let typingTimer = null;
  let musicStarted = false;

  const wait = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  };

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    if (typingTimer) clearInterval(typingTimer);
    typingTimer = null;
  }

  function setState(state) {
    body.className = `state-${state}`;
  }


  function startMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0.5;
    const promise = bgMusic.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {});
    }
    musicStarted = true;
    if (musicToggle) {
      musicToggle.textContent = '♫ Musique';
      musicToggle.setAttribute('aria-label', 'Mettre la musique en pause');
    }
  }

  function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      startMusic();
    } else {
      bgMusic.pause();
      if (musicToggle) {
        musicToggle.textContent = '♫ Pause';
        musicToggle.setAttribute('aria-label', 'Relancer la musique');
      }
    }
  }

  function createStars() {
    starsLayer.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 75; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.textContent = Math.random() > .55 ? '✦' : '·';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.fontSize = `${4 + Math.random() * 8}px`;
      star.style.setProperty('--duration', `${2.5 + Math.random() * 4}s`);
      star.style.animationDelay = `${Math.random() * 4}s`;
      fragment.appendChild(star);
    }
    starsLayer.appendChild(fragment);
  }

  function sparkles(count = 35) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('span');
      spark.className = 'spark';
      spark.textContent = Math.random() > .5 ? '✦' : '✧';
      spark.style.left = `${Math.random() * 100}%`;
      spark.style.top = `${75 + Math.random() * 30}%`;
      spark.style.setProperty('--duration', `${2.2 + Math.random() * 2.5}s`);
      spark.style.animationDelay = `${Math.random() * .8}s`;
      spark.style.fontSize = `${8 + Math.random() * 12}px`;
      fragment.appendChild(spark);
    }
    sparkLayer.appendChild(fragment);
    wait(() => { sparkLayer.innerHTML = ''; }, 5000);
  }

  function burst(count = 80) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'fx-particle';
      p.textContent = Math.random() > .45 ? '✦' : '✧';
      p.style.left = '50%';
      p.style.top = '48%';
      p.style.setProperty('--size', `${8 + Math.random() * 13}px`);
      p.style.setProperty('--duration', `${1 + Math.random() * 1.4}s`);
      p.style.setProperty('--x', `${(Math.random() - .5) * 75}vw`);
      p.style.setProperty('--y', `${(Math.random() - .5) * 65}vh`);
      fxLayer.appendChild(p);
      wait(() => p.remove(), 2600);
    }
  }

  function typeLetter() {
    letterBody.textContent = '';
    letterHint.style.display = '';
    const text = LETTER;
    let index = 0;
    typingTimer = setInterval(() => {
      letterBody.textContent += text[index++];
      if (index >= text.length) {
        clearInterval(typingTimer);
        typingTimer = null;
        letterHint.textContent = 'Une lettre juste pour toi ✨';
        wait(finale, 2200);
      }
    }, 55);
  }

  function showFullLetter() {
    if (typingTimer) clearInterval(typingTimer);
    typingTimer = null;
    letterBody.textContent = LETTER;
    letterHint.textContent = 'Une lettre juste pour toi ✨';
  }

  function finale() {
    if (body.classList.contains('state-finale')) return;
    setState('finale');
    burst(105);
    sparkles(60);
  }

  function play() {
    startMusic();
    const currentRun = ++runId;
    clearTimers();
    letterBody.textContent = '';
    letterHint.textContent = 'Clique sur la lettre pour la lire ✨';
    letterHint.style.display = '';
    setState('open');
    sparkles(30);

    wait(() => {
      if (currentRun !== runId) return;
      burst(65);
    }, 700);

    wait(() => {
      if (currentRun !== runId) return;
      setState('message');
      burst(55);
    }, 2200);

    wait(() => {
      if (currentRun !== runId) return;
      setState('letter');
    }, 4700);

    wait(() => {
      if (currentRun !== runId) return;
      typeLetter();
    }, 5550);
  }

  function reset() {
    ++runId;
    if (bgMusic) {
      bgMusic.pause();
      bgMusic.currentTime = 0;
    }
    musicStarted = false;
    clearTimers();
    fxLayer.innerHTML = '';
    sparkLayer.innerHTML = '';
    letterBody.textContent = '';
    letterHint.textContent = 'Clique sur la lettre pour la lire ✨';
    letterHint.style.display = '';
    setState('idle');
  }

  envelope.addEventListener('click', play);
  envelope.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      play();
    }
  });

  letterCard.addEventListener('click', showFullLetter);
  letterCard.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showFullLetter();
    }
  });

  replayBtn.addEventListener('click', reset);
  musicToggle.addEventListener('click', toggleMusic);

  createStars();
})();
