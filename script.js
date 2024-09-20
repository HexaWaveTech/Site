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

// Função para salvar os dados no Firebase
function saveUserDataToFirebase(ip, cookiesAccepted) {
  const userId = Date.now(); // Gerando um ID único baseado no tempo
  set(ref(database, 'users/' + userId), {
    ip: ip,
    cookiesAccepted: cookiesAccepted,
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

  if (userIP) {
    saveUserDataToFirebase(userIP, cookiesAccepted);
  }
}

// Inicializando o aplicativo quando a página carregar
window.addEventListener("load", initApp);