const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const { resolve } = require("path");

class Photo {
  constructor(title, description, price, img) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.img = img;
    this.id = uuid.v4();
  }
  toJSON() {
    return {
      title: this.title,
      description: this.description,
      price: this.price,
      img: this.img,
      id: this.id,
    };
  }
  static async update(photo) {
    const photoes = await Photo.getAll();

    const idx = photoes.findIndex((c) => c.id === photo.id);
    photoes[idx] = photo;

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "photo.json"),
        JSON.stringify(photoes),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
  async save() {
    const photoes = await Photo.getAll();
    photoes.push(this.toJSON());

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, "..", "data", "photo.json"),
        JSON.stringify(photoes),
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, "..", "data", "photo.json"),
        "utf-8",
        (err, content) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(content));
          }
        }
      );
    });
  }
  static async getById(id) {
    const photoes = await Photo.getAll();
    return photoes.find((c) => c.id === id);
  }
}

module.exports = Photo;
