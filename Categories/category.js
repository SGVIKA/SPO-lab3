export class Category {
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const categories = await response.json();
    return categories;
  }

  async getById(id){
        const response = await fetch(`${API_BASE_URL}/categories/${id}`);
        const categoryData = await response.json();
        return categoryData;
    }
}
