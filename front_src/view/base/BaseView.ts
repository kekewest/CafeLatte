import Backbone = require("backbone");

import SubViewOption = require("./SubViewOption");
import RenderOption = require("./RenderOption");


class BaseView extends Backbone.View<Backbone.Model> {

  protected _subViews: SubViewOption[];
  protected _template: (data: any) => string;

  constructor(options?: any) {
    this._bindSubView();
    this.events = this._setEvents();
    super(options);
  }

  public render(options: RenderOption = {}): BaseView {
    var html: any;
    if (this.model) {
      html = this._template(_.extend(this.model.toJSON(), options.data));
    } else {
      html = this._template(options.data);
    }
    this.$el.html(html);
    if (options.$append) {
      options.$append.append(this.$el);
    }
    this._renderSubView();
    return this;
  }

  public remove(): BaseView {
    if (this.hasSubViews()) {
      _(this._subViews).each((subView: SubViewOption) => {
        subView.view.remove();
      });
    }
    super.remove();
    return this;
  }

  public hasSubViews(): boolean {
    if (this._subViews) {
      return true;
    } else {
      return false;
    }
  }

  protected _setEvents(): any {
    return {};
  }

  protected _renderSubView(): void {
    if (!this.hasSubViews()) return;

    _(this._subViews).each((subView: SubViewOption) => {
      if (subView.selector) {
        subView.view.setElement(this.$(subView.selector));
      }
      subView.view.render();
    });
  }

  protected _bindSubView(): void {
    if (!this.hasSubViews()) return;

    _(this._subViews).each((subView: SubViewOption) => {
      (<any>this)[subView.bind] = subView.view;
    });
  }

}
export = BaseView;
