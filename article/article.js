export class Article {
  async getByProductId(productId) {
    const response = await fetch(
      `${API_BASE_URL}/articleNumbers/GetByProductId/${productId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const articles = await response.json();
    return articles;
  }

  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/articleNumbers/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const article = await response.json();
    return article;
  }

  async uploadImage(currentArticleId, formData) {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/articleNumbersImages/upload/${currentArticleId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  }

  // async create(imageData) {
  //   const token = localStorage.getItem("token");
  //   const response = await fetch(`${API_BASE_URL}/articleNumbersImages`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: imageData,
  //   });

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }
  //   const result = await response.json();
  //   return result;
  // }
}
