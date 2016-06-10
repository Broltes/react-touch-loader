# react-touch-loader
React component for web pull to refresh and load more

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


## Example
[check code from demos/app.jsx](https://github.com/Broltes/react-touch-loader/blob/master/demos/app.jsx)


## Development
modify the `entry` in `webpack.dev.config.js` to yours
```js
'webpack-dev-server/client?http://dev.broltes.com:' + devport,
```
