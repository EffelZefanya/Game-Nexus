let cart = [];

function loadCart() {
  try {
    const savedCart = localStorage.getItem("gameNexusCart");
    cart = savedCart ? JSON.parse(savedCart) : [];
  } catch (err) {
    console.error("Failed to parse saved cart:", err);
    cart = [];
  }
  updateCartUI();
}

function makeEmptyCartMessage() {
  const wrapper = document.createElement("div");
  wrapper.className = "text-center py-8";
  wrapper.innerHTML = `
    <i class="fas fa-shopping-cart text-4xl text-[var(--primary-light)] mb-4"></i>
    <p class="text-lg">Your cart is empty</p>
    <p class="text-sm text-gray-400 mt-2">Add some games to get started!</p>
  `;
  return wrapper;
}

function updateCartUI() {
  const totalItems = cart.reduce((t, i) => t + Number(i.quantity), 0);
  const cartCountEl = document.getElementById("cart-count");
  const mobileCountEl = document.getElementById("mobile-cart-count");
  if (cartCountEl) cartCountEl.textContent = totalItems;
  if (mobileCountEl) mobileCountEl.textContent = totalItems;

  const cartItemsContainer = document.getElementById("cart-items");
  const cartSummary = document.getElementById("cart-summary");

  if (!cartItemsContainer) {
    console.warn("No #cart-items container found");
    return;
  }

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    const empty = makeEmptyCartMessage();
    cartItemsContainer.appendChild(empty);

    if (cartSummary) cartSummary.classList.add("hidden");
    return;
  }

  if (cartSummary) cartSummary.classList.remove("hidden");

  const frag = document.createDocumentFragment();
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className =
      "flex items-center space-x-4 mb-4 pb-4 border-b border-[var(--primary-light)]";
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${escapeHtml(item.title)}" class="w-16 h-16 object-cover rounded">
      <div class="flex-1">
        <h3 class="font-semibold">${escapeHtml(item.title)}</h3>
        <p class="text-sm text-gray-400">Rp${price.toLocaleString()}</p>
        <div class="flex items-center space-x-2 mt-2">
          <button class="quantity-btn decrease w-6 h-6 rounded-full bg-[var(--primary-light)] hover:bg-[var(--accent-base)]" data-title="${escapeAttr(item.title)}">-</button>
          <span class="quantity">${quantity}</span>
          <button class="quantity-btn increase w-6 h-6 rounded-full bg-[var(--primary-light)] hover:bg-[var(--accent-base)]" data-title="${escapeAttr(item.title)}">+</button>
        </div>
      </div>
      <button class="remove-btn text-red-400 hover:text-red-300" data-title="${escapeAttr(item.title)}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    frag.appendChild(cartItem);
  });
  cartItemsContainer.appendChild(frag);

  const subtotal = cart.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const subEl = document.getElementById("cart-subtotal");
  const taxEl = document.getElementById("cart-tax");
  const totalEl = document.getElementById("cart-total");
  if (subEl) subEl.textContent = `Rp${subtotal.toLocaleString()}`;
  if (taxEl) taxEl.textContent = `Rp${tax.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `Rp${total.toLocaleString()}`;

  console.log("updateCartUI: items:", cart.length, "totalItems:", totalItems, "subtotal:", subtotal);
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function escapeAttr(str = "") {
  return String(str).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function saveCart() {
  localStorage.setItem("gameNexusCart", JSON.stringify(cart));
}

function addToCart(game) {
  const existingItem = cart.find((item) => item.title === game.title);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...game, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  showAddToCartNotification(game.title);
}

function removeFromCart(gameTitle) {
  cart = cart.filter((item) => item.title !== gameTitle);
  saveCart();
  updateCartUI();
}

function updateQuantity(gameTitle, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(gameTitle);
    return;
  }

  const item = cart.find((item) => item.title === gameTitle);
  if (item) {
    item.quantity = newQuantity;
    saveCart();
    updateCartUI();
  }
}

function showAddToCartNotification(gameTitle) {
  const notification = document.createElement("div");
  notification.className =
    "fixed top-4 right-4 bg-[var(--primary-base)] border-l-4 border-[var(--accent-base)] p-4 rounded shadow-lg z-50 transform translate-x-full transition-transform duration-300";
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <i class="fas fa-check-circle text-[var(--accent-base)]"></i>
      <div>
        <p class="font-semibold">Added to cart</p>
        <p class="text-sm text-gray-400">${gameTitle}</p>
      </div>
    </div>
  `;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.remove("translate-x-full"), 10);
  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

function toggleCart() {
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");

  cartSidebar.classList.toggle("translate-x-full");
  cartOverlay.classList.toggle("hidden");

  document.body.style.overflow = cartSidebar.classList.contains("translate-x-full")
    ? "auto"
    : "hidden";
}

function createGameCards() {
  const container = document.getElementById("games-container");

  featuredGames.forEach((game) => {
    const card = document.createElement("div");
    card.className =
      "game-card bg-[var(--primary-base)] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1";
    card.innerHTML = `
      <div class="h-48 overflow-hidden">
        <img 
          src="${game.image}" 
          alt="${game.title}" 
          class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div class="p-6 flex flex-col h-[calc(100%-12rem)]">
        <h3 class="text-xl font-bold mb-2">${game.title}</h3>
        <div class="flex flex-wrap gap-2 mb-4">
          ${game.genre
            .split(", ")
            .map(
              (genre) =>
                `<span class="px-2 py-1 bg-[var(--primary-light)] text-xs rounded-full">${genre}</span>`
            )
            .join("")}
        </div>
        <div class="mb-4 flex-1">
          <p class="text-sm mb-1"><span class="font-semibold">Developer:</span> ${game.developer}</p>
          <p class="text-sm mb-1"><span class="font-semibold">Release Date:</span> ${game.releaseDate}</p>
          <p class="text-sm font-semibold mb-1">Description:</p>
          <div class="h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--primary-light)] scrollbar-track-transparent pr-2">
            <p class="text-sm">${game.description}</p>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4">
          <span class="text-lg font-bold text-[var(--accent-base)]">Rp${game.price}</span>
          <button class="add-to-cart-btn px-4 py-2 rounded-full bg-[var(--accent-base)] hover:bg-[var(--accent-light)] transition-colors" data-title="${game.title}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => menu.classList.toggle("hidden"));
  }

  const cartToggle = document.getElementById("cart-toggle");
  const mobileCartToggle = document.getElementById("mobile-cart-toggle");
  const closeCart = document.getElementById("close-cart");
  const cartOverlay = document.getElementById("cart-overlay");
  const checkoutBtn = document.getElementById("checkout-btn");

  cartToggle.addEventListener("click", toggleCart);
  mobileCartToggle.addEventListener("click", () => {
    toggleCart();
    menu.classList.add("hidden");
  });
  closeCart.addEventListener("click", toggleCart);
  cartOverlay.addEventListener("click", toggleCart);

  checkoutBtn.addEventListener("click", () => {
    if (cart.length > 0) {
      checkout()
    }
  });

  document
    .getElementById("games-container")
    .addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-cart-btn");
      if (!btn) return;
      const title = btn.getAttribute("data-title");
      const game = featuredGames.find((g) => g.title === title);
      if (game) addToCart(game);
    });

  document
    .getElementById("cart-items")
    .addEventListener("click", (e) => {
      const decreaseBtn = e.target.closest(".quantity-btn.decrease");
      const increaseBtn = e.target.closest(".quantity-btn.increase");
      const removeBtn = e.target.closest(".remove-btn");

      if (decreaseBtn) {
        const title = decreaseBtn.getAttribute("data-title");
        const item = cart.find((i) => i.title === title);
        if (item) updateQuantity(title, item.quantity - 1);
      }

      if (increaseBtn) {
        const title = increaseBtn.getAttribute("data-title");
        const item = cart.find((i) => i.title === title);
        if (item) updateQuantity(title, item.quantity + 1);
      }

      if (removeBtn) {
        const title = removeBtn.getAttribute("data-title");
        removeFromCart(title);
      }
    });

  createGameCards();
  loadCart();
});

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const summary = cart.map(i => `${i.title} x${i.quantity}`).join("\n");
  const confirmCheckout = confirm(
    `You're about to purchase:\n\n${summary}\n\nContinue to checkout?`
  );

  if (!confirmCheckout) return;

  alert("Thank you for your purchase!");

  cart = [];
  localStorage.removeItem("gameNexusCart");
  updateCartUI();
}
