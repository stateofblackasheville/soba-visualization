# State of Black Asheville: Visualization Library

As part of the 2018 Code for America Community Fellowship, we developed a visualization library built on React + ChartJS.

This library helps you visualize data stored in either:
1. A Google Docs Spreadsheet
2. GraphQL Endpoint

Learn more about our GraphQL endpoint [here]. 

# Installation

## Get some data
It will probably be easier to work through this with some data. Make a Google Docs spreadsheet with your information, like:

https://docs.google.com/spreadsheets/d/1_oMYZp3DnkDUzp4qC31q5KisnXU0YnOzTg_gwi2XbME

## Install React
First things first - make sure you have React and React DOM installed on your site

```html
<script type='text/javascript' src='https://unpkg.com/react@16/umd/react.production.min.js?v=1.1.2'></script>
<script type='text/javascript' src='https://unpkg.com/react-dom@16.6.0/umd/react-dom.production.min.js'></script>
```

## Install soba-visualization
Now, make sure you have the soba-visualiztion library acticated on your site - you can use unpkg.com to drop it on the page! 

Note - this also includes some jQuery we use to bring HTML markup into React

```html
<script type='text/javascript' src='https://unpkg.com/soba-visualization@latest/umd/soba-visualization.min.js?v=1.1.2'></script>
<script type='text/javascript' src='https://www.stateofblackasheville.com/wp-content/themes/sage-8.5.4/dist/scripts/visualization.js?v=1.1.2'></script>
```

## Finally, add some visualizations anywhere on the page

```html
<div 
	class='soba-visualization' 
	data-title='Spreadsheet Demo'
	data-spreadsheetId='1_oMYZp3DnkDUzp4qC31q5KisnXU0YnOzTg_gwi2XbME'
	data-charttype='bar'  
/>
```

## That's it! 

# Options

## Common
Used for both Google Spreadsheet and GraphQL Modes

- **title** *(String)* :  
Title of the Chart

- **chartType** *(Array[String])* :  
['Line', 'Bar'] - Which chart types to display. 

- **showChartTypeSelect:** *true/false* 
Whether to show the chart-type select dropdown

- **datasetLabels**: 

- **labelX**: 

- **labelY**: 

- **summaryText**: 

## Google Spreadsheet
- **spreadsheetId:** 
ID of the Google Spreadsheet, from the URL:
**1_oMYZp3DnkDUzp4qC31q5KisnXU0YnOzTg_gwi2XbME**

- **spreadsheetChartColumns:** ['A','B'] Columns to display (defaults to showing all) 

## GraphQL
- **dataset:** 

- **count:**

- **byDate:**

- **groupBy:**

- **filters:**

# Demo
