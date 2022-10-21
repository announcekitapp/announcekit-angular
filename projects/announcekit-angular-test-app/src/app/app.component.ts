import { Component, ViewChild } from '@angular/core';
import { AnnouncekitComponent } from '../../../announcekit-angular/src/lib/announcekit.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent extends ViewChild {
  unread = 0;

  show = true;

  embedWidget = false;

  @ViewChild('announcekitComponent', { static: false }) announcekitComponent: AnnouncekitComponent;

  user: any = {
    id: Date.now(),
    name: Date.now().toString(),
  };

  data;

  changeUser() {
    this.user = {
      id: Date.now(),
      name: Date.now().toString(),
    };
  }

  changeData() {
    this.data = {
      name: Date.now().toString(),
    };
  }

  public ready() {
    console.log('AnnounceKit Component Ready');
  }

  public open() {
    console.log('AnnounceKit Component Open');
  }

  public getUnread() {
    this.announcekitComponent.unread().then((unread) => {
      console.log('widget unread counter', unread);
      this.unread = unread;
    });
  }

  public barBoosterHide() {
    if (this.show) {
      this.announcekitComponent.barBooster.hide();
    }
    else {
      this.announcekitComponent.barBooster.show();
    }

    this.show = !this.show;
  }
}
