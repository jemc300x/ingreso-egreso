import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as ui from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm!: FormGroup;
  uiSubscription!: Subscription;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre:   ['', Validators.required],
      correo:   ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe(
      ui => this.loading = ui.isLoading
    );

  }

  onRegister() {
    if (this.registerForm.invalid) return;
    const { nombre, correo, password } = this.registerForm.value;

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    this.store.dispatch(ui.isLoading())
    
    this.authService.crearUsuario(nombre, correo, password)
    .then(credenciales => {
      // Swal.close();
        this.store.dispatch(ui.stopLoading())
        this.router.navigate(['/'])
        
      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading())
        console.log(err)
        Swal.fire({
          icon: 'error',
          title: 'Ooops...',
          text: err.message
        });
      });
  }

}
