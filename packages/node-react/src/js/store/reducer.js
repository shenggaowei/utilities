import { combineReducers } from 'redux';
import { ADD_TODO, DELETE_TODO, DOWN_TODO, UP_TODO } from './action';

function todos(state = [], action) {
  console.log(state);
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ];

    case DELETE_TODO: {
      let newState = [...state];
      let { index } = action;
      newState.splice(index, 1);
      return newState;
    }

    case DOWN_TODO: {
      let newState = [...state];
      let { index } = action;
      let [cur, next] = [newState[index], newState[index + 1]];
      newState.splice(index, 2, next, cur);
      return newState;
    }

    case UP_TODO: {
      let newState = [...state];
      let { index } = action;
      let [pre, cur] = [newState[index - 1], newState[index]];
      newState.splice(index - 1, 2, cur, pre);
      return newState;
    }
    default:
      return state;
  }
}

// function todoApp(state = {}, action) {
//   return {
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action),
//     todos: todos(state.todos, action)
//   };
// }

const todoApp = combineReducers({
  todos
});

export default todoApp;
