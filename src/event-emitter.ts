import type { AnyFunction, EventHandler } from './types';
export class EventEmitter {
    private events: {
        [prop: string]: EventHandler[];
    } = {};

    constructor() {
        ['on', 'off', 'emit'].forEach((prop) => {
            this[prop] = this[prop].bind(this);
        });
    }

    once(type: string, _handler: EventHandler) {
        const handler = (...args: Parameters<EventHandler>) => {
            _handler(...args);
            this.off(type, handler);
        };
        this.on(type, handler);
    }

    destroy() {
        this.emit('destroy');
        // eslint-disable-next-line guard-for-in
        for (const prop in this.events) {
            delete this.events[prop];
        }
    }

    on(type: string, handler: EventHandler) {
        if (!this.events[type]) {
            this.events[type] = [];
        }
        if (this.events[type].indexOf(handler) === -1) {
            this.events[type].push(handler);
        }
    }

    off(type: string, handler?: EventHandler) {
        if (this.events[type]) {
            if (handler) {
                const index = this.events[type].indexOf(handler);
                if (index !== -1) {
                    this.events[type].splice(index, 1);
                }
            } else {
                delete this.events[type];
            }
        }
    }

    emit(type: string, data?: any) {
        const currentIsFireHandlers: AnyFunction[] = [];
        const fire = (handleType = type) => {
            let needReload;
            if (this.events[type]) {
                const list = this.events[type];
                for (let i = 0, len = list.length; i < len; i++) {
                    if (!this.events[type]) {
                        break;
                    }
                    if (this.events[type] && i in list && list[i]) {
                        const handler = list[i];
                        if (currentIsFireHandlers.indexOf(handler) !== -1) {
                            continue;
                        }
                        const nextHandler = list[i + 1];
                        currentIsFireHandlers.push(handler);
                        handler(handleType, data);
                        if (!list[i] || list[i] !== handler || !list[i + 1] || list[i + 1] !== nextHandler) {
                            needReload = true;
                            break;
                        }
                    }
                }
            }
            needReload && fire();
        };
        if (type !== 'all') {
            fire();
            const old = type;
            // eslint-disable-next-line no-param-reassign
            type = 'all';
            fire(old);
        }
    }
}
