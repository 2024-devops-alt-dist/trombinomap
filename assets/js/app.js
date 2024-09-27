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

  // Créer un objet pour stocker les marqueurs associés aux apprenants
  const apprenantMarkers = {};

  try {
    // Charger les données JSON
    const response = await fetch("data/apprenants.json");
    const data = await response.json();

    // Pour chaque apprenant, créer un marqueur
    data.forEach((apprenant) => {
      const [latitude, longitude] = apprenant.coordonnees;
      const isTeam = apprenant.isTeam;

      // Choisir l'icône en fonction de isTeam
      const iconUrl = isTeam
        ? "uploads/icons/marker-gold.png"
        : "uploads/icons/marker-default.png";

      const customIcon = L.icon({
        iconUrl: iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Créer le marqueur et le popup
      const marker = L.marker([latitude, longitude], {
        // icon: customIcon,
      });
      const popupContent = `
        <div class="text-center">
            <b>${apprenant.prenom} ${apprenant.nom}</b><br>
            <img class="avatar" src="${apprenant.photo}" alt="${apprenant.prenom} ${apprenant.nom}" style="width:100px;"/>
        </div>
      `;
      marker.bindPopup(popupContent);
      markers.addLayer(marker);

      // Stocker le marqueur avec l'ID de l'apprenant
      apprenantMarkers[apprenant.id] = marker;

      // Ajouter la photo de l'apprenant dans la zone appropriée (équipe ou apprenant normal)
      const photoContainer = isTeam
        ? document.getElementById("team-photos") // Photos de l'équipe
        : document.getElementById("apprenant-photos"); // Autres apprenants

      const photoElement = document.createElement("img");
      photoElement.src = apprenant.photo;
      photoElement.alt = `${apprenant.prenom} ${apprenant.nom}`;
      photoElement.title = `${apprenant.prenom} ${apprenant.nom}`;

      // Ajouter un événement de clic sur la photo pour centrer et ouvrir le popup
      photoElement.addEventListener("click", () => {
        markers.zoomToShowLayer(marker, () => {
          // map.setView([latitude, longitude], 10); // Ajuster le zoom
          marker.openPopup(); // Ouvrir le popup associé
        });
      });

      // Ajouter la photo au bon conteneur (soit team-photos, soit apprenant-photos)
      photoContainer.appendChild(photoElement);
    });

    // Ajouter le groupe de marqueurs à la carte
    map.addLayer(markers);
  } catch (error) {
    console.error("Erreur lors du chargement du fichier JSON:", error);
  }
};

// Appeler la fonction pour initialiser la carte
initMap();
