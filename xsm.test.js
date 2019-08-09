var {reset,setup,setcfg,bindState,unbindState,get,set,setMany} = require('./xsm');

class T2 {
    constructor(bindings) {
        if( !bindings ) {
            bindState(this, {state: 0});
        } else {
            if( bindings != 1 ) {
                bindState(bindings);
            } else {
                const self = this;
                const binding = {'newval': val => self.newval = val};
                bindState(binding);
            }
        }
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
    onMount() {
        return this.newval;
    }
    onDestroy(bindings) {
        unbindState(bindings);
    }
}

class Test {
    constructor(bindings) {
        if( !bindings ) {
            bindings = {state: 0};
            bindState(this, bindings);
        } else {
            if( bindings != 1 ) {
                bindState(bindings);
            } else {
                const self = this;
                this.binding = {'newval': val => self.newval = val};
                
                bindState(this.binding);
            }
        }
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
    onMount() {
        return this.newval;
    }
    onDestroy(bindings) {
        if( bindings )
            unbindState(bindings);
        else
            unbindState(this.binding);
    }
}

class T3 {
    constructor(shouldBind) {
        this.$options = {};
        this.$options._componentTag = 'T3';
        if( !shouldBind) {
            bindState(this)
        }
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
    constructor(shouldBind) {
        this.$options = {};
        this.$options._componentTag = 'T4';
        if( !shouldBind ) {
            bindState(this);
        }
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
        set('key', {a: [3,5], b: 'abc'});
        expect(get('key')).toStrictEqual({a: [3,5], b: 'abc'});
    })
    test('setting key val to Array [3,5]', () => {
        set('key', [3,5]);
        expect(get('key')).toStrictEqual([3,5]);
    })
    test('setting key="a.b.c" and val to 5', () => {
        set('a.b.c', 5);
        expect(get('a.b.c')).toBe(5);
    })
    test('setting key val to "string"', () => {
        set('key', "string");
        expect(get('key')).toBe("string");
    })
    test('setting key val to null', () => {
        set('key', null);
        expect(get('key')).toBe(null);
    })
    test('setting key val to 5', () => {
        set('key', 5);
        expect(get('key')).toBe(5);
    })
    test('resetting store', () => {
        reset();
        expect(get('key')).toBe(undefined);
    })
})

describe('bindState', () => {
    beforeEach(() => {
        reset();
    })
    test("binded with React", () => {
        setcfg({ framework: 'React'});
        const tst = new Test();
        expect(get('state')).toStrictEqual(0);
    })
    test("binded with Vue", () => {
        setup({framework: 'Vue'});
        const tst = new Test();
        expect(get('state')).toStrictEqual(0);
    })
    test("binded with Angular", () => {
        setcfg({framework: 'Angular'});
        const tst = new Test();
        expect(get('state')).toStrictEqual(0);
    })
    test("binded with Svelte", () => {
        setcfg({framework: 'Svelte'});
        let state;
        const tst = new Test({state: val => state = val});
        set('state', 0);
        expect(state).toStrictEqual(0);
    })
})

describe('umountComponent', () => {
    beforeEach(() => {
        set('state', undefined);
    })
    test("React", () => {
        setcfg({framework: 'React'})
        const tst = new Test();
        expect(tst.componentWillUnmount()).toStrictEqual('React');
    })
    test("Vue", () => {
        setcfg({framework: 'Vue'})
        const tst = new Test();
        expect(tst.destroyed()).toStrictEqual('Vue');
    })
    test("Angular", () => {
        setcfg({framework: 'Angular'});
        const tst = new Test();
        expect(tst.ngOnDestroy()).toStrictEqual('Angular');
    })
    test("Svelte", () => {
        setcfg({framework: 'Svelte'});
        let newval;
        const binding = {'newval': val => newval = val};
        const tst = new Test(binding);
        set('newval', 1);
        tst.onDestroy(binding);
        expect(get('newval')).toStrictEqual(undefined);
    })
})

describe('changeState', () => {
    beforeEach(() => {
        set('state', undefined);
    })
    test("React", () => {
        setcfg({framework: 'React'});
        const tst = new Test();
        set('state', 'new')
        expect(tst.forceUpdate()).toStrictEqual('new');
    })
    test("Vue", () => {
        setcfg({framework: 'Vue'});
        const tst = new Test();
        set('state', 'new');
        expect(tst.$forceUpdate()).toStrictEqual('new');
    })
    test("Angular", () => {
        setcfg({framework: 'Angular'});
        const tst = new Test();
        set('state', 'new');
        expect(tst.state).toStrictEqual('new');
    })
    test("Svelte", () => {
        setcfg({framework: 'Svelte'});
        let newval;
        const binding = {'newval': val => newval = val};
        const tst = new Test(binding);
        bindState(binding);
        set('newval', 1);
        expect(newval).toStrictEqual(1);
    })
})

describe('shareData across Components', () => {
    beforeEach(() => {
        set('state', undefined);
    })
    test("React", () => {
        setcfg({framework: 'React'});
        const tst = new Test();
        const t2 = new T2();
        set('state', 'new');
        expect(tst.forceUpdate()).toStrictEqual('new');
        expect(t2.forceUpdate()).toStrictEqual('new');
    })
    test("Vue", () => {
        setcfg({framework: 'Vue'});
        const tst = new Test();
        const t2 = new T2();
        set('state', 'new');
        expect(tst.$forceUpdate()).toStrictEqual('new');
        expect(t2.$forceUpdate()).toStrictEqual('new');
    })
    test("Angular", () => {
        setcfg({framework: 'Angular'});
        const tst = new Test();
        const t2 = new T2();
        set('state', 'new')
        expect(tst.state).toStrictEqual('new');
        expect(t2.state).toStrictEqual('new');
    })
    test("Svelte", () => {
        setcfg({framework: 'Svelte'});
        const tst = new Test(1);
        const t2 = new T2(1);
        set('newval', 1);
        expect(tst.onMount()).toStrictEqual(1);
        expect(t2.onMount()).toStrictEqual(1);
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
        set('state', 'new');
        tst.componentWillUnmount();
        expect(t2.forceUpdate()).toStrictEqual('new');
        set('state', 'one');
        expect(tst.forceUpdate()).not.toBe('one');
        expect(t2.forceUpdate()).toStrictEqual('one');
    })
    test("Vue", () => {
        setcfg({framework: 'Vue'})
        const tst = new Test();
        const t2 = new T2();
        set('state', 'new');
        tst.destroyed();
        expect(t2.$forceUpdate()).toStrictEqual('new');
        set('state', 'one');
        expect(tst.$forceUpdate()).not.toBe('one');
        expect(t2.$forceUpdate()).toStrictEqual('one');
    })
    test("Angular", () => {
        setcfg({framework: 'Angular'})
        const tst = new Test();
        const t2 = new T2();
        set('state', 'new');
        tst.ngOnDestroy();
        expect(t2.state).toStrictEqual('new');
        set('state', 'one');
        expect(tst.state).not.toBe('one');
        expect(t2.state).toStrictEqual('one');
    })
    test("Svelte", () => {
        setcfg({framework: 'Svelte'});
        const tst = new Test(1);
        const t2 = new T2(1);
        set('newval', 1);
        tst.onDestroy();
        expect(t2.onMount()).toStrictEqual(1);
        set('newval', 2);
        expect(t2.onMount()).toStrictEqual(2);
        expect(tst.onMount()).not.toBe(2);
    })
})

describe('sharedData set by setcfg', () => {
    beforeEach(() => {
        setcfg({bindings});
    })
    test("React", () => {
        setcfg({framework: 'React'});
        const t3 = new T3();
        const t4 = new T4();
        set('state', 'new')
        expect(t3.forceUpdate()).toStrictEqual('new');
        expect(t4.forceUpdate()).toStrictEqual('new');
    })
    test("Vue", () => {
        setcfg({framework: 'Vue'});
        const t3 = new T3();
        const t4 = new T4();

        set('state', 'new');
        expect(t3.$forceUpdate()).toStrictEqual('new');
        expect(t4.$forceUpdate()).toStrictEqual('new');
    })
    test("Angular", () => {
        setcfg({framework: 'Angular'});
        const t3 = new T3();
        const t4 = new T4();
        set('state', 'new');
        expect(t3.state).toStrictEqual('new');
        expect(t4.state).toStrictEqual('new');
    })
    test("Svelte N/A", () => {
    })
})
/*
*/
