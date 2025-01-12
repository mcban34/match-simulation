import ReactApexChart from 'react-apexcharts';

const ChampionshipBarChart = ({ teamsAnalysis }) => {
    const truncateTeamName = (name) => {
        return name.length > 10 ? name.substring(0, 10) + '...' : name;
    };

    const chartOptions = {
        series: [{
            name: 'Şampiyonluk Olasılığı (%)',
            data: teamsAnalysis.map(team => parseFloat(team.probability))
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                background: '#1B1B23',
                foreColor: '#999'
            },
            theme: {
                mode: 'dark',
                palette: 'palette1'
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: false,
                    columnWidth: '45%',
                    distributed: true
                }
            },
            colors: ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'],
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val.toFixed(1) + "%"
                },
                style: {
                    fontSize: '10px',
                    colors: ['#fff']
                }
            },
            legend: {
                show: false,
            },
            title: {
                text: 'Şampiyonluk Olasılıkları',
                align: 'center',
                style: {
                    fontSize: '10px',
                    color: '#fff'
                }
            },
            xaxis: {
                categories: teamsAnalysis.map(team => truncateTeamName(team.name)),
                labels: {
                    style: {
                        fontSize: '8px',
                        colors: '#999'
                    },
                    rotate: 0,
                    trim: true,
                    maxHeight: 50,
                    hideOverlappingLabels: true
                }
            },
            yaxis: {
                max: 100,
                title: {
                    text: 'Olasılık (%)',
                    style: {
                        color: '#999'
                    }
                },
                labels: {
                    style: {
                        colors: '#999'
                    }
                }
            },
            grid: {
                borderColor: '#333'
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function (val) {
                        return val.toFixed(1) + '%'
                    }
                },
                x: {
                    formatter: function (val) {
                        return teamsAnalysis[val - 1]?.name || val;
                    }
                }
            }
        }
    };

    return (
        <div className="bg-themeGray rounded-lg shadow p-3">
            <ReactApexChart
                options={chartOptions.options}
                series={chartOptions.series}
                type="bar"
                height={350}
            />
        </div>
    );
};

export default ChampionshipBarChart;