const toCurrency = (price) => {
  return new Intl.NumberFormat("ru-RU", {
    currency: "rub",
    style: "currency",
  }).format(price);
};
document.querySelectorAll(".price").forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const $card = document.querySelector("#card");
if ($card) {
  $card.addEventListener("click", (event) => {
    if (event.target.classList.contains("js-remove")) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf;
      fetch("/card/remove/" + id, {
        method: "delete",
        headers: {
          "X-XSRF-TOKEN": csrf,
        },
      })
        .then((res) => res.json())
        .then((card) => {
          if (card.photo.length) {
            const html = card.photo
              .map((c) => {
                return `    
              <tr>
                <td>${c.title}</td>
                <td><img src="${c.img}" alt="${c.title}" class="img-incard"></td>
                <td>${c.count}</td>
                <td >
                  <button class="btn btn-small red js-remove" data-id="${c._id}">Удалить</button>
                </td>
            </tr>`;
              })
              .join("");
            $card.querySelector("tbody").innerHTML = html;
            $card.querySelector(".price").textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = "<p>Ваша корзина пуста</p>";
          }
        });
    }
  });
}
const toDate = (date) => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(date));
};

M.Tabs.init(document.querySelectorAll(".tabs"));

document.querySelectorAll(".date").forEach((node) => {
  node.textContent = toDate(node.textContent);
});

document.querySelector("#search").oninput = function () {
  let val = this.value.trim();
  let card = document.querySelectorAll(".cards");
  if (val !== "") {
    card.forEach(function (elem) {
      if (elem.innerText.search(val) == -1) {
        elem.classList.add("hide");
        console.log(card);
      } else {
        elem.classList.remove("hide");
      }
    });
  } else if (val === "") {
    card.forEach(function (elem) {
      elem.classList.remove("hide");
    });
  }
};
