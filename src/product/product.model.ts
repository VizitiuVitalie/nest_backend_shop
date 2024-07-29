export type ProductTypeArgs = {
  id: string;
  name: string;
  article: string;
  price: number;
  quantity: number;
  brand: string;
  images: string;
  description: string;
};

export class Product {
  public id: string;
  public name: string;
  public article: string;
  public price: number;
  public quantity: number;
  public brand: string;
  public images: string;
  public description: string;

  constructor({
    id,
    name,
    article,
    price,
    quantity,
    brand,
    images,
    description,
  }: ProductTypeArgs) {
    this.id = id || null;
    this.name = name;
    this.article = article;
    this.price = price;
    this.quantity = quantity;
    this.brand = brand;
    this.images = images;
    this.description = description;
  }
}
