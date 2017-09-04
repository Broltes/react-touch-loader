'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./touch-loader.less');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STATS = {
  init: '',
  pulling: 'pulling',
  enough: 'pulling enough',
  refreshing: 'refreshing',
  refreshed: 'refreshed',
  reset: 'reset',

  loading: 'loading' // loading more
};

// pull to refresh
// tap bottom to load more

var Tloader = function (_React$Component) {
  _inherits(Tloader, _React$Component);

  function Tloader() {
    _classCallCheck(this, Tloader);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tloader).call(this));

    _this.state = {
      loaderState: STATS.init,
      pullHeight: 0,
      progressed: 0
    };
    return _this;
  }

  _createClass(Tloader, [{
    key: 'setInitialTouch',
    value: function setInitialTouch(touch) {
      this._initialTouch = {
        clientY: touch.clientY
      };
    }
  }, {
    key: 'calculateDistance',
    value: function calculateDistance(touch) {
      return touch.clientY - this._initialTouch.clientY;
    }
    // 拖拽的缓动公式 - easeOutSine

  }, {
    key: 'easing',
    value: function easing(distance) {
      // t: current time, b: begInnIng value, c: change In value, d: duration
      var t = distance;
      var b = 0;
      var d = screen.availHeight; // 允许拖拽的最大距离
      var c = d / 2.5; // 提示标签最大有效拖拽距离

      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    }
  }, {
    key: 'canRefresh',
    value: function canRefresh() {
      return this.props.onRefresh && [STATS.refreshing, STATS.loading].indexOf(this.state.loaderState) < 0;
    }
  }, {
    key: 'touchStart',
    value: function touchStart(e) {
      if (!this.canRefresh()) return;
      if (e.touches.length == 1) this._initialTouch = {
        clientY: e.touches[0].clientY,
        scrollTop: this.refs.panel.scrollTop
      };
    }
  }, {
    key: 'touchMove',
    value: function touchMove(e) {
      if (!this.canRefresh()) return;
      var scrollTop = this.refs.panel.scrollTop;
      var distance = this.calculateDistance(e.touches[0]);

      if (distance > 0 && scrollTop <= 0) {
        var pullDistance = distance - this._initialTouch.scrollTop;
        if (pullDistance < 0) {
          // 修复 webview 滚动过程中 touchstart 时计算panel.scrollTop不准
          pullDistance = 0;
          this._initialTouch.scrollTop = distance;
        }
        var pullHeight = this.easing(pullDistance);
        if (pullHeight) e.preventDefault(); // 减弱滚动

        this.setState({
          loaderState: pullHeight > this.props.distanceToRefresh ? STATS.enough : STATS.pulling,
          pullHeight: pullHeight
        });
      }
    }
  }, {
    key: 'touchEnd',
    value: function touchEnd() {
      var _this2 = this;

      if (!this.canRefresh()) return;
      var endState = {
        loaderState: STATS.reset,
        pullHeight: 0
      };

      if (this.state.loaderState == STATS.enough) {
        // refreshing
        this.setState({
          loaderState: STATS.refreshing,
          pullHeight: 0
        });

        // trigger refresh action
        this.props.onRefresh(function () {
          // resolve
          _this2.setState({
            loaderState: STATS.refreshed,
            pullHeight: 0
          });
        }, function () {
          // reject
          _this2.setState(endState); // reset
        });
      } else this.setState(endState); // reset
    }
  }, {
    key: 'loadMore',
    value: function loadMore() {
      var _this3 = this;

      this.setState({ loaderState: STATS.loading });
      this.props.onLoadMore(function () {
        // resolve
        _this3.setState({ loaderState: STATS.init });
      });
    }
  }, {
    key: 'onScroll',
    value: function onScroll(e) {
      if (this.props.autoLoadMore && this.props.hasMore && this.state.loaderState != STATS.loading) {
        var panel = e.currentTarget;
        var scrollBottom = panel.scrollHeight - panel.clientHeight - panel.scrollTop;

        if (scrollBottom < 5) this.loadMore();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.initializing < 2) this.setState({
        progressed: 0 // reset progress animation state
      });
    }
  }, {
    key: 'animationEnd',
    value: function animationEnd() {
      var newState = {};

      if (this.state.loaderState == STATS.refreshed) newState.loaderState = STATS.init;
      if (this.props.initializing > 1) newState.progressed = 1;

      this.setState(newState);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props;
      var className = _props.className;
      var hasMore = _props.hasMore;
      var initializing = _props.initializing;
      var _state = this.state;
      var loaderState = _state.loaderState;
      var pullHeight = _state.pullHeight;
      var progressed = _state.progressed;


      var footer = hasMore ? _react2.default.createElement(
        'div',
        { className: 'tloader-footer' },
        _react2.default.createElement('div', { className: 'tloader-btn', onClick: function onClick(e) {
            return _this4.loadMore(e);
          } }),
        _react2.default.createElement(
          'div',
          { className: 'tloader-loading' },
          _react2.default.createElement('i', { className: 'ui-loading' })
        )
      ) : null;

      var style = pullHeight ? {
        WebkitTransform: 'translate3d(0,' + pullHeight + 'px,0)'
      } : null;

      var progressClassName = '';
      if (!progressed) {
        if (initializing > 0) progressClassName += ' tloader-progress';
        if (initializing > 1) progressClassName += ' ed';
      }

      return _react2.default.createElement(
        'div',
        { ref: 'panel',
          className: 'tloader state-' + loaderState + ' ' + className + progressClassName,
          onScroll: function onScroll(e) {
            return _this4.onScroll(e);
          },
          onTouchStart: function onTouchStart(e) {
            return _this4.touchStart(e);
          },
          onTouchMove: function onTouchMove(e) {
            return _this4.touchMove(e);
          },
          onTouchEnd: function onTouchEnd(e) {
            return _this4.touchEnd(e);
          },
          onAnimationEnd: function onAnimationEnd(e) {
            return _this4.animationEnd(e);
          } },
        _react2.default.createElement(
          'div',
          { className: 'tloader-symbol' },
          _react2.default.createElement(
            'div',
            { className: 'tloader-msg' },
            _react2.default.createElement('i', null)
          ),
          _react2.default.createElement(
            'div',
            { className: 'tloader-loading' },
            _react2.default.createElement('i', { className: 'ui-loading' })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'tloader-body', style: style },
          this.props.children
        ),
        footer
      );
    }
  }]);

  return Tloader;
}(_react2.default.Component);

Tloader.defaultProps = {
  distanceToRefresh: 60,
  autoLoadMore: 1
};

exports.default = Tloader;