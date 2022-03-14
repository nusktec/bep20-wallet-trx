
import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";



class RadialChart extends Component {
    constructor(props) {
        super(props);

        this.state = {

            series: [76, 67, 61, 90],
            options: {
                chart: {
                    height: 300,
                    type: 'radialBar',
                },
                plotOptions: {
                    radialBar: {
                        offsetY: 0,
                        startAngle: 0,
                        endAngle: 270,
                        hollow: {
                            margin: 5,
                            size: '30%',
                            background: 'transparent',
                            image: undefined,
                        },
                        dataLabels: {
                            name: {
                                show: false,
                            },
                            value: {
                                show: false,
                            }
                        }
                    }
                },
                colors: [
                    'rgba(94, 55, 255,1)',
                    'rgba(94, 55, 255,0.7)',
                    'rgba(94, 55, 255,0.3)',
                    'rgba(94, 55, 255,0.1)'
                ],
                labels: ['Bitcoin', 'Litecoin', 'Ripple', 'Dash'],
                legend: {
                    show: false,
                    floating: true,
                    fontSize: '16px',
                    position: 'left',
                    offsetX: 160,
                    offsetY: 15,
                    labels: {
                        useSeriesColors: true,
                    },
                    markers: {
                        size: 0
                    },
                    formatter: function (seriesName, opts) {
                        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
                    },
                    itemMargin: {
                        vertical: 3
                    }
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            show: false
                        }
                    }
                }]
            },


        };
    }



    render() {
        return (


            <ReactApexChart options={this.state.options} series={this.state.series} type="radialBar" height={360} />



        );
    }
}

export default RadialChart;