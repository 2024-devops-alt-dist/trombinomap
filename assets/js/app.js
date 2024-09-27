// Fonction pour initialiser la carte
const initMap = async () => {
  // Initialiser la carte
  const map = L.map("map").setView([46.6034, 1.8883], 5); // Centrer sur la France

  // Ajouter une couche de tuiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // Créer un groupe de marqueurs pour le regroupement
  const markers = L.markerClusterGroup();

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

      // Créer le marqueur
      const marker = L.marker([latitude, longitude], {
        // icon: customIcon,
      });

      // Ajouter le popup au marqueur
      marker.bindPopup(`
                <div class="text-center">
                    <b>${apprenant.prenom} ${apprenant.nom}</b>
                    <br><img class="avatar" src="${apprenant.photo}" alt="${apprenant.prenom} ${apprenant.nom}" style="width:100px;"/>
                </div>
            `);

      // Ajouter le marqueur au groupe de marqueurs
      markers.addLayer(marker);
    });

    // Ajouter le groupe de marqueurs à la carte
    map.addLayer(markers);

    // Ajuster la vue de la carte pour inclure tous les marqueurs
    // map.fitBounds(bounds); // Si vous souhaitez centrer la carte après avoir ajouté les marqueurs
  } catch (error) {
    console.error("Erreur lors du chargement du fichier JSON:", error);
  }
};

// Appeler la fonction pour initialiser la carte
initMap();
