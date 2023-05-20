import { Component, createEffect } from 'solid-js';
import * as Highcharts from 'highcharts';
import HighchartsTreemap from 'highcharts/modules/treemap';

export type Props = {
    data: any;
    seriesName: string;
    formatFunc: (value: number) => string;
};

const Treemap: Component<Props> = (props) => {
    HighchartsTreemap(Highcharts);

    let el;

    const labelFormat = (x: Highcharts.PointLabelObject) => `<b>${x.point.name}</b><br/>${props.formatFunc(x.point.value)}`;

    createEffect(() =>{
        Highcharts.chart('chart', {
            accessibility: {
                enabled: false,
            },
            title: undefined,
            chart: {
                height: el.parentElement.clientHeight,
                margin: 0,
                backgroundColor: '#333'
            },
            plotOptions: {
                treemap: {
                    events: {
                        setRootNode: function(evt) {
                            if(evt.newRootId === '') {
                                evt.series.options.levels[0].dataLabels.enabled = true;
                                evt.series.options.levels[1].dataLabels.enabled = false;
                            } else {
                                evt.series.options.levels[0].dataLabels.enabled = false;
                                evt.series.options.levels[1].dataLabels.enabled = true;
                            }
                        }
                    },
                    tooltip: {
                        pointFormatter: function () { return `<b>${this.name}</b>: ${props.formatFunc(this.value)}`; }
                    }
                }
            },
            series: [{
                name: props.seriesName,
                type: 'treemap',
                layoutAlgorithm: 'squarified',
                borderWidth: 1,
                borderColor: '#ffffff22',
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'normal',
                        textOutline: 'none',
                    }
                },
                levels: [{
                    level: 1,
                    dataLabels: {
                        enabled: true,
                        align: 'left',
                        verticalAlign: 'top',
                        formatter: function () { return labelFormat(this); },
                    }
                }, {
                    level: 2,
                    dataLabels: {
                        enabled: false,
                        align: 'left',
                        verticalAlign: 'top',
                        formatter: function () { return labelFormat(this); },
                        style: {
                            fontSize: '11px',
                        }
                    }
                }],
                allowTraversingTree: true,
                animationLimit: 1000,
                turboThreshold: 5000,
                data: props.data,
            }]
        });
    });

    return (
        <div id="chart" ref={el} />
    );
}

export default Treemap;
