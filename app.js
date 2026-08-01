/* ====================================
   SENSI MATRIX AI - LOGIQUE PRINCIPALE
   Développé par Housseini
   ==================================== */

let currentDevice = '';
let deviceSpecs = {};
let selectedPlaystyle = '';
let generatedSensi = {};

async function analyzeDevice() {
  const input = document.getElementById('deviceName');
  const deviceName = input.value.trim().toLowerCase();
  
  if (!deviceName) {
    alert('⚠️ Veuillez entrer un modèle de téléphone !');
    input.focus();
    return;
  }
  
  const btnScan = document.querySelector('.btn-scan');
  const originalText = btnScan.innerHTML;
  btnScan.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i><span>RECHERCHE EN COURS...</span>';
  btnScan.disabled = true;
  
  try {
    const dbDevice = await searchDevice(deviceName);
    
    let foundDevice = null;
    let foundKey = deviceName;
    
    if (dbDevice) {
      foundDevice = {
        ram: dbDevice.ram,
        cpu: dbDevice.cpu,
        screen: dbDevice.screen,
        score: dbDevice.score
      };
      foundKey = dbDevice.full_name;
      console.log('✅ Device trouvé dans Supabase');
    } else {
      foundDevice = generateRandomSpecs(deviceName);
      console.log('⚠️ Device non trouvé, algo utilisé');
    }
    
    currentDevice = foundKey;
    deviceSpecs = foundDevice;
    
    displayDeviceResults(foundKey, foundDevice);
    
    document.getElementById('step1').classList.add('hidden');
    document.getElementById('step2').classList.remove('hidden');
    
    setTimeout(() => {
      const bar = document.getElementById('performanceBar');
      const percent = document.getElementById('performancePercent');
      bar.style.width = foundDevice.score * 10 + '%';
      percent.textContent = foundDevice.score + '/10';
    }, 100);
    
  } catch (error) {
    console.error('Erreur:', error);
    alert('❌ Erreur lors de la recherche');
  } finally {
    btnScan.innerHTML = originalText;
    btnScan.disabled = false;
  }
}

function generateRandomSpecs(deviceName) {
  const ramOptions = ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB'];
  const cpuOptions = ['Quad-core 1.3GHz', 'Quad-core 1.6GHz', 'Octa-core 1.8GHz', 'Octa-core 2.0GHz', 'Octa-core 2.4GHz'];
  const screenOptions = ['5.0"', '5.5"', '6.0"', '6.1"', '6.3"', '6.5"', '6.7"'];
  
  const hash = simpleHash(deviceName);
  
  return {
    ram: ramOptions[hash % ramOptions.length],
    cpu: cpuOptions[(hash >> 2) % cpuOptions.length],
    screen: screenOptions[(hash >> 4) % screenOptions.length],
    score: 3 + (hash % 7)
  };
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function displayDeviceResults(deviceName, specs) {
  document.getElementById('displayDeviceName').textContent = deviceName.toUpperCase();
  document.getElementById('specRam').textContent = specs.ram;
  document.getElementById('specCpu').textContent = specs.cpu;
  document.getElementById('specScreen').textContent = specs.screen;
  document.getElementById('specScore').textContent = specs.score + '/10';
}

function goToStep3() {
  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step3').classList.remove('hidden');
}

function selectPlaystyle(playstyle) {
  selectedPlaystyle = playstyle;
  
  document.querySelectorAll('.playstyle-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  document.getElementById('card' + playstyle.charAt(0).toUpperCase() + playstyle.slice(1)).classList.add('selected');
  
  setTimeout(() => {
    generateSensitivity();
  }, 300);
}

function generateSensitivity() {
  const baseScore = deviceSpecs.score;
  const hash = simpleHash(currentDevice);
  
  let baseGeneral, baseRed, base2x, base4x, baseSniper, baseLook, baseBtn, baseDpi;
  
  if (selectedPlaystyle === 'rusher') {
    baseGeneral = 85 + (baseScore * 8) + (hash % 15);
    baseRed = 90 + (baseScore * 7) + ((hash >> 1) % 15);
    base2x = 88 + (baseScore * 7) + ((hash >> 2) % 12);
    base4x = 82 + (baseScore * 6) + ((hash >> 3) % 12);
    baseSniper = 55 + (baseScore * 5) + ((hash >> 4) % 15);
    baseLook = 75 + (baseScore * 6) + ((hash >> 5) % 15);
    baseBtn = 48 + (hash % 12);
    baseDpi = 450 + ((hash % 20) * 10);
  } 
  else if (selectedPlaystyle === 'sniper') {
    baseGeneral = 70 + (baseScore * 6) + (hash % 12);
    baseRed = 75 + (baseScore * 6) + ((hash >> 1) % 12);
    base2x = 72 + (baseScore * 6) + ((hash >> 2) % 10);
    base4x = 68 + (baseScore * 5) + ((hash >> 3) % 10);
    baseSniper = 45 + (baseScore * 5) + ((hash >> 4) % 12);
    baseLook = 65 + (baseScore * 5) + ((hash >> 5) % 12);
    baseBtn = 42 + (hash % 10);
    baseDpi = 400 + ((hash % 15) * 8);
  } 
  else {
    baseGeneral = 78 + (baseScore * 7) + (hash % 14);
    baseRed = 82 + (baseScore * 7) + ((hash >> 1) % 14);
    base2x = 80 + (baseScore * 6) + ((hash >> 2) % 11);
    base4x = 75 + (baseScore * 6) + ((hash >> 3) % 11);
    baseSniper = 50 + (baseScore * 5) + ((hash >> 4) % 13);
    baseLook = 70 + (baseScore * 6) + ((hash >> 5) % 13);
    baseBtn = 45 + (hash % 11);
    baseDpi = 420 + ((hash % 18) * 9);
  }
  
  generatedSensi = {
    general: Math.min(200, Math.max(0, Math.round(baseGeneral))),
    redDot: Math.min(200, Math.max(0, Math.round(baseRed))),
    s2x: Math.min(200, Math.max(0, Math.round(base2x))),
    s4x: Math.min(200, Math.max(0, Math.round(base4x))),
    sniper: Math.min(200, Math.max(0, Math.round(baseSniper))),
    freeLook: Math.min(200, Math.max(0, Math.round(baseLook))),
    fireButton: Math.min(100, Math.max(30, Math.round(baseBtn))),
    dpi: Math.round(baseDpi)
  };
  
  displaySensitivityResults();
  document.getElementById('step3').classList.add('hidden');
  document.getElementById('step4').classList.remove('hidden');
  saveSensitivityGeneration(currentDevice, selectedPlaystyle, deviceSpecs, generatedSensi);
}

function displaySensitivityResults() {
  document.getElementById('resultDeviceName').textContent = currentDevice.toUpperCase();
  document.getElementById('resultPlaystyle').textContent = selectedPlaystyle.toUpperCase();
  
  animateValue('valGeneral', 0, generatedSensi.general, 1000);
  animateValue('valRedDot', 0, generatedSensi.redDot, 1000);
  animateValue('val2x', 0, generatedSensi.s2x, 1000);
  animateValue('val4x', 0, generatedSensi.s4x, 1000);
  animateValue('valSniper', 0, generatedSensi.sniper, 1000);
  animateValue('valFreeLook', 0, generatedSensi.freeLook, 1000);
  animateValue('valFireButton', 0, generatedSensi.fireButton, 1000, '%');
  
  setTimeout(() => {
    document.getElementById('valDpi').textContent = generatedSensi.dpi;
  }, 500);
}

function animateValue(elementId, start, end, duration, suffix = '') {
  const element = document.getElementById(elementId);
  const range = end - start;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + range * easeProgress);
    element.textContent = current + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

function copyValue(elementId) {
  const value = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(value).then(() => {
    const btn = event.target.closest('.btn-copy');
    const originalIcon = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    btn.style.background = 'var(--primary)';
    btn.style.color = '#000';
    setTimeout(() => {
      btn.innerHTML = originalIcon;
      btn.style.background = '';
      btn.style.color = '';
    }, 1500);
  }).catch(err => {
    console.error('Erreur:', err);
  });
}

function downloadConfig() {
  const configText = `🔥 SENSI MATRIX AI - TA CONFIGURATION 🔥

📱 Device: ${currentDevice.toUpperCase()}
🎮 Playstyle: ${selectedPlaystyle.toUpperCase()}
⚡ Score: ${deviceSpecs.score}/10

━━━━━━━━━━━━━━━━━━━━
⚙️ SENSIBILITÉ
━━━━━━━━━━━━━━━━━━━━
• Général: ${generatedSensi.general}
• Red Dot: ${generatedSensi.redDot}
• 2x: ${generatedSensi.s2x}
• 4x: ${generatedSensi.s4x}
• Sniper: ${generatedSensi.sniper}
• Free Look: ${generatedSensi.freeLook}
• Bouton: ${generatedSensi.fireButton}%
• DPI: ${generatedSensi.dpi}

🔗 Généré par SENSI MATRIX AI - Housseini`;
  
  const blob = new Blob([configText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SensiMatrix_${currentDevice.replace(/s+/g, '_')}_${selectedPlaystyle}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function shareResults() {
  const shareText = `🔥 SENSI MATRIX AI 🔥

Sensi parfaite pour ${currentDevice.toUpperCase()} !

📊 Score: ${deviceSpecs.score}/10
🎯 Général: ${generatedSensi.general}
🔴 Red Dot: ${generatedSensi.redDot}

Génère la tienne !`;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  window.open(shareUrl, '_blank');
}

function launchAimTest() {
  alert('🎮 Mini-jeu en développement !');
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔥 SENSI MATRIX AI v2.0 - Prêt !');
  initParticles();
});

document.getElementById('deviceName').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    analyzeDevice();
  }
});
