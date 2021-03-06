<template>
  <section>
    <div class="container section">
      <div class="content">
        <div>
          <h1 class="title">Weight Loss Progress</h1>
        </div>

        <div v-if="loaded">
          <div class="select is-info">
            <select v-model="selectedCategory" @change="fetchData">
              <option value="">Total</option>
              <option
                v-for="category in categories"
                :value="category"
                :key="category"
              >
                {{ category }}
              </option>
            </select>
          </div>
          &nbsp;
          <a class="button is-info is-outlined" @click="showModal=true">Register/Update</a>
          <div class="modal is-active" v-show="showModal">
            <div class="modal-background" />
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Register / Update</p>
                <button class="delete" aria-label="close" @click="initialize" />
              </header>
              <section class="modal-card-body">
                <!-- Content ... -->
                <b-field label="Date">
                  <b-datepicker placeholder="Please click." v-model="date" />
                </b-field>

                <div class="field">
                  <label class="label">Weight</label>
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      placeholder="70.5"
                      v-model="weight"
                      v-bind:class="{'is-danger': missingWeight && attemptSubmit}"
                    >
                  </div>
                  <p
                    v-show="attemptSubmit"
                    class="help"
                    v-bind:class="{'is-danger': missingWeight && attemptSubmit}"
                  >
                    Input your weight.
                  </p>
                </div>
              </section>
              <footer class="modal-card-foot">
                <button class="button is-success" @click="update">Register / Update</button>
                <button class="button" @click="initialize">Cancel</button>
              </footer>
            </div>
          </div>

          <div style="margin-top: 20px;">
            <article class="message is-success">
              <div class="message-body" v-if="selectedCategory === ''">
                <p v-if="0 < incrementalDifference">
                  You've lost <strong>{{ incrementalDifference }}</strong> kilos.
                </p>
                <p v-else-if="absoluteValue === 0">
                  Your weight have been stable since measuring.
                </p>
                <p v-else>
                  You've gained <strong>{{ absoluteValue }}</strong> kilos.
                </p>
              </div>
              <div class="message-body" v-else>
                <p v-if="absoluteValue === 0">
                  Your weight was stable in {{ selectedCategory }}.
                </p>
                <p v-else-if="0 < incrementalDifference">
                  You lost <strong>{{ incrementalDifference }}</strong> kilos in {{ selectedCategory }}.
                  <span v-if="2.0 <= incrementalDifference">
                    <br>
                    Congratulation!! XD
                  </span>
                </p>
                <p v-else>
                  You gained <strong>{{ absoluteValue }}</strong> kilos in {{ selectedCategory }}.
                </p>
              </div>
            </article>
          </div>
        </div>

        <div v-else-if="hasError">
          <article class="message is-danger">
            <div class="message-body">
              <p>
                An error occured, please reload the page.
              </p>
            </div>
          </article>
        </div>
      </div>

      <line-chart
        v-if="loaded"
        :chart-title="title"
        :chart-data="weights"
        :chart-labels="labels"
        :chart-category="selectedCategory"
      />
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import {Line} from 'vue-chartjs'
import moment from 'moment'
import LineChart from '~/components/LineChart.vue'
const BASE_URL = process.env.AWS_API_URL;
export default {
  components: {
    LineChart
  },
  created() {
    this.fetchWeight()
  },
  data() {
    return {
      loaded: false,
      hasError: false,
      showModal: false,
      attemptSubmit: false,
      weight: '',
      date: new Date(),
      title: '',
      selectedCategory: '',
      categories: [],
      weights: [],
      labels: []
    }
  },
  computed: {
    incrementalDifference: function() {
      var weightList = this.weights;
      var firstWeight = parseFloat(weightList[0]);
      var lastWeight = parseFloat(weightList[weightList.length -1]);
      var difference = firstWeight - lastWeight;
      return difference.toFixed(2);
    },
    absoluteValue: function() {
      return Math.abs(this.incrementalDifference)
    },
    missingWeight: function () {
      return (
        this.isNumeric(this.weight) === false ||  this.number < 1
      )
    }
  },
  methods: {
    initialize: function() {
      this.showModal= false;
      this.attemptSubmit = false;
      this.missingWeight = false;
      this.weight = '';
      this.date = new Date();
    },
    fetchData() {
      this.makeTitle();
      this.fetchWeight(this.selectedCategory)
    },
    fetchWeight (category) {
      this.loaded = false;
      var labelList = new Array();
      var weightList = new Array();
      var categoryList = new Array();

      axios.get(BASE_URL, {
        headers: {'Content-Type': 'application/json'},
        params: {
          category: this.getQueryString(category)
        }
      })
      .then(response => {
        if (response.data.errorMessage !== undefined) {
          this.hasError = true;
          console.error("error");
          return;
        }
        this.hasError = false;
        var data = response.data;
        for (var value in data) {
          var date = data[value].date;
          var cutomised = this.changeDateFormat(date);
          labelList.push(cutomised);
          weightList.push(data[value].weight);
          categoryList.push(data[value].category);
        }
        this.weights = weightList;
        this.labels = labelList;
        if (this.categories.length === 0) {
          this.makeCategory(categoryList);
        }
        this.loaded = true;
      })
      .catch(e => {
        console.error('error:', e)
      })
    },
    update: function() {
      this.attemptSubmit = true;
      if (this.missingName || this.missingWeight) {
        return event.preventDefault();
      }

      var date = this.changeDateFormat(this.date);
      var labels = this.labels;

      if (labels.indexOf(date) !== -1) {
        this.updateWeight(date);
      } else {
        this.registerWeight(date);
      }
    },
    updateWeight (date) {
      this.loaded = false;

      axios.put(BASE_URL, {
          headers: {'Content-Type': 'application/json'}
        }, {
          date: date,
          weight: this.weight
        }
      )
      .then(response => {
        if (response.data.errorMessage !== undefined) {
          this.hasError = true;
          console.error("error");
          this.initialize();
          return;
        }
        this.hasError = false;
        this.initialize();
        this.fetchWeight();
      })
      .catch(e => {
        console.error('error:', e)
      })
    },
    registerWeight (date) {
      this.loaded = false;
      var category = this.getCategory();

      axios.post(BASE_URL, {
          date: date,
          weight: this.weight,
          category: category
        }, {
          headers: {'Content-Type': 'application/json'}
        }
      )
      .then(response => {
        if (response.data.errorMessage !== undefined) {
          this.hasError = true;
          console.error("error");
          this.initialize();
          return;
        }
        this.hasError = false;
        this.initialize();
        this.fetchWeight();
      })
      .catch(e => {
        console.error('error:', e);
      })
    },
    changeDateFormat: function(date) {
      return moment(new Date(date)).format("YYYY/MM/DD");
    },
    getCategory: function() {
      var selectedDate =  new Date(this.date);
      var year = selectedDate.getFullYear();
      var month = selectedDate.getMonth();
      var en = moment().locale('en');
      return en.localeData().months(moment([year, month]));
    },
    makeCategory(category) {
      this.categories = category.filter(function (x, i, self) {
        return self.indexOf(x) === i;
      });
    },
    makeTitle() {
      if (this.selectedCategory.length === 0) {
        this.title = "per Day";
      } else {
          this.title = "in " + this.selectedCategory;
      }
    },
    getQueryString(category) {
      var queryString = '';
      if (category && category.length !== 0) {
        queryString = category;
      }
      return queryString;
    },
    isNumeric: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
  }
}
</script>
