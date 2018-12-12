'use strict';

import motorcortex from '@vectioneer/motorcortex-js'
import {TestPlot} from './plot.js'

const motorcortex_types = new motorcortex.MessageTypes();

const msg_loaded = motorcortex_types.load([{
    "proto": "msg/motorcortex.proto",
    "hash": "msg/motorcortex_hash.json"
}]);

const req = new motorcortex.Request(motorcortex_types);
const sub = new motorcortex.Subscribe(req);
const session = new motorcortex.SessionManager(req, sub);

// When messages are a loaded open new session
msg_loaded.then(() => {
    const open_handle = session.open({
        host: 'office.vectioneer.com',
        request_port: 5558,
        subscribe_port: 5557,
        timeout_ms: 1000,
        queue_length: 1000
    }, {
        login: 'russian_hacker',
        password: 'secret_password'
    });

    open_handle.then(msg => {
        console.log('connection ready');
    }).catch(e => {
        console.log('connection failed:' + e);
    });
}).catch((e) => {
    console.log(e);
});

// create plot instance
const plot = new TestPlot();

session.notify(msg => {
    if (session.hasError()) {
        console.error('Session error: ' + motorcortex.SessionState.getInfo(msg.state));
    } else if (session.ready()) {
        // when connection is ready, subscribe
        const sub_handle = sub.subscribe([
                'root/Control_task/actual_cycle_max',
                'root/Logger_task/actual_cycle_max'
            ], 'test', 1);

        sub_handle.then(() => {
            plot.addTrace(sub_handle.layout())
            sub_handle.notify((msg) => {
            });
        }).catch(() => {
            console.log('Failed to subscribe');
        })
    }
});