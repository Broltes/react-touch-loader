import React from 'react';

require('./style.less');

const STATS = {
  init: '',
  pulling: 'pulling',
  enough: 'pulling enough',
  refreshing: 'refreshing',
  refreshed: 'refreshed',
  reset: 'reset',

  loading: 'loading', // loading more
};

// 拖拽的缓动公式 - easeOutSine
function easing(distance) {
  // t: current time, b: begInnIng value, c: change In value, d: duration
  const t = distance;
  const b = 0;
  const d = window.screen.availHeight; // 允许拖拽的最大距离
  const c = d / 2.5; // 提示标签最大有效拖拽距离

  return c * Math.sin(t / d * (Math.PI / 2)) + b;
}

// pull to refresh
// tap bottom to load more
class Tloader extends React.Component {
  state = {
    loaderState: STATS.init,
    pullHeight: 0,
    progressed: 0,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initializing < 2) {
      this.setState({
        progressed: 0, // reset progress animation state
      });
    }
  }

  setInitialTouch(touch) {
    this.initialTouch = {
      clientY: touch.clientY,
    };
  }

  touchStart = (e) => {
    if (!this.canRefresh()) return;
    if (e.touches.length === 1) {
      const { panel } = this;
      this.initialTouch = {
        clientY: e.touches[0].clientY,
        scrollTop: panel.scrollTop,
      };
    }
  }

  touchMove = (e) => {
    if (!this.canRefresh()) return;
    const { panel } = this;
    const { distanceToRefresh } = this.props;
    const { scrollTop } = panel;
    const distance = this.calculateDistance(e.touches[0]);

    if (distance > 0 && scrollTop <= 0) {
      let pullDistance = distance - this.initialTouch.scrollTop;
      if (pullDistance < 0) {
        // 修复 webview 滚动过程中 touchstart 时计算panel.scrollTop不准
        pullDistance = 0;
        this.initialTouch.scrollTop = distance;
      }
      const pullHeight = easing(pullDistance);
      if (pullHeight) e.preventDefault();// 减弱滚动

      this.setState({
        loaderState: pullHeight > distanceToRefresh ? STATS.enough : STATS.pulling,
        pullHeight,
      });
    }
  }

  touchEnd = () => {
    if (!this.canRefresh()) return;
    const endState = {
      loaderState: STATS.reset,
      pullHeight: 0,
    };

    if (this.state.loaderState === STATS.enough) {
      // refreshing
      this.setState({
        loaderState: STATS.refreshing,
        pullHeight: 0,
      });

      // trigger refresh action
      this.props.onRefresh(() => {
        // resolve
        this.setState({
          loaderState: STATS.refreshed,
          pullHeight: 0,
        });
      }, () => {
        // reject
        this.setState(endState);// reset
      });
    } else this.setState(endState);// reset
  }

  loadMore = () => {
    this.setState({ loaderState: STATS.loading });
    this.props.onLoadMore(() => {
      // resolve
      this.setState({ loaderState: STATS.init });
    });
  }

  scroll = (e) => {
    if (
      this.props.autoLoadMore
      && this.props.hasMore
      && this.state.loaderState !== STATS.loading
    ) {
      const panel = e.currentTarget;
      const scrollBottom = panel.scrollHeight - panel.clientHeight - panel.scrollTop;

      if (scrollBottom < 5) this.loadMore();
    }
  }

  animationEnd = () => {
    const newState = {};

    if (this.state.loaderState === STATS.refreshed) newState.loaderState = STATS.init;
    if (this.props.initializing > 1) newState.progressed = 1;

    this.setState(newState);
  }

  calculateDistance(touch) {
    return touch.clientY - this.initialTouch.clientY;
  }

  canRefresh() {
    const { onRefresh } = this.props;
    const { loaderState } = this.state;
    return onRefresh && [STATS.refreshing, STATS.loading].indexOf(loaderState) < 0;
  }

  initialTouch

  render() {
    const {
      children, className, hasMore, initializing,
    } = this.props;
    const { loaderState, pullHeight, progressed } = this.state;

    const footer = hasMore ? (
      <div className="tloader-footer">
        <div className="tloader-btn" onClick={this.loadMore} />
        <div className="tloader-loading"><i className="ui-loading" /></div>
      </div>
    ) : null;

    const style = pullHeight ? {
      WebkitTransform: `translate3d(0,${pullHeight}px,0)`,
    } : null;

    let progressClassName = '';
    if (!progressed) {
      if (initializing > 0) progressClassName += ' tloader-progress';
      if (initializing > 1) progressClassName += ' ed';
    }

    return (
      <div
        ref={(el) => { this.panel = el; }}
        className={`tloader state-${loaderState} ${className}${progressClassName}`}
        onScroll={this.scroll}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}
        onTouchEnd={this.touchEnd}
        onAnimationEnd={this.animationEnd}
      >

        <div className="tloader-symbol">
          <div className="tloader-msg"><i /></div>
          <div className="tloader-loading"><i className="ui-loading" /></div>
        </div>
        <div className="tloader-body" style={style}>{children}</div>
        {footer}
      </div>
    );
  }
}

Tloader.defaultProps = {
  distanceToRefresh: 60,
  autoLoadMore: 1,
};

export default Tloader;
