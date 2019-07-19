export class ProductData {
    id: string;
    month: string;
    productsSold: number;

    setId(id: string){
        this.id = id;
    }

    setMonth(month: string){
        this.month = month;
    }

    setProductsSold(productsSold: number){
        this.productsSold = productsSold;
    }
}
