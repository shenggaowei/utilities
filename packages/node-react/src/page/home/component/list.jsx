import React, { Component } from 'react';
import store from '../../../js/store';
import { deleteTodo, upTodo, downTodo } from '../../../js/store/action';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: []
    };
    this.unsubscribe = store.subscribe(() => {
      this.setState({
        value: store.getState().todos
      });
    });
  };

  handleDelete = index => {
    store.dispatch(deleteTodo(index));
  };

  upTodo = index => {
    store.dispatch(upTodo(index));
  };

  downTodo = index => {
    store.dispatch(downTodo(index));
  };

  render() {
    const { value } = this.state;

    return <ul>
      {
        value.map((ele, index) => {
          return <li key={index}>
            <span style={{ marginRight: '5px' }}>{ele.text}</span>
            <button style={{ marginRight: '5px' }} onClick={this.handleDelete.bind(this, index)}>删除</button>
            <button style={{ marginRight: '5px' }} onClick={this.upTodo.bind(this, index)}>上移</button>
            <button style={{ marginRight: '5px' }} onClick={this.downTodo.bind(this, index)}>下移</button>
          </li>;
        })
      }
    </ul>;
  }
}
