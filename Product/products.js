import { Product } from "./product.js";

const product = new Product();

function genPagination(productsData) {
  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = "";

  //кнопки пагинации
  for (let i = 1; i <= productsData.totalPages; i++) {
    if (productsData.currentPage === i) {
      paginationContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="pagination-btn current-page" id="pagination-btn-${i}">${i}</button>`
      );
    } else {
      paginationContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="pagination-btn" id="pagination-btn-${i}">${i}</button>`
      );
    }
  }

  //Список продуктов текущей страницы
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = (productsData.data || [])
    .map((p) => {
      if (isAdmin || p.isVisible) {
        return `<div class="product-card ">
              <div>
              <a href="./product-view.html?id=${p.id}" id="product-${p.id}">${p.productName}</a>
              <p>${p.description}</p>
              </div>
              ${
                isAdmin
                  ? `<div>
                   <a href="./product-edit.html?id=${p.id}">Изменить</a>
                   <button id="delete-btn-${p.id}">Удалить</button>
                    </div>`
                  : ""
              }      
                </div>`;
      }
      return "";
    })
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  let currentFilters = { search: "", sortBy: "CreatedAt", orderBy: "desc" };

  if (isAdmin) {
    document
      .getElementById("buttons-container")
      .insertAdjacentHTML(
        "afterBegin",
        `<a href="./product-edit.html" id="create-product-btn">Создать</a>`
      );
  }

  //пагинация
  //генерация списка и кнопок
  const productsData = await product.getAllWithFilter(
    undefined,
    undefined,
    currentFilters.sortBy,
    currentFilters.orderBy,
    currentFilters.search
  );
  genPagination(productsData);

  //клик на кнопки пагинации
  document
    .getElementById("pagination-container")
    .addEventListener("click", async (e) => {
      if (e.target.classList.contains("pagination-btn")) {
        const pageNum = parseInt(e.target.textContent);
        const offset = (pageNum - 1) * 10;

        const newProductsData = await product.getAllWithFilter(
          offset,
          undefined,
          currentFilters.sortBy,
          currentFilters.orderBy,
          currentFilters.search
        );
        genPagination(newProductsData);
      }
    });

  //открыть форму фильтров
  document.getElementById("filter-btn").addEventListener("click", async () => {
    const filterContainer = document.getElementById("filter-container");
    if (filterContainer.classList.contains("invisible")) {
      filterContainer.classList.remove("invisible");
    } else {
      filterContainer.classList.add("invisible");
    }
  });

  //фильтрация
  document
    .getElementById("filter-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      currentFilters.search = document.getElementById("search").value;
      currentFilters.sortBy = document.getElementById("sort-select").value;
      currentFilters.orderBy = document.getElementById("order-select").value;

      const newPaginationData = await product.getAllWithFilter(
        undefined,
        undefined,
        currentFilters.sortBy,
        currentFilters.orderBy,
        currentFilters.search
      );
      genPagination(newPaginationData);
    });

  //сброс фильрации
  document.getElementById("reset-btn").addEventListener("click", async () => {
    currentFilters = { search: "", sortBy: "CreatedAt", orderBy: "desc" };
    document.getElementById("search").value = "";
    document.getElementById("sort-select").value = "CreatedAt";
    document.getElementById("order-select").value = "desc";
    const newPaginationData = await product.getAllWithFilter();
    genPagination(newPaginationData);
  });

  //Удаление
  document.addEventListener("click", async (e) => {
    if (e.target.id?.startsWith("delete-btn-")) {
      const productId = e.target.id.replace("delete-btn-", "");
      await product.delete(productId);
      location.reload();
    }
  });
});
