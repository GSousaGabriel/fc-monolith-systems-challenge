export interface AddInputProductDto {
  id?: string;
  name: string;
  description: string;
  salesPrice: number;
}

export interface AddOutputProductDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
