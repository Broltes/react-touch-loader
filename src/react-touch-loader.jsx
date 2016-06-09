import React from 'react';
import './touch-loader.less';

const STATS = {
    pulling: 'pulling',
    enough: 'pulling enough',
    loading: 'loading',
    reset: 'reset'
};

// pull to refresh
// tap bottom to load more
export default React.createClass({
    getInitialState: function() {
        return {
            pullState: '',
            pullHeight: 0,
            loadMoreState: ''
        };
    },
    getDefaultProps: function () {
        return {
            distanceToRefresh: 60,
        };
    },
    setInitialTouch: function(touch) {
        this._initialTouch = {
            clientY: touch.clientY
        };
    },
    calculateDistance: function (touch) {
        return touch.clientY - this._initialTouch.clientY;
    },
    // 拖拽的缓动公式 - easeOutSine
    easing: function (distance) {
        // t: current time, b: begInnIng value, c: change In value, d: duration
        var t = distance;
        var b = 0;
        var d = screen.availHeight; // 允许拖拽的最大距离
        var c = d / 2.5; // 提示标签最大有效拖拽距离

        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    touchStart: function(e) {
        if(this.state.pullState == STATS.loading) return;
        if(e.touches.length == 1) this._initialTouch = {
            clientY: e.touches[0].clientY,
            scrollTop: this.refs.panel.scrollTop
        };
    },
    touchMove: function(e) {
        if(this.state.pullState == STATS.loading) return;
        var scrollTop = this.refs.panel.scrollTop;
        var distance = this.calculateDistance(e.touches[0]);

        if(distance > 0 && scrollTop <= 0){
            var pullDistance = distance - this._initialTouch.scrollTop;
            var pullHeight = this.easing(pullDistance);
            if(pullHeight) e.preventDefault();// 减弱滚动

            this.setState({
                pullState: pullHeight > this.props.distanceToRefresh ? STATS.enough : STATS.pulling,
                pullHeight: pullHeight
            });
        }
    },
    touchEnd: function() {
        if(this.state.pullState == STATS.loading) return;
        var endState = {
            pullState: STATS.reset,
            pullHeight: 0
        };

        if (this.state.pullState == STATS.enough) {
            // loading
            this.setState({
                pullState: STATS.loading,
                pullHeight: ''
            });
            // trigger refresh action
            this.props.onRefresh(function(){
                // reset
                this.setState(endState);
            }.bind(this));
        }else this.setState(endState);
    },
    loadMore: function(){
        this.setState({ loadMoreState:  STATS.loading });
        this.props.onLoadMore(function(){
            // reset
            this.setState({loadMoreState: ''});
        }.bind(this));
    },
    render: function(){
        const {
            className,
            hasMore,
            initializing,
        } = this.props;
        let {
            loadMoreState,
            pullState,
            pullHeight
        } = this.state;

        let msg = pullState == STATS.enough ? '松开刷新' : '下拉刷新';

        let footer = hasMore ? (
            <div className={'tloader-footer footer-state-' + loadMoreState}>
                <p className="tloader-btn" onClick={this.loadMore}>加载更多</p>
                <p className="tloader-loading"><i className="ui-loading"/>正在加载...</p>
            </div>
        ) : null;

        var style = pullHeight ? {
            WebkitTransform: `translate3d(0,${pullHeight}px,0)`
        } : null;

        return (
            <div ref="panel" className={'tloader state-' + pullState + ' ' + className } onTouchStart={this.touchStart} onTouchMove={this.touchMove} onTouchEnd={this.touchEnd}>
                <p className={'progress ' + (initializing ? 'on' : 'ed')}/>
                <div className="tloader-symbol">
                    <p className="msg"><i/>{msg}</p>
                    <p className="tloader-loading"><i className="ui-loading"/>正在刷新...</p>
                </div>
                <div className="tloader-body" style={style}>{this.props.children}</div>
                {footer}
            </div>
        );
    }
});
