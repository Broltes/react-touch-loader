# react-touch-loader
React component for web pull to refresh and load more

`npm install react-touch-loader`

## Live demo
[https://broltes.github.io/tloader](https://broltes.github.io/tloader)

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
                initializing: 0
            });
        }.bind(this), 2e3);
    },

    render: function(){
        var { listLen, hasMore, initializing, refreshedAt } = this.state;
        var { refresh, loadMore } = this;
        var list = [];

        if(listLen) {
            list.push(<li key="t"><p>{refreshedAt.toString().substr(7)}</p></li>);

            for(var i = 0; i < listLen; i++){
                list.push(
                    <li key={i}>
                        <p>{i}</p>
                        <img src="cover.jpg"/>
                    </li>
                );
            }
        }

        return (
            <Tloader className="view" onRefresh={refresh} onLoadMore={loadMore} hasMore={hasMore} initializing={initializing}>
                <ul>{list}</ul>
            </Tloader>
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
