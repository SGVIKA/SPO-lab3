export class Brand{
    async getAll(){
        
        const response = await fetch(`${API_BASE_URL}/brands`);
        const brands = await response.json();
        return brands;
    }

    async getById(id){
        const response = await fetch(`${API_BASE_URL}/brands/${id}`);
        const brandData = await response.json();
        return brandData;
    }
}