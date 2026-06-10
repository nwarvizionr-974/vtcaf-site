# VTCAF — Site web (one-page, PWA, déployable sur Netlify)

Site vitrine + estimateur de course pour **VTCAF**, chauffeur privé à La Réunion.
100 % statique : **aucun backend, aucune base de données, aucune clé API, aucune dépendance payante.**
Technologies : HTML, CSS et JavaScript vanilla uniquement.

> Signature : *Votre chauffeur privé – Île de La Réunion*

---

## 1. Arborescence du projet

```
vtcaf/
├── index.html              ← La page (structure + contenus)
├── styles.css              ← Le design (couleurs, mise en page)
├── app.js                  ← La logique (tarifs, estimateur, WhatsApp, avis…)
├── manifest.json           ← Configuration PWA (installation mobile)
├── sw.js                   ← Service Worker (cache / hors-ligne)
├── README.md               ← Ce fichier
└── assets/
    ├── images/
    │   ├── logo-vtcaf.png   ← logo (fond transparent)
    │   ├── logo-vtcaf.jpg   ← logo (fond blanc, pour partage réseaux)
    │   ├── hero-vtcaf.jpg   ← grande photo d'accueil
    │   ├── photo-1.jpg      ← galerie
    │   ├── photo-2.jpg
    │   ├── photo-3.jpg
    │   ├── photo-4.jpg
    │   └── photo-5.jpg
    ├── videos/              ← (vide — la vidéo passe par YouTube)
    └── icons/
        ├── icon-192.png     ← icône PWA
        ├── icon-512.png     ← icône PWA
        └── favicon.png      ← favicon onglet
```

Les médias fournis ont déjà été **renommés et optimisés** aux bons emplacements. Tout est prêt à l'emploi.

---

## 2. Déploiement sur Netlify

### Option A — Glisser-déposer (le plus simple)
1. Vérifiez que le dossier `vtcaf/` contient bien tous les fichiers ci-dessus.
2. Allez sur **https://app.netlify.com/drop**.
3. **Glissez-déposez le dossier `vtcaf/`** entier dans la zone indiquée.
4. Netlify met le site en ligne et vous donne une adresse (ex : `https://vtcaf.netlify.app`).
5. (Facultatif) Renommez le site ou branchez un nom de domaine dans *Site settings → Domain*.

### Option B — Via GitHub (mises à jour automatiques)
1. Créez un dépôt GitHub et déposez-y le contenu du dossier `vtcaf/`.
2. Sur Netlify : **Add new site → Import an existing project → GitHub**.
3. Sélectionnez le dépôt. Laissez *Build command* **vide** et *Publish directory* sur **`/`** (racine).
4. Cliquez sur **Deploy**. À chaque `git push`, le site se met à jour seul.

> 💡 Test en local : ouvrez simplement `index.html` dans un navigateur.
> Pour tester la PWA/Service Worker en local, lancez un petit serveur, ex :
> `python3 -m http.server` puis ouvrez `http://localhost:8000`.

---

## 3. Où modifier quoi ? (tout est dans `app.js`, en haut du fichier)

Ouvrez **`app.js`** : les 6 premiers blocs sont prévus pour être modifiés facilement.

### 📞 Le numéro WhatsApp / téléphone / réseaux
Bloc **`CONFIG`** :
```js
const CONFIG = {
  phoneDisplay: "+262 692 59 48 45",
  whatsappNumber: "262692594845",   // ⚠️ sans +, sans espace, sans tiret
  instagram: "VTCAF974",
  facebook: "VTCAF974",
  googleReviewLink: "",             // lien "Laisser un avis"
  googleBusinessLink: ""            // lien "Voir les avis Google"
};
```

### 🔗 Les liens Google (avis)
Toujours dans `CONFIG` :
- `googleReviewLink` → bouton **« Laisser un avis »**.
- `googleBusinessLink` → bouton **« Voir les avis Google »**.

Pour les obtenir : tableau de bord **Google Business Profile** → *Demander des avis* (donne un lien `https://g.page/r/...../review`) et la page publique de votre fiche.
Si vous les laissez vides, les boutons renvoient vers une recherche Google « VTCAF La Réunion avis ».

### ⭐ Les avis
Bloc **`REVIEWS`** :
```js
const REVIEWS = [
  { name: "Prénom N.", rating: 5, text: "Votre vrai avis ici.", date: "2026" },
  ...
];
```
Remplacez chaque entrée par un **vrai avis Google**. Ajoutez/supprimez des lignes librement.
👉 Ne jamais inventer de faux avis.

### 🖼️ Les photos
Deux façons :
- **La plus simple** : remplacez les fichiers dans `assets/images/` en **gardant exactement les mêmes noms** (`hero-vtcaf.jpg`, `photo-1.jpg`, …). Voir section 6.
- Ou bien changez les chemins/légendes dans le bloc **`MEDIA`** d'`app.js`.

### 🎥 La vidéo YouTube
Voir section 5.

### 🎨 Les couleurs
Dans **`styles.css`**, tout en haut, bloc `:root`. Modifiez les valeurs hex, par ex :
```css
--ink:   #0E1A24;   /* bleu nuit (header/footer) */
--teal:  #1E5F6E;   /* pétrole (boutons) */
--paille:#B23A2E;   /* accent rouge */
```

### 💳 Les moyens de paiement
Bloc **`PAYMENT_OPTIONS`** dans `app.js` : passez une option à `true`/`false`.
Stripe/PayPal ne s'affichent **que** si vous collez un lien :
```js
const PAYMENT_OPTIONS = {
  onboard: true, cash: true, card: false, bankTransfer: true,
  paymentLink: false, depositForEvents: true,
  stripePaymentLink: "",   // collez un lien pour l'activer
  paypalLink: ""
};
```

---

## 4. Comment modifier les tarifs

Tout se trouve dans le bloc **`TARIFFS`** d'`app.js`. Cette grille sert **uniquement de base de calcul interne** : elle n'est pas affichée en entier au public.

Règles de lecture :
- `min` et `max` = une **fourchette** (ex : `min: 70, max: 90` → « 70 € à 90 € »).
- `min` **égal à** `max` = **tarif fixe** (ex : `min: 70, max: 70` → « 70 € »).
- `quote: true` = **sur devis** (aucun total calculé).

Exemples :
```js
// Modifier un tarif aéroport
"leu": { label: "Saint-Leu", min: 80, max: 110 },

// Modifier un trajet SAM (tarif fixe)
"sd-sg": { label: "Saint-Denis ↔ Saint-Gilles A/R", min: 70, max: 70 },

// Ajouter une nouvelle zone aéroport (cherchez le commentaire "TODO")
"nouvelle-zone": { label: "Nom de la zone", min: 50, max: 70 },
```

Les **suppléments** sont dans le bloc `SUPPLEMENTS` :
```js
const SUPPLEMENTS = {
  nightWeekendHoliday: 0.20, // +20 %
  bulkyLuggage: 10,          // +10 €
  babySeat: 0                // offert
};
```
Le calcul applique les suppléments sur le tarif fixe **ou** sur les deux bornes de la fourchette, puis affiche le détail. Une mention rappelle toujours que **l'estimation est indicative** et que VTCAF confirme le tarif final.

---

## 5. Comment modifier le lien YouTube

Dans `app.js`, bloc **`MEDIA`** :
```js
youtubeVideoUrl: "",   // lien classique
youtubeEmbedUrl: "",   // lien "embed" (pour l'intégration responsive)
```

**Convertir un lien classique en lien embed :**
- Lien classique : `https://www.youtube.com/watch?v=ABC123xyz`
- → l'identifiant est `ABC123xyz` (après `v=`)
- Lien embed : `https://www.youtube.com/embed/ABC123xyz`

Exemple complet :
```js
youtubeVideoUrl: "https://www.youtube.com/watch?v=ABC123xyz",
youtubeEmbedUrl: "https://www.youtube.com/embed/ABC123xyz",
```

- Si `youtubeEmbedUrl` est **rempli** → la vidéo s'affiche intégrée (format 16:9 responsive).
- Si elle est **vide** → un encart « Vidéo bientôt disponible » s'affiche (le site ne casse pas).
- Si seul `youtubeVideoUrl` est rempli → le bouton « Voir la vidéo sur YouTube » apparaît.

---

## 6. Comment remplacer les médias

La méthode la plus sûre : **garder les mêmes noms de fichiers**.

1. Préparez vos nouvelles images (idéalement compressées) :
   - Photo d'accueil large → `hero-vtcaf.jpg` (≈ 1600 px de large).
   - Photos de galerie → `photo-1.jpg` à `photo-5.jpg` (≈ 1100 px de large).
   - Logo → `logo-vtcaf.png` (fond transparent recommandé).
2. Remplacez les fichiers dans `assets/images/` en **conservant exactement les mêmes noms**.
3. Rien d'autre à toucher : le site les utilisera automatiquement.

Si vous souhaitez **d'autres noms** ou **plus/moins de photos**, modifiez le tableau `MEDIA.gallery` dans `app.js` :
```js
gallery: [
  { src: "assets/images/photo-1.jpg", alt: "Description de l'image" },
  ...
]
```
> Mettez toujours un texte alternatif (`alt`) clair : c'est important pour l'accessibilité et le référencement.

**Icônes PWA** : pour changer l'icône de l'app installée, remplacez `assets/icons/icon-192.png` et `icon-512.png` (carrés, mêmes dimensions).

> ℹ️ Après toute mise à jour, pensez à incrémenter `CACHE_VERSION` dans `sw.js` (ex : `vtcaf-v1` → `vtcaf-v2`) pour que les visiteurs reçoivent bien la nouvelle version.

---

## 7. Comment fonctionne l'estimateur (résumé)

1. Le client remplit le formulaire (champs obligatoires marqués `*`).
2. Il clique sur **« Calculer l'estimation »** → une carte affiche le tarif estimé et le détail du calcul.
3. Il clique sur **« Envoyer la demande à VTCAF »** → un message WhatsApp pré-rempli s'ouvre.
4. VTCAF reçoit la demande complète et **confirme manuellement** la disponibilité et le tarif final.

- Aucune donnée n'est envoyée ailleurs : tout passe par WhatsApp.
- La dernière demande est **sauvegardée localement** (localStorage) pour ne rien perdre en cas de rechargement.
- Le client peut toujours contacter VTCAF sur WhatsApp même sans estimation (bouton flottant + header + footer).

---

## 8. Bon à savoir

- **Accessibilité** : labels sur tous les champs, navigation clavier, focus visible, textes alternatifs, respect de `prefers-reduced-motion`.
- **Performance** : images optimisées + lazy loading, JS léger, aucune librairie externe obligatoire.
- **SEO** : balise title, meta description, Open Graph, favicon et données structurées Schema.org (`TaxiService`).
- **PWA** : le site est installable sur smartphone. Une bannière discrète « Installer l'application » apparaît si le navigateur le permet ; sinon, rien ne casse.

---

*Projet VTCAF — prêt à déployer.*
