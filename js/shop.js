import { db } from "./firebase-config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const shopGrid = document.getElementById("shopGrid");

async function loadProducts() {

    try {

        const productsSnapshot = await getDocs(
            collection(db, "products")
        );

        shopGrid.innerHTML = "";

        productsSnapshot.forEach((doc) => {

            const product = doc.data();

            const card = document.createElement("div");

            card.className = "shop-card";

            card.innerHTML = `
                <div class="shop-card-image">
                    <img src="../${product.image}" alt="${product.name}">
                </div>

                <div class="shop-card-content">

                    <span class="available-tag">
                        ${product.available ? "AVAILABLE" : "COMING SOON"}
                    </span>

                    <h3>${product.name}</h3>

                    <p>${product.description}</p>

                    <a href="product.html?id=${doc.id}" class="shop-link">
    View Product →
</a>

                </div>
            `;

            shopGrid.appendChild(card);

        });

    } catch (error) {

        console.error("Error loading products:", error);

        shopGrid.innerHTML = `
            <p>Unable to load products.</p>
        `;

    }
}

loadProducts();