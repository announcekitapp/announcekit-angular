import {
  Component, OnInit, Input, Output, EventEmitter
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

export class AnnouncekitComponent implements OnInit {
  @Input() widget: string;
  @Input() data?: Data;
  @Input() user?: User;
  @Input() lang?: string;
  @Input() floatWidget?: boolean;
  @Input() embedWidget?: boolean;
  @Input() widgetStyle?: any;

  @Output('onWidgetOpen') onWidgetOpen = new EventEmitter<any>();
  @Output('onWidgetClose') onWidgetClose = new EventEmitter<any>();
  @Output('onWidgetUnread') onWidgetUnread = new EventEmitter<any>();

  private selector: string;
  private name: string;
  public className: string;

  private widgetInstance: any;
  public widgetHandlers: any[] = [];

  private prevUser: User;
  private prevData: Data;

  constructor() {
    this.selector = `.ak-${Math.random()
      .toString(36)
      .substring(10)}`;

    this.widgetHandlers = [];

    this.className = this.selector.slice(1);

    if (!window['announcekit']) {
      window['announcekit'] = window['announcekit'] || {
        queue: [],
        push: function(x:any) {
          window['announcekit'].queue.push(x);
        },
        on: function(n: any, x:any) {
          window['announcekit'].queue.push([n, x]);
        }
      };

      let scripttag = document.createElement('script') as HTMLScriptElement;
      scripttag['async'] = true;
      scripttag['src'] = `https://cdn.announcekit.app/widget-v2.js`;

      let scr = document.getElementsByTagName('script')[0];
      scr.parentNode.insertBefore(scripttag, scr);
    }
  }

  private loaded(): void {
    let style = this.widgetStyle;

    let styleParams = {
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

    window['announcekit'].push({
      widget: this.widget,
      name: name,
      version: 2,
      framework: 'angular',
      framework_version: '4.0.0',
      data: this.data,
      user: this.user,
      lang: this.lang,
      selector: this.selector,
      onInit: (_widget: any) => {
        if (_widget.conf.name !== name) {
          return _widget.destroy();
        }

        const ann = window['announcekit'];

        this.widgetInstance = _widget;

        this.widgetHandlers.forEach((h:Function) => h(_widget));
        this.widgetHandlers = [];

        if (this.onWidgetUnread) {
          this.unread().then((number) => this.onWidgetUnread.emit(number));
        }

        ann.on('widget-open', ({widget}:any) => {
          if (widget === _widget && this.onWidgetOpen) {
            this.onWidgetOpen.emit({widget});
          }
        });

        ann.on('widget-close', ({widget}:any) => {
          if (widget === _widget && this.onWidgetClose) {
            this.onWidgetClose.emit({widget});
          }
        });
      }
    });
  }

  private withWidget(fn: Function) {
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


  isEquivalent(a:any, b:any): boolean {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a || {});
    var bProps = Object.getOwnPropertyNames(b || {});

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

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

  ngOnInit(): void {
    if (!(this.user || this.data)) {
      this.loaded();
    }
  }

  ngDoCheck(): void {
    let dirty = false;

    if (!this.isEquivalent(this.user, this.prevUser)) {
      this.prevUser = Object.assign({}, this.user);
      dirty = true;
    }

    if (!this.isEquivalent(this.data, this.prevData)) {
      this.prevData = Object.assign({}, this.data);
      dirty = true;
    }

    if (dirty) {
      this.loaded();
    }
  }
}
