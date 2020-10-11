import React from 'react';
import './App.scss';
import logo from './assets/img/logo.png'
import { Form } from './components/Form';
import * as moment from 'moment';

class App extends React.Component {

    constructor() {
        super();

        this.state = {
            hoursLeft: 0,
            minutesLeft: 0,
            daysLeft: 0
        };
        this.eventDateTime = moment('2020-06-20 16:00');
    }

    calculate() {
        const now = moment();
        const minutes = this.eventDateTime.diff(now, 'minute');
        const dl = Math.floor(minutes / (24 * 60));
        const hl = Math.floor((minutes - (dl * 24 * 60)) / 60);
        const ml = Math.floor(minutes - ((dl * 24 * 60) + (hl * 60)));
        const sl = 59 - now.second();

        this.setState({
            daysLeft: dl,
            hoursLeft: hl,
            minutesLeft: ml,
            secondsLeft: sl
        });
    }

    componentDidMount() {
        this.calculate();
        setInterval(() => this.calculate(), 1000);
    }

    render() {
        return (
            <div className="content">
                <img className="logo" src={logo} />
                <span>MDL <strong>BEAST</strong></span>
                <h3>FREQWAYS</h3>
                <span className="desc">ON AIR, ON BOARD, ON FREQ</span>
                <h1>BOOK NOW</h1>
                <span className="date">20 . JUNE . 2020</span>
                <div className="main-container">
                    <div className="first-row">
                        <div className="column column-first">
                            <h5 className="main">TAKEOFF IN</h5>
                        </div>
                        <div className="column column-second column-gray">
                            <span className="number">{ this.state.daysLeft }</span>
                            <h5>DAYS</h5>
                        </div>
                        <div className="column column-third column-gray">
                            <span className="number">{ this.state.hoursLeft }</span>
                            <h5>HOURS</h5>
                        </div>
                        <div className="column column-fourth column-gray">
                            <span className="number">{ this.state.minutesLeft }</span>
                            <h5>MINUTES</h5>
                        </div>
                        <div className="column column-fifth column-gray">
                            <span className="number">{ this.state.secondsLeft }</span>
                            <h5>SECONDS</h5>
                        </div>
                    </div>
                    <div className="main-row">
                        <span className="main-row-title">MDLBEAST FREQWAYS IS A VIRTUAL FESTIVAL WITHOUT BORDERS</span>
                        <p>Join us for a 12-hour non-stop journey from your house to the world; evoking the sense of travel while everyone is grounded.</p>
                        <p>Unfasten your seatbelts as we approach some heavy bass, this ride has turbulence guaranteed. Get ready to Freq and Fly at 7pm (GMT +3) on June 20th, as we usher in World Music Day.</p>
                        <p>Please book now for the updated flight schedule, departure gates and more information about your captains.</p>
                        <Form />
                    </div>
                </div>
            </div>
        );
    }
}
export default App;
