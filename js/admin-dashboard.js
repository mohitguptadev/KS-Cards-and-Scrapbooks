import { app, db } from "./firebase-config.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// =========================
// FIREBASE AUTH
// =========================

const auth = getAuth(app);


// =========================
// AUTH CHECK
// =========================

onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "admin.html";
    }

});


// =========================
// DOM ELEMENTS
// =========================

const productForm = document.getElementById("productForm");
const productList = document.getElementById("adminProductList");
const productCount = document.getElementById("productCount");

const totalProducts = document.getElementById("totalProducts");
const availableProducts = document.getElementById("availableProducts");
const comingSoonProducts = document.getElementById("comingSoonProducts");

const showAddProduct = document.getElementById("showAddProduct");
const cancelProduct = document.getElementById("cancelProduct");

const productFormCard = document.getElementById("productFormCard");

const formTitle = document.getElementById("formTitle");
const formMessage = document.getElementById("formMessage");

const logoutBtn = document.getElementById("logoutBtn");


// =========================
// LOAD PRODUCTS
// =========================

async function loadProducts() {

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        productList.innerHTML = "";

        productCount.textContent =
            `${snapshot.size} Product${snapshot.size !== 1 ? "s" : ""}`;

        let availableCount = 0;
        let comingSoonCount = 0;


        // No products
        if (snapshot.empty) {

            productList.innerHTML =
                "<p>No products found.</p>";

            totalProducts.textContent = "0";
            availableProducts.textContent = "0";
            comingSoonProducts.textContent = "0";

            return;
        }


        // =========================
        // DISPLAY PRODUCTS
        // =========================

        snapshot.forEach((item) => {

            const product = item.data();


            // Count products
            if (product.available) {
                availableCount++;
            } else {
                comingSoonCount++;
            }


            // Create card
            const card = document.createElement("div");

            card.className = "admin-product-card";


            card.innerHTML = `

                <div class="admin-product-image">

                    <img
                        src="../${product.image}"
                        alt="${product.name}"
                    >

                </div>


                <div class="admin-product-info">

                    <span>
                        ${product.available ? "AVAILABLE" : "COMING SOON"}
                    </span>

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <small>
                        ${product.category} • ${product.subcategory}
                    </small>

                    <p class="admin-product-price">
                        ${
                            product.price
                                ? "₹" + product.price
                                : "Price on Enquiry"
                        }
                    </p>


                    <div class="admin-card-buttons">

                        <button
                            class="edit-btn"
                            data-id="${item.id}">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            data-id="${item.id}">
                            Delete
                        </button>

                    </div>

                </div>

            `;


            productList.appendChild(card);

        });


        // =========================
        // UPDATE STATS
        // =========================

        totalProducts.textContent =
            snapshot.size;

        availableProducts.textContent =
            availableCount;

        comingSoonProducts.textContent =
            comingSoonCount;


        // Add button events
        addButtonEvents();


    } catch (error) {

        console.error("Error loading products:", error);

        productList.innerHTML =
            "<p>Unable to load products.</p>";

    }

}


// =========================
// ADD / EDIT PRODUCT
// =========================

productForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const productData = {

        name:
            document.getElementById("productName").value.trim(),

        category:
            document.getElementById("productCategory").value.trim(),

        subcategory:
            document.getElementById("productSubcategory").value.trim(),

        description:
            document.getElementById("productDescription").value.trim(),

        image:
            document.getElementById("productImage").value.trim(),

        page:
            document.getElementById("productPage").value.trim(),

        price:
            Number(
                document.getElementById("productPrice").value
            ),

        available:
            document.getElementById("productAvailable").value === "true"

    };


    const editId =
        document.getElementById("editProductId").value;


    try {

        // =========================
        // EDIT
        // =========================

        if (editId) {

            await updateDoc(
                doc(db, "products", editId),
                productData
            );

            formMessage.textContent =
                "Product updated successfully!";

        }

        // =========================
        // ADD
        // =========================

        else {

            await addDoc(
                collection(db, "products"),
                productData
            );

            formMessage.textContent =
                "Product added successfully!";

        }


        // Reset form
        productForm.reset();

        document.getElementById("editProductId").value = "";

        formTitle.textContent =
            "Add New Product";


        // Reload products
        await loadProducts();

    } catch (error) {

        console.error("Error saving product:", error);

        formMessage.textContent =
            "Unable to save product.";

    }

});


// =========================
// EDIT / DELETE BUTTON EVENTS
// =========================

function addButtonEvents() {


    // EDIT BUTTONS
    document
        .querySelectorAll(".edit-btn")
        .forEach((button) => {

            button.addEventListener("click", () => {

                editProduct(
                    button.dataset.id
                );

            });

        });


    // DELETE BUTTONS
    document
        .querySelectorAll(".delete-btn")
        .forEach((button) => {

            button.addEventListener("click", () => {

                deleteProduct(
                    button.dataset.id
                );

            });

        });

}


// =========================
// EDIT PRODUCT
// =========================

async function editProduct(id) {

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        let productData = null;


        snapshot.forEach((item) => {

            if (item.id === id) {

                productData =
                    item.data();

            }

        });


        if (!productData) {
            return;
        }


        // Fill form
        document.getElementById("editProductId").value =
            id;

        document.getElementById("productName").value =
            productData.name;

        document.getElementById("productCategory").value =
            productData.category;

        document.getElementById("productSubcategory").value =
            productData.subcategory;

        document.getElementById("productDescription").value =
            productData.description;

        document.getElementById("productImage").value =
            productData.image;

        document.getElementById("productPage").value =
            productData.page;

        document.getElementById("productAvailable").value =
            productData.available
                ? "true"
                : "false";

        document.getElementById("productPrice").value =
            productData.price || "";


        // Change title
        formTitle.textContent =
            "Edit Product";


        // Show form
        productFormCard.classList.add("active");


        // Scroll to form
        productFormCard.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        console.error("Error editing product:", error);

    }

}


// =========================
// DELETE PRODUCT
// =========================

async function deleteProduct(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        await deleteDoc(
            doc(db, "products", id)
        );


        await loadProducts();

    } catch (error) {

        console.error(
            "Error deleting product:",
            error
        );

        alert(
            "Unable to delete product."
        );

    }

}


// =========================
// SHOW ADD PRODUCT FORM
// =========================

showAddProduct.addEventListener("click", () => {

    productFormCard.classList.toggle("active");

});


// =========================
// CANCEL PRODUCT FORM
// =========================

cancelProduct.addEventListener("click", () => {

    productForm.reset();

    document.getElementById("editProductId").value = "";

    formTitle.textContent =
        "Add New Product";

    formMessage.textContent = "";

    productFormCard.classList.remove("active");

});


// =========================
// LOGOUT
// =========================

logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href =
            "admin.html";

    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

});


// =========================
// INITIAL LOAD
// =========================

loadProducts();