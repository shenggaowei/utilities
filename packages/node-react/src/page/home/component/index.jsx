import React, { Component } from 'react';
import Header from './header.jsx';
import List from './list.jsx';

function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list)
  }
}

function testTable(isTrue) {
  return Wrap => {
    return class extends Component {
      render() {
        return <Wrap isTrue={isTrue} />
      }
    }
  }
}

const Foo = {
  foo() { console.log('foo') }
};

@testTable(true)
@mixins(Foo)
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log('test', this.test)
    console.log('rest', this.foo)
    console.log('this.props', this.props)
  }

  getState = () => {
    console.log(this.filter.test2())
  }

  render() {
    return <div>
      <Header getInstance={o => this.filter = o} haha={'haha'} />
      <List />
      <button onClick={this.getState}>点击</button>
    </div>;
  }
}
