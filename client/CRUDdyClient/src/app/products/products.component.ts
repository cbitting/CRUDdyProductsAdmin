import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductdataService } from '../productdata.service';
import { HttpResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Product } from '../product';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  constructor(private dataService: ProductdataService) {}

  products: Product[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  showArchived = false;

  ngOnInit() {
    this.getProducts(false);
  }

  getArchivedProducts($event: MatSlideToggleChange) {
    if ($event.checked) {
      this.getProducts(true);
    } else {
      this.getProducts(false);
    }
  }

  getProducts(archived: boolean) {
    this.dataService
      .getProducts(archived)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: HttpResponse<Product[]>) => {
        this.products = res.body as any;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
