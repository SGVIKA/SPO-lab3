import { Article } from "../article/article.js";
import { Product } from "./product.js";

const product = new Product();
const article = new Article();

let viewProduct;
let articlesData;
let viewArticle;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const viewProductId = urlParams.get("id");
  const viewArticleId = urlParams.get("articleId");

  if (viewProductId) {
    viewProduct = await product.getById(viewProductId);

    if (viewArticleId) {
      viewArticle = await article.getById(viewArticleId);
      articlesData = await article.getByProductId(viewProductId);
    } else {
      articlesData = await article.getByProductId(viewProductId);
      viewArticle = articlesData[0];
    }
  } else {
    location.href = "./products.html";
  }

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
        await product.delete(viewProduct.id);
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
  categoryName.textContent = viewProduct.category?.categoryName || "--";
  brandName.textContent = viewProduct.brand?.brandName || "--";
  description.textContent = viewProduct.description;

  // данные Article
  const price = document.getElementById("price");
  const stockQuantity = document.getElementById("stock");
  const articleId = document.getElementById("article-id");

  price.textContent = viewArticle.price;
  stockQuantity.textContent = viewArticle.stockQuantity;
  articleId.textContent = viewArticle.id;

  //атрибуты
  const attributesData = viewArticle.articleNumberAttributes;
  if (attributesData) {
    const productAttributesTable =
      document.getElementById("product-attributes");

    attributesData.forEach((a) => {
      // ✅ forEach вместо map
      productAttributesTable.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td>${a.attribute?.attributeName || "Неизвестный"}</td>
          <td id="${a.id}">${a.value || ""}</td>
        </tr>`
      );
    });
  }
  
  if (articlesData && articlesData.length > 1) {
    document
      .getElementById("product-info")
      .insertAdjacentHTML("beforeend", `<div id="articles-list"></div>`);

    const articlesList = document.getElementById("articles-list");
    articlesList.innerHTML = articlesData
      .map((a) => {
        if (a.articleNumberImages.length === 0) {
          return `<a href="./product-view.html?id=${viewProduct.id}&articleId=${a.id}"><img
              src="../assets/no_product_img.jpeg"
              id="article-img-${a.id}"
              width="50px"
            /></a>`;
        } else {
          return `<a href="./product-view.html?id=${viewProduct.id}&articleId=${a.id}"><img
              src="${a.articleNumberImages[0].imageUrl}"
              id="article-img-${a.id}"
              width="50px"
            /></a>`;
        }
      })
      .join("");
  }

  //загрузка картинок
  //    главная картинка
  const mainImg = document.getElementById("article-img");
  if (viewArticle.articleNumberImages.length > 0) {
    mainImg.src = viewArticle.articleNumberImages[0].imageUrl;

    //    галерея картинок

    document
      .getElementById("product-card")
      .insertAdjacentHTML("beforeend", `<div id="galery"></div>`);
    const galery = document.getElementById("galery");

    galery.innerHTML = viewArticle.articleNumberImages.map((i) => {
      return `<img
              src="${i.imageUrl}"
              id="article-img-${i.id}"
              width="300px"
            />`;
    });
  } else {
    mainImg.src = "../assets/no_product_img.jpeg";
  }
});
