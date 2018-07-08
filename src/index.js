import React, { Component } from "react";
import ReactDOM from "react-dom";
import data from "./data";
let bounds = require("binary-search-bounds");

let windowHeight = window.innerHeight;
let viewport = {
  height: windowHeight * 3
};
let guessHeight = 200;
let heightCache = {};

class TableRow extends Component {
  render() {
    return (
      <div ref="dom" className="row">
        {this.props.content}
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
      <div
        className="wrapper"
        onScroll={this.handleScroll}
        style={{ paddingTop: this.state.paddingTop + "px" }}
      >
        {this.state.projection.map((el, index) => (
          <TableRow {...el} key={el.id} />
        ))}
      </div>
    );
  }

  updateProjection(scrollTop = 0) {
    let index = bounds.le(data, { y: scrollTop }, (a, b) => {
      return a.y - b.y;
    });
    let projection = [];
    let allready = true;
    console.log(index);

    if (index < 0) index = 0;
    let paddingTop = data[index].y ? data[index].y : 0;

    let totalHeight = 0;
    while (totalHeight < viewport.height) {
      let el = data[index];

      if (heightCache[el.id]) {
        totalHeight += heightCache[el.id];
      } else {
        allready = false;
        totalHeight += guessHeight;
      }

      let prevEl = data[index - 1];
      if (prevEl) {
        el.y =
          prevEl.y +
          (heightCache[prevEl.id] ? heightCache[prevEl.id] : guessHeight);
      } else {
        el.y = 0;
      }

      // console.log(el.y);

      index += 1;

      projection.push(el);
    }

    // console.log(projection);

    this.setState({
      projection,
      paddingTop
    });

    return allready;
  }

  updateProjectionRec(scrollTop) {
    let allready = this.updateProjection(scrollTop);
    if (!allready) {
      requestAnimationFrame(() => {
        this.updateProjectionRec(scrollTop);
      });
    }
  }

  handleScroll = e => {
    this.updateProjectionRec(e.target.scrollTop);
  };

  componentDidMount() {
    this.updateProjectionRec();
  }
}

ReactDOM.render(<LazyList />, document.getElementById("root"));
