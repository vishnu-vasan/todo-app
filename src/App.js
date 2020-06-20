import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Todos from "./components/Todos";
import AddTodo from "./components/AddTodo";
import About from "./components/pages/About";
import "./App.css";
import axios from "axios";

class App extends Component {
  state = {
    todos: [],
  };
  componentDidMount() {
    axios
      .get("http://localhost:7800/")
      .then((res) => this.setState({ todos: res.data }));
  }
  //toggle complete
  markComplete = (id) => {
    axios.put(`http://localhost:7800/user/${id}`).then((res) => {
      this.setState({
        todos: this.state.todos.map((todo) => {
          if (todo.id == id) {
            todo.completed = !todo.completed;
          }
          return todo;
        }),
      });
    });
  };

  //delete todo
  delTodo = (id) => {
    axios.delete(`http://localhost:7800/user/${id}`).then((res) => {
      this.setState({
        todos: [...this.state.todos.filter((todo) => todo.id !== id)],
      });
    });
  };

  //Addtodo
  addTodo = (title) => {
    axios
      .post("http://localhost:7800/todos", {
        title,
        completed: false,
      })
      .then((res) => this.setState({ todos: [...this.state.todos, res.data] }));
  };
  render() {
    return (
      <Router>
        <div className="App">
          <div className="container">
            <Header />
            <Route
              exact
              path="/"
              render={(props) => (
                <React.Fragment>
                  <AddTodo addTodo={this.addTodo} />
                  <Todos
                    todos={this.state.todos}
                    markComplete={this.markComplete}
                    delTodo={this.delTodo}
                  />
                </React.Fragment>
              )}
            />
            <Route path="/about" component={About} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
