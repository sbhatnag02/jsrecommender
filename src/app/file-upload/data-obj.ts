export class DataObj {
    $key: string;
    month: string;
    sold: number;

    constructor(month: string, sold: number){
        this.month = month;
        this.sold = sold;
    }

    getMonth(){
        return this.month;
    }

    getSold(){
        return this.sold;
    }
}
