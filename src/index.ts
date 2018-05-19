import {forEach, omit, pick} from 'lodash'
import {Store} from 'redux'
import Keg from './Keg'
import {
  ActionHandler,
  IAgedPlugins,
  IKegOptions,
  IPlugins,
  IReduxKegOptions,
  TAgedPlugin,
  TInjectedFunction,
} from './types'
export {Keg}
export const sKeg = Symbol('keg')

/**
 * call plugins with store
 */
const _agePlugins = (plugins: IPlugins, store: Store): {} => {
  const agedPlugins: IAgedPlugins = {}
  forEach(plugins, (plugin: any, key: string) => {
    agedPlugins[key] = plugin(store)
  })
  return agedPlugins
}

/**
 * call aged plugins with context and payload of an action
 */
const _openPlugins = (agedPlugins: {}, context: Store, payload: any) => {
  const openedPlugins: IPlugins = {}
  forEach(agedPlugins, (plugin: any, key: string) => {
    openedPlugins[key] = plugin(context, payload)
  })
  return openedPlugins
}

/**
 * Redux middleware
 */
export default (options: IReduxKegOptions = {}) => {
  const {plugins = {}, beers = {}} = options
  const myPlugins: IPlugins = {}
  Object.assign(myPlugins, plugins, beers)
  return (store: any) => {
    store[sKeg] = _agePlugins(myPlugins, store)
  }
}

/**
 * Vuex custom utils container function
 */
export const kegRunner = (
  injectedAction: TInjectedFunction,
  options: IKegOptions = {},
): ActionHandler => {
  return function kegTap(payload) {
    const {dispatch, getState, subscribe, replaceReducer}: Store = this
    let myPlugins: {[name: string]: TAgedPlugin} = this[sKeg]
    if(!myPlugins){
      throw new Error('[vuex-keg] keg-plugin is undefined in Store')
    }
    const {only, except} = options
    if(except){
      myPlugins = omit(myPlugins, except)
    }
    if(only){
      myPlugins = pick(myPlugins, only)
    }
    const plugins = _openPlugins(myPlugins, this, payload)
    return injectedAction({...plugins, dispatch, getState, subscribe, replaceReducer}, payload)
  }
}

export const keg = (
  injectedAction: {[name: string]: TInjectedFunction} | TInjectedFunction,
  options: IKegOptions,
): {[name: string]: ActionHandler} | ActionHandler => {
  if(typeof injectedAction === 'function'){
    return kegRunner(injectedAction, options)
  }
  if(!Array.isArray(injectedAction) && typeof injectedAction === 'object'){
    const actions: {[name: string]: ActionHandler} = {}
    Object.keys(injectedAction).forEach((key) => {
      actions[key] = kegRunner(injectedAction[key], options)
    })
    return actions
  }
  throw new Error('[vuex-keg] only support object & function')
}

