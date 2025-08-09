// Sample Products
const products = [
  { id: 1, name: "Wireless Headphones", category: "electronics", price: 40, rating: 4.5, reviews: ["Great sound quality!", "Very comfortable."], img: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=1740&auto=format&fit=crop", deal: true },
  { id: 2, name: "Smartphone", category: "electronics", price: 299, rating: 4.0, reviews: ["Battery lasts long.", "Excellent camera."], img: "https://plus.unsplash.com/premium_photo-1680985551009-05107cd2752c?q=80&w=1632&auto=format&fit=crop", deal: false },
  { id: 3, name: "Cotton T-shirt", category: "clothing", price: 20, rating: 3.5, reviews: ["Good quality cotton.", "Fits well."], img: "https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?q=80&w=1744&auto=format&fit=crop", deal: true },
  { id: 4, name: "Winter Jacket", category: "clothing", price: 80, rating: 4.2, reviews: ["Very warm.", "Stylish and comfy."], img: "https://images.unsplash.com/photo-1706765779494-2705542ebe74?q=80&w=1651&auto=format&fit=crop", deal: false },
  { id: 5, name: "Wooden Chair", category: "furniture", price: 120, rating: 4.8, reviews: ["Sturdy and beautiful.", "Worth the price."], img: "https://images.unsplash.com/photo-1487015307662-6ce6210680f1?q=80&w=985&auto=format&fit=crop", deal: true },
  { id: 6, name: "Sunglasses", category: "accessories", price: 35, rating: 3.9, reviews: ["Looks great!", "Comfortable for long wear."], img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1480&auto=format&fit=crop", deal: false },
];


let cart = [];

// LOGIN FUNCTION
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if (user && pass) {
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("storePage").classList.remove("hidden");
        renderProducts(products);
        renderDeals();
        startDealTimer();
    } else {
        alert("Please enter username & password");
    }
}

// RENDER PRODUCTS
function renderProducts(list) {
  const container = document.getElementById("productGrid");
  container.innerHTML = "";
  list.forEach(p => {
      container.innerHTML += `
          <div onclick="showReviews(${p.id})" class="cursor-pointer bg-white p-4 rounded-xl shadow-md transform transition hover:scale-105 hover:shadow-2xl">
              <img src="${p.img}" class="w-full h-48 object-cover mb-4 rounded-lg shadow-md" />
              <h3 class="font-bold">${p.name}</h3>
              <p>$${p.price}</p>
              <div class="flex items-center mt-1">${getStars(p.rating)} <span class="ml-2 text-sm text-gray-600">(${p.rating.toFixed(1)})</span></div>
              <button onclick="event.stopPropagation(); addToCart(${p.id})" class="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">Add to Cart</button>
          </div>
      `;
  });
}


// RENDER DEALS
function renderDeals() {
  const container = document.getElementById("dealsContainer");
  container.innerHTML = "";
  
  products.filter(p => p.deal).forEach(p => {
    container.innerHTML += `
      <div class="bg-white/30 backdrop-blur-lg rounded-xl shadow-lg p-4 flex flex-col items-center transform transition hover:scale-105 hover:shadow-2xl">
        <div class="w-full aspect-square overflow-hidden rounded-lg mb-4 shadow-lg">
          <img src="${p.img}" class="w-full h-full object-cover" />
        </div>
        <h3 class="text-lg font-semibold mb-2 text-white text-center">${p.name}</h3>
        <p class="text-pink-200 font-bold mb-2">$${p.price}</p>
        <button onclick="addToCart(${p.id})" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition">Add to Cart</button>
      </div>
    `;
  });
}


// ADD TO CART
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    saveCart();
}

// UPDATE CART UI
function updateCartUI() {
  document.getElementById("cartCount").innerText = cart.reduce((sum, i) => sum + i.qty, 0);
  const itemsContainer = document.getElementById("cartItems");
  itemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
          <p class="mb-4 text-lg">Your cart is empty!</p>
          <button onclick="toggleCart(); scrollToProducts()" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
            Add Items to Cart
          </button>
        </div>
      `;
      document.getElementById("cartTotal").innerText = "0.00";
      // Optionally hide checkout button if empty
      document.getElementById("cartFooter").style.display = "none";
      return;
  }

  cart.forEach(item => {
      total += item.price * item.qty;
      itemsContainer.innerHTML += `
          <div class="flex justify-between items-center mb-2">
              <div>
                  <p>${item.name}</p>
                  <small>$${item.price} x ${item.qty}</small>
              </div>
              <div class="flex gap-2 items-center">
                  <button onclick="changeQty(${item.id}, -1)" class="px-2 bg-gray-200 rounded">-</button>
                  <button onclick="changeQty(${item.id}, 1)" class="px-2 bg-gray-200 rounded">+</button><button onclick="deleteItem(${item.id})" title="Remove item" class="ml-3 text-red-600 hover:text-red-800 text-xl">
                  <i class="fas fa-times"></i>
              </button>
              <button onclick="deleteItem(${item.id})" title="Remove item" class="ml-3 text-red-600 hover:text-red-800 font-bold text-xl">❌</button>

              </div>
          </div>
      `;
  });

  document.getElementById("cartTotal").innerText = total.toFixed(2);
  document.getElementById("cartFooter").style.display = "block";
}

function deleteItem(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
  saveCart();
}
function scrollToProducts() {
  document.getElementById("storePage").scrollIntoView({ behavior: "smooth" });
  toggleCart(); // optionally close the cart panel after clicking
}


// CHANGE QUANTITY
function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
    saveCart();
}

// SAVE CART TO localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// LOAD CART FROM localStorage
function loadCart() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartUI();
    }
}

// CART SLIDE PANEL
function toggleCart() {
    const panel = document.getElementById("cartPanel");
    panel.classList.toggle("translate-x-full");
}

// DEAL COUNTDOWN
function startDealTimer() {
    let endTime = Date.now() + 4 * 60 * 60 * 1000;
    setInterval(() => {
        let diff = endTime - Date.now();
        if (diff <= 0) return;
        let h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
        let m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
        let s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
        document.getElementById("dealTimer").innerText = `${h}:${m}:${s}`;
    }, 1000);
}

// FILTERS
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("priceFilter").addEventListener("change", applyFilters);
document.getElementById("searchInput").addEventListener("input", applyFilters);

function applyFilters() {
    let category = document.getElementById("categoryFilter").value;
    let price = document.getElementById("priceFilter").value;
    let search = document.getElementById("searchInput").value.toLowerCase();

    let filtered = products.filter(p =>
        (category === "all" || p.category === category) &&
        (price === "all" || (price === "low" ? p.price < 50 : p.price >= 50)) &&
        p.name.toLowerCase().includes(search)
    );

    renderProducts(filtered);
}
function placeOrder() {
  const name = document.getElementById("checkoutName").value.trim();
  const address = document.getElementById("checkoutAddress").value.trim();
  const payment = document.getElementById("checkoutPayment").value;

  if (!name || !address || !payment) {
    alert("Please fill all fields!");
    return;
  }

  // Get selected products for purchase
  const selectedIds = Array.from(document.querySelectorAll(".purchaseCheck:checked"))
    .map(cb => parseInt(cb.dataset.id));

  if (selectedIds.length === 0) {
    alert("Please select at least one item to purchase!");
    return;
  }

  alert(`✅ Thank you, ${name}! Your order for ${selectedIds.length} item(s) has been placed.`);

  // Remove only purchased items from cart
  cart = cart.filter(item => !selectedIds.includes(item.id));

  // Save updated cart
  saveCart();
  updateCartUI();

  // Reset checkout form view
  document.getElementById("cartItems").classList.remove("hidden");
  document.getElementById("cartFooter").classList.remove("hidden");
  document.getElementById("checkoutForm").classList.add("hidden");
  
  // Clear form
  document.getElementById("checkoutName").value = "";
  document.getElementById("checkoutAddress").value = "";
  document.getElementById("checkoutPayment").value = "";

  toggleCart();
}
//show reviews 
function showReviews(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById("reviewProductName").innerText = product.name;
  const reviewList = document.getElementById("reviewList");
  reviewList.innerHTML = "";

  if (product.reviews.length === 0) {
      reviewList.innerHTML = "<p>No reviews yet.</p>";
  } else {
      product.reviews.forEach(r => {
          reviewList.innerHTML += `<p class="border-b border-gray-200 pb-2">${r}</p>`;
      });
  }

  document.getElementById("reviewsModal").classList.remove("hidden");
}

function closeReviews() {
  document.getElementById("reviewsModal").classList.add("hidden");
}

//getstars
function getStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
          stars += `<span class="text-yellow-400 text-lg">★</span>`;
      } else if (i - rating < 1) {
          stars += `<span class="text-yellow-400 text-lg">☆</span>`; // half star can be improved later
      } else {
          stars += `<span class="text-gray-300 text-lg">☆</span>`;
      }
  }
  return stars;
}

// LOAD CART WHEN PAGE LOADS
window.addEventListener("load", () => {
    loadCart();
});
