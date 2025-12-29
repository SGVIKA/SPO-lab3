import { Article } from "../article/article.js";
import { Product } from "./product.js";

const product = new Product();
const CLASS_article = new Article();

let viewProduct;
let articlesData;
let viewArticle;
let currentArticleId = null;
let viewProductId = null;

async function updateData() {
  const urlParams = new URLSearchParams(window.location.search);
  viewProductId = urlParams.get("id");
  const viewArticleId = urlParams.get("articleId");

  currentArticleId = viewArticleId;

  if (viewProductId) {
    viewProduct = await product.getById(viewProductId);

    if (viewArticleId) {
      viewArticle = await CLASS_article.getById(viewArticleId);
      articlesData = await CLASS_article.getByProductId(viewProductId);
    } else {
      articlesData = await CLASS_article.getByProductId(viewProductId);
      viewArticle = articlesData[0];
    }
  } else {
    location.href = "./products.html";
  }
}
/////////
function addArticlesList() {
  const articlesList = document.getElementById("articles-list");
  if (!articlesList || !articlesData) return;

  articlesList.innerHTML = "";
  const visibleArticles = articlesData.filter(
    (a) => localStorage.getItem("token") !== null || a.isVisible
  );

  const html = visibleArticles
    .map((a) => {
      const firstImage = a.articleNumberImages?.[0]?.imageUrl
        ? `${API_BASE_URL}${a.articleNumberImages[0].imageUrl}`
        : "../assets/no_product_img.jpeg";

      return `<button id="article-${a.id}" class="article-btn">
        <img src="${firstImage}" width="50" height="50"/>
      </button>`;
    })
    .join("");

  articlesList.innerHTML = html;

  //отслеживание изменений url
  visibleArticles.forEach((article) => {
    const button = document.getElementById(`article-${article.id}`);
    if (button) {
      button.addEventListener("click", () => {
        const url = new URL(window.location);
        url.searchParams.set("articleId", article.id);
        history.pushState({ articleId: article.id }, "", url.toString());
        updateArticleContent(article);
      });
    }
  });
}
////////////
function updateArticleContent(article) {
  const productName = document.getElementById("product-name");
  const categoryName = document.getElementById("category");
  const brandName = document.getElementById("brand");
  const description = document.getElementById("description");

  productName.textContent = viewProduct.productName;
  categoryName.textContent = viewProduct.category?.categoryName || "--";
  brandName.textContent = viewProduct.brand?.brandName || "--";
  description.textContent = viewProduct.description;

  
  viewArticle = article;
  currentArticleId = article.id;

  // Картинка
  const mainImage = document.getElementById("article-img");
  const firstImage = article.articleNumberImages?.[0]?.imageUrl
    ? `${API_BASE_URL}${article.articleNumberImages[0].imageUrl}`
    : "../assets/no_product_img.jpeg";
  if (mainImage) {
    mainImage.src = firstImage;
  }

  // основные атрибуты
  document.getElementById("price").textContent = article.price;
  document.getElementById("stock").textContent = article.stockQuantity;
  document.getElementById("article-id").textContent = article.id;

  // Дополнительные атрибуты
  const table = document.getElementById("article-attributes");
  table.innerHTML = "";
  const attributesData = article.articleNumberAttributes || [];
  attributesData.forEach((a) => {
    table.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td class="first-col">${a.attribute?.attributeName}</td>
        <td class="second-col" id="${a.id}">${a.value || ""}</td>
      </tr>
    `
    );
  });
  //для админов
  if (localStorage.getItem("token")) {
    const galery = document.getElementById("galery");
    galery.innerHTML = "";
    const galeryContainer = document.getElementById("galery-container");
    galeryContainer.innerHTML = "";
    galeryContainer.insertAdjacentHTML(
      "afterbegin",
      `<button class="galery-btn" id="open-img-form">Добавить</button>
      <form class="add-img-form invisible" id="add-img-form">
        <input class="img-input" type="file" id="img-input" accept="image/*">
        <button class="galery-btn" type="submit" id="add-img-btn">Загрузить</button>
      </form>
        `
    );

    document.getElementById("open-img-form").addEventListener("click", () => {
      document.getElementById("add-img-form").classList.remove("invisible");
    });

    ////////////////

    const updateBtn = document.getElementById("add-img-btn");
    updateBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      const imgInput = document.getElementById("img-input");
      if (!imgInput?.files[0]) {
        // ✅ 1. ДОБАВИТЬ проверку
        console.log("Выберите изображение!");
        return;
      }

      const formData = new FormData();
      formData.append("photo", imgInput.files[0]);

      // const imageUrl = await article.upload(currentArticleId, formData);
      // const imageData = {
      //   articleNumberId: viewArticle.id,
      //   imageUrl: imageUrl,
      // };
      // await article.create(imageData);

      // await article.upload(currentArticleId, formData);

      // imgInput.value = "";
      // document.getElementById("add-img-form").classList.add("invisible");
      // updateArticleContent(viewArticle);

      try {
        console.log("article:", article);
        console.log("article.uploadImage:", article.uploadImage);
        console.log("typeof article.uploadImage:", typeof article.uploadImage);

        // ✅ 2. ДОБАВИТЬ try-catch
        await CLASS_article.uploadImage(currentArticleId, formData);

        imgInput.value = "";
        document.getElementById("add-img-form").classList.add("invisible");

        // ✅ 3. ДОБАВИТЬ обновление данных с сервера
        articlesData = await CLASS_article.getByProductId(viewProductId);
        viewArticle = articlesData.find((a) => a.id === currentArticleId);
        updateArticleContent(viewArticle); // ✅ Перерисует галерею
      } catch (error) {
        console.error("Ошибка загрузки:", error);
        alert("Ошибка загрузки изображения");
      }
    });
  }

  const galery = document.getElementById("galery");
  galery.innerHTML = "";

  const galeryData = viewArticle.articleNumberImages;
  galeryData.forEach((i) => {
    const url = `${API_BASE_URL}${i.imageUrl}`;
    galery.insertAdjacentHTML(
      "afterbegin",
      `<img
              class="article-img"
              src="${url}"
              width="300px"
            />`
    );
  });

  addArticlesList();
}

window.addEventListener("popstate", (event) => {
  if (event.state?.articleId) {
    const article = articlesData.find((a) => a.id === event.state.articleId);
    if (article) {
      updateArticleContent(article);
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  await updateData();

  updateArticleContent(viewArticle);

  //функционал для админов
  if (localStorage.getItem("token")) {
    //добавление кнопок
    document.getElementById("product").insertAdjacentHTML(
      "afterBegin",
      `<div class="product-btn-container">
        <a class="product-btn" href="./product-edit.html?id=${viewProduct.id}">Изменить</a>
        <button class="product-btn" id="product-delete-btn">Удалить</button>
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

  productName.textContent = viewProduct.productName;
  categoryName.textContent = viewProduct.category?.categoryName || "--";
  brandName.textContent = viewProduct.brand?.brandName || "--";
  description.textContent = viewProduct.description;
});
