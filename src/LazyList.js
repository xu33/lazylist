import React, { Component } from "react";
import TableRow from "./TableRow";

class LazyList extends Component {
  render() {
    return (
      <div className="wrapper" onScroll={this.handleScroll}>
        {this.props.dataSource.map((el, index) => (
          <TableRow content={el.content} key={el.id} />
        ))}
      </div>
    );
  }

  handleScroll = e => {
    // console.log(e.target.scrollTop);
  };

  componentDidMount() {
    updateProjection();
  }
}

export default LazyList;
