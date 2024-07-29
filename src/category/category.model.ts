export type CategoryTypeArgs = {
  name: string;
  description?: string;
};

export class Category {
  public name: string;
  public description: string;

  constructor({ name, description }: CategoryTypeArgs) {
    this.name = name;
    this.description = description || null;
  }
}
