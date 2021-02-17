const path = require("path");
const fs = require("fs");
const { join, resolve } = require("path");
const { rejects } = require("assert");
const e = require("express");

const p = path.join(__dirname, "..", "data", "card.json");

class Card {
  static async add(photo_id) {
    const card = await Card.fetch();

    const idx = card.photo.findIndex((c) => c.id === photo_id.id);
    const candidate = card.photo[idx];

    if (candidate) {
      // Фото уже есть в корзине
      candidate.count++;
      card.photo[idx] = candidate;
    } else {
      // Добавляем
      photo_id.count = 1;
      card.photo.push(photo_id);
    }
    card.price += +photo_id.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  static async remove(id) {
    const card = await Card.fetch();

    const idx = card.photo.findIndex((c) => c.id === id);
    const photo_id = card.photo[idx];

    if (photo_id.count === 1) {
      // Удалить
      card.photo = card.photo.filter((c) => c.id !== id);
    } else {
      // Изменить
      card.photo[idx].count--;
    }
    card.price -= photo_id.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(card);
        }
      });
    });
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, "utf-8", (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      });
    });
  }
}

module.exports = Card;
