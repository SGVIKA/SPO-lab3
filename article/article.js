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
}
