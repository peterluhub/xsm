<h1 align="center">Welcome to XSM 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/xsm">
    <img src="https://img.shields.io/npm/v/xsm.svg" alt="npm version">
  </a>
  <a href="https://packagephobia.now.sh/result?p=xsm">
    <img src="https://packagephobia.now.sh/badge?p=xsm" alt="install size">
  </a>
  <a href="https://github.com/peterluhub/usm/blob/master/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
</p>

> XSM - State Management made eXtraordinarily simple and effective for Angular, React, and Vue

### 🏠 [Homepage](https://github.com/peterluhub/usm)

### Demos
[Angular](https://codesandbox.io/s/angular-xsm-demo-1j9j0)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [React](https://codesandbox.io/s/xsm-react-3v3fg)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [Vue](https://codesandbox.io/s/vuexsmdemo-2152h)

### Highlights

  - Incrediblly easy to use, developer friedly and minimum learning curve
  - Reactive, nonintrusive
  - Automatic re-rendering and state data removal, efficient memory management
  - Small size for fast download
  - Super simple async handling
  - Same API for Angular, React, and Vue 

### How-to's

##### Install
```sh
npm install xsm
```

##### Usage in Brief

- Tell XSM which framework to use

  ```javascript
  setcfg({'framework': 'React'})
  ```

- Bind the component state to XSM

  ```javascript
  bindState(this, {key: val, key2: val2, ...})
  ```

- When you are ready to update the state(sync or async)

  ```javascript
  set('key', val)
  ```

Component will be re-rendered automatically.

##### Debug and Trace

Both debug and trace can be selectively turn on and off at any point

  ```javascript
  setcfg({debug: true})  //debug on
  setcfg({debug: false}) //debug off
  setcfg({trace: true})  //trace on
  setcfg({trace: false}) //trace off
  ```

### Why XSM?

To answer why, let's start by answering another question, what is XSM?  It consists of a global store and the machinary to re-render the component when the state is updated.  The store is just a javascript object with key and value pairs.  By binding the instance reference, *this*, to the store, each component can react to the changes of the store whether it is re-render or unmount.  It is really *this* simple, no need to use HOC, provider, reducer, decorator, observer, action, dispatcher, etc.  Hence, all the three most popular framewokrs work the same way in XSM and that's why we can keep the code size very small and support the three frameworks without framework specific modules.  On top of that, XSM is performant according to Stefan Krause's [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark).  It outperforms Redux and MobX with React and Vuex with Vue.

### API

**bindState** - binds a component's *this* and optionally state to the store.  The state is an object with key and value pairs.
```javascript
 bindState(this, state)
```

**get** - gets the value of a given key from the store.
```javascript
 get(key)
```

**set** - updates the store with the value for a given key and re-renders the component(s).
```javascript
 set(key, value)
```

**setMany** - updates the store for the given key and value pairs and re-renders the component(s).
```javascript
 setMany({key1: value1, key2, value2, ...})
```

**setcfg** - It takes an object as an argument and is used for telling XSM which framework you app uses and optionally for binding the state of all components of the app to the store as well as turning the debug and trace on and off.
```javascript
 setcfg(
    {framework: frameworkValue, 
     bindings: {ComponentName: {key1: value1,...},
             ComponentName1: {key1: value1,...},
            ...},
     debug: true/false,
     trace: true/false
    }
 )
```
- frameworkValue: Angular, React, or Vue
- ComponentName: It is the class name for React and Angular.  It is the registered component name for Vue
  bindings: It serves two purposes.  One is to bind the state of each component to the store and you don't need to binState in this case.  Another is to tell XSM that which piece of data is shared by more than one components and the shared data will not be deleted even if the the components are unmounted.

## User Guide

To use XSM to manage you app state, here are the steps to follow:

- Use *setcfg* to bind XSM to a framework.  Currently, XSM supports Angular, Reatc, and Vue.
- Bind the component state to the store with *bindState* to enble the auto re-rendering when the state is updated.  The value of each bound key can be accessed in the component with *this.keyname*.  For example, you want to bind a key and value pair of {title: 'XSM'} to a component,
- For Angular and React, it is done in the constructor.
  ```javascript
  constructor() {
      super()
      bindState(this, {title: 'XSM'})
  }
  ```
- For Vue, it can be done in the *created* life cycle hook.
  ```javascript
  created() {
      bindState(this, {title: 'XSM'})
  }
  ```

- When it's time to update the state, use *set* when and where your state data is available whether it's in the await function, promise.then callback, or just plain old callback. XSM does not get in the way.

- Besides the demos, you can find more code examples in [this repository](https://github.com/peterluhub/xsm-code-examples).  A realworld example(implementing the [Realworld Example Specs](https://github.com/gothinkster/realworld) using XSM with React is forthcoming.  So, stay tuned.

## Author

👤 **Peter Lu**

* Github: [@peterluhub](https://github.com/peterluhub)

### Show your support

Give a ⭐️ if this project helped you !

### 📝 License

Copyright © 2019 [Peter Lu](https://github.com/peterluhub).<br />
This project is [MIT](https://github.com/peterluhub/usm/blob/master/LICENSE) licensed.

***
_This README was originally generated by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
