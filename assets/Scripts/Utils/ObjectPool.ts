import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export interface Poolable {
    next: Poolable | null;
}

export class PoolableNode extends Node implements Poolable {
    next: Poolable | null = null;
}

@ccclass('ObjectPool')
export class ObjectPool<T extends PoolableNode> {
    private _pool: T[] = [];
    private _poolSize: number;
    private _firstAvailable: T = null;

    constructor(createFunction: () => T, poolSize: number) {
        this._poolSize = poolSize;
        for (let i = 0; i < this._poolSize; ++i) {
            this._pool.push(createFunction());
        }
        
        this._firstAvailable = this._pool[0];
        for (let i = 0; i < this._poolSize - 1; ++i) {
            this._pool[i].next = this._pool[i + 1];
        }
        this._pool[this._poolSize - 1].next = null;
    }

    get(): T | null {
        if (!this._firstAvailable) {
            console.error('ObjectPool: No available object');
            return null;
        }
        const ret = this._firstAvailable;
        this._firstAvailable = this._firstAvailable.next as T;
        return ret;
    }

    return(obj: T) {
        if (!obj) {
            console.error('ObjectPool: Return object is null');
            return;
        }
        obj.next = this._firstAvailable;
        this._firstAvailable = obj;
    }
};


