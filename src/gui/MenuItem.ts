/*
 * Copyright 2014-2016 Simon Edwards <simon@simonzone.com>
 *
 * This source code is licensed under the MIT license which is detailed in the LICENSE.txt file.
 */
import {ThemeableElementBase} from '../ThemeableElementBase';
import * as DomUtils from '../DomUtils';
import * as Util from './Util';
import * as ThemeTypes from '../Theme';

const ID = "EtbMenuItemTemplate";
const ID_CONTAINER = "ID_CONTAINER";
const ID_ICON2 = "ID_ICON2";
const ID_LABEL = "ID_LABEL";
const CLASS_SELECTED = "selected";

let registered = false;

/**
 * A menu item suitable for use inside a ContextMenu.
 */
export class MenuItem extends ThemeableElementBase {
  
  /**
   * The HTML tag name of this element.
   */
  static TAG_NAME = 'ET-MENUITEM';
  
  static ATTR_SELECTED = 'selected';
  
  static ID_ICON1 = "ID_ICON1";

  /**
   * Initialize the MenuItem class and resources.
   *
   * When MenuItem is imported into a render process, this static method
   * must be called before an instances may be created. This is can be safely
   * called multiple times.
   */
  static init(): void {
    if (registered === false) {
      window.customElements.define(MenuItem.TAG_NAME.toLowerCase(), MenuItem);
      registered = true;
    }
  }
  
  //-----------------------------------------------------------------------
  //
  //   #                                                         
  //   #       # ###### ######  ####  #   #  ####  #      ###### 
  //   #       # #      #      #    #  # #  #    # #      #      
  //   #       # #####  #####  #        #   #      #      #####  
  //   #       # #      #      #        #   #      #      #      
  //   #       # #      #      #    #   #   #    # #      #      
  //   ####### # #      ######  ####    #    ####  ###### ###### 
  //
  //-----------------------------------------------------------------------

  /**
   * Custom Element 'connected' life cycle hook.
   */
  connectedCallback(): void {
    super.connectedCallback();
    if (DomUtils.getShadowRoot(this) !== null) {
      return;
    }
    
    const shadow = this.attachShadow({ mode: 'open', delegatesFocus: false });
    const clone = this._createClone();
    shadow.appendChild(clone);
    this.updateThemeCss();

    let iconhtml = "";
    const icon = this.getAttribute('icon');
    if (icon !== null && icon !== "") {
      iconhtml += "<i class='fa fa-fw fa-" + icon + "'></i>";
    } else {
      iconhtml += "<i class='fa fa-fw'></i>";
    }
    (<HTMLElement>shadow.querySelector("#" + ID_ICON2)).innerHTML = iconhtml;
    
    this.updateKeyboardSelected(this.getAttribute(MenuItem.ATTR_SELECTED));
  }
  

  static get observedAttributes(): string[] {
    return [MenuItem.ATTR_SELECTED];
  }

  /**
   * Custom Element 'attribute changed' hook.
   */
  attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void {
    if (attrName === MenuItem.ATTR_SELECTED) {
      this.updateKeyboardSelected(newValue);
    }
  }
  
  protected _themeCssFiles(): ThemeTypes.CssFile[] {
    return [ThemeTypes.CssFile.GUI_CONTROLS, ThemeTypes.CssFile.FONT_AWESOME, ThemeTypes.CssFile.GUI_MENUITEM];
  }

  //-----------------------------------------------------------------------
  private _html(): string {
    return `
      <style id='${ThemeableElementBase.ID_THEME}'></style>
      <div id='${ID_CONTAINER}'>
        <div id='${MenuItem.ID_ICON1}'><i class='fa fa-fw'></i></div>
        <div id='${ID_ICON2}'></div>
      <div id='${ID_LABEL}'><slot></slot></div>
      </div>`;
  }

  private _createClone(): Node {
    let template = <HTMLTemplateElement>window.document.getElementById(ID);
    if (template === null) {
      template = <HTMLTemplateElement>window.document.createElement('template');
      template.id = ID;
      template.innerHTML = this._html();
      window.document.body.appendChild(template);
    }
    return window.document.importNode(template.content, true);
  }

  _clicked(): void {}
  
  private updateKeyboardSelected(value: string): void {
    const shadow = DomUtils.getShadowRoot(this);
    const container = <HTMLDivElement>shadow.querySelector("#" +ID_CONTAINER);
    const on = value === "true";
    if (on) {
      container.classList.add(CLASS_SELECTED);
    } else {
      container.classList.remove(CLASS_SELECTED);
    }
  }
}
