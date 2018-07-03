import React from 'react';
import ReactDOM from 'react-dom';
import LazyList from './LazyList';
import data from './data';

ReactDOM.render(
  <LazyList dataSource={data} />,
  document.getElementById('root')
);
