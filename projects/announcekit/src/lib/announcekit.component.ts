import {
  Component, OnInit, Input, Output, EventEmitter, DoCheck, NgZone
} from '@angular/core';

interface User {
  id: string;

  [key: string]: any;
}

interface Data {
  [key: string]: any;
}

@Component({
  selector: 'announcekit',
  templateUrl: './announcekit.component.html'
})

export class AnnouncekitComponent implements OnInit, DoCheck {
  @Input() widget: string;
  @Input() data?: Data;
  @Input() user?: User;
  @Input() lang?: string;
  @Input() floatWidget?: boolean;
  @Input() embedWidget?: boolean;
  @Input() boosters?: boolean;
  @Input() widgetStyle?: any;

  @Output('onWidgetOpen') onWidgetOpen = new EventEmitter<any>();
  @Output('onWidgetClose') onWidgetClose = new EventEmitter<any>();
  @Output('onWidgetUnread') onWidgetUnread = new EventEmitter<any>();
  @Output('onWidgetReady') onWidgetReady = new EventEmitter<any>();

  private selector: string;
  private name: string;
  public className: string;

  public widgetInstance: any;
  public widgetHandlers: any[] = [];

  private prevUser: User;
  private prevData: Data;

  public barBooster: any;
  public modalBooster: any;

  constructor(private ngZone: NgZone) {
    this.selector = `.ak-${Math.random()
      .toString(36)
      .substring(10)}`;

    this.widgetHandlers = [];

    this.className = this.selector.slice(1);

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

      this.selector = null;
      this.className = null;
    }

    const name = Math.random()
      .toString(36)
      .substring(10);

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
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
          selector: this.selector,
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

            ann.on('widget-open', ({widget}: any) => {
              if (widget === initWidget && this.onWidgetOpen) {
                this.onWidgetOpen.emit({widget});
              }
            });

            ann.on('widget-close', ({widget}: any) => {
              if (widget === initWidget && this.onWidgetClose) {
                this.onWidgetClose.emit({widget});
              }
            });

            ann.on('widget-ready', ({widget}: any) => {
              if (widget === initWidget && this.onWidgetReady) {
                this.onWidgetReady.emit({widget});
              }
            });
          }
        });
      }, 10);
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


  private isEquivalent(a: any, b: any): boolean {
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(a || {});
    const bProps = Object.getOwnPropertyNames(b || {});

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false;
    }

    for (const propName of aProps) {
      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

  private isObject(obj): boolean {
    return obj !== undefined && obj !== null && obj.constructor === Object;
  }

  private isString(obj): boolean {
    return obj !== undefined && obj !== null && obj.constructor === String;
  }

  ngOnInit(): void {
    if (!(this.user || this.data)) {
      this.loaded();
    }
  }

  ngDoCheck(): void {
    let dirty = false;

    try {
      if (this.isString(this.data) || this.isString(this.prevData) || this.isString(this.user) || this.isString(this.prevUser)) {
        return;
      }

      if (!this.isEquivalent(this.user, this.prevUser)) {
        if (!this.user) {
          this.prevUser = undefined;
        } else {
          this.prevUser = Object.assign({}, this.user);
        }

        dirty = true;
      }

      if (!this.isEquivalent(this.data, this.prevData)) {
        if (!this.data) {
          this.prevData = undefined;
        } else {
          this.prevData = Object.assign({}, this.data);
        }

        dirty = true;
      }

    } catch (e) {
      dirty = false;
    }

    if (dirty) {
      this.loaded();
    }
  }
}
