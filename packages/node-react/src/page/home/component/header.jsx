import React, { Component } from 'react';
import store from '../../../js/store';
import { toggleTodo, addTodo } from '../../../js/store/action';
import './header.sass';

function testTable(isTrue) {
  return Wrap => {
    return class extends Component {
      constructor(props) {
        super(props)
        console.log(props);
      }
      render() {
        return <Wrap ref={o => this.props.getInstance(o)} isTrue={isTrue} />
      }
    }
  }
}

function testTable2(Wrap) {
  return class extends Component {

    test2 = () => 22

    render() {
      return <Wrap {...this.props} />
    }
  }
}

function withRef(Wrap) {
  return class extends Component {
    constructor(props) {
      super(props);
    }

    getRefs = (o) => {
      const { getInstance } = this.props;
      if (getInstance) {
        getInstance(o)
      }
    }

    test2 = () => 222

    render() {
      return <Wrap {...this.props} ref={this.getRefs} />
    }
  }
}

@testTable2
@withRef
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'a'
    };
    this.unsubscribe = store.subscribe(() => console.log(store.getState()));
  };

  addTodo = () => {
    store.dispatch(addTodo(this.state.value));
  };

  test2 = () => 333

  handleInput = (e) => {
    this.setState({
      value: e.target.value
    });
  };

  render() {
    return <div>
      <input onChange={this.handleInput} value={this.state.value} />
      <button style={{ marginRight: '5px' }} onClick={this.addTodo.bind(this)}>新增todo</button>
    </div>;
  }
}
