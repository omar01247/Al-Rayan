document.getElementById("li2").addEventListener("click", () => {
  new bootstrap.Modal(document.getElementById("addCardModal")).show();
});

window.addEventListener("load", () => {
  const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
  const container = document.getElementById("cardContainer");
  container.innerHTML = ""; 

  savedCards.forEach((cardData, idx) => {
    addCardToPage(cardData, idx);
  });
});

document.getElementById("cardForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const title = document.getElementById("cardTitle").value.trim();
  const desc = document.getElementById("cardDescription").value.trim();
  const category = document.getElementById("cardCategory").value.trim();
  const price = document.getElementById("price").value.trim();
  const file = document.getElementById("cardImage").files[0];

  if (!file) return;
  if (!category) {
    alert("من فضلك اختر الفئة.");
    return;
  }
  if (!price || isNaN(price) || Number(price) <= 0) {
    alert("من فضلك أدخل ثمن صالح.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    const cardData = {
      title,
      description: desc,
      category,
      price,
      image: evt.target.result
    };

    const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
    savedCards.push(cardData);
    localStorage.setItem("cards", JSON.stringify(savedCards));

    addCardToPage(cardData, savedCards.length - 1);

    bootstrap.Modal.getInstance(document.getElementById("addCardModal")).hide();
    document.getElementById("cardForm").reset();
  };
  reader.readAsDataURL(file);
});

function addCardToPage(card, index) {
  const container = document.getElementById("cardContainer");
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

  // زر حذف
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-single-btn";
  deleteBtn.innerHTML = "&times;";
  deleteBtn.title = "حذف البطاقة";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (confirm("هل أنت متأكد من حذف هذه البطاقة؟")) {
      deleteCard(index);
    }
  });

  cardElement.appendChild(deleteBtn);

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
    document.getElementById("detailTitle").textContent =
      `${card.price} درهم  | الفئة: ${card.category}`;
    document.getElementById("detailDescription").textContent = card.description;
    new bootstrap.Modal(document.getElementById("cardDetailModal")).show();
  });

  col.appendChild(cardElement);
  container.appendChild(col);
}

function deleteCard(index) {
  const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
  savedCards.splice(index, 1);
  localStorage.setItem("cards", JSON.stringify(savedCards));

  const container = document.getElementById("cardContainer");
  container.innerHTML = "";
  savedCards.forEach((cardData, idx) => {
    addCardToPage(cardData, idx);
  });
}

function filterCards() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll("#cardContainer .col-auto").forEach(col => {
    const title = col.querySelector(".card-title").textContent.toLowerCase();
    col.style.display = title.includes(input) ? "" : "none";
  });
}

function clearCards() {
  if (confirm("هل أنت متأكد من حذف كل البطاقات؟")) {
    localStorage.removeItem("cards");
    document.getElementById("cardContainer").innerHTML = "";
  }
}

document.getElementById("li4").addEventListener("click", () => {
  document.body.classList.toggle("show-delete-btns");
});

document.getElementById("li4").addEventListener("click", (e) => {
  e.stopPropagation(); 
  document.body.classList.add("show-delete-btns");
});

document.getElementById("overlay-delete").addEventListener("click", () => {
  document.body.classList.remove("show-delete-btns");
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

