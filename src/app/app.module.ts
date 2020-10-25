import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AnnouncekitModule} from 'announcekit-angular'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    AnnouncekitModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
