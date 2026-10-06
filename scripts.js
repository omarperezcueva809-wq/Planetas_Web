document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('solarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 300));
  resizeCanvas();

  const celestialObjects = [
    { 
      id: 'sun', name: 'El Sol', baseColor: '#ffaa00', radius: 55, distance: 0, speed: 0, angle: 0, au: 0, 
      desc: 'Estrella central del sistema solar que genera energía mediante fusión nuclear.', 
      dia: '1,392,700 km', dist: '0 AU', orb: 'N/A', temp: '5,500 °C', comp: '73% Hidrógeno, 25% Helio', grav: '274.0 m/s²', moons: '0' 
    },
    { 
      id: 'mercury', name: 'Mercurio', baseColor: '#9ca3af', radius: 10, distance: 100, speed: 0.03, angle: Math.random() * Math.PI * 2, au: 0.39, 
      desc: 'Planeta más cercano al Sol y el más pequeño del sistema.', 
      dia: '4,879 km', dist: '0.39 AU', orb: '88 días', temp: '167 °C', comp: 'Hierro y silicatos', grav: '3.7 m/s²', moons: '0' 
    },
    { 
      id: 'venus', name: 'Venus', baseColor: '#facc15', radius: 15, distance: 150, speed: 0.02, angle: Math.random() * Math.PI * 2, au: 0.72, 
      desc: 'Mundo rocoso con densa atmósfera de CO2 y efecto invernadero extremo.', 
      dia: '12,104 km', dist: '0.72 AU', orb: '225 días', temp: '464 °C', comp: 'Dióxido de carbono', grav: '8.87 m/s²', moons: '0' 
    },
    { 
      id: 'earth', name: 'Tierra', baseColor: '#38bdf8', radius: 18, distance: 210, speed: 0.015, angle: Math.random() * Math.PI * 2, au: 1.00, hasMoon: true, isEarth: true, 
      desc: 'Nuestro hogar, el único cuerpo celeste conocido que alberga vida.', 
      dia: '12,742 km', dist: '1.00 AU', orb: '365 días', temp: '15 °C', comp: 'Nitrógeno, Oxígeno, Agua', grav: '9.81 m/s²', moons: '1 (Luna)' 
    },
    { 
      id: 'mars', name: 'Marte', baseColor: '#f87171', radius: 12, distance: 280, speed: 0.011, angle: Math.random() * Math.PI * 2, au: 1.52, 
      desc: 'El Planeta Rojo, famoso por su óxido de hierro y antiguos cauces.', 
      dia: '6,779 km', dist: '1.52 AU', orb: '687 días', temp: '-65 °C', comp: 'Dióxido de carbono', grav: '3.72 m/s²', moons: '2' 
    },
    { 
      id: 'jupiter', name: 'Júpiter', baseColor: '#fb923c', radius: 30, distance: 380, speed: 0.007, angle: Math.random() * Math.PI * 2, au: 5.20, isJupiter: true, 
      desc: 'El gigante gaseoso más grande, con su icónica Gran Mancha Roja.', 
      dia: '139,820 km', dist: '5.20 AU', orb: '11.8 años', temp: '-110 °C', comp: 'Hidrógeno y Helio', grav: '24.79 m/s²', moons: '95' 
    },
    { 
      id: 'saturn', name: 'Saturno', baseColor: '#fde047', radius: 25, distance: 480, speed: 0.0048, angle: Math.random() * Math.PI * 2, au: 9.58, hasRings: true, 
      desc: 'Majestuoso gigante gaseoso célebre por su deslumbrante sistema de anillos.', 
      dia: '116,460 km', dist: '9.58 AU', orb: '29.5 años', temp: '-140 °C', comp: 'Hidrógeno, Helio y Hielo', grav: '10.44 m/s²', moons: '146' 
    },
    { 
      id: 'uranus', name: 'Urano', baseColor: '#2dd4bf', radius: 20, distance: 580, speed: 0.003, angle: Math.random() * Math.PI * 2, au: 19.2, 
      desc: 'Gigante helado caracterizado por poseer un eje de rotación tumbado.', 
      dia: '50,724 km', dist: '19.22 AU', orb: '84 años', temp: '-195 °C', comp: 'Agua, amoníaco y metano', grav: '8.69 m/s²', moons: '28' 
    },
    { 
      id: 'neptune', name: 'Neptuno', baseColor: '#60a5fa', radius: 19, distance: 680, speed: 0.002, angle: Math.random() * Math.PI * 2, au: 30.1, 
      desc: 'El planeta más distante, un mundo azul tempestuoso e hiperfrío.', 
      dia: '49,244 km', dist: '30.05 AU', orb: '165 años', temp: '-200 °C', comp: 'Hidrógeno, Helio y Metano', grav: '11.15 m/s²', moons: '16' 
    }
  ];

  let isRunning = true;
  let showOrbits = true;
  let speedMultiplier = 1.0;
  let tiltFactor = 0.50;
  let selectedPlanetId = 'all';
  let sunPulse = 0;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // ☀️ Sol
    sunPulse += 0.025;
    const currentSunRadius = celestialObjects[0].radius + Math.sin(sunPulse) * 2;

    const sunCorona = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, currentSunRadius * 2.5);
    sunCorona.addColorStop(0, '#ffffff');
    sunCorona.addColorStop(0.4, '#ffaa00');
    sunCorona.addColorStop(1, 'rgba(255, 68, 0, 0)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, currentSunRadius * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = sunCorona;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, currentSunRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffaa00';
    ctx.shadowBlur = 40;
    ctx.shadowColor = '#ff4400';
    ctx.fill();
    ctx.shadowBlur = 0;

    // 🪐 Planetas y Órbitas
    for (let i = 1; i < celestialObjects.length; i++) {
      const p = celestialObjects[i];

      if (showOrbits) {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, p.distance, p.distance * tiltFactor, 0, 0, Math.PI * 2);
        ctx.strokeStyle = selectedPlanetId === p.id ? 'rgba(0, 242, 254, 0.8)' : 'rgba(125, 125, 125, 0.15)';
        ctx.lineWidth = selectedPlanetId === p.id ? 2 : 1;
        ctx.stroke();
      }

      const x = centerX + Math.cos(p.angle) * p.distance;
      const y = centerY + Math.sin(p.angle) * (p.distance * tiltFactor);

      p.currentX = x;
      p.currentY = y;

      if (p.hasRings) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(0.3);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius * 2.4, p.radius * 0.8, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(x, y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.baseColor;
      ctx.shadowBlur = selectedPlanetId === p.id ? 25 : 8;
      ctx.shadowColor = p.baseColor;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = selectedPlanetId === p.id ? 'var(--primary-cyan)' : '#f8fafc';
      ctx.font = '12px Outfit, sans-serif';
      ctx.fillText(p.name, x + p.radius + 8, y + 4);

      if (isRunning) {
        p.angle += p.speed * speedMultiplier;
      }
    }

    requestAnimationFrame(render);
  }

  // 🎛️ Controles e Interacción Táctil
  const planetSelect = document.getElementById('planetSelect');
  const speedRange = document.getElementById('speedRange');
  const speedVal = document.getElementById('speedVal');
  const tiltRange = document.getElementById('tiltRange');
  const tiltVal = document.getElementById('tiltVal');
  const pausePlayBtn = document.getElementById('pausePlayBtn');
  const toggleOrbitsBtn = document.getElementById('toggleOrbitsBtn');

  if (planetSelect) {
    planetSelect.addEventListener('change', (e) => {
      selectedPlanetId = e.target.value;
      if (selectedPlanetId !== 'all') {
        const p = celestialObjects.find(item => item.id === selectedPlanetId);
        if (p) openTelemetryModal(p);
      } else {
        document.getElementById('infoModal').classList.add('hidden');
      }
    });
  }

  if (speedRange) {
    speedRange.addEventListener('input', (e) => {
      speedMultiplier = parseFloat(e.target.value);
      if (speedVal) speedVal.textContent = `${speedMultiplier.toFixed(1)}x`;
    });
  }

  if (tiltRange) {
    tiltRange.addEventListener('input', (e) => {
      const val = e.target.value;
      if (tiltVal) tiltVal.textContent = `${val}°`;
      tiltFactor = val / 100;
    });
  }

  if (pausePlayBtn) {
    pausePlayBtn.addEventListener('click', () => {
      isRunning = !isRunning;
      pausePlayBtn.textContent = isRunning ? '⏸️ Pausa' : '▶ Reanudar';
      pausePlayBtn.classList.toggle('active', isRunning);
    });
  }

  if (toggleOrbitsBtn) {
    toggleOrbitsBtn.addEventListener('click', () => {
      showOrbits = !showOrbits;
      toggleOrbitsBtn.textContent = showOrbits ? '🌐 Órbitas' : '🌐 Ocultas';
      toggleOrbitsBtn.classList.toggle('active', showOrbits);
    });
  }

  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let clickedPlanet = null;
    celestialObjects.forEach(p => {
      if (p.id === 'sun') {
        const dist = Math.hypot(clickX - canvas.width/2, clickY - canvas.height/2);
        if (dist < p.radius * 1.5) clickedPlanet = p;
        return;
      }
      const dist = Math.hypot(clickX - p.currentX, clickY - p.currentY);
      if (dist < p.radius + 15) clickedPlanet = p;
    });

    if (clickedPlanet) {
      selectedPlanetId = clickedPlanet.id;
      if (planetSelect) planetSelect.value = clickedPlanet.id;
      openTelemetryModal(clickedPlanet);
    }
  });

  function openTelemetryModal(p) {
    document.getElementById('modalTitle').textContent = p.name;
    document.getElementById('modalDesc').textContent = p.desc;
    document.getElementById('statDia').textContent = p.dia;
    document.getElementById('statDist').textContent = p.dist;
    document.getElementById('statOrb').textContent = p.orb;
    document.getElementById('statTemp').textContent = p.temp;
    document.getElementById('statComp').textContent = p.comp;
    document.getElementById('statGrav').textContent = p.grav;
    document.getElementById('statMoons').textContent = p.moons;
    document.getElementById('infoModal').classList.remove('hidden');
  }

  const openChartBtn = document.getElementById('openChartBtn');
  const chartModal = document.getElementById('chartModal');
  const closeChartModal = document.getElementById('closeChartModal');
  const chartBarsContainer = document.getElementById('chartBarsContainer');

  if (chartBarsContainer) {
    celestialObjects.filter(p => p.id !== 'sun').forEach(p => {
      const percentage = (p.au / 31) * 100;
      const row = document.createElement('div');
      row.className = 'chart-bar-row';
      row.innerHTML = `<div class="bar-meta"><span>${p.name}</span><span style="color:var(--primary-cyan);">${p.dist}</span></div><div class="bar-track" style="background:rgba(255,255,255,0.1);height:6px;border-radius:3px;margin:4px 0 10px 0;"><div style="width:${Math.max(percentage, 3)}%;background:var(--primary-cyan);height:100%;border-radius:3px;"></div></div>`;
      chartBarsContainer.appendChild(row);
    });
  }

  if (openChartBtn) openChartBtn.addEventListener('click', () => chartModal.classList.remove('hidden'));
  if (closeChartModal) closeChartModal.addEventListener('click', () => chartModal.classList.add('hidden'));
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('infoModal').classList.add('hidden');
    selectedPlanetId = 'all';
    if (planetSelect) planetSelect.value = 'all';
  });

  render();
});