'use strict';

import Waveform from 'gl-waveform'
import FPS from 'fps-indicator'

FPS('bottom-left');

export class TestPlot {
    constructor() {
        this.traces = [];
        this.waveform = new Waveform();
        // register resize callback
        window.onresize = this.resize.bind(this);
        // start rendering
        requestAnimationFrame(this.render.bind(this));
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
            time: 0,
            total: 0,
            // pxStep: 0.01
        }
    }

    render(time) {
        this.traces.forEach(trace => {
            if (trace.total > 0) {
                trace.render()
            }
        });
        requestAnimationFrame(this.render.bind(this));
    }

    addTrace(traces) {
        console.log(traces)
        traces.forEach(t => {
            const config = this.getDefaultTraceConfig(
                this.waveform.canvas,
                this.viewportSize,
                'black',
                [-1200, 1200]);
            this.traces.push(new Waveform(config));
            this.traces[this.traces.length - 1].__buffer = [];
            console.log('Added trace: ', t);
        });
    }

    update(parameters, range) {
        this.traces.forEach((t, index) => {

            if (t.__buffer.length < 20) {
                const parameter = parameters[index];
                const timestamp = parameter.timestamp;
                const value = parameter.value;
                // updated y (amp) if necessary
                if (value < t.amplitude[0]) {
                    t.update({
                        amp: [value, t.amplitude[1]]
                    });
                } else if (value > t.amplitude[1]) {
                    t.update({
                        amp: [t.amplitude[0], value]
                    });
                }
                t.__buffer.push(value);
            } else {
                t.push([t.__buffer]);
                const x_offset = t.total - range;
                console.log(t.total);
                if (x_offset > 0) {
                    console.log('update');
                    t.update({range: [x_offset, t.total]})
                }
                t.__buffer.length = 0;
            }

            
            // // update x (range) if necessary
            // const x_offset = t.total - range;
            // if (x_offset > 0) {
            //     t.update({range: [x_offset, t.total]})
            // }
            // t.push([value]);
            // // t.push([{x: timestamp, y: value}]); ??
        });
    }
}
