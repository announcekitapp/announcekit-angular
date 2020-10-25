import { NgModule,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncekitComponent } from './announcekit.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AnnouncekitComponent],
  exports: [AnnouncekitComponent]
})
export class AnnouncekitModule { }
