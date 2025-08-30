import { Component, createEffect } from "solid-js";
import * as Highcharts from "highcharts";
import "highcharts/modules/heatmap.js";
import "highcharts/modules/treemap";

type Props = {
    data: any;
    seriesName: string;
    formatFunc: (value: number) => string;
    onSelectPoint?: (point: Highcharts.Point, event: Highcharts.PointClickEventObject) => void;
};

const Treemap: Component<Props> = props => {
    const themeBase200 = "";
    const themeBase300 = "";
    const themePrimary = "";
    const themeSecondary = "";

    let el;

    const labelFormat = (x: Highcharts.Point) =>
        `<b>${x.name}</b><br/>${props.formatFunc(x.value!)}`;

    createEffect(() => {
        Highcharts.chart("chart", {
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
                height: el.parentElement.clientHeight,
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
                                const newColor = Highcharts.color(this.color).brighten(0.2).get();
                                this.update({ color: newColor }, true);
                            },
                            mouseOut: function () {
                                const newColor = Highcharts.color(this.color).brighten(-0.2).get();
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
    });

    return <div id="chart" ref={el} />;
};

export default Treemap;
