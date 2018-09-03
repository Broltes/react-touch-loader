'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./style.less');

var STATS = {
  init: '',
  pulling: 'pulling',
  enough: 'pulling enough',
  refreshing: 'refreshing',
  refreshed: 'refreshed',
  reset: 'reset',

  loading: 'loading' // loading more
};

// 拖拽的缓动公式 - easeOutSine
function easing(distance) {
  // t: current time, b: begInnIng value, c: change In value, d: duration
  var t = distance;
  var b = 0;
  var d = window.screen.availHeight; // 允许拖拽的最大距离
  var c = d / 2.5; // 提示标签最大有效拖拽距离

  return c * Math.sin(t / d * (Math.PI / 2)) + b;
}

// pull to refresh
// tap bottom to load more

var Tloader = function (_React$Component) {
  _inherits(Tloader, _React$Component);

  function Tloader() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Tloader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Tloader.__proto__ || Object.getPrototypeOf(Tloader)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loaderState: STATS.init,
      pullHeight: 0,
      progressed: 0
    }, _this.touchStart = function (e) {
      if (!_this.canRefresh()) return;
      if (e.touches.length === 1) {
        var _this2 = _this,
            panel = _this2.panel;

        _this.initialTouch = {
          clientY: e.touches[0].clientY,
          scrollTop: panel.scrollTop
        };
      }
    }, _this.touchMove = function (e) {
      if (!_this.canRefresh()) return;
      var _this3 = _this,
          panel = _this3.panel;
      var distanceToRefresh = _this.props.distanceToRefresh;
      var scrollTop = panel.scrollTop;

      var distance = _this.calculateDistance(e.touches[0]);

      if (distance > 0 && scrollTop <= 0) {
        var pullDistance = distance - _this.initialTouch.scrollTop;
        if (pullDistance < 0) {
          // 修复 webview 滚动过程中 touchstart 时计算panel.scrollTop不准
          pullDistance = 0;
          _this.initialTouch.scrollTop = distance;
        }
        var pullHeight = easing(pullDistance);
        if (pullHeight) e.preventDefault(); // 减弱滚动

        _this.setState({
          loaderState: pullHeight > distanceToRefresh ? STATS.enough : STATS.pulling,
          pullHeight: pullHeight
        });
      }
    }, _this.touchEnd = function () {
      if (!_this.canRefresh()) return;
      var endState = {
        loaderState: STATS.reset,
        pullHeight: 0
      };

      if (_this.state.loaderState === STATS.enough) {
        // refreshing
        _this.setState({
          loaderState: STATS.refreshing,
          pullHeight: 0
        });

        // trigger refresh action
        _this.props.onRefresh(function () {
          // resolve
          _this.setState({
            loaderState: STATS.refreshed,
            pullHeight: 0
          });
        }, function () {
          // reject
          _this.setState(endState); // reset
        });
      } else _this.setState(endState); // reset
    }, _this.loadMore = function () {
      _this.setState({ loaderState: STATS.loading });
      _this.props.onLoadMore(function () {
        // resolve
        _this.setState({ loaderState: STATS.init });
      });
    }, _this.scroll = function (e) {
      if (_this.props.autoLoadMore && _this.props.hasMore && _this.state.loaderState !== STATS.loading) {
        var panel = e.currentTarget;
        var scrollBottom = panel.scrollHeight - panel.clientHeight - panel.scrollTop;

        if (scrollBottom < 5) _this.loadMore();
      }
    }, _this.animationEnd = function () {
      var newState = {};

      if (_this.state.loaderState === STATS.refreshed) newState.loaderState = STATS.init;
      if (_this.props.initializing > 1) newState.progressed = 1;

      _this.setState(newState);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Tloader, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.initializing < 2) {
        this.setState({
          progressed: 0 // reset progress animation state
        });
      }
    }
  }, {
    key: 'setInitialTouch',
    value: function setInitialTouch(touch) {
      this.initialTouch = {
        clientY: touch.clientY
      };
    }
  }, {
    key: 'calculateDistance',
    value: function calculateDistance(touch) {
      return touch.clientY - this.initialTouch.clientY;
    }
  }, {
    key: 'canRefresh',
    value: function canRefresh() {
      var onRefresh = this.props.onRefresh;
      var loaderState = this.state.loaderState;

      return onRefresh && [STATS.refreshing, STATS.loading].indexOf(loaderState) < 0;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props = this.props,
          children = _props.children,
          className = _props.className,
          hasMore = _props.hasMore,
          initializing = _props.initializing;
      var _state = this.state,
          loaderState = _state.loaderState,
          pullHeight = _state.pullHeight,
          progressed = _state.progressed;


      var footer = hasMore ? _react2.default.createElement(
        'div',
        { className: 'tloader-footer' },
        _react2.default.createElement('div', { className: 'tloader-btn', onClick: this.loadMore }),
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
        {
          ref: function ref(el) {
            _this4.panel = el;
          },
          className: 'tloader state-' + loaderState + ' ' + className + progressClassName,
          onScroll: this.scroll,
          onTouchStart: this.touchStart,
          onTouchMove: this.touchMove,
          onTouchEnd: this.touchEnd,
          onAnimationEnd: this.animationEnd
        },
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
          children
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