import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function TodoForm(props) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    props.addTask(name);
    setName("");
  }

  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
      <h2 className="label-wrapper">
        <Form.Text htmlFor="new-todo-input" variant="lg">
          What needs to be done?
        </Form.Text>
      </h2>
        <Form.Control
          type="text"
          id="new-todo-input"
          size="lg"
          name="text"
          autoComplete="off"
          onChange={handleChange}
          placeholder="Type your task name here"
          value={name}
        />
        <Button type="submit" variant="primary" size="lg">
          Add
        </Button>
      </Form.Group>
    </Form>
  );
}

export default TodoForm;
