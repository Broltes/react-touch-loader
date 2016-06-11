import React from 'react';
import { render } from 'react-dom';
import './app.less';

import Tloader from 'react-touch-loader';

var App = React.createClass({
    getInitialState: function() {
        return {
            canRefreshResolve: 1,
            listLen: 0,
            hasMore: 0,
            initializing: 1,
            refreshedAt: Date.now()
        };
    },
    refresh: function(resolve, reject) {
        setTimeout(function(){
            if(!this.state.canRefreshResolve) return reject();

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
                hasMore: l>0 && l<20
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
    toggleCanReresh: function() {
        this.setState({ canRefreshResolve: !this.state.canRefreshResolve});
    },

    render: function(){
        var { listLen, hasMore, initializing, refreshedAt, canRefreshResolve } = this.state;
        var { refresh, loadMore, toggleCanReresh } = this;
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

                <h2>
                    <a href="https://github.com/Broltes/react-touch-loader">view source</a>
                    <labe>can refresh resolve<input onChange={toggleCanReresh} type="checkbox" checked={canRefreshResolve}/></labe>
                </h2>
            </div>
        );
    }
});
render(<App/>, document.getElementById('app'));
