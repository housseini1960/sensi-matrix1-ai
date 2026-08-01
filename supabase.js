/* ====================================
   SENSI MATRIX AI - CONNEXION SUPABASE
   Développé par Housseini
   ==================================== */

// Configuration Supabase
const SUPABASE_URL = 'https://zedopeqrewcqjpnvrwbb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tcIaW5qGXU315Ekq8ugPIA_eUSZPOaH';

// Initialiser le client Supabase
let supabase;

if (typeof window.supabase !== 'undefined') {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('✅ Supabase connecté - Housseini');
} else {
  console.log('⚠️ Supabase non initialisé - Mode offline activé');
}

// Fonction pour chercher un device dans la base
async function searchDevice(deviceName) {
  if (!supabase) {
    console.log('Mode offline');
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .ilike('full_name', `%${deviceName}%`)
      .limit(1);
    
    if (error) {
      console.error('Erreur Supabase:', error);
      return null;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Device trouvé:', data[0]);
      return data[0];
    }
    
    return null;
  } catch (err) {
    console.error('Erreur:', err);
    return null;
  }
}

// Fonction pour sauvegarder une génération
async function saveSensitivityGeneration(device, playstyle, specs, sensi) {
  if (!supabase) {
    console.log('Mode offline: données non sauvegardées');
    return;
  }
  
  try {
    const { data, error } = await supabase
      .from('sensitivity_logs')
      .insert({
        device_name: device,
        playstyle: playstyle,
        device_ram: specs.ram,
        device_cpu: specs.cpu,
        device_screen: specs.screen,
        device_score: specs.score,
        sensi_general: sensi.general,
        sensi_red_dot: sensi.redDot,
        sensi_2x: sensi.s2x,
        sensi_4x: sensi.s4x,
        sensi_sniper: sensi.sniper,
        sensi_free_look: sensi.freeLook,
        sensi_fire_button: sensi.fireButton,
        sensi_dpi: sensi.dpi,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Erreur Supabase:', error);
    } else {
      console.log('✅ Génération sauvegardée:', data);
    }
  } catch (err) {
    console.error('Erreur:', err);
  }
}

// Fonction pour ajouter un device (admin)
async function addDevice(brand, model, fullName, ram, cpu, screen, score) {
  if (!supabase) {
    alert('⚠️ Supabase non connecté');
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('devices')
      .insert({
        brand: brand,
        model: model,
        full_name: fullName,
        ram: ram,
        cpu: cpu,
        screen: screen,
        score: score,
        verified: true,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur: ' + error.message);
      return null;
    }
    
    console.log('✅ Device ajouté:', data);
    return data;
  } catch (err) {
    console.error('Erreur:', err);
    return null;
  }
}

// Fonction pour s'inscrire (admin)
async function signUp(email, password) {
  if (!supabase) {
    alert('⚠️ Supabase non configuré');
    return;
  }
  
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });
  
  if (error) {
    console.error('Erreur inscription:', error);
    alert('❌ Erreur: ' + error.message);
  } else {
    console.log('✅ Inscription réussie:', data);
    alert('✅ Inscription réussie ! Vérifie tes emails.');
  }
  
  return { data, error };
}

// Fonction pour se connecter (admin)
async function signIn(email, password) {
  if (!supabase) {
    alert('⚠️ Supabase non configuré');
    return;
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
  
  if (error) {
    console.error('Erreur connexion:', error);
    alert('❌ Erreur: ' + error.message);
  } else {
    console.log('✅ Connexion réussie:', data);
  }
  
  return { data, error };
}

// Fonction pour se déconnecter
async function signOut() {
  if (!supabase) return;
  
  await supabase.auth.signOut();
  console.log('✅ Déconnecté');
  window.location.href = 'admin.html';
}

// Fonction pour vérifier si l'utilisateur est connecté
async function getCurrentUser() {
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
      }
