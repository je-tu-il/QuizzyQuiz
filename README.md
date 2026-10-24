# QuizzyQuiz ⚡ — Réplique Libre & P2P de Kahoot

[![Live Demo](https://img.shields.io/badge/Demo%20en%20Ligne-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://je-tu-il.github.io/QuizzyQuiz/)
[![Deploy to GitHub Pages](https://github.com/je-tu-il/QuizzyQuiz/actions/workflows/deploy.yml/badge.svg)](https://github.com/je-tu-il/QuizzyQuiz/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **QuizzyQuiz** est une réplique libre, festive et décentralisée de Kahoot, fonctionnant entièrement en **Peer-to-Peer (WebRTC)** sans aucun serveur centralisé de jeu !

🎮 **[👉 Jouer Immédiatement en Ligne (Aucune installation requise)](https://je-tu-il.github.io/QuizzyQuiz/)**

![QuizzyQuiz Banner](https://raw.githubusercontent.com/je-tu-il/QuizzyQuiz/main/src/assets/hero.png)


---

## 🌟 Points Forts

* **100% P2P & Décentralisé** : Les questions, réponses, scores et synchronisations transitent directement entre le navigateur de l'animateur (Host) et les smartphones des joueurs via **WebRTC DataChannels**.
* **Esthétique fidèle & Dynamique festive** :
  * Thème violet profond emblématique.
  * Formes et couleurs officielles : ▲ Triangle Rouge, ◆ Losange Bleu, ● Cercle Jaune, ◼ Carré Vert.
  * Effets sonores intégrés via l'API Web Audio (aucun fichier audio lourd à télécharger).
  * Animations, histogrammes des réponses en temps réel, écran de score et **Podium 3D final**.
* **Studio de Création de Quiz complet** :
  * Import d'illustrations / images (PNG, JPG, GIF, WebP).
  * Questions classiques à 4 choix ou mode Vrai / Faux à 2 choix.
  * Prise en charge des **Choix Multiples** (plusieurs réponses correctes).
  * Chronomètres ajustables (5s à 120s) et multiplicateurs de points (Points Doubles 2x, Standard, Brise-glace 0 pt).
* **Partage et Portabilité simples** :
  * Stockage local automatique (`localStorage`).
  * Exportation et importation des quiz en format JSON en un clic.
  * Connexion instantanée des joueurs par **Code PIN** (ex: `482 910`) ou en flashant le **QR Code**.
  * Traversée automatique des réseaux (Wi-Fi, 4G, box différentes) grâce aux serveurs STUN / TURN.

---

## 🚀 Démarrage Rapide

### Prérequis
* [Node.js](https://nodejs.org/) (version 18+)
* Git

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/je-tu-il/QuizzyQuiz.git
cd QuizzyQuiz

# Installer les dépendances
npm install

# Lancer le serveur de développement local
npm run dev
```

Ouvrez ensuite votre navigateur sur `http://localhost:5173/`.

---

## 🕹️ Comment Jouer ?

1. **L'Animateur (Host)** :
   * Sur l'écran d'accueil, choisissez un quiz ou créez-en un avec le studio.
   * Cliquez sur **« Lancer l'écran (Host) »**.
   * Projetez l'écran sur votre téléviseur, vidéoprojecteur ou partagez votre fenêtre (Discord, Zoom, Google Meet).
2. **Les Joueurs** :
   * Sur leur smartphone, ils scannent le **QR Code** ou se rendent sur `/join`.
   * Ils saisissent le **PIN** et choisissent leur pseudo ainsi qu'un avatar.
   * La manette tactile à 4 couleurs apparaît dès que la question commence !

---

## 🌐 Déploiement en ligne (Vercel, Netlify, Cloudflare Pages)

QuizzyQuiz est une Single Page Application (SPA) sans backend applicatif :

1. Liez ce dépôt GitHub à votre compte [Vercel](https://vercel.com/) ou [Netlify](https://www.netlify.com/).
2. Paramètres de build :
   * **Build Command** : `npm run build`
   * **Output Directory** : `dist`
3. Votre site est déployé avec une URL publique HTTPS sécurisée permettant aux joueurs de rejoindre depuis le monde entier !

---

## 🛠️ Technologies Utilisées

* **React 19** + **TypeScript** + **Vite**
* **Tailwind CSS v4** + **Lucide Icons**
* **WebRTC & PeerJS** (avec STUN & TURN fallback)
* **Web Audio API** (synthèse audio en temps réel)
* **QRCode.react**

---

## 📄 Licence

Projet open-source disponible sous licence [MIT](LICENSE).
