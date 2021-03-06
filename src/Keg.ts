import {ActionHandler, IKegOptions, TInjectedFunction} from './types'
import {keg} from './'

/**
 * Vuex custom utils container class
 */
export default class Keg {
  private _options: IKegOptions
  constructor(options: IKegOptions = {}) {
    this._options = options
  }

  /**
   * use custom utils
   */
  tap(
    injectedAction: {[name: string]: TInjectedFunction} | TInjectedFunction,
    options: IKegOptions = {},
  ): {[name: string]: ActionHandler} | ActionHandler {
    const {_options} = this
    const {only = _options.only, except = _options.except} = options
    return keg(injectedAction, {only, except})
  }

  /**
   * change default options
   */
  set options(options: IKegOptions) {
    this._options = options
  }

  /**
   * get default options
   */
  get options() {
    return {...this._options}
  }
}
