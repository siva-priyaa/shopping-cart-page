/* ==================================================
   PRODUCTS
================================================== */

const products = [

    {
        id: 1,
        name: "Smart Watch",
        description: "Modern fitness smart watch",
        price: 1499,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },

    {
        id: 2,
        name: "Wireless Headphones",
        description: "Premium wireless headphones",
        price: 999,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    },

    {
        id: 3,
        name: "Sneakers",
        description: "Comfortable casual sneakers",
        price: 1999,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },

    {
        id: 4,
        name: "Backpack",
        description: "Stylish everyday backpack",
        price: 799,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
    },

    {
        id: 5,
        name: "Smartphone",
        description: "Latest generation smartphone",
        price: 15999,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
    },

    {
        id: 6,
        name: "T-Shirt",
        description: "Comfortable cotton t-shirt",
        price: 599,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
    },

    {
        id: 7,
        name: "Sunglasses",
        description: "Stylish UV protection sunglasses",
        price: 699,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
    },

    {
        id: 8,
        name: "Bluetooth Speaker",
        description: "Portable wireless speaker",
        price: 1299,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"
    }

];


/* ==================================================
   LOAD LOCAL STORAGE
================================================== */

let cart =
    JSON.parse(
        localStorage.getItem("shoppingCart")
    ) || [];


let wishlist =
    JSON.parse(
        localStorage.getItem("shoppingWishlist")
    ) || [];


let orders =
    JSON.parse(
        localStorage.getItem("shoppingOrders")
    ) || [];


let appliedCoupon =
    localStorage.getItem("appliedCoupon") || null;


/* ==================================================
   SAVE CART
================================================== */

function saveCart() {

    localStorage.setItem(
        "shoppingCart",
        JSON.stringify(cart)
    );

}


/* ==================================================
   SAVE WISHLIST
================================================== */

function saveWishlist() {

    localStorage.setItem(
        "shoppingWishlist",
        JSON.stringify(wishlist)
    );

}


/* ==================================================
   SAVE ORDERS
================================================== */

function saveOrders() {

    localStorage.setItem(
        "shoppingOrders",
        JSON.stringify(orders)
    );

}
/* ==================================================
   DISPLAY PRODUCTS
================================================== */

function displayProducts(productArray = products) {

    const productList =
        document.getElementById("product-list");


    if (!productList) {
        return;
    }


    productList.innerHTML = "";


    if (productArray.length === 0) {

        productList.innerHTML =
            "<p>No products found.</p>";

        return;
    }


    productArray.forEach(product => {

        const card =
            document.createElement("div");


        card.className =
            "product-card";


        const isWishlisted =
            wishlist.includes(product.id);


        card.innerHTML = `

            <button
                class="wishlist-btn"
                onclick="toggleWishlist(${product.id})"
            >
                ${isWishlisted ? "❤️" : "🤍"}
            </button>


           <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
            >


            <h3>
                ${product.name}
            </h3>


            <p>
                ${product.description}
            </p>


            <div class="product-price">
                ₹${product.price}
            </div>


            <button
                class="add-btn"
                onclick="addToCart(${product.id})"
            >
                Add to Cart
            </button>

        `;


        productList.appendChild(card);

    });

}
/* ==================================================
   SEARCH + FILTER
================================================== */

function filterProducts() {

    const searchElement =
        document.getElementById("search-input");


    const categoryElement =
        document.getElementById("category-filter");


    if (!searchElement || !categoryElement) {
        return;
    }


    const searchText =
        searchElement.value.toLowerCase();


    const selectedCategory =
        categoryElement.value;


    const filteredProducts =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    displayProducts(filteredProducts);

}


/* ==================================================
   ADD TO CART
================================================== */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );


    if (!product) {
        return;
    }


    const existingItem =
        cart.find(
            item => item.id === productId
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }

    saveCart();

    window.saveCartToSupabase = saveCartToSupabase;
    saveCartToSupabase();

    updateCart();

    updateCounts();


    showNotification(
        product.name +
        " added to cart 🛒"
    );

}
/* ==================================================
   UPDATE CART
================================================== */

function updateCart() {

    const cartItems =
        document.getElementById("cart-items");


    if (!cartItems) {
        return;
    }


    const subtotalElement =
        document.getElementById("subtotal");


    const discountElement =
        document.getElementById("discount");


    const totalElement =
        document.getElementById("total");


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        if (subtotalElement) {
            subtotalElement.textContent =
                "0.00";
        }

        if (discountElement) {
            discountElement.textContent =
                "0.00";
        }

        if (totalElement) {
            totalElement.textContent =
                "0.00";
        }

        return;
    }


    let subtotal = 0;


    cart.forEach(item => {

        subtotal +=
            item.price *
            item.quantity;


        const cartItem =
            document.createElement("div");


        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₹${item.price}
                    ×
                    ${item.quantity}
                </p>

            </div>


            <div class="quantity-controls">

                <button
                    onclick="decreaseQuantity(${item.id})"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="increaseQuantity(${item.id})"
                >
                    +
                </button>

            </div>


            <strong>
                ₹${(
                    item.price *
                    item.quantity
                ).toFixed(2)}
            </strong>


            <button
                class="remove-btn"
                onclick="removeFromCart(${item.id})"
            >
                Remove
            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    let discount = 0;


    if (appliedCoupon === "SAVE10") {

        discount =
            subtotal * 0.10;

    }


    if (appliedCoupon === "SAVE20") {

        discount =
            subtotal * 0.20;

    }


    const total =
        subtotal - discount;


    if (subtotalElement) {

        subtotalElement.textContent =
            subtotal.toFixed(2);

    }


    if (discountElement) {

        discountElement.textContent =
            discount.toFixed(2);

    }


    if (totalElement) {

        totalElement.textContent =
            total.toFixed(2);

    }

}
/* ==================================================
   INCREASE
================================================== */

function increaseQuantity(productId) {

    const item =
        cart.find(
            item => item.id === productId
        );


    if (item) {

        item.quantity++;

        saveCart();

        updateCart();

        updateCounts();

    }

}


/* ==================================================
   DECREASE
================================================== */

function decreaseQuantity(productId) {

    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) {
        return;
    }


    item.quantity--;


    if (item.quantity <= 0) {

        removeFromCart(productId);

    } else {

        saveCart();

        updateCart();

        updateCounts();

    }

}


/* ==================================================
   REMOVE
================================================== */

function removeFromCart(productId) {

    const product =
        cart.find(
            item => item.id === productId
        );


    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart();

    updateCart();

    updateCounts();


    if (product) {

        showNotification(
            product.name +
            " removed from cart"
        );

    }

}


/* ==================================================
   CLEAR CART
================================================== */

function clearCart() {

    if (cart.length === 0) {

        showNotification(
            "Cart is already empty"
        );

        return;
    }


    cart = [];

    appliedCoupon = null;


    saveCart();


    localStorage.removeItem(
        "appliedCoupon"
    );


    updateCart();

    updateCounts();


    const couponInput =
        document.getElementById(
            "coupon-input"
        );


    const couponMessage =
        document.getElementById(
            "coupon-message"
        );


    if (couponInput) {

        couponInput.value = "";

    }


    if (couponMessage) {

        couponMessage.textContent = "";

    }


    showNotification(
        "Cart cleared successfully"
    );

}


/* ==================================================
   COUPON
================================================== */

function applyCoupon() {

    const input =
        document.getElementById(
            "coupon-input"
        );


    const message =
        document.getElementById(
            "coupon-message"
        );


    if (!input || !message) {
        return;
    }


    const code =
        input.value
            .trim()
            .toUpperCase();


    if (cart.length === 0) {

        message.textContent =
            "❌ Add products to cart first.";

        return;
    }


    if (code === "SAVE10") {

        appliedCoupon = "SAVE10";


        localStorage.setItem(
            "appliedCoupon",
            appliedCoupon
        );


        message.textContent =
            "🎉 10% discount applied!";


        updateCart();

    }

    else if (code === "SAVE20") {

        appliedCoupon = "SAVE20";


        localStorage.setItem(
            "appliedCoupon",
            appliedCoupon
        );


        message.textContent =
            "🎉 20% discount applied!";


        updateCart();

    }

    else {

        message.textContent =
            "❌ Invalid coupon code.";

    }

}


/* ==================================================
   WISHLIST
================================================== */

function toggleWishlist(productId) {

    const index =
        wishlist.indexOf(productId);


    const product =
        products.find(
            item => item.id === productId
        );


    if (index === -1) {

        wishlist.push(productId);


        showNotification(
            product.name +
            " added to wishlist ❤️"
        );

    } else {

        wishlist.splice(index, 1);


        showNotification(
            product.name +
            " removed from wishlist"
        );

    }


    saveWishlist();

    displayProducts();

    displayWishlist();

    updateCounts();

}


/* ==================================================
   DISPLAY WISHLIST
================================================== */

function displayWishlist() {

    const wishlistItems =
        document.getElementById(
            "wishlist-items"
        );


    if (!wishlistItems) {
        return;
    }


    wishlistItems.innerHTML = "";


    if (wishlist.length === 0) {

        wishlistItems.innerHTML =
            "<p>Your wishlist is empty. ❤️</p>";

        return;
    }


    wishlist.forEach(productId => {

        const product =
            products.find(
                item => item.id === productId
            );


        if (!product) {
            return;
        }


        const card =
            document.createElement("div");


        card.className =
            "wishlist-card";


        card.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >


            <h3>
                ${product.name}
            </h3>


            <p>
                ₹${product.price}
            </p>


            <button
                onclick="addToCart(${product.id})"
            >
                🛒 Add to Cart
            </button>


            <button
                onclick="toggleWishlist(${product.id})"
            >
                Remove ❤️
            </button>

        `;


        wishlistItems.appendChild(card);

    });

}
/* ==================================================
   CHECKOUT
================================================== */

function checkout() {

    if (cart.length === 0) {

        showNotification(
            "Your cart is empty 🛒"
        );

        return;
    }


    let subtotal = 0;


    cart.forEach(item => {

        subtotal +=
            item.price *
            item.quantity;

    });


    let discount = 0;


    if (appliedCoupon === "SAVE10") {

        discount =
            subtotal * 0.10;

    }


    if (appliedCoupon === "SAVE20") {

        discount =
            subtotal * 0.20;

    }


    const total =
        subtotal - discount;


    const currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );


    const order = {

        id:
            "ORD" +
            Date.now(),

        date:
            new Date().toLocaleString(),

        items:
            [...cart],

        subtotal:
            subtotal,

        discount:
            discount,

        total:
            total,

        customer:
            currentUser
                ? currentUser.name
                : "Guest",

        status:
            "Confirmed"

    };


    orders.unshift(order);


    saveOrders();


    alert(
        "🎉 Order placed successfully!\n\n" +
        "Order ID: " +
        order.id +
        "\n" +
        "Total: ₹" +
        total.toFixed(2) +
        "\n\n" +
        "Thank you for shopping with ShopEase!"
    );


    cart = [];

    appliedCoupon = null;


    saveCart();


    localStorage.removeItem(
        "appliedCoupon"
    );


    updateCart();

    updateCounts();


    const couponInput =
        document.getElementById(
            "coupon-input"
        );


    const couponMessage =
        document.getElementById(
            "coupon-message"
        );


    if (couponInput) {
        couponInput.value = "";
    }


    if (couponMessage) {
        couponMessage.textContent = "";
    }

}


/* ==================================================
   DISPLAY ORDERS
================================================== */

function displayOrders() {

    const ordersList =
        document.getElementById(
            "orders-list"
        );


    if (!ordersList) {
        return;
    }


    ordersList.innerHTML = "";


    if (orders.length === 0) {

        ordersList.innerHTML =
            "<p>No orders yet. Start shopping! 🛍️</p>";

        return;
    }


    orders.forEach(order => {

        const card =
            document.createElement("div");


        card.className =
            "order-card";


        let productsHTML = "";


        order.items.forEach(item => {

            productsHTML += `

                <div class="order-product">

                    <strong>
                        ${item.name}
                    </strong>

                    <br>

                    ₹${item.price}
                    ×
                    ${item.quantity}

                </div>

            `;

        });


        card.innerHTML = `

            <div class="order-header">

                <div>

                    <strong>
                        Order ID:
                    </strong>

                    ${order.id}

                    <br>

                    <small>
                        ${order.date}
                    </small>

                </div>


                <span class="order-status">
                    ${order.status}
                </span>

            </div>


            ${productsHTML}


            <div class="order-total">

                Total:
                ₹${order.total.toFixed(2)}

            </div>

        `;


        ordersList.appendChild(card);

    });

}


/* ==================================================
   UPDATE COUNTS
================================================== */

function updateCounts() {

    const cartCount =
        document.getElementById(
            "cart-count"
        );


    const wishlistCount =
        document.getElementById(
            "wishlist-count"
        );


    if (cartCount) {

        let count = 0;


        cart.forEach(item => {

            count += item.quantity;

        });


        cartCount.textContent =
            count;

    }


    if (wishlistCount) {

        wishlistCount.textContent =
            wishlist.length;

    }

}


/* ==================================================
   DARK MODE
================================================== */

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const button =
        document.getElementById(
            "theme-btn"
        );


    if (
        document.body.classList.contains(
            "dark"
        )
    ) {

        if (button) {
            button.textContent = "☀️";
        }


        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        if (button) {
            button.textContent = "🌙";
        }


        localStorage.setItem(
            "theme",
            "light"
        );

    }

}


/* ==================================================
   LOAD THEME
================================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "theme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );


        const button =
            document.getElementById(
                "theme-btn"
            );


        if (button) {

            button.textContent =
                "☀️";

        }

    }

}


/* ==================================================
   NOTIFICATION
================================================== */

function showNotification(message) {

    const notification =
        document.getElementById(
            "notification"
        );


    if (!notification) {
        return;
    }


    notification.textContent =
        message;


    notification.style.display =
        "block";


    setTimeout(() => {

        notification.style.display =
            "none";

    }, 2500);

}


/* ==================================================
   ACCOUNT - SIGN UP
================================================== */
async function signup() {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const message = document.getElementById("signup-message");

    if (!name || !email || !password) {
        message.textContent = "❌ Please fill all fields.";
        return;
    }

    if (password.length < 6) {
        message.textContent = "❌ Password must contain at least 6 characters.";
        return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { name: name }
        }
    });

    if (error) {
        message.textContent = "❌ " + error.message;
        return;
    }

    message.textContent = data.session
        ? "🎉 Account created successfully!"
        : "🎉 Account created! Check your email to verify it.";

    document.getElementById("signup-name").value = "";
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";

    setTimeout(() => showLogin(), 1500);
}


/* ==================================================
   ACCOUNT - LOGIN
================================================== */

async function login() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");

    if (!email || !password) {
        message.textContent = "❌ Please fill all fields.";
        return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        message.textContent = "❌ " + error.message;
        return;
    }

    message.textContent = "🎉 Login successful!";
    setTimeout(() => loadAccount(), 700);
}
/* ==================================================
   SHOW LOGIN
================================================== */

function showLogin() {

    const loginForm =
        document.getElementById(
            "login-form"
        );


    const signupForm =
        document.getElementById(
            "signup-form"
        );


    const loginTab =
        document.getElementById(
            "login-tab"
        );


    const signupTab =
        document.getElementById(
            "signup-tab"
        );


    if (!loginForm) {
        return;
    }


    loginForm.classList.remove(
        "hidden"
    );


    signupForm.classList.add(
        "hidden"
    );


    loginTab.classList.add(
        "active-tab"
    );


    signupTab.classList.remove(
        "active-tab"
    );

}


/* ==================================================
   SHOW SIGNUP
================================================== */

function showSignup() {

    const loginForm =
        document.getElementById(
            "login-form"
        );


    const signupForm =
        document.getElementById(
            "signup-form"
        );


    const loginTab =
        document.getElementById(
            "login-tab"
        );


    const signupTab =
        document.getElementById(
            "signup-tab"
        );


    if (!signupForm) {
        return;
    }


    signupForm.classList.remove(
        "hidden"
    );


    loginForm.classList.add(
        "hidden"
    );


    signupTab.classList.add(
        "active-tab"
    );


    loginTab.classList.remove(
        "active-tab"
    );

}


/* ==================================================
   LOAD ACCOUNT
================================================== */

async function loadAccount() {
    const authSection = document.getElementById("auth-section");
    const profileSection = document.getElementById("profile-section");

    if (!authSection || !profileSection) return;

    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        authSection.classList.remove("hidden");
        profileSection.classList.add("hidden");
        return;
    }

    const user = data.user;

    authSection.classList.add("hidden");
    profileSection.classList.remove("hidden");

    document.getElementById("profile-name").textContent =
        user.user_metadata.name || "User";

    document.getElementById("profile-email").textContent =
        user.email;
}
/* ==================================================
   LOGOUT
================================================== */

async function logout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout failed:", error.message);
        return;
    }

    showNotification("Logged out successfully 👋");
    loadAccount();
}

/* ==================================================
   START
================================================== */

displayProducts();

displayWishlist();

displayOrders();

updateCart();

updateCounts();

loadTheme();

loadAccount();

async function loadProductsFromSupabase() {
    const { data, error } = await supabaseClient
        .from("products")
        .select("*");

    if (error) {
        console.error(error.message);
        return;
    }

    products = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        category: item.category,
        image: item.image_url
    }));

    displayProducts(products);
}

loadProductsFromSupabase();

async function saveCartToSupabase() {
    const { data: { user }, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !user) {
        return;
    }

    const { error: deleteError } = await supabaseClient
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

    if (deleteError) {
        console.error("Cart save error:", deleteError.message);
        return;
    }

    if (cart.length === 0) {
        return;
    }

    const cartRows = cart.map(item => ({
        user_id: user.id,
        product_id: item.id,
        quantity: item.quantity
    }));

    const { error } = await supabaseClient
        .from("cart_items")
        .insert(cartRows);

    if (error) {
        console.error("Cart save error:", error.message);
    } else {
        console.log("Cart saved to Supabase!");
    }
}
