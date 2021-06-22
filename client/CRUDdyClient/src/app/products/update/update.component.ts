import { Component, OnInit } from '@angular/core';
import { ProductdataService } from '../../productdata.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Product } from '../../product';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css'],
})
export class UpdateComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  product: Product = {
    id: '',
    price: 0,
    name: '',
    descrip: '',
    archived: false,
  };
  destroy$: Subject<boolean> = new Subject<boolean>();
  id: string = '';
  newprod: boolean = true;

  productForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    descrip: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(1000),
    ]),
    price: new FormControl('', [
      Validators.min(1),
      Validators.max(20000),
      Validators.required,
    ]),
    id: new FormControl(''),
  });

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('productId')) {
      this.id = this.route.snapshot.paramMap.get('productId') as string;
      this.newprod = false;
      this.dataService
        .getProduct(this.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: HttpResponse<Product[]>) => {
          console.log(res);
          this.product = res.body as any;
          this.productForm.patchValue(this.product);
        });
    } else {
      console.log('new prod, do not get data.');
    }
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.productForm.controls[controlName].hasError(errorName);
  };

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  deleteProduct(id: string) {
    if (!this.newprod) {
      this.dataService
        .deleteProduct(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: HttpResponse<Product[]>) => {
          this.openSnackBar('Product Deleted', 'Close');
          this.router.navigate(['/products']);
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    public dataService: ProductdataService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}
  submitForm() {
    if (this.newprod) {
      this.dataService
        .createProduct(this.productForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: HttpResponse<Product[]>) => {
          console.log(res.body);
          let nProd: Product = res.body as any;
          this.router.navigate(['/product/update', nProd.id]);
          this.openSnackBar('New Product: ' + nProd.name + ' Added', 'Close');

          //this.products =  res.body as any;
        });
    }

    if (!this.newprod) {
      this.dataService
        .updateProduct(this.productForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: HttpResponse<Product[]>) => {
          console.log(res.body);
          let nProd: Product = res.body as any;
          this.router.navigate(['/product/update', nProd.id]);
          this.openSnackBar('Product: ' + nProd.name + ' Updated', 'Close');
          //this.products =  res.body as any;
        });
    }
    //  this.dataService.create(this.productForm.value).subscribe(res => {
    //    console.log('Product created!')
    //    this.router.navigateByUrl('/crud/home/'))

    // }
    console.warn(this.productForm.value);
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    let invalid = true;
    if (control != null) {
      if (!control.invalid) {
        invalid = false;
      }
    }
    return invalid;
    // return (control as FormControl && control.invalid);
  }
}
