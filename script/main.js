// Feature flag pour activer/désactiver l'aperçu en temps réel
const enableRealTimePreview = false;

// Feature flag pour activer/désactiver la conversion de documents
const enableFileConversion = true;

// Fonction utilitaire pour vérifier si une chaîne est en Base64
function isBase64(str) {
  try {
    // Vérifie si la chaîne est valide Base64
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

// Fonction pour lire un fichier et le convertir en Base64
function fileToBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const base64String = btoa(event.target.result);
    callback(base64String);
  };
  reader.readAsBinaryString(file);
}

document.addEventListener("DOMContentLoaded", function () {
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const previewContainer = document.getElementById("previewContainer");
  const preview = document.getElementById("preview");
  const fileInput = document.getElementById("fileInput");
  const fileOutput = document.getElementById("fileOutput");
  const fileForm = document.getElementById("fileForm");

  // Activer ou désactiver l'aperçu en temps réel selon le flag
  if (enableRealTimePreview) {
    previewContainer.classList.remove("hidden");

    // Écouteur d'événements pour mettre à jour l'aperçu en temps réel
    inputText.addEventListener("input", function () {
      const inputValue = inputText.value.trim();

      if (isBase64(inputValue)) {
        // Si la chaîne est en Base64, on la décode pour l'aperçu
        try {
          const decoded = atob(inputValue);
          preview.textContent = decoded;
        } catch (e) {
          preview.textContent = "Erreur : Chaîne Base64 non valide";
        }
      } else {
        // Sinon, on l'encode en Base64 pour l'aperçu
        const encoded = btoa(inputValue);
        preview.textContent = encoded;
      }
    });
  }

  // Afficher ou cacher le formulaire de conversion de fichiers
  if (enableFileConversion) {
    fileForm.classList.remove("hidden");

    fileInput.addEventListener("change", function () {
      const file = fileInput.files[0];
      if (file) {
        fileToBase64(file, function (base64String) {
          fileOutput.value = base64String;
        });
      }
    });
  } else {
    fileForm.classList.add("hidden");
  }

  document.getElementById("encodeBtn").addEventListener("click", function () {
    const encoded = btoa(inputText.value);
    outputText.value = encoded;

    if (enableRealTimePreview) {
      preview.textContent = encoded;
    }
  });

  document.getElementById("decodeBtn").addEventListener("click", function () {
    try {
      const decoded = atob(inputText.value);
      outputText.value = decoded;

      if (enableRealTimePreview) {
        preview.textContent = decoded;
      }
    } catch (e) {
      outputText.value = "Erreur : Chaîne Base64 non valide";
      if (enableRealTimePreview) {
        preview.textContent = "Erreur : Chaîne Base64 non valide";
      }
    }
  });

  document.getElementById("copyBtn").addEventListener("click", function () {
    outputText.select();
    document.execCommand("copy");
  });
});
