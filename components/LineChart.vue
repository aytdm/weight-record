<script>
import {Line} from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    chartLabels: {
      type: Array | Object,
      required: true
    },
    chartData: {
      type: Array | Object,
      required: true
    },
    chartTitle: {
      type: String,
      required: true
    },
    chartCategory: {
      type: String,
      required: true
    }
  },
  mounted () {
    var gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
    gradient.addColorStop(0, 'rgba(32, 156, 238, 0.5)')
    gradient.addColorStop(0.5, 'rgba(32, 156, 238, 0.2)');
    gradient.addColorStop(1, 'rgba(32, 156, 238, 0)');

    var options = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: this.chartTitle
      }
    };

    if (this.chartCategory.length !== 0) {
      options.scales = {
        yAxes: [
          {
            ticks: {
              suggestedMax: 95,
              suggestedMin: 70
            }
          }
        ]
      };
    }

    this.renderChart({
      labels: this.chartLabels,
      datasets: [
        {
          label: 'weight',
          data: this.chartData,
          borderColor: '#209CEE',
          pointBackgroundColor: '#209CEE',
          pointRadius: 1,
          borderWidth: 1,
          pointBorderColor: '#209CEE',
          backgroundColor: gradient
        }
      ]
    },options)
  },
  methods: {
  }
}
</script>