import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AnnouncekitModule } from 'projects/announcekit-angular/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AnnouncekitModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
