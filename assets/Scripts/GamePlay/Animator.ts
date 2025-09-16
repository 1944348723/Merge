import { _decorator, Component, Node } from 'cc';
import State from './States/State';
const { ccclass, property } = _decorator;

@ccclass('Animator')
export class Animator {
    private _states: Map<string, State> = new Map();
    private _state: State = null;

    addState(key: string, state: State) {
        if ('' === key) {
            console.error('Animator: Add state failed, the key of state is empty');
            return;
        }
        if (null == state) {
            console.error('Animator: Add state failed, the target state is null');
            return;
        }
        if (this._states.has(key)) {
            console.error('Animator: Add state failed, the state already exists');
            return;
        }

        this._states.set(key, state);
    }

    deleteState(key: string) {
        if ('' === key) {
            console.error('Animator: Delete state failed, the key of state is empty');
            return;
        }
        this._states.delete(key);
    }

    switchState(key: string) {
        if ('' === key) {
            console.error('Animator: Switch state failed, the key of state is empty');
            return;
        }

        if (!this._states.has(key)) {
            console.error('Animator: Switch state failed, the state does not exist: ' + key);
            return;
        }

        if (this._state && this._state == this._states.get(key)) {
            console.warn('Animator: Switch state failed, already in the state: ' + key);
            return;
        }

        const previousState = this._state;
        if (previousState) {
            previousState.onExit();
        }
        this._state = this._states.get(key);
        this._state.onEnter();
    }

    getCurrentState() {
        return this._state;
    }

    getCurrentStateName(): string {
        for (const [key, state] of this._states) {
            if (state === this._state) {
                return key;
            }
        }
        return '';
    }

    getStates() {
        return this._states;
    }

    onUpdate(dt: number) {
        if (this._state) {
            this._state.onUpdate(dt);
        }
    }
}


