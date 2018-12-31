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

const frequiency_divider = 1; // Frequiency divider of the input data (1KHz / frequiency_divider)
const range_msec = 50000; // Range of the X axis in milliseconds

// When messages are a loaded open new session
msg_loaded.then(() => {
    const open_handle = session.open({
        host: 'office.vectioneer.com',
        request_port: 5558,
        subscribe_port: 5557,
        timeout_ms: 2000,
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
                'root/Logger_task/actual_cycle_max',
                'root/Control/signalGenerator/output'
            ], 'test', frequiency_divider);

        sub_handle.then(() => {
            plot.addTrace(sub_handle.layout())
            sub_handle.notify((msg) => {
                // updating the plot
                plot.update(msg, range_msec / frequiency_divider);
            });
        }).catch(() => {
            console.log('Failed to subscribe');
        })
    }
});
