import {EN} from "../locale/locale.en";

export class TranslateUtil {
  public static getEnText(key: string, ...params: any[]) {
    let message = EN[key];

    if(!!params) {
      params.forEach((val) => {
        message = message.replace('{}', val);
      });
    }

    return message;
  }
}
