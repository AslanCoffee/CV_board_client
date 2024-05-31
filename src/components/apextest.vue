<template>
    <div id="wrapper">
      <div v-for="(chart, index) in charts" :key="index" class="chart-container">
        <apexchart 
          type="line" 
          height="250" 
          :options="getChartOptions(index)" 
          :series="chart.series"
          @mounted="chartMounted(index)"
        ></apexchart>
      </div>
    </div>
  </template>
  
  <script>
  import VueApexCharts from 'vue3-apexcharts';
  import ApexCharts from 'apexcharts'; // Импортируем ApexCharts
  
  export default {
    name: 'ChartComponent',
    props: {
      user: Object,
    },
    components: {
      apexchart: VueApexCharts,
    },
    data() {
      return {
        charts: [
          { series: [] }, // Первый график
          { series: [] }, // Второй график
          { series: [] }, // Третий график
          { series: [] }, // Четвертый график
          { series: [] }, // Пятый график
          // Добавьте столько объектов, сколько нужно графиков
        ],
        sharedOptions: {
          chart: {
            type: 'line',
            height: 250,
            zoom: {
              enabled: true,
              type: 'x',
              autoScaleYaxis: true,
            },
            toolbar: {
              autoSelected: 'zoom',
              tools: {
                pan: true,
                reset: true,
              },
            },
            events: {
              beforeZoom: (chartContext, { xaxis }) => {
                let minX = new Date(xaxis.min).getTime();
                let maxX = new Date(xaxis.max).getTime();
                return {
                  xaxis: {
                    min: minX,
                    max: maxX
                  }
                };
              },
              mouseMove: (event, chartContext, config) => {
                this.syncCharts('mousemove', event);
              },
              mouseLeave: (event, chartContext, config) => {
                this.syncCharts('mouseleave', event);
              },
            }
          },
          xaxis: {
            type: 'datetime',
            labels: {
              datetimeFormatter: {
                year: 'yyyy',
                month: "MMM 'yy",
                day: 'dd MMM',
                hour: 'HH:mm',
              },
              style: {
                colors: '#FFF', // Цвет текста оси X
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
              },
            },
          },
          yaxis: {
            tickAmount: 6,
            labels: {
              formatter: val => parseInt(val),
              style: {
                colors: '#FFF', // Цвет текста оси Y
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
              },
            },
          },
          colors: ['#008FFB'],
          stroke: {
            width: 3,
          },
          tooltip: {
            x: {
              format: 'dd MMM yyyy',
            },
          },
        },
      };
    },
    mounted() {
      this.allFetch();
    },
    watch: {
      user: {
        handler: 'allFetch',
        deep: true,
      },
    },
    methods: {
      getChartOptions(index) {
        return {
          ...this.sharedOptions,
          chart: {
            ...this.sharedOptions.chart,
            id: `chart-${index}`,
          },
        };
      },
      async fetchKeywordCounts() {
        try {
          const data = await this.$store.dispatch('mUsers/userHistoryEdit', { id: this.user.id });
          const seriesData = this.processKeywordData(data);
          this.charts[0].series = [{ name: 'Keywords', data: seriesData }];
        } catch (error) {
          console.error('Ошибка при загрузке данных:', error);
        }
      },
      async fetchOtherCounts(options, graphIndex) {
        try {
          const data = await this.$store.dispatch('mUsers/userHistoryMany', { id: this.user.id, options: options });
          const seriesData = this.processOtherData(data);
          this.charts[graphIndex].series = [{ name: options, data: seriesData }];
        } catch (error) {
          console.error(`Ошибка при загрузке данных для графика ${options}:`, error);
        }
      },
      processKeywordData(data) {
        return Object.keys(data).map(date => {
          const total = Object.values(data[date]).reduce((acc, value) => acc + value, 0);
          return { x: new Date(date).getTime(), y: total };
        });
      },
      processOtherData(data) {
        return Object.keys(data).map(date => {
          return { x: new Date(date).getTime(), y: data[date] };
        });
      },
      allFetch() {
        this.fetchKeywordCounts();
        this.fetchOtherCounts('CREATE', 1);
        this.fetchOtherCounts('GROUP', 2);
        this.fetchOtherCounts('STATUS', 3);
        this.fetchOtherCounts('DOCUMENT', 4);
      },
      syncCharts(eventType, event) {
        for (let i = 0; i < this.charts.length; i++) {
          ApexCharts.exec(`chart-${i}`, 'dispatchEvent', {
            eventType: eventType,
            event: event,
          });
        }
      },
      chartMounted(index) {
        this.$nextTick(() => {
          ApexCharts.exec(`chart-${index}`, 'dispatchEvent', {
            eventType: 'mousemove',
          });
        });
      }
    },
  };
  </script>
  
  <style>
  #wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .chart-container {
    width: 100%;
    margin-bottom: 20px;
  }
  
  .apexcharts-tooltip {
    border-radius: 8px !important;
    background-color: #fff !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
  }
  
  .apexcharts-xaxis-label,
  .apexcharts-yaxis-label {
    font-weight: bold;
  }
  
  .apexcharts-zoom-icon,
  .apexcharts-reset-zoom-icon {
    background: #008FFB !important;
    color: #fff !important;
    border-radius: 50% !important;
  }
  </style>
  