import React, { Component } from 'react';

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: false,
            geolocationError: false,
            history: []
        }
        //bind
        this.toggle = this.toggle.bind(this);        
    }

    toggle = (event) => {
        //console.log(event.target);
        const target = event.target;
        const id = target.id;
        var latitude, longitude;
        var startTime, endTime;

        function error() {
            this.setState({
                geolocationError: true
            });
        }

        if (id === "start") {
            startTime = new Date();
            console.log('st', startTime);
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('inside');
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;
                var item = {
                    startTime: startTime,
                    startLatitude: latitude,
                    startLongitude: longitude,
                }

                var currentHistory = localStorage.getItem('historyTable');
                var currentHistoryArray = []
        
                if(currentHistory != null){
                    currentHistoryArray = JSON.parse(currentHistory);
                } 

                var historyList = currentHistoryArray;
                historyList.push(item);
               
                localStorage.setItem('historyTable', JSON.stringify(historyList));
                this.setState({
                    history: historyList
                });
                console.log('history', this.state.history);
                //console.log('long', this.state.currentLongitude);
            }, error);


        }
        else {
            endTime = new Date();
            console.log('et', endTime);
            navigator.geolocation.getCurrentPosition((position) => {

                var currentHistory = localStorage.getItem('historyTable');
                var currentHistoryArray = []
        
                if(currentHistory != null){
                    currentHistoryArray = JSON.parse(currentHistory);
                } 

                var item = currentHistoryArray.splice(currentHistoryArray.length - 1)[0];
                console.log('item', item);
                item.endTime = endTime;
                item.endLatitude = position.coords.latitude;
                item.endLongitude = position.coords.longitude;
                item.timeElapsed = endTime.getSeconds() - new Date(item.startTime).getSeconds();
                                
                var historyList = currentHistoryArray;
                historyList.push(item);
                
                localStorage.setItem('historyTable', JSON.stringify(historyList));
                this.setState({
                    history: historyList
                });
                //console.log(this.state.history);

            }, error);

        }

        this.setState({
            toggle: !this.state.toggle
        });
    }


    deleteEntry = (Parameter, event) =>{

        var currentHistory = localStorage.getItem('historyTable');
        var currentHistoryArray = JSON.parse(currentHistory);
       
        currentHistoryArray.splice(Parameter,1);
        localStorage.setItem('historyTable', JSON.stringify(currentHistoryArray));
        this.setState({
            deleted: true
        });
                
        console.log(currentHistoryArray);
    }

    render() {

        let error = null;

        if (this.state.geolocationError === true) {
            error = <div className="alert alert-danger" role="alert">
                <strong>Error in retrieving Geo location details!</strong>
            </div>;
        }

        var historyTableContent = localStorage.getItem('historyTable');
        let historyTable = null;
        if(historyTableContent != null){
            var historyArray = JSON.parse(historyTableContent);
            historyTable = historyArray.map( (item, index) => {
                return (
                    <tr key={index}>
    
                        <th scope="row">{index + 1}</th>
                        <td colspan="2">{new Date(item.startTime).toString()}</td>
                        <td>{item.startLatitude}</td>
                        <td>{item.startLongitude}</td>
                        <td colspan="2">{item.endTime ? new Date(item.endTime).toString(): ""}</td>
                        <td>{item.endLatitude}</td>
                        <td>{item.endLongitude}</td>
                        <td>{item.timeElapsed}</td>
                        <td><button className="btn btn-lg btn-danger" onClick={this.deleteEntry.bind(this, index)}>Delete</button></td>
                    </tr>
                );
            });
        }
        
        return (
            <div>
                <div className="header container center-content">
                    <h1>The Race Around The World</h1>
                </div>
                <div className="container">

                    <div className="main-content center-content">
                        <br /><br />
                        <div className="btn-container">
                            <button className={this.state.toggle === true ? "btn btn-lg btn-success display-block" : "btn btn-lg btn-success"} id="start" onClick={this.toggle}>Start</button>
                            <button className={this.state.toggle === true ? "btn btn-lg btn-danger" : "btn btn-lg btn-danger display-block"} id="end" onClick={this.toggle}>Stop</button>
                        </div>
                        <br /><br />
                        <div>
                            {error}
                            <table className="table table-dark table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col" colspan="2">Start Time</th>
                                        <th scope="col">Latitude</th>
                                        <th scope="col">Longitude</th>
                                        <th scope="col" colspan="2">End Time</th>
                                        <th scope="col">End Latitude</th>
                                        <th scope="col">End Longitude</th>

                                        <th scope="col">Time Elapsed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyTable}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Main;