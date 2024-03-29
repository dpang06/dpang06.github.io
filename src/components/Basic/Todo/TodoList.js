import React, { useEffect, useRef, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function TodoList(props) {
  // console.log(`render Todo`);
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const editFieldRef = useRef(null);
  const editButtonRef = useRef(null);
  const wasEditing = usePrevious(isEditing);
  // console.log(`render Todo: isEditing=${isEditing} wasEditing=${wasEditing}`);
  let className = 'todo';
  if (props.important) className += ' todo-important';

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.editTask(props.id, newName);
    setNewName('');
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          id={props.id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
          ref={editFieldRef}
        />
      </div>
      <div className="btn-group">
        <Button type="button" className="todo-cancel" onClick={() => setEditing(false)}>
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </Button>
        <Button type="submit" variant="primary" className="todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </Button>
      </div>
    </form>
  );
  const viewTemplate = (
    <div className="stack-small">
      <Form.Group className="c-cb">
        <Form.Check
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
          label={props.name}
        />
      </Form.Group>
      <div className="btn-group">
        <Button
          type="button"
          onClick={() => setEditing(true)}
          ref={editButtonRef}
        >
          Edit <span className="visually-hidden">{props.name}</span>
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={() => props.deleteTask(props.id)}
        >
          Delete <span className="visually-hidden">{props.name}</span>
        </Button>
        <Button
          type="button"
          onClick={() => props.markImportantTask(props.id)}
        >
          Important <span className="visually-hidden">{props.name}</span>
        </Button>
      </div>
    </div>
  );
  useEffect(() => {
    // console.log(`use effect wasEditing=${wasEditing} isEditing=${isEditing}`);
    if (!wasEditing && isEditing) {
      editFieldRef.current.focus();
    }
    if (wasEditing && !isEditing) {
      editButtonRef.current.focus();
    }
    // console.log("side effect" + Date.now()); // this will run after the rendering (after two renderings in strict mode)
  }, [wasEditing, isEditing]); // only called when isEditing is changed

  return (<li className={className}>{(isEditing) ? editingTemplate : viewTemplate}</li>)
}
export default TodoList;