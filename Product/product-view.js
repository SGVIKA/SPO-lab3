import { Product } from "./product.js";

const product = new Product();

let viewProduct;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  viewProduct = await product.getById(productId);
  console.log(viewProduct);

  //функционал для админов
  if (localStorage.getItem("token")) {
    //добавление кнопок
    document.getElementById("product").insertAdjacentHTML(
      "afterBegin",
      `<div>
        <a href="./product-edit.html?id=${viewProduct.id}">Изменить</a>
        <button id="product-delete-btn">Удалить</button>
      </div>`
    );

    //удалить
    document
      .getElementById("product-delete-btn")
      .addEventListener("click", async () => {
        await product.delete(productId);
        location.href = "./products.html";
      });
  }

  //данные Product
  const productName = document.getElementById("product-name");
  const categoryName = document.getElementById("category");
  const brandName = document.getElementById("brand");
  const description = document.getElementById("description");

  //    заполнение
  productName.textContent = viewProduct.productName;
  categoryName.textContent = viewProduct.category.categoryName || "--";
  brandName.textContent = viewProduct.brand.brandName || "--";
  description.textContent = viewProduct.description;

  // данные Article
  const price = document.getElementById("price");
  const stock = document.getElementById("stock");
  const articleId = document.getElementById("article-id");
  const articleImg = document.getElementById("article-img");
  const articleList = document.getElementById("article-list");
  const galery = document.getElementById("galery");
});
