import React from 'react';

import SBHSStore from '../../stores/sbhs';
import SettingsStore from '../../stores/settings';

import SBHSException from '../sbhs-exception';
import Centered from '../centered';
import Loader from '../loader';
import Expandable from '../expandable';

import {DAYS} from '../../data/day-constants';

import STYLE from './style.css';

const LOGIN_MESSAGE = [<a onClick={() => window.location.href='/auth/login'}>Login</a>, ' to load your timetable!'];

//TODO: Snackbar if notices is outdated.
export default React.createClass({
  getInitialState() {
    return {
      notices: null,
      date: null,

      initiallyExpanded: SettingsStore.expandNotices,
      filter: SettingsStore.noticesFilter
    };
  },

  getData() {
    if (SBHSStore.notices) {
      this.setState({
        date: SBHSStore.notices.date,
        notices: SBHSStore.notices.notices
      });
    }
  },

  getSettings() {
    this.setState({
      initiallyExpanded: SettingsStore.expandNotices,
      filter: SettingsStore.noticesFilter
    });
  },

  componentWillMount() {
    SBHSStore.bind('notices', this.getData);
    this.getData();

    SettingsStore.bind('update', this.getSettings);
  },

  componentWillUnmount() {
    SBHSStore.unbind('notices', this.getData);
    SettingsStore.unbind('update', this.getSettings);
  },

  render() {
    if (!this.state.notices)
      return <Centered vertical horizontal>
        <SBHSException
          loading={<Loader />}
          loggedOut={LOGIN_MESSAGE}
          offline='Go online to read the notices!' />
      </Centered>;


    let notices = this.state.notices;
    if (this.state.filter)
      notices = notices.filter(notice => notice.targetList.indexOf(this.state.filter) != -1);

    if (notices.length == 0)
      return <Centered vertical horizontal>
        No notices.
      </Centered>;

    return <Centered horizontal><div className={STYLE.notices}>
        {notices.map((notice, i) => {
          let meeting;

          if (notice.meeting) {
            let meetingDate = new Date(notice.meeting.date);
            meeting = <span style={{ 'color': '#757575' }}>
              {` on ${DAYS[meetingDate.getDay()]} ${meetingDate.getDate()}` + ( notice.meeting.time? ', ' + notice.meeting.time : '' )}
            </span>;
          } else {
            meeting = null;
          }

          return <Expandable
            className={STYLE.notice}
            key={i}
            title={<div className={STYLE.title}>
              <div style={{ 'fontSize': '1.2em' }}>
                <span style={{ 'fontWeight': '400' }}>{ notice.title }</span>
                {meeting}
              </div>
              <div style={{ 'fontSize': '0.8em', 'color': '#757575' }}>{ notice.author } | { notice.target }</div>
            </div>}
            content={<div dangerouslySetInnerHTML={{ __html: notice.content }} />}
            initiallyExpanded={this.state.initiallyExpanded} />
        })}
      </div></Centered>;
  }
});