import {Store} from 'redux'


interface IKegContext extends Store{
  [pluginName: string]: any
}

export type TOpenedPlugin = (...any: any[]) => any

export type TPlugin = (store: Store) => TAgedPlugin

export type TAgedPlugin = (context: IFnContext, payload: any) => TOpenedPlugin

export type TInjectedFunction = (context: IKegContext, payload?: any) => any

// since vuex not updated for this yet, I defined this
export type ActionHandler = (context: any, payload: any) => any

export interface IFnContext extends Store{
  [plugin: string]: TOpenedPlugin
}

export interface IReduxKegOptions {
  plugins?: IPlugins
  beers?: IPlugins // = plugins
}

export interface IKegOptions {
  only?: string[]
  except?: string[]
  // when?: () => Promise<any> next feather
}

export interface IPlugins {
  [name: string]: TPlugin
}

export interface IAgedPlugins {
  [name: string]: TAgedPlugin
}
