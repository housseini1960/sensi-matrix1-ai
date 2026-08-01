/* ====================================
   SENSI MATRIX AI - ADMIN PANEL
   Développé par Housseini
   ==================================== */

let currentUser = null;

checkAuth();

async function checkAuth() {
  const user = await getCurrentUser();
  if (user) {
    currentUser = user;
    showAdminPanel();
  }
}

function showAdminPanel() {
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('adminPanel').classList.remove('hidden');
  loadStats();
}

async function handleLogin() {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  
  if (!email || !password) {
    alert('⚠️ Remplis email et mot de passe');
    return;
  }
  
  await signIn(email, password);
  checkAuth();
}

async function handleSignup() {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  
  if (!email || !password) {
    alert('⚠️ Remplis email et mot de passe');
    return;
  }
  
  await signUp(email, password);
}

async function handleLogout() {
  await signOut();
  window.location.reload();
}

async function handleAddDevice() {
  const brand = document.getElementById('deviceBrand').value;
  const model = document.getElementById('deviceModel').value;
  const fullName = document.getElementById('deviceFullName').value;
  const ram = document.getElementById('deviceRam').value;
  const cpu = document.getElementById('deviceCpu').value;
  const screen = document.getElementById('deviceScreen').value;
  const score = parseInt(document.getElementById('deviceScore').value);
  
  if (!model || !fullName) {
    alert('⚠️ Remplis au moins le modèle et le nom complet');
    return;
  }
  
  const result = await addDevice(brand, model, fullName, ram, cpu, screen, score);
  
  if (result) {
    alert('✅ Device ajouté avec succès !');
    document.getElementById('deviceModel').value = '';
    document.getElementById('deviceFullName').value = '';
    loadStats();
  }
}

async function loadStats() {
  const { count: deviceCount } = await supabase
    .from('devices')
    .select('*', { count: 'exact', head: true });
  
  document.getElementById('totalDevices').textContent = deviceCount || 0;
  
  const { count: genCount } = await supabase
    .from('sensitivity_logs')
    .select('*', { count: 'exact', head: true });
  
  document.getElementById('totalGenerations').textContent = genCount || 0;
  
  loadRecentDevices();
}

async function loadRecentDevices() {
  const { data } = await supabase
    .from('devices')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  const list = document.getElementById('devicesList');
  list.innerHTML = '';
  
  if (data && data.length > 0) {
    data.forEach(device => {
      const item = document.createElement('div');
      item.className = 'device-item';
      item.innerHTML = `
        <strong>${device.full_name}</strong><br>
        <small>${device.ram} | ${device.cpu} | Score: ${device.score}/10</small>
      `;
      list.appendChild(item);
    });
  } else {
    list.innerHTML = '<p style="color: var(--primary);">Aucun device pour le moment</p>';
  }
}
