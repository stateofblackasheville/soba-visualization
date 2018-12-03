import React, { Component } from 'react';
// import { XYFrame } from 'semiotic'
import {
  Line, Bar, Doughnut, Pie,
} from 'react-chartjs-2';

import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';


// import { drive_v3 } from 'googleapis';
// import { GoogleSheets } from 'google-drive-sheets';
// import { GoogleSpreadsheets } from 'google-spreadsheets';


import SobaTable from './SobaTable';

import '../css/SobaVisualization.css';

const reactStringReplace = require('react-string-replace')


const API_KEY = 'AIzaSyC7rROXbT3W8IP4gs0oMtDGxumkMF4CFXo';

var alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

// PRC TEMP

const query = `query generic_stats($dataset: String!, $fields: [GenericStatsAggregateField], $groupBy: [GenericStatsGroupBy], $filters: GenericStatsFilterGroup) {
  generic_stats(dataset: $dataset, fields: $fields, groupBy: $groupBy, filters: $filters) {
    groupTitle
    groupCategory
    fields {
      column
      aggregateFunction
      value
    }
    subitems {
      groupTitle
      groupCategory
      fields {
        column
        aggregateFunction
        value
      }
      subitems {
        groupTitle
        groupCategory
        fields {
          column
          aggregateFunction
          value
        }
        subitems {
          groupTitle
          groupCategory
          fields {
            column
            aggregateFunction
            value
          }
          subitems {
            groupTitle
            groupCategory
            fields {
              column
              aggregateFunction
              value
            }
            subitems {
              groupTitle
              groupCategory
             fields {
                column
                aggregateFunction
                value
              }
            }
          }
        }
      }
    }
  }
}`;

const chartColors = ['rgba(27,158,119, 0.8)', 'rgba(217,95,2, 0.8)', 'rgb(117,112,179)', 'rgb(231,41,138)', 'rgb(102,166,30)', 'rgb(230,171,2)'];

class SobaVisualization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: '',
      groupByText: '["offense_group_level", "offense_group_short_description"]',
      byDateText: '["year"]',
      groupBy: ['offense_group_level', 'offense_group_short_description'],
      byDate: [],
      count: 'incident_id',
      dateField: 'date_occurred',
      filters: '',
      items: [],
      errors: [],
      chartDatasets: [],
      chartLabels: [],
      chartType: 'line',
      dataMode: 'graphql',
      spreadsheetID: false,
      spreadsheetRange: "A:Z",
      showChartTypeSelect: true,
      gapiReady: false,
      datasetLabels: false,
      labelX: false,
      labelY: false,
      summaryText: false,
      activeRowIndex: 10,
    };

    const {
      count, dataset, byDate, chartType, groupBy, spreadsheetId, spreadsheetRange, spreadsheetChartColumns,
      showChartTypeSelect, filters,
      datasetLabels, labelX, labelY, summaryText, activeRowIndex,
    } = props;

    this.state.count = count;
    this.state.dataset = dataset;
    this.state.byDate = byDate;
    this.state.byDateText = byDate;
    this.state.chartType = chartType;
    this.state.groupBy = groupBy;
    this.state.groupByText = groupBy;
    this.state.spreadsheetID = spreadsheetId;
    this.state.spreadsheetRange = spreadsheetRange;
    this.state.filters = filters;
    this.state.datasetLabels = datasetLabels;
    this.state.labelX = labelX;
    this.state.labelY = labelY;
    this.state.spreadsheetChartColumns = spreadsheetChartColumns;
    this.state.summaryText = summaryText;
    this.state.activeRowIndex = activeRowIndex;


    if (typeof showChartTypeSelect !== typeof undefined) {
      this.state.showChartTypeSelect = (showChartTypeSelect == true);
    }

    if (spreadsheetId) {
      this.state.dataMode = 'google';
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // PRC - Clean this up!
  loadGoogleAPI() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/client.js';

    const obj = this;

    script.onload = () => {
      gapi.load('client', () => {
        gapi.client.setApiKey(API_KEY);
        gapi.client.load('sheets', 'v4', () => {
          // console.log("GOOGLE LOADED", this, this.state.gapiReady, this.state.dataMode);

          obj.getData();
          obj.setState({ gapiReady: true });
        });
      });
    };

    document.body.appendChild(script);
  }

  componentDidMount() {
    this.getData();
    this.loadGoogleAPI();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { byDateText, groupByText } = this.state;

    // console.log('update', prevState.byDateText, this.state.byDateText)
    if (prevState.byDateText !== byDateText) {
      this.getData();
    }

    if (prevState.groupByText !== groupByText) {
      this.getData();
    }
  }

  getData() {
    const { dataMode } = this.state;

    if (dataMode === 'google') {
      if (typeof gapi === typeof undefined) {
        console.log('not ready');
        return;
      }

      // console.log('gapi', gapi);

      const {  spreadsheetID } = this.state;
      let {  spreadsheetRange } = this.state;
      // ID of the Google Spreadsheet
      // const spreadsheetID = '1oyMRNYXrTCBLXh0166zN432k7Pg7TIvu5FrEa8znjQ4';
      const url = 'https://spreadsheets.google.com/feeds/list/' + spreadsheetID + '/od6/public/values?alt=json';

      if(! spreadsheetRange){
        spreadsheetRange = "A:Z";
      }
      const params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: spreadsheetID,  // TODO: Update placeholder value.

        // The A1 notation of the values to retrieve.
        range: spreadsheetRange,  // TODO: Update placeholder value.
      };

      var request = gapi.client.sheets.spreadsheets.values.get(params);
      request.then((response) => {
        // TODO: Change code below to process the `response` object:
        console.log('data coming back', response.result);

        if (response.result) {
          const chartData = this.processGoogleSheetForChartFromAPI(response.result.values);
          this.setState({
            chartDatasets: chartData[0],
            chartLabels: chartData[1],
          });
          this.setState({
            items: chartData[2],
            errors: false,
            loadingChart: false,
          });
        } else {
          this.setState({
            errors: 'Google Sheet Error',
            loadingChart: false,
            items: [],
          });
        }
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });

      this.setState({
        loadingChart: true,
      });

      return true;
    } 
      const {
        dataset, count, dateField, byDateText, groupByText, filters
      } = this.state;

      // const dataset = this.state.dataset;
      let byDate = false;

      if (byDateText) {
        byDate = JSON.parse(byDateText); //['year'];
      }

      let groupByOld = false;
      if ( groupByText ) {
        groupByOld = JSON.parse(groupByText);// ['name_race'];
      }

      const fields = [{column: count}];

      const groupBy = [];

      if(byDate.length){
        groupBy.push({column: byDate[0], dateField: dateField, sortDirection: 'ASC'});
      }

      if(groupByOld){
        groupByOld.map((row) => {
          groupBy.push({column: row});
        });        
      }

      console.log('patrick123', byDate, dateField, groupBy);

      const inputVariables = {
        dataset, fields, groupBy, filters,
      };


      const bodyStringArgs = {
        query,
        variables: inputVariables,
      };

      const bodyString = JSON.stringify(bodyStringArgs);

      console.log('input', inputVariables);
      console.log(bodyString);

      this.setState({
        loadingChart: true,
      });

      // eslint-disable-next-line
      // fetch('http://localhost:8080/graphql', {
      fetch('https://data-api1.ashevillenc.gov/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // eslint-disable-next-line
          'Accept': 'application/json',
        },
        body: bodyString,
      })
        .then(r => r.json())
        .then((data) => {
          if (data.data.generic_stats) {
            const chartData = this.processGraphQLForChart(data.data.generic_stats);
            this.setState({
              chartDatasets: chartData[0],
              chartLabels: chartData[1],
            });
            this.setState({
              items: data.data.generic_stats,
              errors: false,
              loadingChart: false,
            });
          } else {
            console.log(data.errors, data);
            this.setState({
              errors: data.errors[0].message,
              loadingChart: false,
              items: [],
            });
          }
        });
    


  }

  handleInputChange(event) {
    const { target } = event;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    console.log('input change', name, value, target, event);
    this.setState({
      [name]: value,
    });
  }

  processGoogleSheetForChartFromAPI(data) {
    console.log('data', data);

    const chartLabels = [];
    const chartDatasets = [];

    // First row is headers
    let firstRow = data.shift();

    const yearLabel = firstRow.shift();

    if (this.state.spreadsheetChartColumns) {
      this.state.spreadsheetChartColumns = this.state.spreadsheetChartColumns.map(row => alphabet.indexOf(row) - 1);
    }

    if (this.state.spreadsheetChartColumns) {
      firstRow = firstRow.filter(
        (value, index) => this.state.spreadsheetChartColumns.indexOf(index) !== -1,
      );
    }

    firstRow.forEach((value, index) => {
      const dataset = {};
      dataset.label = value;
      dataset.coordinates = [];
      dataset.data = [];
      dataset.backgroundColor = chartColors[chartDatasets.length];
      dataset.borderColor = chartColors[chartDatasets.length];
      dataset.fill = false;
      // dataset.borderDash = [1,1];


      chartDatasets.push(dataset);
    });

    console.log(firstRow);
    console.log(chartDatasets);

    console.log(this);
    const tableData = [];

    data.forEach((value_array, columnIndex) => {
      const tableRow = {};

      const yearTitle = value_array.shift();

      chartLabels.push(yearTitle);
      tableRow.groupTitle = yearTitle;
      tableRow.groupCategory = yearLabel;
      tableRow.count = '';
      tableRow.subitems = [];

      if (this.state.spreadsheetChartColumns) {
        value_array = value_array.filter((value, index) => this.state.spreadsheetChartColumns.indexOf(index) !== -1);
      }

      value_array.forEach((value, dataSetIndex) => {
        // Cleanup values and parse
        value = parseFloat(value.replace(',', ''));

        chartDatasets[dataSetIndex].data[columnIndex] = value;

        tableRow.subitems[dataSetIndex] = {
          groupTitle: chartDatasets[dataSetIndex].label, groupCategory: 'category', count: value, subitems: [],
        };
      });

      tableData.push(tableRow);
    });

    // console.log('labels', chartLabels);
    // console.log('data', chartDatasets);
    // console.log('table', tableData);

    if (!this.state.activeRowIndex) {
      this.state.activeRowIndex = data.length - 1;
    }
    if (data.length) {
      this.setState({ activeRow: data[this.state.activeRowIndex] });
      this.setState({ activeRowData: data });
      this.setState({ chartLabels });
    } else {
      this.setState({ activeRow: false });
      this.setState({ activeRowData: false });
      this.setState({ chartLabels: false });

    }

    console.log('active row', this.state.activeRow);

    return [chartDatasets, chartLabels, tableData];
  }

  processGoogleSheetForChart(data) {
    console.log('data', data);
    const chartLabels = [];

    console.log(this);

    const chartDatasets = [];
    const chartDatasetsLookup = {}; // subitem_label => idnex
    const chartLabelLookup = {}; // key => index

    const tableData = [];


    data.forEach((row) => {
      let activeYear = false;
      const tableRow = {};

      Object.keys(row).forEach((index) => {
        // console.log('test', index);

        if (index.indexOf('gsx$') === 0) {
          const key = index.replace('gsx$', '');
          const value = row[index].$t;
          // console.log('val', value);

          if (key === 'year') {
            if (chartLabels.indexOf(key) === -1) {
              chartLabelLookup[value] = chartLabels.length;
              chartLabels.push(value);
              activeYear = value;
              tableRow.groupTitle = value;
              tableRow.groupCategory = 'Year';
              tableRow.count = '';
              tableRow.subitems = [];
            }
          } else {
            const lookupKey = key;

            if (typeof chartDatasetsLookup[lookupKey] === typeof undefined) {
              chartDatasetsLookup[lookupKey] = chartDatasets.length;

              const dataset = {};
              dataset.label = lookupKey;
              dataset.coordinates = [];
              dataset.data = [];
              dataset.backgroundColor = chartColors[chartDatasets.length];
              dataset.borderColor = chartColors[chartDatasets.length];
              dataset.fill = false;
              // dataset.borderDash = [1,1];
              chartDatasets.push(dataset);
            }

            const targetIndex = chartDatasetsLookup[lookupKey];
            const valueIndex = chartLabelLookup[activeYear];

            tableRow.subitems[targetIndex] = {
              groupTitle: key, groupCategory: 'category', count: value, subitems: [],
            };

            // chartDatasets[targetIndex].coordinates[valueIndex] = {
            //   count: row2.count, year: row.groupTitle,
            // };

            // console.log(lookupKey, valueIndex, chartDatasets, value);

            chartDatasets[targetIndex].data[valueIndex] = value;
          }
        }
      });
      tableData.push(tableRow);
    });

    // console.log('labels', chartLabels);
    // console.log('data', chartDatasets);
    // console.log('table', tableData);

    return [chartDatasets, chartLabels, tableData];
  }

  // eslint-disable-next-line
  processGraphQLForChart(data) {
    const chartLabels = [];

    data.forEach((row) => {
      chartLabels.push(row.groupTitle);
    });

    const chartDatasets = [];
    const chartDatasetsLookup = {}; // subitem_label => idnex

    data.forEach((row, valueIndex) => {
      row.subitems.forEach((row2) => {
        const lookupKey = row2.groupTitle;

        if (typeof chartDatasetsLookup[lookupKey] === typeof undefined) {
          chartDatasetsLookup[lookupKey] = chartDatasets.length;

          let datasetLabel = false;
          if (this.state.datasetLabels 
              && typeof this.state.datasetLabels[row2.groupTitle.trim()] !== typeof undefined) {
            datasetLabel = this.state.datasetLabels[row2.groupTitle.trim()];
          } else {
            datasetLabel = row2.groupTitle;
          }

          const dataset = {};
          dataset.label = datasetLabel;
          dataset.coordinates = [];
          dataset.data = [];
          dataset.backgroundColor = chartColors[chartDatasets.length];
          dataset.borderColor = chartColors[chartDatasets.length];
          dataset.fill = false;
          // dataset.borderDash = [1,1];

          chartDatasets.push(dataset);
        }

        const targetIndex = chartDatasetsLookup[lookupKey];

        chartDatasets[targetIndex].coordinates[valueIndex] = {
          count: row2.fields[0].value, year: row.groupTitle,
        };

        console.log(row2.fields);
        chartDatasets[targetIndex].data[valueIndex] = row2.fields[0].value;
      });
    });

    console.log('data', chartDatasets);

    return [chartDatasets, chartLabels];
  }

  render() {
    // const frameProps = {
    //   title: "Chart",
    //   size: [800,400],
    //   lines: [{ label: "Queens Park Rangers", coordinates: this.state.chartDatasets }],
    //   xAccessor: "grouptitle",
    //   yAccessor: "count",
    //   lineStyle: { stroke: "blue" },
    //   hoverAnnotation: true,
    //   margin: {top: 50, left: 50, bottom: 50, right: 50},
    //   axes: [
    //     { key: 'yAxis', orient: 'left', className: 'yscale', name: 'CountAxis' },
    //     { key: 'xAxis', orient: 'bottom', className: 'xscale',
    //        name: 'TimeAxis', tickValues : this.state.chartLabels }
    //   ],
    //   hoverAnnotation : true,
    // };

    // frameProps.lines = this.state.lines;

    // <XYFrame
    //       {...frameProps}
    //       tooltipContent={d =>
    //      <div className="tooltip-content" >
    //        <p>{d.x} : {d.y}</p>
    //     </div>}
    //       />

    const {
      chartType, chartLabels, chartDatasets, loadingChart, items, groupByText, byDateText, count,
      dateField, errors, dataMode, showChartTypeSelect, spreadsheetID, spreadsheetRange
    } = this.state;

    const { title, dataset } = this.props;


    const testData = {
      labels: chartLabels,
      datasets: chartDatasets,
    };

    const formatLabel = function (str, maxwidth) {
      let sections = [];
      let words = str.split(' ');
      let temp = '';

      words.forEach(function(item, index){
            if(temp.length > 0)
            {
                var concat = temp + ' ' + item;

                if(concat.length > maxwidth){
                    sections.push(temp);
                    temp = "";
                }
                else{
                    if(index == (words.length-1))
                    {
                        sections.push(concat);
                        return;
                    }
                    
                        temp = concat;
                        return;
                    
                }
            }

            if(index == (words.length-1))
            {
                sections.push(item);
                return;
            }

            if(item.length < maxwidth) {
                temp = item;
            }
            else {
                sections.push(item);
            }

        });

      return sections;
    };

    const chartOptions = {
      tooltips: {
        mode: 'label',
        callbacks: {
          label: function (tooltipItem, data) {
            console.log(data, tooltipItem);

            var dataset = data.datasets[tooltipItem.datasetIndex];
            var total = data.datasets.reduce((previousValue, currentValue, currentIndex, array) => {

            console.log(previousValue.data[tooltipItem.index], currentValue.data[tooltipItem.index]);
            return parseInt(previousValue.data[tooltipItem.index]) + parseInt(currentValue.data[tooltipItem.index]);

          });

            console.log(total);
            var currentValue = dataset.data[tooltipItem.index];
            var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
            return `${dataset.label.trim()  }: ${  tooltipItem.yLabel  } (${  percentage  }%)`;
          },
        },
      },
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          ticks: {
            callback: function(value) {
                  if(value.length > 10){
                    var test=  formatLabel(value, 20);
                    return test;
                    // return value.substr(0, 10) + "...";//truncate
                  }
                  
                    return value;
                  
                },
          },
        }],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
            stacked: false,
          },
        ],
      },
    };

    let byDate = false;
    if (this.state.byDateText) {
      byDate = JSON.parse(this.state.byDateText);
    }

    if (byDate && byDate.length) {
      chartOptions.scales.xAxes[0].scaleLabel = { display: true, labelString: JSON.parse(this.state.byDateText)[0] };
    }

    if (this.state.labelY) {
      chartOptions.scales.yAxes[0].scaleLabel = { display: true, labelString: this.state.labelY };
    }

    let chart = <Bar data={testData} options={chartOptions} />;

    if (chartType === 'line') {
      chartOptions.scales.yAxes[0].stacked = false;
      chart = <Line data={testData} options={chartOptions} />;
    } else if (chartType === 'doughnut') {
      chart = <Doughnut data={testData} options={chartOptions} />;
    } else if (chartType === 'pie') {
      chart = <Pie data={testData} options={chartOptions} />;
    }

    if (loadingChart) {
      chart = <div className="loading-container"><h2>Loading...</h2></div>;
    }

    let table = <SobaTable items={items} />;

    if (loadingChart) {
      table = <div className="loading-container"><h2>Loading...</h2></div>;
    }

    let dateRangeFilter = false;

    if (dataMode === 'graphql') {
      dateRangeFilter = (
        <select
          name="byDateText"
          value={byDateText}
          onChange={this.handleInputChange}
        >
          <option value='["year"]'>Year</option>
          <option value='["month"]'>Month</option>
          <option value='["week"]'>Week</option>
          <option value='["day"]'>Day of Month</option>
          <option value='["dow"]'>Day of Week</option>
        </select>
      );
    }

    let settings = false;
    let settingsTab = false;
    let settingsPanel = false;
    if (false && dataMode === 'graphql') {
      settingsTab = <Tab>Settings</Tab>;
      settings = (
        <div className="inputs">
          <div>
            <label>Dataset:</label>
            <input
              name="dataset"
              type="text"
              value={dataset}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Count Field:</label>
            <input
              name="count"
              type="text"
              value={count}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Date Field:</label>
            <input
              name="dateField"
              type="text"
              value={dateField}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Group By:</label>
            <input
              name="groupByText"
              type="text"
              value={groupByText}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <label>Date Field:</label>
            <input
              name="byDateText"
              type="text"
              value={byDateText}
              onChange={this.handleInputChange}
            />
          </div>
        </div>
      );

      settingsPanel = <TabPanel>{settings}</TabPanel>;
    }

    let chartTypeSelect = false;

    if (showChartTypeSelect) {
      chartTypeSelect = (
        <select
          name="chartType"
          value={chartType}
          onChange={this.handleInputChange}
        >
          <option value="line">Line</option>
          <option value="bar">Bar</option>
        </select>
      );
    }

    let summaryPanel = false;
    let summaryTab = false;

    const summaryTextOutput = [];
    if (this.state.summaryText) {
      const summaryTextHTML = this.state.summaryText;

      if (
        this.state.activeRowIndex && typeof this.state.activeRowData !== typeof undefined
        && typeof this.state.activeRowData[this.state.activeRowIndex] !== typeof undefined) {
        const activeRow = this.state.activeRowData[this.state.activeRowIndex];

        const labelValue = this.state.chartLabels[this.state.activeRowIndex];

        if (summaryTextHTML.length) {
          summaryTextHTML.forEach((summaryTextHTMLElm, index) => {
            summaryTextHTMLElm = reactStringReplace(summaryTextHTMLElm, /\(([^)]+)\)/g,
              (match) => {
                let replaceValue;

                if (match.toLowerCase() == 'a') {
                  replaceValue = labelValue;
                } else {
                  const matchIndex = alphabet.indexOf(match.toLowerCase()) - 1;
                  replaceValue = activeRow[matchIndex];
                }
                return (<span>{replaceValue}</span>);
              });
            summaryTextOutput[index] = <div>{summaryTextHTMLElm}</div>;
          });
        }
      }

      summaryTab = <Tab>Summary</Tab>;

      if (this.state.activeRowData) {
        const optionRows = [];

        this.state.chartLabels.forEach((row, index) => {
          optionRows.push(<option value={index}>{row}</option>);
        });
        summaryPanel = (
<div>
            <select
              name="activeRowIndex"
              value={this.state.activeRowIndex}
              onChange={this.handleInputChange}
            >
              {optionRows}
            </select>
            <div className='summary-text'>
              { summaryTextOutput }
            </div>
          </div>
);
      }
    }


    const pStyle = {
      float: 'right',
      display: 'block',
    };

    // Data Tab / Panel
    let dataTab = false;
    let dataPanel = false;

    if (dataMode === 'google') {
      dataTab = <Tab>Data</Tab>;
      dataPanel = (
        <TabPanel className="spredsheet-source">
          <p>
            This visualization is powered by a Google Spreadsheet.
            You can help us keep these resources up to data by adding additional
            information to the spreadsheet below.
          </p>
          <p>
            Just request&nbsp;
            <strong>Edit Access</strong>
            , or contact us via&nbsp;
            <a href="#intercom">
              chat
            </a>
            , and you can edit!
          </p>
          <a href={`https://docs.google.com/spreadsheets/d/${  spreadsheetID}`}>
            Google Spreadsheet
          </a>
        </TabPanel>);
    }

    return (
      <div className="soba-visualization">
        <h3>{ title }</h3>
        <div>
          {summaryPanel}
        </div>
        <Tabs>
          <div className="user-controls" style={pStyle}>
            {chartTypeSelect}
            {dateRangeFilter}
          </div>
          <TabList>
            <Tab>Chart</Tab>
            <Tab>Table</Tab>
            {settingsTab}
            {dataTab}
          </TabList>
          <TabPanel>
            {chart}
          </TabPanel>
          <TabPanel>
            { table }
          </TabPanel>
          {settingsPanel}
          {dataPanel}
        </Tabs>
        { errors }
      </div>
    );
  }
}

export default SobaVisualization;
