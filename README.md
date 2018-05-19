![intro](./media/intro.png)
# Redux Keg

> supporting custom util plugin in Redux.

## Installation
``
npm i -S vuex-keg
``

``
yarn add vuex-keg
``

## New Feature!
> Now keg can set many actions at ones
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexKeg, {keg} from './'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
      count: 0,
    },
    mutation: {
      increase(state) {
        state.count += 1
      },
    },
    actions: {
      IAmJustAction({commit}, payload) {
        commit('increase')
      },
      ...keg({
        doSayHi({justSay, commit}, payload) {
          // custom keg util
          justSay('hi', 'foo')
          // do mutation
          commit('increase')
        },
        doSayHo: ({justSay, commit}, payload) => {
          // custom keg util
          justSay('ho', 'foo')
          // do mutation
          commit('increase')
        },
        doSayHa: ({justSay, commit}, payload) => {
          // custom keg util
          justSay('ha', 'foo')
          // do mutation
          commit('increase')
        },
      })
    },
    plugins: [
      VuexKeg({
        plugins: {
          justSay: (store) => (context, payload) => (say, yourName) => (window.console.log(`${say}!`, yourName)),
        }
      })
    ],
  }
)
```

## How to Register & Use this
### Basic
```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexKeg, {keg} from './'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
      count: 0,
    },
    mutation: {
      increase(state) {
        state.count += 1
      },
    },
    actions: {
      doSayHi: keg(({justSayHi, commit}, payload) => {
        // custom keg util
        justSayHi('foo')
        // do mutation
        commit('increase')
      }),
    },
    plugins: [
      VuexKeg({
        plugins: {
          justSayHi: (store) => (context, payload) => (yourPrams) => (window.console.log('hi!', yourPrams)),
        }
      })
    ],
  }
)
  // result console 'hi!, foo'
```
