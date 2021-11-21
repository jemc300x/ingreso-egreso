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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm!: FormGroup;
  loading = false;
  uiSubcription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) { }

  ngOnDestroy(): void {
    this.uiSubcription.unsubscribe();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.uiSubcription = this.store.select('ui').subscribe(
      ui => {
        this.loading = ui.isLoading
        console.log('test')
      }
    )
  }

  onLogin() {
    const {email, password} = this.loginForm.value;

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    this.store.dispatch(ui.isLoading());
    
    this.authService.login(email, password)
    .then(credenciales => {
      console.log(credenciales);
      this.store.dispatch(ui.stopLoading());
      // Swal.close();
      this.router.navigate(['/']);
    })
    .catch(err => {
        this.store.dispatch(ui.stopLoading());
        console.log(err)
        Swal.fire({
          icon: 'error',
          title: 'Ooops...',
          text: err.message
        });
      });
  }

}
