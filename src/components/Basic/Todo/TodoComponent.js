import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import './TodoComponent.css';
import { nanoid } from 'nanoid';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import FilterButton from './FilterButton';

const FILTER_MAP = {
  'All': () => true,
  'Active': (task) => !task.completed,
  'Completed': (task) => task.completed,
}
const FILTER_NAMES = Object.keys(FILTER_MAP);

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const LIGHT_THEME = "theme_light";
const DARK_THEME = "theme_dark";

function TodoComponent(props) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [theme, setTheme] = useState(LIGHT_THEME);
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  function addTask(name) {
    let task = {
      id: `todo-${nanoid()}`,
      name,
      completed: false,
      important: false,
    }
    setTasks([...tasks, task]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    })
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  }

  function editTask(id, newName) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function markImportantTask(id) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return {...task, important: true};
      }
      return task;
    })
    setTasks(updatedTasks);
  }

  function clearAllTasks() {
    setTasks([]);
  }

  function toggleTheme(e) {
    let newTheme;
    if (e.currentTarget.checked === true) {
      newTheme = DARK_THEME;
    } else {
      newTheme = LIGHT_THEME;
    }
    setTheme(newTheme);
  }

  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map((task) => (
    <TodoList
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      important={task.important}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
      markImportantTask={markImportantTask}
    />
  ));
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
    key={name}
    name={name}
    isPressed={name === filter}
    setFilter={setFilter}
    />
  ));

  const taskNoun = (taskList.length === 1) ? "task" : "tasks";
  const headingText = `${taskList.length} ${taskNoun} remaining`;

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      // console.log(`focus on listHeadingRef=${listHeadingRef}`);
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  // initially load tasks
  useEffect(() => {
    const data = localStorage.getItem('listOfTasks');
    if (data) {
      setTasks(JSON.parse(data));
    }
  }, []); // [] means run only once (doesn't run again on any state change)
  // save tasks on every render
  useEffect(() => {
    localStorage.setItem('listOfTasks', JSON.stringify(tasks));
  });

  // persist theme
  useEffect(() => {
    const initTheme = localStorage.getItem('theme') ?? LIGHT_THEME;
    setTheme(initTheme);
  }, []);
  useEffect(() => {
    localStorage.setItem('theme', theme);
  });

  let className = "todoapp stack-large";
  className += ` ${theme}`;
  return (
    <div className={className}>
      <label id="theme-switcher" className="switch">
        <input type="checkbox" onChange={toggleTheme} checked={theme === DARK_THEME} />
        <span className="slider round"></span>
      </label>
      <h1>TodoMatic</h1>
      <TodoForm addTask={addTask}/>
      <div>
        <Button id="clear-all-btn" onClick={clearAllTasks} variant="danger" size="lg" >Clear All Tasks</Button>
      </div>
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default TodoComponent;