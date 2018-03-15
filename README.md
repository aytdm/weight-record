# weight-record

This is a example application of Nuxt.js, vue-chartjs, Buefy and ava.

Register your weight, you can see it visually.

## Preview

<p>
    <img valign="top" src="https://raw.githubusercontent.com/aytdm/weight-record/images/ss_total.png" width="200">
    <img valign="top" src="https://raw.githubusercontent.com/aytdm/weight-record/images/ss_jan.png" width="200">
    <img valign="top" src="https://raw.githubusercontent.com/aytdm/weight-record/images/ss_feb.png" width="200">
    <img valign="top" src="https://raw.githubusercontent.com/aytdm/weight-record/images/ss_error.png" width="200">
</p>
<p><img valign="top" src="https://raw.githubusercontent.com/aytdm/weight-record/images/ss_register.png" width="200"></p>

## Workflow

<img src="https://cdn-ak.f.st-hatena.com/images/fotolife/a/aytdm/20180209/20180209152837.png">

If you want to use this, you need to prepare environment of AWS Lambda, Amazon API Gateway and Amazon RDS.

I used RDS MySQL.

## Entity-relationship diagram

<img src="https://raw.githubusercontent.com/aytdm/weight-record/images/erd.png">

## Example of Lambda Function (Nods.js)

* [fetching data from MySQL](https://gist.github.com/aytdm/f73f329fb5e7d0537aac1180f3f4298b)
* [insert data into MySQL](https://gist.github.com/aytdm/51eda9d98304c57f8c5f82d95344dd39)
* [update data on MySQL](https://gist.github.com/aytdm/68f4845288ac6f9cbc0a0f1e628bb764)
