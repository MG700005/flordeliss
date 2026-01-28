const images = [
  "images/catalogo (1).jpg",
  "images/catalogo (2).jpg",
  "images/catalogo (3).jpg",
  "images/catalogo (4).jpg",
  "images/catalogo (5).jpg",
  "images/catalogo (6).jpg",
  "images/catalogo (7).jpg",
  "images/catalogo (8).jpg",
  "images/catalogo (9).jpg",
  "images/catalogo (10).jpg",
  "images/catalogo (11).jpg",
  "images/catalogo (12).jpg",
  "images/catalogo (13).jpg",
  "images/catalogo (14).jpg",
  "images/catalogo (15).jpg",
  "images/catalogo (16).jpg",
  "images/catalogo (17).jpg",
  "images/catalogo (18).jpg",
  "images/catalogo (19).jpg",
  "images/catalogo (20).jpg",
  "images/catalogo (21).jpg",
  "images/catalogo (22).jpg",
  "images/catalogo (23).jpg",
  "images/catalogo (24).jpg",
  "images/catalogo (25).jpg",
  "images/catalogo (26).jpg",
  "images/catalogo (27).jpg",
  "images/catalogo (28).jpg",
  "images/catalogo (29).jpg",
  "images/catalogo (30).jpg",
  "images/catalogo (31).jpg",
  "images/catalogo (32).jpg",
  "images/catalogo (33).jpg",
  "images/catalogo (34).jpg",
  "images/catalogo (35).jpg",
  "images/catalogo (36).jpg",
  "images/catalogo (37).jpg",
  "images/catalogo (38).jpg",
  "images/catalogo (39).jpg",
  "images/catalogo (40).jpg",
  "images/catalogo (41).jpg",
  "images/catalogo (42).jpg",
  "images/catalogo (43).jpg",
  "images/catalogo (44).jpg",
  "images/catalogo (45).jpg",
  "images/catalogo (46).jpg",
  "images/catalogo (47).jpg",
  "images/catalogo (48).jpg",
  "images/catalogo (49).jpg",
  "images/catalogo (50).jpg",
  "images/catalogo (51).jpg",
  "images/catalogo (52).jpg",
];

const grid = document.getElementById("grid");
const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewerImage");
const addButton = document.getElementById("addButton");
const viewerPrice = document.getElementById("viewerPrice");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartEmpty = document.querySelector(".cart-empty");
const WHATSAPP_NUMBER = "50378363085";

let currentIndex = 0;
const cart = [];
let prices = [];
const SHIPPING_FEE = 3.5;

async function loadPrices() {
  try {
    const response = await fetch("precios.txt", { cache: "no-cache" });
    if (!response.ok) throw new Error("No se pudo leer precios.txt");
    const text = await response.text();
    const map = new Map();
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((line) => {
        const match = line.match(/catalogo\s*\((\d+)\).*?([0-9]+(?:[\.,][0-9]+)?)/i);
        if (!match) return;
        const index = Number(match[1]);
        const value = Number(match[2].replace(",", "."));
        if (!Number.isNaN(index) && !Number.isNaN(value)) {
          map.set(index, value);
        }
      });

    prices = images.map((_, idx) => map.get(idx + 1) ?? null);
  } catch (error) {
    prices = images.map(() => null);
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function renderGrid() {
  images.forEach((src, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Producto ${index + 1}`;

    card.appendChild(img);
    card.addEventListener("click", () => openViewer(index));
    grid.appendChild(card);
  });
}

function openViewer(index) {
  currentIndex = index;
  viewerImage.src = images[currentIndex];
  updateViewerPrice();
  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden", "false");
}

function closeViewer() {
  viewer.classList.remove("open");
  viewer.setAttribute("aria-hidden", "true");
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  viewerImage.src = images[currentIndex];
  updateViewerPrice();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  viewerImage.src = images[currentIndex];
  updateViewerPrice();
}

function addCurrent() {
  const price = prices[currentIndex];
  if (!price) {
    alert("Este producto no tiene precio asignado.");
    return;
  }

  cart.push({
    name: `Producto ${currentIndex + 1}`,
    price,
  });
  renderCart();
  alert("Producto agregado exitosamente");
}

function updateViewerPrice() {
  const price = prices[currentIndex];
  if (!price) {
    viewerPrice.textContent = "Sin precio";
    addButton.disabled = true;
    addButton.style.opacity = "0.6";
    return;
  }
  viewerPrice.textContent = formatCurrency(price);
  addButton.disabled = false;
  addButton.style.opacity = "1";
}

function renderCart() {
  cartList.innerHTML = "";
  if (cart.length === 0) {
    cartEmpty.style.display = "block";
  } else {
    cartEmpty.style.display = "none";
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.className = "cart-item";

    const label = document.createElement("span");
    label.textContent = `${item.name}`;

    const right = document.createElement("div");
    right.className = "cart-actions";

    const price = document.createElement("span");
    price.textContent = formatCurrency(item.price);

    const remove = document.createElement("button");
    remove.textContent = "Quitar";
    remove.className = "primary";
    remove.style.padding = "6px 12px";
    remove.addEventListener("click", () => {
      cart.splice(index, 1);
      renderCart();
    });

    right.appendChild(price);
    right.appendChild(remove);

    li.appendChild(label);
    li.appendChild(right);
    cartList.appendChild(li);
  });

  if (shippingMethodInput.value === "delivery") {
    total += SHIPPING_FEE;
  }
  cartTotal.textContent = formatCurrency(total);
}

let touchStartX = 0;

viewer.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
});

viewer.addEventListener("touchend", (event) => {
  const diff = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) < 40) return;
  if (diff < 0) {
    showNext();
  } else {
    showPrev();
  }
});

viewer.querySelector(".viewer-close").addEventListener("click", closeViewer);
viewer.querySelector(".viewer-backdrop").addEventListener("click", closeViewer);
viewer.querySelector(".viewer-nav.left").addEventListener("click", showPrev);
viewer.querySelector(".viewer-nav.right").addEventListener("click", showNext);
addButton.addEventListener("click", addCurrent);

document.addEventListener("keydown", (event) => {
  if (!viewer.classList.contains("open")) return;
  if (event.key === "Escape") closeViewer();
  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrev();
});

const orderForm = document.getElementById("orderForm");
const departmentSelect = document.getElementById("departmentSelect");
const municipalitySelect = document.getElementById("municipalitySelect");
const shippingMethodInput = document.getElementById("shippingMethod");
const deliveryOption = document.getElementById("deliveryOption");
const pickupOption = document.getElementById("pickupOption");
const shippingFieldNames = ["address", "department", "municipality", "reference"];
const shippingFields = document.getElementById("shippingFields");
function buildWhatsAppMessage(formData) {
  const lines = [];
  lines.push("Pedido desde el catálogo");
  lines.push("");
  lines.push("Productos:");
  if (cart.length === 0) {
    lines.push("- Sin productos");
  } else {
    cart.forEach((item) => {
      lines.push(`- ${item.name}: ${formatCurrency(item.price)}`);
    });
  }

  let total = cart.reduce((sum, item) => sum + item.price, 0);
  if (shippingMethodInput.value === "delivery") {
    lines.push(`Envío: ${formatCurrency(SHIPPING_FEE)}`);
    total += SHIPPING_FEE;
  }
  lines.push(`Total: ${formatCurrency(total)}`);
  lines.push("");
  lines.push("Datos de entrega:");
  lines.push(`Nombre: ${formData.get("fullName")}`);
  lines.push(`Teléfono: ${formData.get("phone")}`);
  if (shippingMethodInput.value !== "pickup") {
    lines.push(`Dirección: ${formData.get("address")}`);
    lines.push(`Departamento: ${formData.get("department")}`);
    lines.push(`Municipio: ${formData.get("municipality")}`);
    lines.push(`Referencia: ${formData.get("reference")}`);
  }
  lines.push(`Método: ${shippingMethodInput.value === "pickup" ? "Retiro en agencia" : "Envío"}`);

  return lines.join("\n");
}

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (cart.length === 0) {
    alert("Agrega al menos un producto.");
    return;
  }
  const formData = new FormData(orderForm);
  const message = buildWhatsAppMessage(formData);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
  window.location.reload();
});

function updateShippingFields() {
  const disabled = shippingMethodInput.value === "pickup";
  if (shippingFields) {
    shippingFields.classList.toggle("hidden", disabled);
  }
  shippingFieldNames.forEach((name) => {
    const field = orderForm.elements[name];
    if (!field) return;
    field.disabled = disabled;
    if (field.required) {
      field.dataset.wasRequired = "true";
      field.required = !disabled;
    } else if (field.dataset.wasRequired === "true") {
      field.required = !disabled;
    }
  });
  renderCart();
}

function setShippingMethod(method) {
  shippingMethodInput.value = method;
  const isDelivery = method === "delivery";
  deliveryOption.classList.toggle("selected", isDelivery);
  pickupOption.classList.toggle("selected", !isDelivery);
  deliveryOption.setAttribute("aria-pressed", String(isDelivery));
  pickupOption.setAttribute("aria-pressed", String(!isDelivery));
  updateShippingFields();
}

deliveryOption.addEventListener("click", () => setShippingMethod("delivery"));
pickupOption.addEventListener("click", () => setShippingMethod("pickup"));
setShippingMethod(shippingMethodInput.value || "pickup");

const departments = {
  "Ahuachapán": [
    "Ahuachapán",
    "Apaneca",
    "Atiquizaya",
    "Concepción de Ataco",
    "El Refugio",
    "Guaymango",
    "Jujutla",
    "San Francisco Menéndez",
    "San Lorenzo",
    "San Pedro Puxtla",
    "Tacuba",
    "Turín",
  ],
  "Cabañas": [
    "Cinquera",
    "Dolores",
    "Guacotecti",
    "Ilobasco",
    "Jutiapa",
    "San Isidro",
    "Sensuntepeque",
    "Tejutepeque",
    "Victoria",
  ],
  "Chalatenango": [
    "Agua Caliente",
    "Arcatao",
    "Azacualpa",
    "Chalatenango",
    "Citalá",
    "Comalapa",
    "Concepción Quezaltepeque",
    "Dulce Nombre de María",
    "El Carrizal",
    "El Paraíso",
    "La Laguna",
    "La Palma",
    "La Reina",
    "Las Vueltas",
    "Nombre de Jesús",
    "Nueva Concepción",
    "Nueva Trinidad",
    "Ojos de Agua",
    "Potonico",
    "San Antonio de la Cruz",
    "San Antonio Los Ranchos",
    "San Fernando",
    "San Francisco Lempa",
    "San Francisco Morazán",
    "San Ignacio",
    "San Isidro Labrador",
    "San José Cancasque",
    "San José Las Flores",
    "San Luis del Carmen",
    "San Miguel de Mercedes",
    "San Rafael",
    "Santa Rita",
    "Tejutla",
  ],
  "Cuscatlán": [
    "Candelaria",
    "Cojutepeque",
    "El Carmen",
    "El Rosario",
    "Monte San Juan",
    "Oratorio de Concepción",
    "San Bartolomé Perulapía",
    "San Cristóbal",
    "San José Guayabal",
    "San Pedro Perulapán",
    "San Rafael Cedros",
    "San Ramón",
    "Santa Cruz Analquito",
    "Santa Cruz Michapa",
    "Suchitoto",
    "Tenancingo",
  ],
  "La Libertad": [
    "Antiguo Cuscatlán",
    "Chiltiupán",
    "Ciudad Arce",
    "Colón",
    "Comasagua",
    "Huizúcar",
    "Jayaque",
    "Jicalapa",
    "La Libertad",
    "Nuevo Cuscatlán",
    "Quezaltepeque",
    "Sacacoyo",
    "San Juan Opico",
    "San Matías",
    "San Pablo Tacachico",
    "Santa Tecla",
    "Talnique",
    "Tamanique",
    "Teotepeque",
    "Tepecoyo",
    "Zaragoza",
  ],
  "La Paz": [
    "Cuyultitán",
    "El Rosario (La Paz)",
    "Jerusalén",
    "Mercedes La Ceiba",
    "Olocuilta",
    "Paraíso de Osorio",
    "San Antonio Masahuat",
    "San Emigdio",
    "San Francisco Chinameca",
    "San Juan Nonualco",
    "San Juan Talpa",
    "San Juan Tepezontes",
    "San Luis La Herradura",
    "San Luis Talpa",
    "San Miguel Tepezontes",
    "San Pedro Masahuat",
    "San Pedro Nonualco",
    "San Rafael Obrajuelo",
    "Santa María Ostuma",
    "Santiago Nonualco",
    "Tapalhuaca",
    "Zacatecoluca",
  ],
  "La Unión": [
    "Anamorós",
    "Bolívar",
    "Concepción de Oriente",
    "Conchagua",
    "El Carmen",
    "El Sauce",
    "Intipucá",
    "La Unión",
    "Lislique",
    "Meanguera del Golfo",
    "Nueva Esparta",
    "Pasaquina",
    "Polorós",
    "San Alejo",
    "San José",
    "Santa Rosa de Lima",
    "Yayantique",
    "Yucuaiquín",
  ],
  "Morazán": [
    "Arambala",
    "Cacaopera",
    "Chilanga",
    "Corinto",
    "Delicias de Concepción",
    "El Divisadero",
    "El Rosario (Morazán)",
    "Gualococti",
    "Guatajiagua",
    "Joateca",
    "Jocoaitique",
    "Jocoro",
    "Lolotiquillo",
    "Meanguera",
    "Osicala",
    "Perquín",
    "San Carlos",
    "San Fernando",
    "San Francisco Gotera",
    "San Isidro",
    "San Simón",
    "Sensembra",
    "Sociedad",
    "Torola",
    "Yamabal",
    "Yoloaiquín",
  ],
  "San Miguel": [
    "Carolina",
    "Chapeltique",
    "Chinameca",
    "Chirilagua",
    "Ciudad Barrios",
    "Comacarán",
    "El Tránsito",
    "Lolotique",
    "Moncagua",
    "Nueva Guadalupe",
    "Nuevo Edén de San Juan",
    "Quelepa",
    "San Antonio del Mosco",
    "San Gerardo",
    "San Jorge",
    "San Luis de la Reina",
    "San Miguel",
    "San Rafael Oriente",
    "Sesori",
    "Uluazapa",
  ],
  "San Salvador": [
    "Aguilares",
    "Apopa",
    "Ayutuxtepeque",
    "Ciudad Delgado",
    "Cuscatancingo",
    "El Paisnal",
    "Guazapa",
    "Ilopango",
    "Mejicanos",
    "Nejapa",
    "Panchimalco",
    "Rosario de Mora",
    "San Marcos",
    "San Martín",
    "San Salvador",
    "Santiago Texacuangos",
    "Santo Tomás",
    "Soyapango",
    "Tonacatepeque",
  ],
  "San Vicente": [
    "Apastepeque",
    "Guadalupe",
    "San Cayetano Istepeque",
    "San Esteban Catarina",
    "San Ildefonso",
    "San Lorenzo",
    "San Sebastián",
    "San Vicente",
    "Santa Clara",
    "Santo Domingo",
    "Tecoluca",
    "Tepetitán",
    "Verapaz",
  ],
  "Santa Ana": [
    "Candelaria de la Frontera",
    "Chalchuapa",
    "Coatepeque",
    "El Congo",
    "El Porvenir",
    "Masahuat",
    "Metapán",
    "San Antonio Pajonal",
    "San Sebastián Salitrillo",
    "Santa Ana",
    "Santa Rosa Guachipilín",
    "Santiago de la Frontera",
    "Texistepeque",
  ],
  "Sonsonate": [
    "Acajutla",
    "Armenia",
    "Caluco",
    "Cuisnahuat",
    "Izalco",
    "Juayúa",
    "Nahuizalco",
    "Nahulingo",
    "Salcoatitán",
    "San Antonio del Monte",
    "San Julián",
    "Santa Catarina Masahuat",
    "Santa Isabel Ishuatán",
    "Santo Domingo de Guzmán",
    "Sonsonate",
    "Sonzacate",
  ],
  "Usulután": [
    "Alegría",
    "Berlín",
    "California",
    "Concepción Batres",
    "El Triunfo",
    "Ereguayquín",
    "Estanzuelas",
    "Jiquilisco",
    "Jucuapa",
    "Jucuarán",
    "Mercedes Umaña",
    "Nueva Granada",
    "Ozatlán",
    "Puerto El Triunfo",
    "San Agustín",
    "San Buenaventura",
    "San Dionisio",
    "San Francisco Javier",
    "Santa Elena",
    "Santa María",
    "Santiago de María",
    "Tecapán",
    "Usulután",
  ],
};

function populateDepartments() {
  Object.keys(departments).forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    departmentSelect.appendChild(option);
  });
}

function populateMunicipalities(department) {
  municipalitySelect.innerHTML =
    '<option value="" selected disabled>Selecciona un municipio</option>';
  if (!department) {
    municipalitySelect.disabled = true;
    return;
  }
  const list = departments[department] || [];
  list.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    municipalitySelect.appendChild(option);
  });
  municipalitySelect.disabled = list.length === 0;
}

async function init() {
  await loadPrices();
  renderGrid();
  renderCart();
  populateDepartments();
}

init();

departmentSelect.addEventListener("change", (event) => {
  populateMunicipalities(event.target.value);
});
