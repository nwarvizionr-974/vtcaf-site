/* =================================================================
   VTCAF — app.js
   JavaScript vanilla, sans dépendance.
   -----------------------------------------------------------------
   ZONES À MODIFIER FACILEMENT :
   1) CONFIG          → numéro WhatsApp, téléphone, réseaux, liens Google
   2) MEDIA           → lien YouTube, logo, hero, galerie photos
   3) TARIFFS         → toute la grille tarifaire (base interne de calcul)
   4) SUPPLEMENTS     → suppléments (nuit, bagage, siège bébé)
   5) REVIEWS         → avis clients (à remplacer par de vrais avis Google)
   6) PAYMENT_OPTIONS → moyens de paiement affichés
   ================================================================= */

/* ----------------------------------------------------------------
   1) CONFIG — informations de contact
   ---------------------------------------------------------------- */
const CONFIG = {
  companyName: "VTCAF",
  phoneDisplay: "+262 692 59 48 45",
  whatsappNumber: "262692594845",      // ⚠️ JAMAIS de +, espaces ou tirets
  instagram: "VTCAF974",
  facebook: "VTCAF974",
  currency: "€",
  googleReviewLink: "",                // ➜ Lien "Laisser un avis" Google (ex : https://g.page/r/XXXX/review)
  googleBusinessLink: ""               // ➜ Lien fiche Google "Voir les avis"
};

/* ----------------------------------------------------------------
   2) MEDIA — visuels et vidéo
   Pour la vidéo : collez le lien classique dans youtubeVideoUrl ET
   le lien "embed" dans youtubeEmbedUrl (voir README).
   ---------------------------------------------------------------- */
const MEDIA = {
  youtubeVideoUrl: "https://www.youtube.com/watch?v=ZnN8FwQaSwo",                 // ex : https://www.youtube.com/watch?v=XXXXXXXXXXX
  youtubeEmbedUrl: "",                 // ex : https://www.youtube.com/embed/XXXXXXXXXXX
  heroImage: "assets/images/hero-vtcaf.jpg",
  logo: "assets/images/logo-vtcaf.png",
  gallery: [
    { src: "assets/images/photo-1.jpg", alt: "Mercedes GLB blanc VTCAF sous le ciel de La Réunion" },
    { src: "assets/images/photo-2.jpg", alt: "Chauffeur VTCAF ouvrant la portière pour une cliente" },
    { src: "assets/images/photo-3.jpg", alt: "Intérieur premium du Mercedes GLB, volant et tableau de bord" },
    { src: "assets/images/photo-4.jpg", alt: "Chauffeur VTCAF en tenue professionnelle près du véhicule" },
    { src: "assets/images/photo-5.jpg", alt: "Chauffeur VTCAF au volant du Mercedes GLB" }
  ]
};

/* ----------------------------------------------------------------
   3) TARIFFS — grille interne (NON affichée publiquement en entier)
   min/max = fourchette ; si min === max → tarif fixe ; quote:true → sur devis
   ---------------------------------------------------------------- */
const TARIFFS = {
  // Course de jour : facturée selon la distance estimée saisie par le client
  jour: {
    tiers: [
      { upTo: 5,        min: 10,  max: 10,  label: "0 à 5 km" },
      { upTo: 10,       min: 10,  max: 25,  label: "5 à 10 km" },
      { upTo: 20,       min: 25,  max: 45,  label: "10 à 20 km" },
      { upTo: 40,       min: 45,  max: 90,  label: "20 à 40 km" },
      { upTo: Infinity, quote: true,        label: "Plus de 40 km" }
    ]
  },

  // Transfert aéroport Roland-Garros : par zone
  // TODO : ajouter ici d'autres zones plus tard si besoin (même format)
  aeroport: {
    zones: {
      "denis-marie": { label: "Saint-Denis / Sainte-Marie", min: 30,  max: 40 },
      "paul-gilles": { label: "Saint-Paul / Saint-Gilles",   min: 70,  max: 90 },
      "leu":         { label: "Saint-Leu",                   min: 80,  max: 110 },
      "pierre-tampon":{ label: "Saint-Pierre / Le Tampon",   min: 110, max: 150 },
      "andre":       { label: "Saint-André",                 min: 60,  max: 80 },
      "benoit":      { label: "Saint-Benoît",                min: 80,  max: 100 },
      "anne":        { label: "Sainte-Anne",                 min: 100, max: 120 }
    }
  },

  // Mise à disposition chauffeur : par durée
  disposition: {
    durations: {
      "1h":  { label: "1 heure",   min: 120,  max: 120 },
      "2h":  { label: "2 heures",  min: 210,  max: 210 },
      "4h":  { label: "4 heures",  quote: true, note: "tarif à confirmer" },
      "6h":  { label: "6 heures",  min: 510,  max: 600 },
      "8h":  { label: "8 heures",  min: 710,  max: 800 },
      "10h": { label: "10 heures", min: 910,  max: 1000 }
    }
  },

  // Retour de soirée / SAM : trajets prédéfinis aller-retour
  sam: {
    trips: {
      "sd-sg":  { label: "Saint-Denis ↔ Saint-Gilles A/R",  min: 70, max: 70 },
      "sm-sg":  { label: "Sainte-Marie ↔ Saint-Gilles A/R", min: 80, max: 80 },
      "sg-sg":  { label: "Saint-Gilles ↔ Saint-Gilles A/R", min: 30, max: 30 },
      "port-sg":{ label: "Le Port ↔ Saint-Gilles A/R",      min: 60, max: 60 },
      "sp-sg":  { label: "Saint-Paul ↔ Saint-Gilles A/R",   min: 40, max: 40 },
      "sl-sg":  { label: "Saint-Leu ↔ Saint-Gilles A/R",    min: 50, max: 50 }
    }
  },

  // Mariage / événement : formules
  mariage: {
    formulas: {
      "essentielle": { label: "Formule essentielle (2 à 3 h)", min: 250, max: 350 },
      "prestige":    { label: "Formule prestige (4 à 6 h)",    min: 400, max: 600 },
      "luxe":        { label: "Formule luxe (journée)",        quote: true }
    }
  },

  // Autre demande / sur devis
  autre: { quote: true }
};

/* ----------------------------------------------------------------
   4) SUPPLEMENTS
   ---------------------------------------------------------------- */
const SUPPLEMENTS = {
  nightWeekendHoliday: 0.20, // +20 %
  bulkyLuggage: 10,          // +10 €
  babySeat: 0                // offert
};

/* ----------------------------------------------------------------
   5) REVIEWS — avis clients (remplacer par de VRAIS avis Google)
   ⚠️ Ne jamais inventer de faux avis.
   ---------------------------------------------------------------- */
const REVIEWS = [
  { name: "Client Google", rating: 5, text: "Avis à remplacer par un vrai avis Google.", date: "2026" },
  { name: "Client Google", rating: 5, text: "Avis à remplacer par un vrai avis Google.", date: "2026" },
  { name: "Client Google", rating: 5, text: "Avis à remplacer par un vrai avis Google.", date: "2026" }
];

/* ----------------------------------------------------------------
   6) PAYMENT_OPTIONS — moyens de paiement
   ---------------------------------------------------------------- */
const PAYMENT_OPTIONS = {
  onboard: true,
  cash: true,
  card: false,
  bankTransfer: true,
  paymentLink: false,
  depositForEvents: true,
  stripePaymentLink: "",   // si vide → non affiché
  paypalLink: ""           // si vide → non affiché
};

/* =================================================================
   ===============  LE CODE CI-DESSOUS EST GÉNÉRIQUE  ===============
   ===============  (modification non nécessaire)     ===============
   ================================================================= */

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const fmt = (n) => `${Math.round(n)} ${CONFIG.currency}`;

/* ---------- Lien WhatsApp générique ---------- */
function waLink(message) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
function bindStaticWaLinks() {
  const presets = {
    bonjour: `Bonjour ${CONFIG.companyName}, je souhaite des informations sur vos services.`,
    dispo:   `Bonjour ${CONFIG.companyName}, je souhaite connaître vos disponibilités pour un trajet.`
  };
  $$("[data-wa]").forEach((el) => {
    el.setAttribute("href", waLink(presets[el.dataset.wa] || presets.bonjour));
    el.setAttribute("target", "_blank");
  });
}

/* ---------- Navigation mobile ---------- */
function initNav() {
  const toggle = $("#nav-toggle");
  const nav = $("#main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  // Surlignage de la section active
  const links = $$("a[href^='#']", nav);
  const map = {};
  links.forEach((l) => { const id = l.getAttribute("href").slice(1); if (document.getElementById(id)) map[id] = l; });
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.remove("active"));
        if (map[e.target.id]) map[e.target.id].classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(map).forEach((id) => obs.observe(document.getElementById(id)));
}

/* ---------- Champs dynamiques de l'estimateur ---------- */
function fillSelect(sel, entries) {
  if (!sel) return;
  entries.forEach(([value, label]) => {
    const o = document.createElement("option");
    o.value = value; o.textContent = label;
    sel.appendChild(o);
  });
}
function initDynamicFields() {
  fillSelect($("#f-zone"),    Object.entries(TARIFFS.aeroport.zones).map(([k, v]) => [k, v.label]));
  fillSelect($("#f-duree"),   Object.entries(TARIFFS.disposition.durations).map(([k, v]) => [k, v.label]));
  fillSelect($("#f-sam"),     Object.entries(TARIFFS.sam.trips).map(([k, v]) => [k, v.label]));
  fillSelect($("#f-formule"), Object.entries(TARIFFS.mariage.formulas).map(([k, v]) => [k, v.label]));

  const typeSel = $("#f-type");
  const updateConds = () => {
    const t = typeSel.value;
    $$(".cond").forEach((el) => { el.hidden = el.dataset.cond !== t; });
  };
  typeSel.addEventListener("change", updateConds);
  updateConds();
}

/* ---------- Calcul de l'estimation ---------- */
function applySupplements(base, opts) {
  // base = {min, max} ; renvoie {min, max, lines:[]}
  const lines = [];
  let { min, max } = base;

  if (opts.nuit) {
    min = min * (1 + SUPPLEMENTS.nightWeekendHoliday);
    max = max * (1 + SUPPLEMENTS.nightWeekendHoliday);
    lines.push(["Nuit / week-end / jour férié", "+20 %"]);
  }
  if (opts.bulky) {
    min += SUPPLEMENTS.bulkyLuggage;
    max += SUPPLEMENTS.bulkyLuggage;
    lines.push(["Bagage volumineux", `+${SUPPLEMENTS.bulkyLuggage} ${CONFIG.currency}`]);
  }
  if (opts.babySeat) {
    lines.push(["Siège bébé", "offert"]);
  }
  return { min, max, lines };
}

function priceText(min, max) {
  return Math.round(min) === Math.round(max) ? fmt(min) : `${fmt(min)} à ${fmt(max)}`;
}

function computeEstimate(data) {
  // Renvoie { typeLabel, baseLabel, base|null (devis), lines, quote:boolean, priceStr, missing:string|null }
  const type = data.type;
  const out = { lines: [], quote: false, base: null, baseLabel: "", missing: null };

  switch (type) {
    case "jour": {
      out.typeLabel = "Course de jour";
      const km = parseFloat(data.km);
      if (isNaN(km)) {
        out.missing = "Distance non renseignée — tarif à confirmer par VTCAF.";
        return out;
      }
      const tier = TARIFFS.jour.tiers.find((t) => km <= t.upTo);
      out.baseLabel = `${tier.label} (${km} km)`;
      if (tier.quote) { out.quote = true; return out; }
      out.base = { min: tier.min, max: tier.max };
      break;
    }
    case "aeroport": {
      out.typeLabel = "Transfert aéroport Roland-Garros";
      const z = TARIFFS.aeroport.zones[data.zone];
      if (!z) { out.missing = "Sélectionnez une zone — tarif à confirmer par VTCAF."; return out; }
      out.baseLabel = z.label;
      out.base = { min: z.min, max: z.max };
      break;
    }
    case "disposition": {
      out.typeLabel = "Mise à disposition chauffeur";
      const d = TARIFFS.disposition.durations[data.duree];
      if (!d) { out.missing = "Sélectionnez une durée — tarif à confirmer par VTCAF."; return out; }
      out.baseLabel = d.label;
      if (d.quote) { out.quote = true; return out; }
      out.base = { min: d.min, max: d.max };
      break;
    }
    case "sam": {
      out.typeLabel = "Retour de soirée / SAM";
      const tr = TARIFFS.sam.trips[data.trajetSam];
      if (!tr) { out.missing = "Sélectionnez un trajet — tarif à confirmer par VTCAF."; return out; }
      out.baseLabel = tr.label;
      out.base = { min: tr.min, max: tr.max };
      break;
    }
    case "mariage": {
      out.typeLabel = "Mariage / événement";
      const f = TARIFFS.mariage.formulas[data.formule];
      if (!f) { out.missing = "Sélectionnez une formule — tarif à confirmer par VTCAF."; return out; }
      out.baseLabel = f.label + " · décoration comprise selon la formule";
      if (f.quote) { out.quote = true; return out; }
      out.base = { min: f.min, max: f.max };
      break;
    }
    default: {
      out.typeLabel = "Autre demande / sur devis";
      out.quote = true;
      return out;
    }
  }

  // Application des suppléments sur la fourchette / le tarif fixe
  const sup = applySupplements(out.base, {
    nuit: data.nuit === "oui",
    bulky: data.bagageVolumineux === "oui",
    babySeat: data.siegeBebe === "oui"
  });
  out.final = { min: sup.min, max: sup.max };
  out.lines = sup.lines;
  return out;
}

/* ---------- Lecture du formulaire ---------- */
function readForm() {
  const f = $("#estimate-form");
  const get = (n) => (f.elements[n] ? f.elements[n].value.trim() : "");
  return {
    nom: get("nom"), tel: get("tel"), email: get("email"),
    date: get("date"), heure: get("heure"),
    depart: get("depart"), communeDepart: get("communeDepart"),
    arrivee: get("arrivee"), communeArrivee: get("communeArrivee"),
    type: get("type"), passagers: get("passagers"),
    km: get("km"), zone: get("zone"), duree: get("duree"),
    trajetSam: get("trajetSam"), formule: get("formule"), vol: get("vol"),
    bagages: get("bagages"), bagageVolumineux: get("bagageVolumineux"),
    enfant: get("enfant"), siegeBebe: get("siegeBebe"), nuit: get("nuit"),
    precisions: get("precisions"),
    consent: f.elements["consent"].checked
  };
}

/* ---------- Validation ---------- */
const REQUIRED = {
  nom: "Indiquez votre nom et prénom.",
  tel: "Indiquez un numéro de téléphone.",
  date: "Choisissez une date.",
  heure: "Choisissez une heure.",
  depart: "Indiquez l'adresse de départ.",
  communeDepart: "Indiquez la commune de départ.",
  arrivee: "Indiquez l'adresse d'arrivée.",
  communeArrivee: "Indiquez la commune d'arrivée.",
  type: "Choisissez un type de demande.",
  passagers: "Indiquez le nombre de passagers."
};
function validate(data) {
  const errors = {};
  Object.keys(REQUIRED).forEach((k) => { if (!data[k]) errors[k] = REQUIRED[k]; });
  if (!data.consent) errors.consent = "Merci d'accepter d'être recontacté.";
  return errors;
}
function showErrors(errors) {
  $$(".err").forEach((e) => (e.textContent = ""));
  $$(".field").forEach((f) => f.classList.remove("invalid"));
  Object.entries(errors).forEach(([k, msg]) => {
    const errEl = $(`[data-err="${k}"]`);
    if (errEl) { errEl.textContent = msg; errEl.closest(".field")?.classList.add("invalid"); }
  });
  const first = Object.keys(errors)[0];
  if (first) {
    const el = document.querySelector(`[name="${first}"]`);
    el?.focus();
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/* ---------- Affichage du résultat ---------- */
let LAST = null; // dernière estimation pour le message WhatsApp

function renderResult(data, est) {
  const card = $("#result");
  const detail = $("#result-detail");
  const price = $("#result-price");
  detail.innerHTML = "";

  const addRow = (a, b) => {
    const r = document.createElement("div");
    r.className = "row";
    r.innerHTML = `<span>${a}</span><span>${b}</span>`;
    detail.appendChild(r);
  };

  addRow("Type de demande", est.typeLabel);

  let priceStr;
  if (est.quote) {
    priceStr = "Sur devis";
    price.textContent = "Sur devis";
    if (est.baseLabel) addRow("Prestation", est.baseLabel);
    addRow("Tarif", "communiqué par VTCAF");
  } else if (est.missing) {
    priceStr = "À confirmer";
    price.textContent = "À confirmer";
    addRow("Information", est.missing);
  } else {
    addRow("Base", `${est.baseLabel} : ${priceText(est.base.min, est.base.max)}`);
    est.lines.forEach(([a, b]) => addRow(a, b));
    priceStr = priceText(est.final.min, est.final.max);
    price.textContent = priceStr;
  }

  LAST = { data, est, priceStr };
  card.hidden = false;
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Met à jour le lien d'envoi WhatsApp
  $("#btn-send").setAttribute("href", waLink(buildWhatsAppMessage(data, est, priceStr)));
}

/* ---------- Message WhatsApp ---------- */
function buildWhatsAppMessage(d, est, priceStr) {
  const yn = (v) => (v === "oui" ? "Oui" : "Non");
  const detailLines = [];
  if (est.missing) {
    detailLines.push(est.missing);
  } else if (est.quote) {
    detailLines.push(`${est.typeLabel}${est.baseLabel ? " — " + est.baseLabel : ""} : sur devis`);
  } else {
    detailLines.push(`Base : ${est.baseLabel} (${priceText(est.base.min, est.base.max)})`);
    est.lines.forEach(([a, b]) => detailLines.push(`${a} : ${b}`));
  }

  return (
`Bonjour ${CONFIG.companyName}, je souhaite faire une demande de réservation.

Nom : ${d.nom}
Téléphone : ${d.tel}
Email : ${d.email || "—"}
Date souhaitée : ${d.date}
Heure souhaitée : ${d.heure}

Type de demande : ${est.typeLabel}
Départ : ${d.depart}
Commune de départ : ${d.communeDepart}
Arrivée : ${d.arrivee}
Commune d'arrivée : ${d.communeArrivee}

Nombre de passagers : ${d.passagers}
Nombre de bagages : ${d.bagages || "0"}
Bagage volumineux : ${yn(d.bagageVolumineux)}
Enfant à bord : ${yn(d.enfant)}
Siège bébé : ${yn(d.siegeBebe)}
Nuit / week-end / jour férié : ${yn(d.nuit)}
Numéro de vol : ${d.vol || "—"}
Distance estimée : ${d.km ? d.km + " km" : "—"}
Précisions : ${d.precisions || "—"}

Estimation affichée : ${priceStr}
Détail du calcul :
${detailLines.map((l) => "- " + l).join("\n")}

Merci de me confirmer votre disponibilité et le tarif final.`
  );
}

/* ---------- localStorage (sauvegarde du formulaire) ---------- */
const LS_KEY = "vtcaf_last_request";
function saveForm() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(readForm())); } catch (e) {}
}
function restoreForm() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    const f = $("#estimate-form");
    Object.entries(d).forEach(([k, v]) => {
      const el = f.elements[k];
      if (!el) return;
      if (el.type === "checkbox") el.checked = !!v;
      else el.value = v;
    });
    $("#f-type").dispatchEvent(new Event("change"));
  } catch (e) {}
}

/* ---------- Initialisation de l'estimateur ---------- */
function initEstimator() {
  const form = $("#estimate-form");
  if (!form) return;
  restoreForm();
  form.addEventListener("input", saveForm);
  form.addEventListener("change", saveForm);

  $("#btn-estimate").addEventListener("click", () => {
    const data = readForm();
    const errors = validate(data);
    if (Object.keys(errors).length) { showErrors(errors); $("#result").hidden = true; return; }
    showErrors({});
    renderResult(data, computeEstimate(data));
  });
}

/* ---------- Galerie + lightbox ---------- */
function initGallery() {
  const grid = $("#gallery");
  if (!grid) return;
  MEDIA.gallery.forEach((img, i) => {
    const fig = document.createElement("figure");
    const el = document.createElement("img");
    el.src = img.src; el.alt = img.alt;
    el.width = 800; el.height = 540;
    if (i > 0) el.loading = "lazy";       // hero de galerie chargée tout de suite
    el.decoding = "async";
    el.addEventListener("error", () => { fig.style.display = "none"; }); // ne casse pas si média manquant
    el.addEventListener("click", () => openLightbox(img.src, img.alt));
    fig.appendChild(el);
    grid.appendChild(fig);
  });

  const lb = $("#lightbox"), lbImg = $("#lightbox-img");
  const close = () => { lb.hidden = true; lb.setAttribute("aria-hidden", "true"); lbImg.src = ""; };
  $("#lightbox-close").addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) close(); });
  window.openLightbox = (src, alt) => { lbImg.src = src; lbImg.alt = alt; lb.hidden = false; lb.setAttribute("aria-hidden", "false"); };
}

/* ---------- Vidéo YouTube ---------- */
function initVideo() {
  const wrap = $("#video-wrap");
  const cta = $("#video-cta");
  const ytBtn = $("#btn-youtube");
  if (!wrap) return;

  if (MEDIA.youtubeEmbedUrl) {
    const iframe = document.createElement("iframe");
    iframe.src = MEDIA.youtubeEmbedUrl;
    iframe.title = "Vidéo VTCAF";
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    wrap.appendChild(iframe);
    if (MEDIA.youtubeVideoUrl) { ytBtn.href = MEDIA.youtubeVideoUrl; cta.hidden = false; }
  } else {
    wrap.innerHTML = `
      <div class="video-fallback">
        <strong>Vidéo bientôt disponible</strong>
        <span>La présentation vidéo de VTCAF sera ajoutée prochainement.</span>
      </div>`;
    if (MEDIA.youtubeVideoUrl) { ytBtn.href = MEDIA.youtubeVideoUrl; cta.hidden = false; }
  }
}

/* ---------- Avis ---------- */
function initReviews() {
  const grid = $("#reviews");
  if (grid) {
    grid.innerHTML = "";
    REVIEWS.forEach((r) => {
      const stars = "★".repeat(r.rating) + `<span class="off">${"★".repeat(5 - r.rating)}</span>`;
      const el = document.createElement("article");
      el.className = "review";
      el.innerHTML = `
        <div class="stars" aria-label="${r.rating} étoiles sur 5">${stars}</div>
        <p>“${r.text}”</p>
        <div class="meta"><span class="name">${r.name}</span><span class="date">${r.date}</span></div>`;
      grid.appendChild(el);
    });
  }

  const see = $("#btn-see-reviews");
  const leave = $("#btn-leave-review");
  // Si aucun lien Google n'est renseigné, on pointe vers une recherche Google par défaut.
  const fallback = "https://www.google.com/search?q=VTCAF+La+R%C3%A9union+avis";
  see.href = CONFIG.googleBusinessLink || fallback;
  leave.href = CONFIG.googleReviewLink || fallback;
}

/* ---------- Moyens de paiement ---------- */
function initPayments() {
  const ul = $("#pay-options");
  if (!ul) return;
  const ic = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
  const items = [];
  if (PAYMENT_OPTIONS.onboard) items.push("Paiement à bord");
  if (PAYMENT_OPTIONS.cash) items.push("Espèces");
  if (PAYMENT_OPTIONS.card) items.push("Carte bancaire");
  if (PAYMENT_OPTIONS.bankTransfer) items.push("Virement");
  if (PAYMENT_OPTIONS.paymentLink) items.push("Lien de paiement après validation");
  if (PAYMENT_OPTIONS.depositForEvents) items.push("Acompte (événement / mariage)");
  if (PAYMENT_OPTIONS.stripePaymentLink) items.push("Paiement en ligne");
  if (PAYMENT_OPTIONS.paypalLink) items.push("PayPal");

  items.forEach((label) => {
    const li = document.createElement("li");
    li.innerHTML = `${ic}<span>${label}</span>`;
    ul.appendChild(li);
  });
}

/* ---------- PWA : Service Worker + bannière d'installation ---------- */
function initPWA() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {}); // silencieux si non supporté
    });
  }

  const banner = $("#install-banner");
  let deferred = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    if (banner) banner.hidden = false;
  });
  $("#install-yes")?.addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    if (banner) banner.hidden = true;
  });
  $("#install-no")?.addEventListener("click", () => { if (banner) banner.hidden = true; });
}

/* ---------- Init global ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  bindStaticWaLinks();
  initNav();
  initDynamicFields();
  initEstimator();
  initGallery();
  initVideo();
  initReviews();
  initPayments();
  initPWA();
});
