import { Product } from '../product.model';

enum ProductKeys {
  name = 'Наименование',
  article = 'Артикул',
  price = 'МРЦ/РРЦ',
  quantity = 'Количество на складе',
  brand = 'Производитель',
  image = 'изображение',
  photo = 'фото',
}

export function getImageKeysOfProduct(product: any) {
  return Object.keys(product).filter((key) => {
    key = key.toLowerCase();
    if (key.includes(ProductKeys.image) || key.includes(ProductKeys.photo))
      return key;
  });
}

export function getImagesOfProduct(product: any) {
  const imageColumnNames = getImageKeysOfProduct(product);
  const imagesValues = imageColumnNames.map((imageColumnName) => {
    return product[imageColumnName];
  });
  return imagesValues.join(', ');
}

export function getDescriptionOfProduct(product: any) {
  const description = Object.keys(product).map((key) => {
    const productKeys = Object.values(ProductKeys).map((key) => key.toString());
    if (
      !productKeys.includes(key) &&
      !key.toLowerCase().includes(ProductKeys.image) &&
      !key.toLowerCase().includes(ProductKeys.photo)
    ) {
      return `${key}: ${product[key]}`;
    }
  });

  return description.filter((detail) => detail !== undefined).join('; ');
}

export function convertToProducts(data: unknown[]) {
  return data.map((product) => {
    const images = getImagesOfProduct(product);
    const description = getDescriptionOfProduct(product);

    return <Product>{
      name: product[ProductKeys.name],
      article: product[ProductKeys.article],
      price: +product[ProductKeys.price],
      quantity: +product[ProductKeys.quantity],
      brand: product[ProductKeys.brand],
      images,
      description,
    };
  });
}
