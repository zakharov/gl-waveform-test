'use strict';

import Waveform from 'gl-waveform'
import FPS from 'fps-indicator'

FPS();

export class TestPlot {
    constructor() {

        this.waveform = new Waveform();
        console.log(this.waveform)
        // start rendering
        requestAnimationFrame(this.render.bind(this));
        this.traces = [];
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
            total: 0
        }
    }

    render(time) {
        this.traces.forEach(trace => {
            trace.render()
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
                [-3000, 3000]);

            this.traces.push(new Waveform(config));
        });
    }

    update(values) {

    }
}