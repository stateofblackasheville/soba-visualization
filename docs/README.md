# State of Black Asheville: Visualization Library

As part of the 2018 Code for America Community Fellowship, we developed a visualization library built on React + ChartJS.

This library helps you visualize data stored in either:
1. A Google Docs Spreadsheet
2. GraphQL Endpoint

Learn more about our GraphQL endpoint [here]. 

# Installation

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

- title={this.props.title}
- chartType={this.props.chartType}
- dataset={this.props.dataset}
- count={this.props.count}
- byDate={this.props.byDate}
- groupBy={this.props.groupBy}
- filters={this.props.filters}
- spreadsheetId={this.props.spreadsheetId}
- spreadsheetChartColumns={this.props.spreadsheetChartColumns}
- showChartTypeSelect={this.props.showChartTypeSelect}
- datasetLabels={this.props.datasetLabels}
- labelX={this.props.labelX}
- labelY={this.props.labelY}
- summaryText={this.props.summaryText}
```

## Demo