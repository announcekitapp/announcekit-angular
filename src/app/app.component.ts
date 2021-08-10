import {Component, ViewChild} from '@angular/core';
import {AnnouncekitComponent} from 'announcekit-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent extends ViewChild {
  unread = 0;

  @ViewChild('announcekitComponent', {static: false}) announcekitComponent: AnnouncekitComponent;

  user = {
    id: Date.now(),
    name: Date.now().toString(),
  };

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
    this.announcekitComponent.barBooster.hide();
  }
}
