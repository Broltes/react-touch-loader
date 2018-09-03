import 'babel-polyfill';
import React from 'react';
import { hot } from 'react-hot-loader';
import './style.less';

import Tloader from 'react-touch-loader';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      canRefreshResolve: 1,
      listLen: 0,
      hasMore: 0,
      initializing: 1,
      refreshedAt: Date.now(),
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        listLen: 9,
        hasMore: 1,
        initializing: 2, // initialized
      });
    }, 2e3);
  }

  refresh = (resolve, reject) => {
    setTimeout(() => {
      const { canRefreshResolve } = this.state;
      if (!canRefreshResolve) reject();
      else {
        this.setState({
          listLen: 9,
          hasMore: 1,
          refreshedAt: Date.now(),
        });

        resolve();
      }
    }, 2e3);
  }

  loadMore = (resolve) => {
    setTimeout(() => {
      const { listLen } = this.state;
      const l = listLen + 9;

      this.setState({
        listLen: l,
        hasMore: l > 0 && l < 50,
      });

      resolve();
    }, 2e3);
  }


  toggleCanRefresh = () => {
    const { canRefreshResolve } = this.state;

    this.setState({ canRefreshResolve: !canRefreshResolve });
  }

  render() {
    const {
      listLen, hasMore, initializing, refreshedAt, canRefreshResolve,
    } = this.state;
    const list = [];

    if (listLen) {
      for (let i = 0; i < listLen; i++) {
        list.push((
          <li key={i}>
            <p>{i}</p>
          </li>
        ));
      }
    }
    return (
      <div className="view">
        <h1>react-touch-loader {refreshedAt.toString().substr(7)}</h1>

        <Tloader
          className="main"
          onRefresh={this.refresh}
          onLoadMore={this.loadMore}
          hasMore={hasMore}
          initializing={initializing}
        >
          <ul>{list}</ul>
        </Tloader>

        <div className="footer">
          <a href="https://github.com/Broltes/react-touch-loader">view source</a>
          <label>
            can refresh resolve
            <input
              type="checkbox"
              checked={canRefreshResolve}
              onChange={this.toggleCanRefresh}
            />
          </label>
        </div>
      </div>
    );
  }
}

export default hot(module)(App);
