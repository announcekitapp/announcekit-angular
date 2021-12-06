![](https://announcekit.app/images/logo@2x.png)

The easiest way to use AnnounceKit widgets in your Angular apps (>=4.2.0).

**Visit [https://announcekit.app](https://announcekit.app) to get started with AnnounceKit.**
[CodeSandbox Demo](https://codesandbox.io/s/announcekit-angular-u4nxq)

[Documentation](https://announcekit.app/docs/angular)
______
## Installation

```sh
yarn add announcekit-angular
```

## Usage

app.module.ts
```ts
import {AnnouncekitModule} from 'announcekit-angular'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AnnouncekitModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


app.component.html
```html
<announcekit [user]="user" [data]="data"  widget="https://announcekit.co/widgets/v2/3xdhio">
    What's new
</announcekit>
```

## Props

Common props you may want to specify include:

- **`widget`** - The url of the widget. You can obtain it while creating or editing widget in AnnounceKit Dashboard.
- `widgetStyle` - You can apply CSS rules to modify / tune the position of the widget.
- `floatWidget` - Set true if the widget is a Float widget.
- `embedWidget` - Set true if the widget is a Embed widget.
- `boosters` - Set false if you want to disable boosters / Default: true.
- `user` - User properties (for user tracking)
- `data` - Segmentation data
- `lang` - Language selector
- `labels` -  In case you want to filter and display posts under a specific label or tag.
- `user_token` - JWT setup: https://announcekit.app/docs/jwt
- `onWidgetOpen` - Called when the widget is opened.
- `onWidgetClose` - Called when the widget is closed.
- `onWidgetUnread` - Called when unread post count of widget has been updated.
- `onWidgetReady` - Called when the widget is ready for the interaction
