import {
  Component, Input, Output, EventEmitter, NgZone, AfterViewInit, ElementRef, ViewChild
} from '@angular/core';

interface User {
  id: any;

  [key: string]: any;
}

interface Data {
  [key: string]: any;
}

@Component({
  selector: 'announcekit',
  templateUrl: './announcekit.component.html'
})

export class AnnouncekitComponent implements AfterViewInit {
  @ViewChild('ankRef', {static: true}) elementRef: ElementRef;

  @Input() widget: string;

  @Input('user') set user(value: User) {
    if (this.isString(value) || this.isString(this._user)) {
      this.propsValid = false;
      this._user = undefined;
    }
    else {
      if (!value) {
        this._user = undefined;
      } else {
        this._user = Object.assign({}, value);
      }
    }
  }

  @Input('data') set data(value: Data) {
    if (this.isString(value) || this.isString(this._data)) {
      this.propsValid = false;
      this._data = undefined;
    }
    else {
      if (!value) {
        this._data = undefined;
      } else {
        this._data = Object.assign({}, value);
      }
    }
  }

  @Input() lang?: string;
  @Input() floatWidget?: boolean;
  @Input() embedWidget?: boolean;
  @Input() boosters?: boolean;
  @Input() widgetStyle?: any;
  @Input() userToken?: string;
  @Input() labels?: [string];

  @Output('onWidgetOpen') onWidgetOpen = new EventEmitter<any>();
  @Output('onWidgetClose') onWidgetClose = new EventEmitter<any>();
  @Output('onWidgetUnread') onWidgetUnread = new EventEmitter<any>();
  @Output('onWidgetReady') onWidgetReady = new EventEmitter<any>();

  get user(): User {
    return this._user;
  }

  get data(): Data {
    return this._data;
  }

  private propsValid: boolean = true;
  private _user: User;
  private _data: Data;
  public className: string;

  public widgetInstance: any;
  public widgetHandlers: any[] = [];

  public barBooster: any;
  public modalBooster: any;

  constructor(private ngZone: NgZone) {
    this.widgetHandlers = [];

    this.ngZone.runOutsideAngular(() => {
      if (!window[`announcekit`]) {
        window[`announcekit`] = window[`announcekit`] || {
          queue: [],
          push(x: any) {
            window[`announcekit`].queue.push(x);
          },
          on(n: any, x: any) {
            window[`announcekit`].queue.push([n, x]);
          }
        };

        let scripttag: HTMLScriptElement;
        scripttag = document.createElement('script') as HTMLScriptElement;
        scripttag.async = true;
        scripttag.src = `https://cdn.announcekit.app/widget-v2.js`;

        let scr: HTMLScriptElement;
        scr = document.getElementsByTagName('script')[0];
        scr.parentNode.insertBefore(scripttag, scr);
      }
    });
  }

  ngOnChanges() {
    if (this.propsValid) {
      this.loaded();
    }

    this.propsValid = true;
  }

  private loaded(): void {
    const style = this.widgetStyle;

    const styleParams = {
      badge: {
        style
      },
      line: {
        style
      },
      float: {
        style
      }
    };


    if (this.floatWidget) {
      delete styleParams.badge;
      delete styleParams.line;
    }

    const name = Math.random()
      .toString(36)
      .substring(10);

    this.ngZone.runOutsideAngular(() => {
      window[`announcekit`].push({
        widget: this.widget,
        name,
        version: 2,
        framework: 'angular',
        framework_version: '4.0.0',
        embed: !!this.embedWidget,
        data: this.data,
        user: this.user,
        lang: this.lang,
        labels: this.labels,
        user_token: this.userToken,
        selector: this.elementRef.nativeElement,
        boosters: typeof this.boosters === 'undefined' ? true : this.boosters,
        ...styleParams,
        onInit: (initWidget: any) => {
          if (initWidget.conf.name !== name) {
            return initWidget.destroy();
          }

          const ann = window[`announcekit`];

          this.widgetInstance = initWidget;

          this.barBooster = ann.boosters.bar;
          this.modalBooster = ann.boosters.modal;

          this.widgetHandlers.forEach((h) => h(initWidget));
          this.widgetHandlers = [];

          if (this.onWidgetUnread) {
            this.onWidgetUnread.emit(this.widgetInstance.state.ui.unreadCount);
          }

          ann.on('widget-open', ({ widget }: any) => {
            if (widget === initWidget && this.onWidgetOpen) {
              this.onWidgetOpen.emit({ widget });
            }
          });

          ann.on('widget-close', ({ widget }: any) => {
            if (widget === initWidget && this.onWidgetClose) {
              this.onWidgetClose.emit({ widget });
            }
          });

          ann.on('widget-ready', ({ widget }: any) => {
            if (widget === initWidget && this.onWidgetReady) {
              this.onWidgetReady.emit({ widget });
            }
          });
        }
      });
    });
  }

  withWidget(fn) {
    return new Promise(res => {
      if (this.widgetInstance) {
        return res(fn(this.widgetInstance));
      } else {
        this.widgetHandlers.push((widget: any) => {
          res(fn(widget));
        });
      }
    });
  }

  unread(): any {
    return this.withWidget((widget: any) => widget.state.ui.unreadCount);
  }

  instance(): any {
    return this.withWidget((widget: any) => widget);
  }

  open() {
    this.withWidget((widget: any) => widget.open());
  }

  close() {
    this.withWidget((widget: any) => widget.close());
  }

  private isString(obj): boolean {
    return obj !== undefined && obj !== null && obj.constructor === String;
  }

  ngAfterViewInit(): void {
    if (!(this.user || this.data)) {
      this.loaded();
    }
  }
}
