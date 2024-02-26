import { uuid } from './_util';
import { EventEmitter } from './event-emitter';
import { getGlobalObject } from './global';
import type { CrossEvent } from './types';

export class CrossEventSystem {
    static Ebus: EventEmitter;
    private hash: string;
    private parentHash: string;
    private eventHandler: (type: string, e: CrossEvent) => void;
    private onHandler?: (e: CrossEvent) => void;
    constructor() {
        this.hash = uuid();
        this.parentHash = '';
        if (!CrossEventSystem.Ebus) {
            const G = getGlobalObject();
            if (!G.Ebus) {
                G.Ebus = new EventEmitter();
            }
            CrossEventSystem.Ebus = G.Ebus;
        }
        this.eventHandler = (type: string, e: CrossEvent) => {
            if (e.target === this.hash) {
                try {
                    this.onHandler?.(e);
                } catch (error) {
                    console.error(error);
                }
            }
        };
        CrossEventSystem.Ebus.on('CrossEvent', this.eventHandler);
    }

    destroy() {
        CrossEventSystem.Ebus.off('CrossEvent', this.eventHandler);
    }

    emit(name: string, data?: any) {
        CrossEventSystem.Ebus.emit('CrossEvent', {
            from: this.hash,
            target: this.parentHash,
            name,
            data
        });
    }
    on(handler: (e: CrossEvent) => void) {
        this.onHandler = handler;
    }

    getHash() {
        return this.hash;
    }

    setParentHash(val: string) {
        this.parentHash = val;
    }
}
