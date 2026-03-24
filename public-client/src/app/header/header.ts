import { AsyncPipe, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly doc = inject(DOCUMENT);
  
  protected readonly isAuthenticated = toSignal(this.authService.isAuthenticated$, { initialValue: false });

  login() {
    this.authService.loginWithRedirect();
  }

  logout() {
    this.authService.logout({
      logoutParams: { returnTo: this.doc.location.origin },
    });
  }
}
