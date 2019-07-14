let _data = {};
let config = {};
let sharedState = {};
let sublist = new Map();
let debug=false;
let trace=false;
let fwsetstate, fwinitstate, fwumount, fwcname;

function initstate(self, key, val) {
    let v = get(key);
    if( v === undefined ) {
        self[key] = val;
        set(key, val);
    } else {
        self[key] = v;
    }
}

function printinfo(self, key=null, val=null) {
    let name
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
            if( debug || trace )
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
            if( debug || trace )
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
                if( debug || trace )
                    printinfo(self, key, val);
        },
        initstate,
        cname: self => self.constructor.name,
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
                sublist.delete(key)
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
    subitem.push({self, cb:(key,val)=>cb(key,val)})
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
    if( debug || trace )
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

function rmStateBinding(self, opt) {
    let map;
    if( opt )
        map  = opt;
    else if( config.bindings )
        map  = config.bindings[fwcname(self)];
    else
        return;
    Object.keys(map).forEach(key => {
        if( debug || trace )
            printinfo(self, key, 'removing key');
        rmsub(self, key);
    });
}

export function bindState(self, opt) {
    let map;
    if( opt )
        map  = opt;
    else if( config.bindings )
        map  = config.bindings[fwcname(self)];
    else
        return;
    let id, statecb;
    let frameworkcb =  fwsetstate(self);
    Object.keys(map).forEach(key => {
        fwinitstate(self, key, map[key]);
        id = addsub(key, frameworkcb, self);
        //ref[key] = id;
    });
    if( config.framework ) {
        let umount = self[fwumount]
        if( umount ) {
            umount = umount.bind(self);
            self[fwumount] = function classDestroy() {
                
                rmStateBinding(self, map);
                return umount();
            };
        } else {
            self[fwumount] = function classDestroy() {
                rmStateBinding(self, map);
            };
        }
    } else {
        console.log('default framework', framework, 'umount', umount, 'self', self)
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
    if( debug )
        printinfo(null, 'sharedState', sharedState);
}

export function setcfg(opt) {
    if( !opt ) return;
    let val;
    Object.keys(opt).forEach(key => {
        val = opt[key];
        config[key] = val;
        
        if( key === 'framework' ) {
            fwinitstate = frameworkcfg[val].initstate;
            fwsetstate = frameworkcfg[val].setstate;
            fwumount = frameworkcfg[val].umount;
            fwcname = frameworkcfg[val].cname;
        } else if( key === 'bindings' ) {
            setSharedState(val)
        } else if( key === 'sharedBindings' ) {
            addSharedState(val)
        } else if( key === 'trace' ) {
            usm.trace(val)
            trace = val;
        } else if( key === 'debug' ) {
            usm.debug(val)
            debug = val;
        } else {
            console.log('not supported option ', key);
        }
    });
}

const usm = {
  setcfg,
  set,
  get,
  reset,
  rmsub,
  addsub,
  bindState,
  debug: val => debug=val,
  trace: val => trace=val,
};

export default usm;
