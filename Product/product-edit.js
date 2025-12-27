import { Product } from "./product.js";
import { Brand } from "../Brands/brand.js";
import { Category } from "../Categories/category.js";

const product = new Product();
const brand = new Brand();
const category = new Category();

let currentProduct = {
  id: null,
  productName: "",
  description: "",
  brandId: "00000000-0000-0000-0000-000000000000",
  categoryId: "00000000-0000-0000-0000-000000000000",
  isVisible: false,
};

function saveCurrentProduct() {
  currentProduct.productName = document.getElementById("product-name").value;
  currentProduct.description = document.getElementById("description").value;
  currentProduct.brandId = document.getElementById("brand-select").value;
  currentProduct.categoryId = document.getElementById("category-select").value;
  currentProduct.isVisible = document.getElementById("is-visible").checked;

  localStorage.setItem("currentProduct", JSON.stringify(currentProduct));
}

function updateTitle() {
  const title = document.getElementById("product-edit-title");
  if (currentProduct.id !== null) {
    title.textContent = `Продукт № ${currentProduct.id}`;
  } else {
    title.textContent = `Новый продукт`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const saved = localStorage.getItem("currentProduct");
  if (saved) {
    currentProduct = { ...currentProduct, ...JSON.parse(saved) };
  }
  //кэширование заполнения формы
  const productName = document.getElementById("product-name");
  const description = document.getElementById("description");
  const brandSelect = document.getElementById("brand-select");
  const categorySelect = document.getElementById("category-select");
  const isVisible = document.getElementById("is-visible");

  productName.addEventListener("input", saveCurrentProduct);
  description.addEventListener("input", saveCurrentProduct);
  brandSelect.addEventListener("change", saveCurrentProduct);
  categorySelect.addEventListener("change", saveCurrentProduct);
  isVisible.addEventListener("change", saveCurrentProduct);

  //заполнение выборов
  //бренда
  brandSelect.innerHTML = "";

  const brandData = await brand.getAll();

  brandSelect.innerHTML = brandData
    .map((b) => {
      return `<option value="${b.id}">${b.brandName}</option>`;
    })
    .join("");

  //категории
  categorySelect.innerHTML = "";
  const categoryData = await category.getAll();

  categorySelect.innerHTML = categoryData
    .map((c) => {
      return `<option value="${c.id}">${c.categoryName}</option>`;
    })
    .join("");

  //перезаполнение формы сохраненнными данными
  if (currentProduct.id !== null) {
    document.getElementById(
      "product-edit-title"
    ).textContent = `Продукт № ${currentProduct.id}`;
  } else {
    document.getElementById("product-edit-title").textContent = `Новый продукт`;
  }
  productName.value = currentProduct.productName;
  description.value = currentProduct.description;
  brandSelect.value = currentProduct.brandId;
  categorySelect.value = currentProduct.categoryId;
  isVisible.checked = currentProduct.isVisible;
});

document
  .getElementById("save-product-btn")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    saveCurrentProduct();

    if (currentProduct.id !== null) {
      const newProductData = {
        id: currentProduct.id,
        productName: currentProduct.productName,
        description: currentProduct.description,
        brandId: currentProduct.brandId,
        categoryId: currentProduct.categoryId,
        isVisible: currentProduct.isVisible,
      };

      await product.update(currentProduct.id, newProductData);
    } else {
      const newProductData = {
        productName: currentProduct.productName,
        description: currentProduct.description,
        brandId: currentProduct.brandId,
        categoryId: currentProduct.categoryId,
      };
      const response = await product.create(newProductData);
      currentProduct.id = response.id;

      if(currentProduct.isVisible){
        await product.updateVisibility(currentProduct.id);
      }

      updateTitle();
    }
  });
