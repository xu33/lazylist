import React, { Component } from "react";

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

export default TableRow;
