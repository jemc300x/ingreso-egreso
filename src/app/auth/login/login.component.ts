import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    const {email, password} = this.loginForm.value;

    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    })

    this.authService.login(email, password)
      .then(credenciales => {
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.log(err)
        Swal.fire({
          icon: 'error',
          title: 'Ooops...',
          text: err.message
        });
      });
  }

}
