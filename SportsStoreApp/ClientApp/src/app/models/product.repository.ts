import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { StaticDatasource } from './static.datasource';
import { RestDatasource } from './rest.datasource';

@Injectable()

export class ProductRepository {
  private products: Product[] = [];
  private categories: string[] = [];

  //constructor(private dataSource: StaticDatasource)
  constructor(private dataSource: RestDatasource){
    dataSource.getProducts()
      .subscribe(
        (data) => {
          this.products = data;
          this.categories = data.map(p => p.category).filter((c, index, array) => array.indexOf(c) === index).sort() as string[];
        },
        (err) => { console.log(`Error from dataSource.getProducts().subscribe() -> \n${err}`); }
        //,() => { console.log(`dataSource.getProducts().subscribe() -> work completed`); }
      );
  }

  getProducts(category: string | null = null): Product[] {
    return this.products.filter(c => category == null || category === c.category);
  }

  getProduct = (id: number) => this.products.find(p => p.productId == id) as Product;

  getCategories = () => this.categories;

  saveProduct(product: Product) {
    if (product.productId == null || product.productId === 0) {
      this.dataSource.saveProduct(product).subscribe(
        (p: Product) => { this.products.push(p); },
        (err) => { console.log(`RestDatasource.saveProduct.newProduct error: \n${err}`); }
      ); // subscribe
    } else {
      this.dataSource.updateProduct(product).subscribe(
        (prod: Product) => {
          this.products.splice(this.products.findIndex(p => p.productId === product.productId), 1, product);
        },
        (err) => { console.log(`RestDatasource.saveProduct.updateProduct error: \n${err}`); }
      ); // subscribe
    }
  }

  deleteProduct(id: number) {
    this.dataSource.deleteProduct(id).subscribe(
      (prod: Product) => {
        this.products.splice(this.products.findIndex(p => p.productId === id), 1);
      },
      (err) => { console.log(`RestDatasource.deleteProduct: error: \n${err}`); }
    );// subscribe
  }
}
