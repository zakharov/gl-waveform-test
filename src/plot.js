'use strict';

import Waveform from 'gl-waveform'
import FPS from 'fps-indicator'
import raf from 'raf'

FPS('bottom-left')

let acc = []
export class TestPlot {
    constructor() {
        this.firstTimestamp = null;

        this.traces = [];
        this.waveform = new Waveform();
        // register resize callback
        window.onresize = this.resize.bind(this);

        this.render = this.render.bind(this);
        this.render();
    }

    resize(e) {
        const wnd = e.target;
        this.traces.forEach(t => {
            t.update({
                viewport: [0, 0, wnd.innerWidth, wnd.innerHeight]
            });
        });
    }

    getDefaultTraceConfig(canvas, viewport, color, amp) {
        return {
            canvas: canvas,
            viewport: viewport,
            thickness: 1,
            color: color,
            opacity: 1,
            amp: amp,
            time: 0
        }
    }

    render(time) {
        if (this.traces.length) {
        this.traces.forEach(t => t.render())
            }
        raf(this.render);
    }

    addTrace(traces) {
        traces.forEach(t => {
            const config = this.getDefaultTraceConfig(
                this.waveform.canvas,
                this.viewportSize,
                'black',
                [-1200, 1200]);
            this.traces.push(new Waveform(config));
            console.log('Added trace: ', t);
        });
    }

    update(parameters, range) {
        this.traces.forEach((t, index) => {
            const parameter = parameters[index];
            if (!parameter) return
            const timestamp = parameter.timestamp;
            const value = parameter.value;

            if (!t.firstTimestamp) t.firstTimestamp = timestamp

            // handle sample from the past or the future (network failure etc)
            if (t.lastTimestamp > timestamp) {
                console.warn('value from the past')
            }
            else {
                t.push(value);
                if (!index) acc.push(value)
                t.lastTimestamp = timestamp
            }
        });
    }
}
