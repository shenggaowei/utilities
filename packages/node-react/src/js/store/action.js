/*
 * action 类型
 */

export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
export const DELETE_TODO = 'DELETE_TODO';
export const UP_TODO = 'UP_TODO';
export const DOWN_TODO = 'DOWN_TODO';

/**
 * 
 * @param {*} text 
 */
export function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  };
}

export function deleteTodo(index) {
  return {
    type: DELETE_TODO,
    index
  };
}

export function toggleTodo(index) {
  return {
    type: TOGGLE_TODO,
    index
  };
}

export function upTodo(index) {
  return {
    type: UP_TODO,
    index
  };
}

export function downTodo(index) {
  return {
    type: DOWN_TODO,
    index
  };
}

/**
 * 排序
 */