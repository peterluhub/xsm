let _data = {};
let config = {};
let sharedState = {};
let sublist = new Map();
let debug=false;
let trace=false;

let fwsetstate, fwinitstate, fwumount, fwcname, thisless, debugTrace;

function initstate(self, key, val) {
    let v = get(key);
    if( v === undefined ) {
        self[key] = val;
        set(key, val);
    } else {
        self[key] = v;
    }
}

export function setTrace(val) {
    trace = val;
    debugTrace = debug || trace;
}

export function setDebug(val) {
    debug = val;
    debugTrace = debug || trace;
}

function printinfo(self, key=null, val=null) {
    let name;
    if( fwcname && self ) 
        name = fwcname(self);
    else
        name = 'none';
    let printfunc = console.log;
    if( trace ) {
        printfunc = console.trace;
    }
    printfunc('cname', name, 'key', key, 'val', val, '\n store', {..._data});
}

const frameworkcfg = {
    React: {
        umount: 'componentWillUnmount',
        setstate: self => (key, val) => {
            self[key] = val;
            if( debugTrace )
                printinfo(self, key, val);
            self.forceUpdate();
            return self;
        },
        initstate,
        cname: self => self.constructor.name,
    },
    Vue: {
        umount: 'destroyed',
        setstate: self => (key, val) => {
            self[key] = val;
            if( debugTrace )
                printinfo(self, key, val);
            return self.$forceUpdate();
        },
        initstate,
        cname: self => self.$options._componentTag
    },
    Angular: {
        umount: 'ngOnDestroy',
        setstate: self => (key, val) => {
                self[key] = val;
                if( debugTrace )
                    printinfo(self, key, val);
        },
        initstate,
        cname: self => self.constructor.name,
    },
    Svelte: {
        umount: null,
        setstate: self => (key, val) => {
                self[key](val);
                if( debugTrace )
                    printinfo(self, key, val);
        },
        initstate: () => null,
        cname: self => '',
    },
};

function rmkey(key) {
    _data[key] = undefined;
}

function rmsub(self, key) {
    const cblist = sublist.get(key);
    for(let i=0; i<cblist.length; i++) {
        if( cblist[i].self === self ) {
            cblist.splice(i, 1)
            if( cblist.length === 0 ) {
                sublist.delete(key);
                if( !sharedState[key] )
                    rmkey(key);
            }
            return;
        }
    }
}

function addsub(key, cb, self) {
    if( !sublist.has(key) ) sublist.set(key, []);
    let subitem = sublist.get(key);
    subitem.push({self, cb: (key,val) => cb(key,val)})
    return subitem.length-1;
}

export function set(key, val) {
    let cblst = sublist.get(key);
    if(  cblst ) {
        if( cblst.length == 1 ) {
            cblst[0].cb(key, val);
        } else {
            for(let i=0; i<cblst.length; i++) {
                cblst[i].cb(key, val);
            }
        }
    }
    _data[key] = val;
    if( (debugTrace) && !cblst )
        printinfo(null, key, val);
}

export function setMany(kv) {
    Object.keys(kv).forEach(key => {
        set(key, kv[key])
    });
}

export function get(key) {
    return _data[key];
}

export function unbindState(bindings) {
    return rmStateBinding(bindings);
}

function rmStateBinding(self, opt) {
    let map;
    
    if( thisless ) {
        if( !self && opt ) {
            map = opt;
            self = opt;
        } else if( self && arguments.length === 1 ) {
            map = self;
        } else {
            console.log('no binding');
            return;
        }
    } else {
        if( opt )
            map  = opt;
        else if( config.bindings )
            map  = config.bindings[fwcname(self)];
        else
            return;
    }
    Object.keys(map).forEach(key => {
        if( debugTrace )
            printinfo('removing key', key, 'from', self);
        rmsub(self, key);
    });
}

export function bindState(self, opt) {
    let map;
    if( thisless ) {
        if( !self && opt ) {
            map = opt;
            self = opt;
        } else if( arguments.length === 1 ) {
            map = self;
        } else {
            console.trace('no binding self=', self, 'opt=', opt, 'arguments.length', arguments.length);
            return;
        }
    } else {
        if( opt )
            map  = opt;
        else if( config.bindings )
            map  = config.bindings[fwcname(self)];
        else
            return;
    }
    let id, statecb;
    let frameworkcb =  fwsetstate(self);
    Object.keys(map).forEach(key => {
        fwinitstate(self, key, map[key]);
        id = addsub(key, frameworkcb, self);
        //ref[key] = id;
    });
    if( config.framework ) {
        let umount = self[fwumount];
        if( umount ) {
            umount = umount.bind(self);
            self[fwumount] = function classDestroy() {
                
                rmStateBinding(self, map);
                return umount();
            };
        } else {
            if( !thisless ) {
                self[fwumount] = function classDestroy() {
                    rmStateBinding(self, map);
                };
            }
        }
    } else {
        console.log('default framework is none');
    }
}

export function reset(key, opt) {
    if(key) {
      delete _data[key];
    } else {
      _data = {};
    }
}

function addSharedState(bindings) {
    Object.keys(bindings).forEach(key => {
        sharedState[key] = true;
    });
}

function setSharedState(bindings) {
    let keylist = {};
    Object.keys(bindings).forEach(key => {
      const component = bindings[key];
      Object.keys(component).forEach(state => {
        if( keylist[state])
            keylist[state] += 1;
        else
            keylist[state]= 1;
      });
    });
    Object.keys(keylist).forEach(key => {
        if( keylist[key]>1 ) {
            sharedState[key] = true;
        }
    });
    if( debugTrace )
        printinfo(null, 'sharedState', sharedState);
}

export function setup(opt) {
    if( !opt ) return;
    let val;
    Object.keys(opt).forEach(key => {
        val = opt[key];
        config[key] = val;
        
        if( key === 'framework' ) {
            if( opt[key] === 'Svelte' )
                thisless = true;
            else
                thisless = false;
            fwinitstate = frameworkcfg[val].initstate;
            fwsetstate = frameworkcfg[val].setstate;
            fwumount = frameworkcfg[val].umount;
            fwcname = frameworkcfg[val].cname;
        } else if( key === 'bindings' ) {
            setSharedState(val)
        } else if( key === 'sharedBindings' ) {
            addSharedState(val)
        } else if( key === 'trace' ) {
            setTrace(val)
            trace = val;
        } else if( key === 'debug' ) {
            setDebug(val)
            debug = val;
        } else {
            console.log('not supported option ', key);
        }
    });
}

export const setcfg = setup;

const usm = {
  setup,
  setcfg,
  set,
  get,
  reset,
  rmsub,
  addsub,
  bindState,
  setDebug, 
  setTrace,
};

export default usm;
