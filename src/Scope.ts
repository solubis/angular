import _ = require('lodash');

export class Scope {

    static counter: number = 0;

    private $$id: number;
    private $$watchers: any[] = [];
    private $$children: Scope[] = [];
    private $parent: Scope;
    private __proto__: Scope;

    constructor(parent: Scope = null, id: number = 0) {
        this.$parent = parent;
        this.$$id = id;
    }

    $watch(expr, listenerFn = () => { }, valueEq) {
        let watcher = {
            expr: expr,
            listenerFn: listenerFn,
            valueEq: !!valueEq
        };
        this.$$watchers.push(watcher);
    }

    $eval(expr: any, locals?: any) {
        let result;

        if (typeof expr === 'function') {
            result = expr(this, locals);
        } else {
            try {
                with (this) {
                    /* tslint:disable:no-eval */
                    result = eval(expr);
                    /* tslint:enable:no-eval */
                }
            } catch (e) {
                result = undefined;
            }
        }

        return result;

    }

    $apply(expr) {
        try {
            return this.$eval(expr);
        } finally {
            this.$digest();
        }
    }

    $new() {
        let obj = new Scope(this, Scope.counter++);

        obj.__proto__ = this;

        this.$$children.push(obj);

        return obj;
    }

    $destroy() {
        let pc = this.$parent.$$children;
        pc.splice(pc.indexOf(this), 1);
    }

    $digest() {
        let dirty;
        let ttl = 10;

        do {
            dirty = this.$$digestOnce();
            if (dirty && !(ttl--)) {
                throw '10 digest iterations';
            }
        } while (dirty);

        this.$$children.forEach((child) => child.$digest());
    }

    private $$digestOnce() {
        let dirty;

        this.$$watchers.forEach((watcher) => {
            let newValue = this.$eval(watcher.expr);
            let oldValue = watcher.last;

            if (!this.$$areEqual(newValue, oldValue, watcher.valueEq)) {
                watcher.listenerFn(newValue, oldValue, this);
                watcher.last = (watcher.valueEq ? _.cloneDeep(newValue) : newValue);
                dirty = true;
            }
        });

        return dirty;
    }

    private $$areEqual(newValue, oldValue, valueEq) {
        if (valueEq) {
            return _.isEqual(newValue, oldValue);
        } else {
            return newValue === oldValue ||
                (typeof newValue === 'number' && typeof oldValue === 'number' &&
                    isNaN(newValue) && isNaN(oldValue));
        }
    }
}
