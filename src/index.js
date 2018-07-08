import React, { Component } from "react";
import ReactDOM from "react-dom";
import data from "./data";
import NormalList from "./NormalList";
let bounds = require("binary-search-bounds");

let windowHeight = window.innerHeight;
let viewportHeight = windowHeight * 4.5;

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
});

let scrollTop = 0;
let running = false;

class TableRow extends Component {
  render() {
    return (
      <div ref="dom" className="row">
        <h1>{this.props.id}</h1>
        <p>
          {this.props.content}
        </p>
      </div>
    );
  }

  componentDidMount() {
    let { height } = this.refs.dom.getBoundingClientRect();
    heightCache[this.props.id] = height;
  }
}

class LazyList extends Component {
  state = {
    projection: [],
    paddingTop: 0,
    paddingBottom: 0
  };

  render() {
    return (
      <div className="wrapper" onScroll={this.handleScroll}>
        <div
          className="scroller"
          style={{
            paddingTop: this.state.paddingTop,
            paddingBottom: this.state.paddingBottom
          }}
        >
          {this.state.projection.map((el, index) => (
            <TableRow {...el} key={el.id} />
          ))}
        </div>
      </div>
    );
  }

  updateProjection() {
    running = true;

    let startIndex = bounds.le(
      data,
      { y: scrollTop - windowHeight * 2 },
      (a, b) => {
        return a.y - b.y;
      }
    );

    if (startIndex === -1) {
      startIndex = 0;
    }

    console.log("startIndex:", startIndex);
    let projection = [];
    let paddingTop = 0;
    let paddingBottom = 0;
    let allknow = true;
    let projectionHeight = 0;
    let index = startIndex;

    while (index < data.length) {
      let el = data[index];
      if (heightCache[el.id]) {
        data[index].height = heightCache[el.id];
        if (index === 0) {
          data[index].y = 0;
        } else {
          data[index].y = data[index - 1].y + data[index - 1].height;
        }
      } else {
        allknow = false;
      }
      projectionHeight += data[index].height;
      projection.push(el);

      index++;

      if (projectionHeight > viewportHeight) {
        break;
      }
    }

    paddingTop = data[startIndex].y;
    for (let i = index; i < data.length; i++) {
      paddingBottom += data[i].height;
    }

    this.setState({
      paddingTop: paddingTop,
      paddingBottom: paddingBottom,
      projection: projection,
      allknow
    });

    return allknow;
  }

  updateProjectionRec = () => {
    let allknow = this.updateProjection();

    if (!allknow) {
      requestAnimationFrame(this.updateProjectionRec);
    } else {
      running = false;
    }
  };

  handleScroll = e => {
    scrollTop = e.target.scrollTop;

    if (running === false) {
      this.updateProjectionRec();
    }
  };

  componentDidMount() {
    this.updateProjectionRec();
  }
}

// ReactDOM.render(<LazyList />, document.getElementById("root"));
ReactDOM.render(<NormalList data={data} />, document.getElementById("root"));
