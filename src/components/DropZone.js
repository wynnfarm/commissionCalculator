import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import csv from 'csv';
import moment from 'moment';
import accounting from 'accounting';
import Table from './Table';

class DropZone extends Component {
    constructor() {
        super()
        this.state = {
          files: [],
          commissionData: null
        }
      }
    
    onDrop (e) {
        const reader = new FileReader();
        reader.onload = () => {
            csv.parse(reader.result, (err, data) => {
                // console.log(data);
                let result = this.extractDateAndCommission(data);
                let updatedResults = this.aggregateByPayPeriod(result);
                this.sumCommissionByPayPeriod(updatedResults);
            });
        };
    
        reader.readAsBinaryString(e[0]);
    }
    
    sumCommissionByPayPeriod(data){

        let summedDates = {};
        data.forEach(({date, commission}, i)=> {
            let updatedCommission = Math.round(parseFloat(commission) * 100) / 100;
            if (summedDates[date._i]) {
                let tempSum = summedDates[date._i] + updatedCommission
                summedDates[date._i] =  Math.round(tempSum * 100) / 100;
            } else {
                summedDates[date._i] = updatedCommission;
            }
            

        })
        this.setState({commissionData: summedDates});
    }

    aggregateByPayPeriod(data){
        let newCommission = [];
        data.forEach(({date, commission},i) => {
            let newDate = [];
            if(date.date() < 15) {
                newDate = moment(`${date.month()+ 1 }/1/${date.year()}`, 'MM/DD/YYYY')
            } else {
                newDate = moment(`${date.month()+ 1 }/15/${date.year()}`, 'MM/DD/YYYY')
            }
            newCommission.push({date: newDate, commission:commission});
            // console.log(newDate);
        })
        
        return newCommission;
    }

    extractDateAndCommission(data){
        let commissionData = [];
        data.forEach((row,i) => {
            if(i > 5 && i < data.length-1){
                let date = moment(row[1], 'DD-MMM-YY');
                let commission = row[10];
                commissionData.push({date: date, commission:  parseFloat(accounting.unformat(commission).toFixed(2))})
            }
        })
        return commissionData;
    }
    
    onCancel() {
        this.setState({
          files: []
        });
    }
    
    render() {
        const files = this.state.files.map(file => (
          <li key={file.name}>
            {file.name}
          </li>
        ))

        if (this.state.tableData) {
          return (
            <Table data={this.state.commissionData} />
          )
        }
    
        return (
          <>
            <section>
              <Dropzone
                onDrop={this.onDrop.bind(this)}
                onFileDialogCancel={this.onCancel.bind(this)}
              >
                {({getRootProps, getInputProps}) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                      <p>Drop files here, or click to select files</p>
                  </div>
                )}
              </Dropzone>
              <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
              </aside>
            </section>
            {this.state.commissionData ? <Table data={this.state.commissionData} /> : null }
          </>
        );
      }
}

export default DropZone;