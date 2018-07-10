import React, { Component } from "react";
import ReactDOM from "react-dom";
import data from "./data";
// import NormalList from "./NormalList";
let bounds = require("binary-search-bounds");

let windowHeight = window.innerHeight;
let viewportHeight = windowHeight * 3;

let guessHeight = 200;
let heightCache = {};

data.forEach((el, idx, arr) => {
  let height = heightCache[el.id];
  if (!height) {
    height = guessHeight;
  }

  el.height = height;
  if (idx === 0) {
    el.y = 0;
  } else {
    let prev = arr[idx - 1];
    el.y = prev.y + prev.height;
  }

  heightCache[el.id] = guessHeight;
});

let scrollTop = 0;

class TableRow extends Component {
  render() {
    return (
      <div ref="dom" className="row" id={this.props.num}>
        <div className="num">{this.props.num}</div>
        <p>
          {this.props.content}
        </p>
      </div>
    );
  }

  componentDidMount() {
    let { height } = this.refs.dom.getBoundingClientRect();
    if (height !== heightCache[this.props.id]) {
      heightCache[this.props.id] = height;
      this.props.onUnmatch(height - guessHeight);
    }
  }
}

class LazyList extends Component {
  prevIndex = 0;
  prevPaddingTop = 0;
  prevScrollTop = 0;

  state = {
    projection: [],
    paddingTop: 0,
    paddingBottom: 0
  };

  render() {
    return (
      <div className="wrapper" ref="wrapper" onScroll={this.handleScroll}>
        <div
          className="scroller"
          style={{
            paddingTop: this.state.paddingTop,
            paddingBottom: this.state.paddingBottom
          }}
        >
          {this.state.projection.map((el, index) => (
            <TableRow
              {...el}
              key={el.id}
              onUnmatch={this.updateProjectionAsync}
            />
          ))}
        </div>
      </div>
    );
  }

  updateProjection = () => {
    // console.log(scrollTop);
    let y = Math.max(0, scrollTop - windowHeight);
    let startIndex = bounds.le(data, { y: y }, (a, b) => {
      return a.y - b.y;
    });

    if (startIndex === -1) {
      startIndex = 0;
    }

    let projection = [];
    let paddingTop = 0;
    let paddingBottom = 0;
    let projectionHeight = 0;
    let index = startIndex;
    let l = data.length;

    while (index < l) {
      let el = data[index];
      el.height = heightCache[el.id];

      if (index === 0) {
        el.y = 0;
      } else {
        el.y = data[index - 1].y + data[index - 1].height;
      }

      projectionHeight += el.height;
      projection.push(el);

      index++;

      if (projectionHeight >= viewportHeight) {
        break;
      }
    }

    paddingTop = data[startIndex].y;
    for (let i = index; i < l; i++) {
      paddingBottom += data[i].height;
    }

    this.prevIndex = startIndex;
    this.prevPaddingTop = this.state.paddingTop;

    // console.log("totalHeight:", paddingTop + projectionHeight + paddingBottom);

    this.setState({
      paddingTop: paddingTop,
      paddingBottom: paddingBottom,
      projection: projection
    });
  };

  updateProjectionAsync = () => {
    requestAnimationFrame(this.updateProjection);
  };

  handleScroll = e => {
    scrollTop = e.target.scrollTop;
    this.updateProjectionAsync();
  };

  componentDidMount() {
    this.updateProjection();
  }
}

ReactDOM.render(<LazyList />, document.getElementById("root"));
// ReactDOM.render(<NormalList data={data} />, document.getElementById("root"));
