import React from "react";

class TableRow extends React.Component {
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
}

class NormalList extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <div className="scroller">
          {this.props.data.map((el, index) => <TableRow {...el} key={el.id} />)}
        </div>
      </div>
    );
  }
}

export default NormalList;
