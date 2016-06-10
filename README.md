# react-touch-loader
React component for web pull to refresh and load more

`npm install react-touch-loader`

## Live demo
[https://broltes.github.io/tloader](https://broltes.github.io/tloader)
## All props

#### initializing
- 0: do not display the progress bar
- 1: start progress bar
- 2: progress to end

#### onRefresh
- function (resove)
- null: disable the pull to refresh action

#### hasMore
- 0: hide the load more footer (disable load more)
- 1: show the load more footer

#### onLoadMore
- function (resove)

#### className
- custom css class


## Usage
```js
import React from 'react';
import { render } from 'react-dom';
import './app.less';

import Tloader from 'react-touch-loader';

var App = React.createClass({
    getInitialState: function() {
        return {
            listLen: 0,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now()
        };
    },
    refresh: function(resolve) {
        setTimeout(function(){
            this.setState({
                listLen: 9,
                hasMore: 1,
                refreshedAt: Date.now()
            });
            resolve();
        }.bind(this), 2e3);
    },
    loadMore: function(resolve){
        setTimeout(function() {
            var l = this.state.listLen + 9;

            this.setState({
                listLen: l,
                hasMore: l>0 && l<99
            });

            resolve();
        }.bind(this), 2e3);
    },
    componentDidMount: function() {
        setTimeout(function(){
            this.setState({
                listLen: 9,
                hasMore: 1,
                initializing: 2, // initialized
            });
        }.bind(this), 2e3);
    },

    render: function(){
        var { listLen, hasMore, initializing, refreshedAt } = this.state;
        var { refresh, loadMore } = this;
        var list = [];

        if(listLen) {
            for(var i = 0; i < listLen; i++){
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

                <Tloader className="main" onRefresh={refresh} onLoadMore={loadMore} hasMore={hasMore} initializing={initializing}>
                    <ul>{list}</ul>
                </Tloader>

                <h2><a href="https://github.com/Broltes/react-touch-loader">view source</a></h2>
            </div>
        );
    }
});
render(<App/>, document.getElementById('app'));
```

## Development
开发时注意设置 webpack.dev.config.js 的entry：
```js
'webpack-dev-server/client?http://dev.broltes.com:' + devport,
```
将环境修改为自己的。
