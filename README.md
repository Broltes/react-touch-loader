# react-touch-loader
React component for web pull to refresh and load more, 下拉刷新, 加载更多

## Live demo
[https://broltes.github.io/tloader](https://broltes.github.io/tloader)

## Usage
`npm install react-touch-loader`

```js
import Tloader from 'react-touch-loader';

<Tloader
    initializing={initializing}
    onRefresh={handleRefresh}
    hasMore={hasMore}
    onLoadMore={handleLoadMore}
    className="some class">

    <ul><li>some items</li></ul>
</Tloader>
```
## Less needed
react-touch-loader will automaticly import the less file, please config your webpack for less.

## All props

#### initializing
- 0: do not display the progress bar
- 1: start progress bar
- 2: progress to end

#### onRefresh
- function (resove, reject)
- undefined: disable the pull to refresh action

#### hasMore
- 0: hide the load more footer (disable load more)
- 1: show the load more footer

#### onLoadMore
- function (resove)

#### className
- custom css class

### Localization
The text is defined in css(less):

```less
@pullingMsg: '下拉刷新';
@pullingEnoughMsg: '松开刷新';
@refreshingMsg: '正在刷新...';
@refreshedMsg: '刷新成功';
@loadingMsg: '正在加载...';
@btnLoadMore: '加载更多';

.tloader-msg:after{
    .state-pulling &{
        content: @pullingMsg
    }

    .state-pulling.enough &{
        content: @pullingEnoughMsg;
    }

    .state-refreshed &{
        content: @refreshedMsg;
    }
}
.tloader-loading:after{
    content: @loadingMsg;

    .tloader-symbol &{
        content: @refreshingMsg;
    }
}
.tloader-btn:after{
    content: @btnLoadMore;
}
```

So you can easily overwrite the defaults by css like this:
```less
.tloader .tloader-btn:after{
    content: 'Load More';
}
```

## Example
[check code from demos/app.jsx](https://github.com/Broltes/react-touch-loader/blob/master/demos/app.jsx)
