import React, {Component} from 'react'
// import {render} from 'react-dom'
import ReactDOM from 'react-dom';

import Example from '../../src'


class Demo extends Component {


  render() {
    const filterObj = {
      "op": "AND",
      "groups":
  			[
  				// {
  				// 	"filters":[ 
  				// 		{ 
  				// 			"key": "year", "dateField": "date_occurred", 
	  			// 			"op": "!=", "value": "2018"
	  			// 		}
	  			// 		]
  				// },
  				{
  					"op":"OR",
  					"filters": [ 
  						{"key": "name_race", "op": "=", "value": "W"},
						{ "key": "name_race", "op": "=", "value": "B"}
  					]
  				}
			]
  	};

    const filterObj2 = {
      "op": "AND",
      "groups":
        [
          // {
          //   "filters":[ 
          //     { 
          //       "key": "year", "dateField": "date_occurred", 
          //       "op": "=", "value": "2018"
          //     }
          //     ]
          // },
          {
            "op":"OR",
            "filters": [ 
              {"key": "name_race", "op": "=", "value": "W"},
            { "key": "name_race", "op": "=", "value": "B"}
            ]
          },
          {
            "filters": [ 
              {"key": "search_initiated", "op": "=", "value": "1"}
            ]
          }
      ]
    };

    const filterObj3 = {
      "op": "AND",
      "groups":
        [
          {
            "op":"OR",
            "filters": [ 
              {"key": "name_race", "op": "=", "value": "W"},
            { "key": "name_race", "op": "=", "value": "B"}
            ]
          },
          {
            "op":"AND",
            "filters": [ 
              {"key": "search_initiated", "op": "=", "value": "1"},
              {"key": "t_search_consent", "op": "=", "value": "1"},
              { 
                "key": "year", "dateField": "date_occurred", 
                "op": "=", "value": "2018"
              }
            ]
          }
      ]
    };

    let datasetLabels = {'W' : 'White', 'B': 'Black'};

    return <div>
      <h1>soba-visualization Demo</h1>
      <div className='soba-visualization-demo'>
        <div className='soba-visualization'>
            <Example 
            title='APD Traffic Searches by Race, 2018'
            chartType='line'  
            dataset='coa_apd_traffic_stop_name_data_table' 
            count='traffic_stop_id' 
            byDate='["month"]' 
            groupBy='["name_race", "no_contraband_found"]'
            filters={filterObj2}
            datasetLabels={datasetLabels}
            labelX="Month"
            labelY="Number of searches"
            />
            <Example 
              title='Spreadsheet Demo'
            spreadsheetId='1_oMYZp3DnkDUzp4qC31q5KisnXU0YnOzTg_gwi2XbME'
            chartType='bar'  
            showChartTypeSelect='1'
            // spreadsheetChartColumns={['s','t']}
            summaryText={['In Grades 3 through 8 in Asheville City Schools, (B)% of black students, (C)% of white students, and XX% of Hispanic students reached proficient or advanced reading levels. [ (A) school year ]']}
            />
            <Example 
                title='APD Traffic Stops by Race, 2018'
            chartType='line'  
            dataset='coa_apd_traffic_stop_name_data_table' 
            count='traffic_stop_id' 
            byDate='["month"]' 
            groupBy='["name_race"]'
            filters={filterObj}
            />
        </div>
      </div>
    </div>
  }


 

// <Example 
//         title='APD Traffic Consent Searches by Race, 2018'
//         chartType='line'  
//         dataset='coa_apd_traffic_stop_name_data_table' 
//         count='traffic_stop_id' 
//         groupBy='["name_race"]'
//         filters={filterObj3}
//         datasetLabels={datasetLabels}
//         labelY="Number of searches"
//         />



   











   
}


const domContainer = document.querySelector('#demo');
ReactDOM.render(React.createElement(Demo), domContainer);

// render(<Demo/>, document.querySelector('#demo'))
