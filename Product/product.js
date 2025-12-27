export class Product {
  async getAllWithFilter(
    offset = 0,
    limit = 10,
    sortBy = "CreatedAt",
    orderBy = "desc",
    search = "",
    showHidden = isAdmin ? "true" : "false"
  ) {
    try {
      const params = new URLSearchParams({
        Offset: offset.toString(),
        Limit: limit.toString(),
        SortBy: sortBy,
        OrderBy: orderBy,
        Search: search,
        ShowHidden: showHidden,
      });
      const response = await fetch(
        `${API_BASE_URL}/products/GetAllWithFilter?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const products = await response.json();
      return products;
    } catch (error) {
      console.error("Ошибка получения продуктов:", error);
      throw error;
    }
  }

  async delete(productId) {
    const token = localStorage.token;
    await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  async create(productData) {
    const token = localStorage.token;

    // const productData = {
    //   product: innerProductData,
    // };

    // console.log("Token:", token);
    // console.log("ProductData:", JSON.stringify(productData, null, 2));
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const product = await response.json();
    return product;
  }

  async updateVisibility(id) {
    const token = localStorage.token;
    try {
      await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Ошибка:", error);
    }
  }
}
