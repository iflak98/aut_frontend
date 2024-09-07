import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SnackbarConfig {
  isVisible: boolean;
  text: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  private _isProgressing = new BehaviorSubject<boolean>(false);
  private _isProgressing$ = this._isProgressing.asObservable();

  getIsProgreesing() {
    return this._isProgressing$;
  }
  setIsProgressing(isProgressing: boolean) {
    this._isProgressing.next(isProgressing);
  }

  private _isFileLoaded = new BehaviorSubject<SnackbarConfig>({
    isVisible: false,
    text: ''
  });
  private _isFileLoaded$ = this._isFileLoaded.asObservable();

  getIsFileLoaded() {
    return this._isFileLoaded$;
  }
  setIsFileLoaded(isFileLoadedSnackbarConfig: SnackbarConfig) {
    this._isFileLoaded.next(isFileLoadedSnackbarConfig);
  }

}
