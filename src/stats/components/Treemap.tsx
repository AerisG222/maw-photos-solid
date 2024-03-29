import { Component, createEffect } from "solid-js";
import * as Highcharts from "highcharts";
import HighchartsTreemap from "highcharts/modules/treemap";

import { useAppSettingsContext } from '../../contexts/settings/AppSettingsContext';
import { getTheme } from '../../_models/Theme';

type Props = {
    data: any;
    seriesName: string;
    formatFunc: (value: number) => string;
};

const Treemap: Component<Props> = (props) => {
    const[settings] = useAppSettingsContext();
    HighchartsTreemap(Highcharts);

    let el;

    const labelFormat = (x: Highcharts.PointLabelObject) => `<b>${x.point.name}</b><br/>${props.formatFunc(x.point.value)}`;

    createEffect(() =>{
        const themeInfo = getTheme(settings.theme);

        Highcharts.chart("chart", {
            accessibility: {
                enabled: false,
            },
            title: undefined,
            chart: {
                height: el.parentElement.clientHeight,
                margin: 0,
                backgroundColor: themeInfo.def["base-300"],
                style: {
                    "fontFamily": "Nunito Sans,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji"
                }
            },
            navigation: {
                breadcrumbs: {
                    position: {
                        y: -30,
                    },
                    buttonTheme: {
                        style: {
                            "font-weight": 700,
                            color: themeInfo.def["primary"],
                        }
                    }
                }
            },
            plotOptions: {
                treemap: {
                    events: {
                        setRootNode: function(evt) {
                            if(evt.newRootId === "") {
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
                type: "treemap",
                layoutAlgorithm: "squarified",
                borderWidth: 1,
                borderColor: "#ffffff22",
                dataLabels: {
                    enabled: true,
                    style: {
                        fontSize: "14px",
                        fontWeight: "normal",
                        textOutline: "none",
                    }
                },
                levels: [{
                    level: 1,
                    dataLabels: {
                        enabled: true,
                        align: "left",
                        verticalAlign: "top",
                        formatter: function () { return labelFormat(this); },
                    }
                }, {
                    level: 2,
                    dataLabels: {
                        enabled: false,
                        align: "left",
                        verticalAlign: "top",
                        formatter: function () { return labelFormat(this); },
                        style: {
                            fontSize: "11px",
                        }
                    }
                }],
                allowTraversingTree: true,
                animationLimit: 10000,
                turboThreshold: 50000,
                data: props.data,
            }]
        });
    });

    const getStyle = () => {
        const themeInfo = getTheme(settings.theme);

        return `
            .highcharts-button-hover rect
                { fill: ${themeInfo.def["base-200"]} !important; }

            .highcharts-button-hover text
                { fill: ${themeInfo.def["primary"]} !important; }

            .highcharts-button-pressed text
                { fill: ${themeInfo.def["secondary"]} !important; }

            .highcharts-button-normal text,
            .highcharts-button-hover text,
            .highcharts-button-pressed text
                { font-weight: bold !important; }
        `;
    }

    return (
        <>
            <style>
                {getStyle()}
            </style>

            <div id="chart" ref={el} />
        </>
    );
};

export default Treemap;
