# State of Black Asheville: Visualization Library

As part of the 2018 Code for America Community Fellowship, we developed a visualization library built on React + ChartJS.

This library helps you visualize data stored in either:
1. A Google Docs Spreadsheet
2. GraphQL Endpoint

Learn more about our GraphQL endpoint [here]. 

```
<script type='text/javascript' src='https://unpkg.com/react@16/umd/react.production.min.js?v=1.1.2'></script>
<script type='text/javascript' src='https://unpkg.com/react-dom@16.6.0/umd/react-dom.production.min.js'></script>
<script type='text/javascript' src='https://unpkg.com/soba-visualization@latest/umd/soba-visualization.min.js?v=1.1.2'></script>
<script type='text/javascript' src='https://www.stateofblackasheville.com/wp-content/themes/sage-8.5.4/dist/scripts/visualization.js?v=1.1.2'></script>

```

```
<div 
  class='soba-visualization' 
  data-title='Traffic Stops by Race'
  data-charttype='bar'  
  data-dataset='coa_apd_traffic_stop_name_data_table' 
  data-count='traffic_stop_id' 
  data-bydate='["month"]' 
  data-groupby='["name_race"]'
  data-filters='{"op": "AND", "groups":[{"filters":[ { "key": "year", "dateField": "date_occurred", "op": "=", "value": "2018"}]},{"op":"OR","filters":[ { "key": "name_race", "op": "=", "value": "W"},{ "key": "name_race", "op": "=", "value": "B"}]}]}'
  data-datasetLabels='{"W" : "White", "B": "Black"}'
  data-labelY='Number of stops'
></div>
```

## Demo