import { Scope } from './Scope';

export class Provider {

    static DIRECTIVE_SUFFIX = 'Directive';
    static CONTROLLER_SUFFIX = 'Controller';

    static _instance: Provider;

    private _providers = {};
    private _cache = { $rootScope: new Scope() };

    static get instance(): Provider {
        if (!Provider._instance) {
            Provider._instance = new Provider();
        }

        return Provider._instance;
    }

    directive(name: string, fn: Function) {
        this._register(name + Provider.DIRECTIVE_SUFFIX, fn);
    }

    controller(name: string, fn: Function) {
        this._register(name + Provider.CONTROLLER_SUFFIX, function() {
            return fn;
        });
    }

    service(name: string, fn: Function) {
        this._register(name, fn);
    }

    get(name: string, locals = {}) {
        if (this._cache[name]) {
            return this._cache[name];
        }
        let provider = this._providers[name];
        if (!provider || typeof provider !== 'function') {
            return null;
        }
        return (this._cache[name] = this.invoke(provider, locals));
    }

    annotate(fn: Function) {
        let res = fn.toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '')
            .match(/\((.*?)\)/);
        if (res && res[1]) {
            return res[1].split(',').map((d) => d.trim());
        }
        return [];
    }

    invoke(fn: Function, locals = {}) {
        let deps = this.annotate(fn).map((s) => locals[s] || this.get(s, locals), this);
        return fn.apply(null, deps);
    }

    private _register(name: string, factory: Function) {
        this._providers[name] = factory;
    }

}
