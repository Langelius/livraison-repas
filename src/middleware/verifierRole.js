// Vérifie que l'utilisateur connecté possède un rôle autorisé
function verifierRole(...rolesAutorises) {
  return function (requete, reponse, suivant) {
    if (!requete.utilisateur || !rolesAutorises.includes(requete.utilisateur.role)) {
      return reponse.status(403).json({
        message: "Vous n'avez pas l'autorisation d'effectuer cette action"
      });
    }

    suivant();
  };
}

module.exports = verifierRole;
