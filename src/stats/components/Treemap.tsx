import { Component, createEffect, onCleanup } from "solid-js";
// Import the ESM build explicitly, core and modules alike. highcharts 13.0.1 added a
// "module" field, so the bare "highcharts" specifier now resolves to esm/highcharts.js in a
// bundle while "highcharts/modules/*" stay UMD - and those UMD modules compose against a
// `window._Highcharts` global the ESM core never sets, so they blow up on undefined. The
// esm/modules/* variants import the core directly, keeping everything on one instance.
import Highcharts from "highcharts/esm/highcharts.js";
import "highcharts/esm/modules/heatmap.js";
import "highcharts/esm/modules/treemap.js";

interface Props {
    data: { name: string; value: number | undefined }[];
    seriesName: string;
    formatFunc: (value: number) => string;
    onSelectPoint?: (point: Highcharts.Point, event: Highcharts.PointClickEventObject) => void;
}

const Treemap: Component<Props> = props => {
    let el: HTMLDivElement | undefined;
    let chart: Highcharts.Chart | undefined;

    const labelFormat = (x: Highcharts.Point) =>
        `<b>${x.name}</b><br/>${props.formatFunc(x.value!)}`;

    const createChart = () =>
        Highcharts.chart(el!, {
            accessibility: {
                enabled: false
            },
            title: undefined,
            // https://www.learnui.design/tools/data-color-picker.html
            // https://medialab.github.io/iwanthue/
            colors: [
                "#ab5e85",
                "#51c3e0",
                "#7b285c",
                "#9ec4e8",
                "#483a8b",
                "#d9c6dd",
                "#8d4692",
                "#6d94a9",
                "#da72ad",
                "#2d5d70",
                "#e0a3de",
                "#41465b",
                "#a988da",
                "#6d4858",
                "#6193d1",
                "#59486f",
                "#636ec2",
                "#676a84",
                "#3f4e85",
                "#a58cae"
            ],
            chart: {
                height: el?.parentElement?.clientHeight,
                margin: 0,
                reflow: true,
                style: {
                    fontFamily:
                        "Nunito Sans,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji"
                }
            },
            plotOptions: {
                series: {
                    cursor: props.onSelectPoint ? "pointer" : undefined
                },
                treemap: {
                    tooltip: {
                        pointFormatter: function () {
                            return `<b>${this.name}</b>: ${props.formatFunc(this.value!)}`;
                        }
                    }
                }
            },
            series: [
                {
                    name: props.seriesName,
                    type: "treemap",
                    layoutAlgorithm: "squarified",
                    colorByPoint: true,
                    point: {
                        events: {
                            click: function (evt: Highcharts.PointClickEventObject) {
                                if (props.onSelectPoint) {
                                    props.onSelectPoint(this, evt);
                                }
                            },
                            mouseOver: function () {
                                const newColor = Highcharts.color(this.color ?? "#000000")
                                    .brighten(0.2)
                                    .get();
                                this.update({ color: newColor }, true);
                            },
                            mouseOut: function () {
                                const newColor = Highcharts.color(this.color ?? "#000000")
                                    .brighten(-0.2)
                                    .get();
                                this.update({ color: newColor }, false);
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontSize: "12px",
                            fontWeight: "normal",
                            textOutline: "none"
                        }
                    },
                    levels: [
                        {
                            level: 1,
                            borderWidth: 1,
                            borderColor: "#ffffff22",
                            dataLabels: {
                                enabled: true,
                                align: "left",
                                verticalAlign: "top",
                                formatter: function () {
                                    return labelFormat(this);
                                }
                            }
                        }
                    ],
                    data: props.data
                }
            ]
        });

    // build the chart once, then update the series data in place on changes
    // rather than recreating (and leaking) a whole chart each time
    createEffect(() => {
        const data = props.data;

        if (chart) {
            chart.series[0]?.setData(data, true);
        } else {
            chart = createChart();
        }
    });

    onCleanup(() => {
        chart?.destroy();
        chart = undefined;
    });

    return <div ref={el} />;
};

export default Treemap;
