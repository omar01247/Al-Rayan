const container = document.getElementById("mainCardContainer");

function addCardToPage(card) {
  const col = document.createElement("div");
  col.className = "col-auto position-relative";

  const cardElement = document.createElement("div");
  cardElement.className = "card";
  cardElement.style.width = "300px";
  cardElement.style.height = "330px";
  cardElement.style.border = "2px solid #d4a564";
  cardElement.style.backgroundColor = "#fff";
  cardElement.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  cardElement.style.cursor = "pointer";

  cardElement.setAttribute('data-category', card.category);

  const image = document.createElement("img");
  image.src = card.image;
  image.className = "card-img-top";
  image.style.height = "270px";
  image.style.objectFit = "cover";

  cardElement.appendChild(image);

  const cardBody = document.createElement("div");
  cardBody.className = "card-body text-center";

  const titleEl = document.createElement("h6");
  titleEl.className = "card-title";
  titleEl.textContent = card.title;

  cardBody.appendChild(titleEl);
  cardElement.appendChild(cardBody);

  cardElement.addEventListener("click", () => {
    document.getElementById("cardDetailModalLabel").textContent = card.title;
    document.getElementById("detailImage").src = card.image;
    document.getElementById("detailTitle").textContent = `${card.price} درهم  | الفئة: ${card.category}`;
    document.getElementById("detailDescription").textContent = card.description;

    new bootstrap.Modal(document.getElementById("cardDetailModal")).show();
  });

  col.appendChild(cardElement);
  container.appendChild(col);
}

window.addEventListener("load", () => {
  const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
  container.innerHTML = "";
  savedCards.forEach(card => {
    addCardToPage(card);
  });
});

const channel = new BroadcastChannel('cards_channel');
channel.onmessage = function(e) {
  if (e.data.type === "addCard") {
    addCardToPage(e.data.data);
  }
};

const filterBtn = document.getElementById('filterBtn');
const filterModal = document.getElementById('filterModal');
const closeModal = document.getElementById('closeModal');
const applyFilter = document.getElementById('applyFilter');

filterBtn?.addEventListener('click', () => {
  filterModal.style.display = 'flex';
});

closeModal?.addEventListener('click', () => {
  filterModal.style.display = 'none';
});

applyFilter?.addEventListener('click', () => {
  const selectedCategories = Array.from(
    filterModal.querySelectorAll('input[type="checkbox"]:checked')
  ).map(checkbox => checkbox.value);

  const cards = container.querySelectorAll('.card');

  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (selectedCategories.length === 0 || selectedCategories.includes(cardCategory)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });

  filterModal.style.display = 'none';
});

function filterCards() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll("#mainCardContainer .col-auto");
  let visibleCount = 0;

  cards.forEach(col => {
    const title = col.querySelector(".card-title").textContent.toLowerCase();
    if (title.includes(input)) {
      col.style.display = "";
      visibleCount++;
    } else {
      col.style.display = "none";
    }
  });

  const noResults = document.getElementById("noResultsMessage");
  if (visibleCount === 0) {
    noResults.style.display = "block";
  } else {
    noResults.style.display = "none";
  }
}

document.getElementById("searchInput").addEventListener("input", filterCards);

