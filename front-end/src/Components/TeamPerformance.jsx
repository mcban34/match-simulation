import ReactApexChart from 'react-apexcharts';

const TeamPerformance = ({ teamsAnalysis }) => {
    const chartOptions = {
        series: teamsAnalysis.map(team => ({
            name: team.name,
            data: [
                parseFloat(team.probability),
                parseFloat(team.recentForm),
                parseFloat(team.goalRatio),
                parseFloat(team.homePerformance),
                parseFloat(team.awayPerformance)
            ]
        })),
        options: {
            chart: {
                type: 'radar',
                height: 400,
                background: '#1B1B23',
                foreColor: '#999',
                toolbar: {
                    show: false
                }
            },
            theme: {
                mode: 'dark',
                palette: 'palette1'
            },
            colors: ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'],
            title: {
                text: 'Takım Performans Analizi',
                align: 'center',
                style: {
                    fontSize: '14px',
                    color: '#fff'
                }
            },
            xaxis: {
                categories: ['Şampiyonluk Şansı', 'Form', 'Gol Gücü', 'İç Saha', 'Deplasman'],
                labels: {
                    style: {
                        colors: ['#999', '#999', '#999', '#999', '#999'],
                        fontSize: '12px'
                    }
                }
            },
            yaxis: {
                max: 100,
                show: true,
                labels: {
                    style: {
                        colors: ['#999']
                    }
                }
            },
            markers: {
                size: 4,
                strokeColors: '#fff',
                strokeWidth: 2,
                hover: {
                    size: 6
                }
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function (val) {
                        return val.toFixed(1) + '%'
                    }
                }
            },
            grid: {
                show: true,
                padding: {
                    top: 0,
                    bottom: 0
                }
            },
            stroke: {
                width: 2
            },
            fill: {
                opacity: 0.2
            },
            legend: {
                show: true,
                position: 'bottom',
                fontFamily: 'system-ui',
                fontSize: '8px',
                horizontalAlign: 'center',
                labels: {
                    colors: '#999'
                },
                markers: {
                    width: 12,
                    height: 12,
                    strokeWidth: 0,
                    radius: 12
                },
                itemMargin: {
                    horizontal: 5
                },
                onItemClick: {
                    toggleDataSeries: true
                },
                onItemHover: {
                    highlightDataSeries: true
                }
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors: '#333',
                        strokeWidth: 1,
                        connectorColors: '#333',
                        fill: {
                            colors: ['#1B1B23']
                        }
                    }
                }
            }
        }
    };

    return (
        <div className="bg-themeGray rounded-lg shadow p-4">
            <ReactApexChart
                options={chartOptions.options}
                series={chartOptions.series}
                type="radar"
                height={400}
            />
        </div>
    );
};

export default TeamPerformance;