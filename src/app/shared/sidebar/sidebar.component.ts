import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from '../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  currentUser!: Usuario | null;
  userSubs!: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private store: Store<AppState>
  ) { }
  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.userSubs = this.store.select('user').subscribe(
      ({user}) => this.currentUser = user 
    )
  }

  onLogout(){
    this.authService.logout().then(
      () => {
        this.router.navigate(['/login']);
      }
    );
  }

}
