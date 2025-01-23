export class Base {
    private _caches: Map<string, Map<string, any>> = new Map();

    public getCache(methodName: string): Map<string, any> {
        if (!this._caches.has(methodName)) {
            this._caches.set(methodName, new Map<string, any>());
        }
        return this._caches.get(methodName)!;
    }

    clearCache(methodName?: string) {
        if (methodName) {
            if (this._caches.has(methodName)) {
                this._caches.get(methodName)!.clear();
                console.log(`Cache for method ${methodName} cleared.`);
            }
        } else {
            this._caches.forEach((cache, key) => {
                cache.clear();
                console.log(`Cache for method ${key} cleared.`);
            });
        }
    }

}
