import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import './app.less'

import Tloader from 'react-touch-loader';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      canRefreshResolve: 1,
      listLen: 0,
      hasMore: 0,
      initializing: 1,
      refreshedAt: Date.now()
    }
  }

  refresh(resolve, reject) {
    setTimeout(() => {
      if (!this.state.canRefreshResolve) return reject();

      this.setState({
        listLen: 9,
        hasMore: 1,
        refreshedAt: Date.now()
      });
      resolve();
    }, 2e3);
  }
  loadMore(resolve) {
    setTimeout(() => {
      var l = this.state.listLen + 9;

      this.setState({
        listLen: l,
        hasMore: l > 0 && l < 50
      });

      resolve();
    }, 2e3);
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
  toggleCanRefresh() {
    this.setState({ canRefreshResolve: !this.state.canRefreshResolve });
  }

  render() {
    var { listLen, hasMore, initializing, refreshedAt, canRefreshResolve } = this.state;
    var { refresh, loadMore, toggleCanRefresh } = this;
    var list = [];

    if (listLen) {
      for (var i = 0; i < listLen; i++) {
        list.push(
          <li key={i}>
            <p>{i}</p>
          </li>
        );
      }
    }
    return (
      <div className="view">
        <h1>react-touch-loader {refreshedAt.toString().substr(7)}</h1>

        <Tloader className="main"
          onRefresh={(resolve, reject) => this.refresh(resolve, reject)}
          onLoadMore={(resolve) => this.loadMore(resolve)}
          hasMore={hasMore}
          initializing={initializing}>
          <ul>{list}</ul>
        </Tloader>

        <h2>
          <a href="https://github.com/Broltes/react-touch-loader">view source</a>
          <label>
            can refresh resolve
            <input type="checkbox"
              checked={canRefreshResolve}
              onChange={(e) => this.toggleCanRefresh(e)} />
          </label>
        </h2>
      </div>
    );
  }
}
render(<App />, document.getElementById('app'));
