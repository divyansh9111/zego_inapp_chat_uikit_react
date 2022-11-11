import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "../../locales/zh";
import en from "../../locales/en";

interface ZIMKiti18nLocalesBase {
  [index: string]: string | ZIMKiti18nLocalesBase;
}

interface ZIMKiti18nLocalesData {
  [index: string]: ZIMKiti18nLocalesBase;
}

class ZIMKiti18n {
  static instance: ZIMKiti18n;
  private localesData: ZIMKiti18nLocalesData = {
    en: {},
    zh: {},
  };
  private i18next = i18next.use(initReactI18next);
  constructor() {
    if (!ZIMKiti18n.instance) {
      const localesData = { en, zh };
      this.localesData = localesData;
      ZIMKiti18n.instance = this;
    }
    return ZIMKiti18n.instance;
  }
  static getInstance() {
    if (!ZIMKiti18n.instance) {
      ZIMKiti18n.instance = new ZIMKiti18n();
    }
    return ZIMKiti18n.instance;
  }
  static destroy() {
    ZIMKiti18n.instance.localesData = { en: {}, cn: {} };
    // @ts-ignore
    ZIMKiti18n.instance = null;
  }
  init() {
    const options = {
      resources: {
        zh: { translation: this.localesData.zh },
        en: { translation: this.localesData.en },
      },
      fallbackLng: navigator.language,
      detection: {
        caches: ["localStorage", "sessionStorage", "cookie"],
      },
    };
    return this.i18next.init(options);
  }
  provideMessage(localesData: ZIMKiti18nLocalesData) {
    this.localesData.en = { ...this.localesData.en, ...localesData.en };
    this.localesData.zh = { ...this.localesData.zh, ...localesData.zh };
    return this.localesData;
  }
  getLocalesData() {
    return this.localesData;
  }
  getI18next() {
    return this.i18next;
  }
}

export default ZIMKiti18n;
