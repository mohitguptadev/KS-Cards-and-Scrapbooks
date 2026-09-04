import { db } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);

const productId = params.get("id");

const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");
const productImage = document.getElementById("productImage");
const productCategory = document.getElementById("productCategory");
const whatsappButton = document.getElementById("whatsappButton");

async function loadProduct() {

    if (!productId) {
        productName.textContent = "Product not found";
        return;
    }

    try {

        const productRef = doc(db, "products", productId);
        const productSnapshot = await getDoc(productRef);

        if (!productSnapshot.exists()) {
            productName.textContent = "Product not found";
            return;
        }

        const product = productSnapshot.data();

        productName.textContent = product.name;
        productDescription.textContent = product.description;
        const productPrice = document.getElementById("productPrice");

productPrice.textContent =
    product.price
        ? `₹${product.price}`
        : "Price on Enquiry";
        productCategory.textContent = product.category;

        productImage.src = "../" + product.image;
        productImage.alt = product.name;

        const message = `Hi KS Cards & Scrapbooks, I am interested in the ${product.name}.`;

        whatsappButton.href =
            `https://wa.me/919428839108?text=${encodeURIComponent(message)}`;

    } catch (error) {

        console.error(error);
        productName.textContent = "Unable to load product.";

    }
}

loadProduct();