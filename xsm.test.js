var {reset,setcfg,bindState,get,set,setMany} = require('./xsm');

class T2 {
    constructor() {
        bindState(this, {state: 0})
    }

    forceUpdate() {
        return this.state;
    }

    $forceUpdate() {
        return this.state;
    }
    componentWillUnmount() {
        return 'React';
    }
    destroyed() {
        return 'Vue';
    }
    ngOnDestroy() {
        return 'Angular';
    }
}

class Test {
    constructor(bindings) {
        if( !bindings )
            bindings = {state: 0};
        bindState(this, bindings)
    }

    forceUpdate() {
        return this.state;
    }

    $forceUpdate() {
        return this.state;
    }
    componentWillUnmount() {
        return 'React';
    }
    destroyed() {
        return 'Vue';
    }
    ngOnDestroy() {
        return 'Angular';
    }
}

class T3 {
    constructor() {
        this.$options = {};
        this.$options._componentTag = 'T3';
        bindState(this)
    }
    forceUpdate() {
        return this.state;
    }

    $forceUpdate() {
        return this.state;
    }
    componentWillUnmount() {
        return 'React';
    }
    destroyed() {
        return 'Vue';
    }
    ngOnDestroy() {
        return 'Angular';
    }
}

class T4 {
    constructor() {
        this.$options = {};
        this.$options._componentTag = 'T4';
        bindState(this)
    }
    forceUpdate() {
        return this.state;
    }

    $forceUpdate() {
        return this.state;
    }
    componentWillUnmount() {
        return 'React';
    }
    destroyed() {
        return 'Vue';
    }
    ngOnDestroy() {
        return 'Angular';
    }
}

const bindings = {
    T3: {state: undefined},
    T4: {state: undefined},
};

describe('set and get tests', () => {
    test("setting key val to Object {a: [3,5], b: 'abc'}", () => {
        set('key', {a: [3,5], b: 'abc'})
        expect(get('key')).toStrictEqual({a: [3,5], b: 'abc'})
    })
    test('setting key val to Array [3,5]', () => {
        set('key', [3,5])
        expect(get('key')).toStrictEqual([3,5])
    })
    test('setting key="a.b.c" and val to 5', () => {
        set('a.b.c', 5)
        expect(get('a.b.c')).toBe(5)
    })
    test('setting key val to "string"', () => {
        set('key', "string")
        expect(get('key')).toBe("string")
    })
    test('setting key val to null', () => {
        set('key', null)
        expect(get('key')).toBe(null)
    })
    test('setting key val to 5', () => {
        set('key', 5)
        expect(get('key')).toBe(5)
    })
    test('resetting store', () => {
        reset();
        expect(get('key')).toBe(undefined)
    })
})

describe('bindState', () => {
    beforeEach(() => {
        reset();
    })
    test("binded with React", () => {
        setcfg({ framework: 'React'})
        const tst = new Test();
        expect(get('state')).toStrictEqual(0)
    })
    test("binded with Vue", () => {
        setcfg({framework: 'Vue'})
        const tst = new Test();
        expect(get('state')).toStrictEqual(0)
    })
    test("binded with Angular", () => {
        setcfg({framework: 'Angular'})
        const tst = new Test();
        expect(get('state')).toStrictEqual(0)
    })
})

describe('umountComponent', () => {
    beforeEach(() => {
        set('state', undefined);
    })
    test("React", () => {
        setcfg({framework: 'React'})
        const tst = new Test();
        expect(tst.componentWillUnmount()).toStrictEqual('React')
    })
    test("Vue", () => {
        setcfg({framework: 'Vue'})
        const tst = new Test();
        expect(tst.destroyed()).toStrictEqual('Vue')
    })
    test("Angular", () => {
        setcfg({framework: 'Angular'})
        const tst = new Test();
        expect(tst.ngOnDestroy()).toStrictEqual('Angular')
    })
})

describe('changeState', () => {
    beforeEach(() => {
        set('state', undefined);
    })
    test("React", () => {
        setcfg({framework: 'React'})
        const tst = new Test();
        set('state', 'new')
        expect(tst.forceUpdate()).toStrictEqual('new')
    })
    test("Vue", () => {
        setcfg({framework: 'Vue'})
        const tst = new Test();
        set('state', 'new')
        expect(tst.$forceUpdate()).toStrictEqual('new')
    })
    test("Angular", () => {
        setcfg({framework: 'Angular'})
        const tst = new Test();
        set('state', 'new')
        expect(tst.state).toStrictEqual('new')
    })
})

describe('shareData across Components', () => {
    beforeEach(() => {
        set('state', undefined);
    })
    test("React", () => {
        setcfg({framework: 'React'})
        const tst = new Test();
        const t2 = new T2();
        set('state', 'new')
        expect(tst.forceUpdate()).toStrictEqual('new')
        expect(t2.forceUpdate()).toStrictEqual('new')
    })
    test("Vue", () => {
        setcfg({framework: 'Vue'})
        const tst = new Test();
        const t2 = new T2();
        set('state', 'new')
        expect(tst.$forceUpdate()).toStrictEqual('new')
        expect(t2.$forceUpdate()).toStrictEqual('new')
    })
    test("Angular", () => {
        setcfg({framework: 'Angular'})
        const tst = new Test();
        const t2 = new T2();
        set('state', 'new')
        expect(tst.state).toStrictEqual('new')
        expect(t2.state).toStrictEqual('new')
    })
})

describe('sharedData remains when one Component umounts', () => {
    beforeEach(() => {
        set('state', undefined);
    })
    test("React", () => {
        setcfg({framework: 'React'})
        const tst = new Test();
        const t2 = new T2();
        set('state', 'new')
        tst.componentWillUnmount();
        expect(t2.forceUpdate()).toStrictEqual('new')
        set('state', 'one')
        expect(tst.forceUpdate()).not.toBe('one')
        expect(t2.forceUpdate()).toStrictEqual('one')
    })
    test("Vue", () => {
        setcfg({framework: 'Vue'})
        const tst = new Test();
        const t2 = new T2();
        set('state', 'new')
        tst.destroyed()
        expect(t2.$forceUpdate()).toStrictEqual('new')
        set('state', 'one')
        expect(tst.$forceUpdate()).not.toBe('one')
        expect(t2.$forceUpdate()).toStrictEqual('one')
    })
    test("Angular", () => {
        setcfg({framework: 'Angular'})
        const tst = new Test();
        const t2 = new T2();
        set('state', 'new')
        tst.ngOnDestroy();
        expect(t2.state).toStrictEqual('new')
        set('state', 'one')
        expect(tst.state).not.toBe('one')
        expect(t2.state).toStrictEqual('one')
    })
})

describe('sharedData set by setcfg', () => {
    beforeEach(() => {
        setcfg({bindings});
    })
    test("React", () => {
        setcfg({framework: 'React'})
        const t3 = new T3();
        const t4 = new T4();
        set('state', 'new')
        expect(t3.forceUpdate()).toStrictEqual('new')
        expect(t4.forceUpdate()).toStrictEqual('new')
    })
    test("Vue", () => {
        setcfg({framework: 'Vue'})
        const t3 = new T3();
        const t4 = new T4();

        set('state', 'new')
        expect(t3.$forceUpdate()).toStrictEqual('new')
        expect(t4.$forceUpdate()).toStrictEqual('new')
    })
    test("Angular", () => {
        setcfg({framework: 'Angular'})
        const t3 = new T3();
        const t4 = new T4();
        set('state', 'new')
        expect(t3.state).toStrictEqual('new')
        expect(t4.state).toStrictEqual('new')
    })
})
