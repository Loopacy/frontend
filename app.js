// Global States
let cart = [];
let wishlist = [];

// Initialize wishlist on page load
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the wishlist from localStorage (if exists)
    wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Update the UI to reflect the initial state of the wishlist
    updateWishlistUI();
    renderProducts(); // Ensure products are rendered on page load
});

// Toggle Wishlist function to add/remove items
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    const wishlistButton = document.querySelector(`button[data-id='${productId}']`);
    const icon = wishlistButton.querySelector("i");

    // Check if the product is already in the wishlist
    const isProductInWishlist = wishlist.some(item => item.id === productId);

    if (isProductInWishlist) {
        // Remove product from wishlist
        wishlist = wishlist.filter(item => item.id !== productId);
        // Change heart icon to empty (far)
        icon.classList.remove("fas");
        icon.classList.add("far");
        showFlashMessage("Product removed from your wishlist!", "success");
    } else {
        // Add product to wishlist
        wishlist.push(product);
        // Change heart icon to filled (fas)
        icon.classList.remove("far");
        icon.classList.add("fas");
        showFlashMessage("Product added to your wishlist!", "success");
    }

    // Save the updated wishlist to localStorage
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // Update the UI after toggling
    updateWishlistUI();
}

// Function to update the heart icons based on wishlist state
function updateWishlistUI() {
    const buttons = document.querySelectorAll(".wishlist-button");
    buttons.forEach(button => {
        const productId = parseInt(button.getAttribute("data-id"));
        const icon = button.querySelector("i");

        // Set the correct class for heart based on wishlist state
        if (wishlist.some(item => item.id === productId)) {
            icon.classList.remove("far");
            icon.classList.add("fas");
        } else {
            icon.classList.remove("fas");
            icon.classList.add("far");
        }
    });
}

// Update Wishlist Page
function updateWishlistPage() {
    const wishlistContainer = document.getElementById("wishlist-items");
    if (!wishlistContainer) return;

    wishlistContainer.innerHTML = wishlist.length
        ? wishlist.map(item => `
            <div class="wishlist-item">
                <img src="${item.image}" alt="${item.name}">
                <p>${item.name} - ${item.price}</p>
                <button onclick="removeFromWishlist(${item.id})">Remove</button>
            </div>
        `).join("")
        : "<p>Your wishlist is empty!</p>";
}

// Remove from Wishlist (used on the wishlist page)
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    saveToLocalStorage("wishlist", wishlist);
    showFlashMessage("Product removed from your wishlist!", "success");
    updateWishlistPage();
    updateWishlistUI(); // Reflect changes on the main product page
}


// Sample products (available globally)
const products = [
    { id: 1, name: "Product 1", price: "$10", image: "https://via.placeholder.com/200" },
    { id: 2, name: "Product 2", price: "$20", image: "https://via.placeholder.com/200" },
    { id: 3, name: "Product 3", price: "$30", image: "https://via.placeholder.com/200" },
    { id: 4, name: "Product 4", price: "$40", image: "https://via.placeholder.com/200" },
];

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    loadCart();
    loadWishlist();
    updateCartPage();
    updateWishlistPage();
    setupSearch();
    setupNavToggle();
    setupProductDetailsPage();
    setupAuthHandlers();
    setupReviewSystem();
});

// Render Products with Wishlist Button
function renderProducts(productsToRender = products) {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    productList.innerHTML = productsToRender.map(product => {
        const isInWishlist = wishlist.includes(product.id); // Check if the product is in the wishlist
        const heartClass = isInWishlist ? "fas fa-heart" : "far fa-heart"; // Set heart class based on wishlist state
        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
                <button 
                    onclick="goToProductDetails(${product.id})" 
                    class="details-button"
                >
                    View Details
                </button>
                <button 
                    class="wishlist-button" 
                    data-id="${product.id}"
                    onclick="toggleWishlist(${product.id})"
                >
                    <i class="${heartClass}"></i>
                </button>
            </div>
        `;
    }).join("");
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product && !cart.some(item => item.id === productId)) {
        cart.push(product);
        saveToLocalStorage("cart", cart);
        showFlashMessage(`${product.name} added to your cart!`, "success");
        updateCartPage();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveToLocalStorage("cart", cart);
    showFlashMessage("Product removed from your cart!", "success");
    updateCartPage();
}


// Update Cart Page
function updateCartPage() {
    const cartItemsContainer = document.getElementById("cart-items");
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = cart.length
        ? cart.map(item => `
            <div class="cart-item">
                <p>${item.name} - ${item.price}</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join("")
        : "<p>Your cart is empty!</p>";
}


// Search Products
function setupSearch() {
    const searchBar = document.getElementById("search-bar");
    if (!searchBar) return;

    searchBar.addEventListener("input", (e) => {
        const searchQuery = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery)
        );
        renderProducts(filteredProducts);
    });
}

// Mobile Navigation Toggle
function setupNavToggle() {
    const navToggle = document.getElementById("nav-toggle");
    if (navToggle) {
        navToggle.addEventListener("click", () => {
            document.querySelector(".nav-links").classList.toggle("show");
        });
    }
}

// Flash Messages
function showFlashMessage(message, type) {
    const flashMessage = document.getElementById("flash-message");
    if (!flashMessage) return;

    flashMessage.textContent = message;
    flashMessage.className = type;
    flashMessage.style.display = "block";

    setTimeout(() => {
        flashMessage.style.display = "none";
    }, 3000);
}

// Local Storage Helpers
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function loadCart() {
    cart = loadFromLocalStorage("cart") || [];
}

function loadWishlist() {
    wishlist = loadFromLocalStorage("wishlist") || [];
}

function fetchProducts() {
    fetch('https://loopacy-be.onrender.com/products')  // Correct URL to backend API
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data) && data.length > 0) {
                products = data;  // Store fetched products in global state
                renderProducts();  // Re-render products after fetching
            } else {
                document.getElementById('product-list').innerHTML = "<p>No products available at the moment.</p>";
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            showFlashMessage('Failed to load products. Please try again later.', 'error');
        });
}


// Render Products with Wishlist Button
function renderProducts() {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    productList.innerHTML = products.map(product => {
        const isInWishlist = wishlist.some(item => item.id === product.id); // Check if product is in wishlist
        const heartClass = isInWishlist ? "fas fa-heart" : "far fa-heart"; // Set heart class based on wishlist state
        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
                <button 
                    onclick="goToProductDetails(${product.id})" 
                    class="details-button"
                >
                    View Details
                </button>
                <button 
                    class="wishlist-button" 
                    data-id="${product.id}"
                    onclick="toggleWishlist(${product.id})"
                >
                    <i class="${heartClass}"></i>
                </button>
            </div>
        `;
    }).join("");
}
// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the wishlist from localStorage (if exists)
    wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Load cart and wishlist data from localStorage
    loadCart();
    loadWishlist();

    // Fetch products from the backend
    fetchProducts();  // Fetch products here

    // Update the UI to reflect the initial state of the wishlist
    updateWishlistUI();
    renderProducts();  // Ensure products are rendered on page load
});
