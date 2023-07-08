import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './pages/login/login.component';
import { MaterialModule } from './material/material.module';
import { environment } from 'src/environments/environment';
import { JwtModule } from '@auth0/angular-jwt';
import { ServerErrorsInterceptor } from './shared/server-errors.interceptor';
import { SpinnerModule } from './shared/spinner/spinner.module';
import { SpinnerInterceptor } from './shared/interceptors/spinner.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_NAME)
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule, //Formularios
    FormsModule, //Two Way Biding
    MaterialModule,
    SpinnerModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.HOST.replace("http://", "").split("/")[0]],
        disallowedRoutes: [`${environment.HOST.split("/")[0]}/oauth/token`]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
