// Fonction pour initialiser la carte
const initMap = async () => {
  // Initialiser la carte
  const map = L.map("map").setView([46.6034, 1.8883], 5); // Centrer sur la France

  // Ajouter une couche de tuiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // Créer un objet LatLngBounds pour ajuster la vue de la carte
  const bounds = L.latLngBounds();

  try {
    // Charger les données JSON
    const response = await fetch("data/apprenants.json");
    const data = await response.json();

    // Pour chaque apprenant, créer un marqueur
    data.forEach((apprenant) => {
      // Extraire latitude, longitude et isTeam
      const [latitude, longitude] = apprenant.coordonnees; // Décomposer les coordonnées
      const isTeam = apprenant.isTeam; // Vérifier si l'apprenant est dans l'équipe

      // Choisir l'icône en fonction de isTeam
      const iconUrl = isTeam
        ? "uploads/icons/marker-gold.png" // Marqueur doré
        : "uploads/icons/marker-default.png"; // Marqueur par défaut

      // Créer une icône personnalisée
      const customIcon = L.icon({
        iconUrl: iconUrl,
        iconSize: [25, 41], // Taille de l'icône
        iconAnchor: [12, 41], // Point d'ancrage
        popupAnchor: [1, -34], // Point d'ancrage pour le popup
      });

      // Créer le marqueur et l'ajouter à la carte
      const marker = L.marker([latitude, longitude], {
        // icon: customIcon,
      }).addTo(map);

      // Ajouter les coordonnées du marqueur aux limites
      bounds.extend([latitude, longitude]);

      // Ajouter un popup au marqueur
      marker.bindPopup(`
          <div class="text-center">
            <b>${apprenant.prenom} ${apprenant.nom}</b>
            <div><img class="avatar" src="${apprenant.photo}" alt="${apprenant.prenom} ${apprenant.nom}" style="width:100px;"/>
          </div>
        `);
    });

    // Ajuster la vue de la carte pour inclure tous les marqueurs
    map.fitBounds(bounds);
  } catch (error) {
    console.error("Erreur lors du chargement du fichier JSON:", error);
  }
};

// Appeler la fonction pour initialiser la carte
initMap();
