import { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import ButtonGroup from '@mui/material/ButtonGroup';
// import './App.css'

/** для ids использовать библиотеку uuid ("f353ca91-4fc5-49f2-9b9e-304f83d11914") */

//почему если есть данные в localeStorage, то при перезагрузке страницы на секунду появляется {total: 0, completed: 0}? Из-за того, что state с задачами сперва пустой?
const useTodosCount = (todos) => {
  const [count, setCount] = useState({total: 0, completed: 0});

  useEffect(() => {
    setCount({ 
      total: todos.length,
      completed: todos.filter((todo) => todo.done).length
    });
  }, [todos]);

  return count;
}

function App() {
  const [todos, setTodos] = useState(() => {
    const data = localStorage.getItem('todos');
    return data ? JSON.parse(data) : [];
  });
  // const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const { total, completed } = useTodosCount(todos);

  

  const updateInput = (e) => {
    const data = e.target.value;
    setInputValue(data);
  };

  const handleClickAdd = () => {
    setTodos(prev => [...prev, {id: new Date(), text: inputValue, done: false}]);
    setInputValue('');
  };

  const toggleCheckbox = (id) => {
    const checkedTodos = todos.map(item => 
        item.id == id 
          ? { ...item, done: !item.done }
          : item
      )

    setTodos(checkedTodos);
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  const changeFilter = (filter) => {
    setFilter(filter);
  };

  const getFilteredTask = () => {
    /** early return */
    if (filter === 'active') {
      return todos.filter((item) => !item.done);
    }

    if (filter === 'completed') {
      return todos.filter((item) => item.done)
    }

    return todos;
  };

  const resetCompletedTask = () => {
    setTodos(todos.filter((item) => !item.done));
  };

  const resetAll = () => {
    setTodos([]);
  };

  //проверяем localeStorage при первом рендере  // Стейт  перезаписывается на 17 строке
  // useEffect(() => {
  //   const dataLocaleStorage = localStorage.getItem('todos');
  //   console.log(dataLocaleStorage);
  //   return dataLocaleStorage ? setTodos(JSON.parse(dataLocaleStorage)) : todos;
  // },[]);

  //обновляем localStorage 
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  },[todos]);

  const filteredTask = getFilteredTask();

  return (
    <>
      <Typography variant="h3" gutterBottom>
        To do list
      </Typography>

      {/* <Filter /> */}

      <ButtonGroup sx={{mb: 3}} variant="outlined" aria-label="Basic button group">
        <Button onClick={() => changeFilter('all')} sx={filter == 'all' ? {backgroundColor: 'primary.dark', color: 'white'} : {backgroundColor: 'primary.main '}}>All</Button>
        <Button onClick={() => changeFilter('active')} sx={filter == 'active' ? {backgroundColor: 'primary.dark', color: 'white'} : {backgroundColor: 'primary.main '}}>Active</Button>
        <Button onClick={() => changeFilter('completed')} sx={filter == 'completed' ? {backgroundColor: 'primary.dark', color: 'white'} : {backgroundColor: 'primary.main '}}>Completed</Button>
      </ButtonGroup>

      {/* <TodoForm /> */}

      <Stack spacing={2} direction="row">
        <TextField id="outlined-basic" label="Task name" variant="outlined" onChange={updateInput} value={inputValue}/>
        <Button variant="contained" onClick={handleClickAdd}>Add</Button>
        <Button variant="contained" onClick={resetCompletedTask}>Clear Completed</Button>
      </Stack>
      
      {/* <TodosList /> */}

      <List>
        {filteredTask.length !== 0 
          ? filteredTask.map((item) => <ListItem key={item.id}><Checkbox checked={item.done} onChange={() => toggleCheckbox(item.id)}/>{item.text} <Button color="error" sx={{ml: 2, fontSize: 10}} variant="outlined" onClick={(() => deleteTask(item.id))}>delete</Button></ListItem>) 
          : <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>Empty List</Typography>}
      </List>

      <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>{`Total task: ${total}, completed task: ${completed}`} </Typography>
      <Button variant="contained" color="error" onClick={resetAll}>Reset All</Button>
      
    </>
  )
}

export default App
