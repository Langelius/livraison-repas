// Modèle de données : un plat
export default class Plat {
  constructor(id, nom, prix, description) {
    this.id = id;
    this.nom = nom;
    this.prix = prix;
    this.description = description;
  }

  static depuisJson(json) {
    return new Plat(
      json._id || "",
      json.nom || "",
      Number(json.prix || 0),
      json.description || ""
    );
  }
}
