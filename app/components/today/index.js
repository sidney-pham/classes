import React from 'react';

import SBHSStore from '../../stores/sbhs';
import Centered from '../centered';
import Countdown from '../countdown';
import Icon from '../icon';
import Loader from '../loader';

import parseTime from '../../utilities/parse-time';

import STYLE from './style.css';

const VARIATION_COLOR = '#00BFFF';

export default React.createClass({
  getInitialState() {
    return {
      bells: null,
      periods: null,
      date: null,

      nextTime: null,
      nextBell: null
    };
  },

  getData() {
    if (SBHSStore.today) {
      this.setState({
        bells: SBHSStore.today.bells,
        periods: SBHSStore.today.bells.filter(bell => bell.room),
        date: SBHSStore.today.date
      }, this.getNext);
    }
  },

  getNext() {
    let bells = this.state.bells;

    if (bells) {
      let date = new Date(this.state.date),
          now = Date.now();

      for (let i = 0; i < bells.length; i++) {
        let bell = bells[i];
        parseTime(date, bell.time);
        
        if (date > now) {
          return this.setState({
            nextBell: bell,
            nextTime: date
          });
        }
      }
    }

    this.setState({
      nextBell: null,
      nextTime: null
    });
  },

  componentWillMount() {
    SBHSStore.bind('today', this.getData);
    this.getData();
  },

  componentWillUnmount() {
    SBHSStore.unbind('today', this.getData);
  },

  render() {
    let {periods, nextBell, nextTime} = this.state;

    //TODO: Remove vw sizing or add a fullscreen button when periods.length.
    return <Centered vertical horizontal>
      {nextBell? <div className={STYLE.next} style={{ 'fontSize': periods.length? '1em' : '3vw' }}>
        <span style={{ 'fontSize': '1.5em' }}>{ nextBell.title }</span> in
        <Countdown
          to={nextTime}
          className={STYLE.countdown}
          onComplete={this.getNext} />
      </div> : <Loader />}

      {periods.length? <div className={STYLE.today}>
        {periods.map((bell, i) =>
          <div key={i} className={STYLE.period}>
            <div>
              <div style={{
                'fontSize': '1.2em',
                'marginBottom': '8px',
                'color': bell.variations.indexOf('title') < 0 ? null : VARIATION_COLOR
              }}>{bell.title}</div>
              <div style={{
                'fontSize': '0.8em'
              }}>with <span style={{
                'color': bell.variations.indexOf('teacher') < 0 ? null : VARIATION_COLOR
              }}>{bell.teacher || 'no one'}</span></div>
            </div>
            <div style={{
                'fontSize': '1.5em',
                'color': bell.variations.indexOf('room') < 0 ? null : VARIATION_COLOR
              }}>{bell.room}
            </div>
          </div>)}
      </div> :null}
    </Centered>;
  }
});