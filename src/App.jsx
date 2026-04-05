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


//почему если есть данные в localeStorage, то при перезагрузке страницы на секунду появляется {total: 0, completed: 0}? Из-за того, что state с задачами сперва пустой?
const useCount = (todos, initialValue) => {
  const [count, setCount] = useState(initialValue);

  const getTask = () => {
    let total = 0;
    let completed = 0;
    todos.map((item) => {
      total++;
      item.done ? completed++ : completed;
    });
    setCount(prev =>  ({...prev, total, completed}));
  };

  const checkTodosList = () => {
   return todos.length !== 0 ? getTask() : initialValue;
  };


  useEffect(() => {
    checkTodosList();
    }, []);

  useEffect(() => {
    getTask();
    }, [todos]);

  return {count}
  
}

function App() {
  const [todos, setTodos] = useState(() => {
    const data = localStorage.getItem('todos');
    return data ? JSON.parse(data) : [];
  });
  // const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const {count} = useCount(todos, {total: 0, completed: 0})

  

  const updateInput = (e) => {
    const data = e.target.value;
    setInputValue(data);
    
  };

  const handleClickAdd = () => {
    setTodos(prev => [...prev, {id: todos.length + 1, text: inputValue, done: false}]);
    setInputValue('');
  };

  const toggleCheckbox = (id) => {
    setTodos(todos.map(item => 
        item.id == id 
          ? { ...item, done: !item.done }
          : item
      )
    );
  };

  const deleteTask = (id) => {
    setTodos(() => {
      return todos.filter((item) => item.id !== id)
    });
  };

  const changeFilter = (filter) => {
    setFilter(filter);
  };

  const getFilteredTask = (filter) => {
    let result = '';
    switch (filter) {
      case 'all':
        result = todos.map((item) => item);
        break;
      case 'active':
        result = todos.filter((item) => (item.done == false));
        break;
      case 'completed':
        result = todos.filter((item) => item.done == true);
        break;
      default:
        result = [todos.map((item) => item)];
    };

    return result;
  };

  const resetCompletedTask = () => {
    setTodos(prev => {
      return prev.filter((item) => {
        return item.done !== true
      });
    });
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

  //обновляем id когда меняется длина массива
  useEffect(() => {
    setTodos(todos.map((item, index) => ({...item, id: index + 1})));
  },[todos.length]);

  //обновляем localStorage 
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  },[todos]);


 console.log(todos)
 console.log(count)
  const filteredTask = getFilteredTask(filter);

  return (
    <>
      <Typography variant="h3" gutterBottom>
        To do list
      </Typography>

      <ButtonGroup sx={{mb: 3}} variant="outlined" aria-label="Basic button group">
        <Button onClick={() => changeFilter('all')} sx={filter == 'all' ? {backgroundColor: 'primary.dark', color: 'white'} : {backgroundColor: 'primary.main '}}>All</Button>
        <Button onClick={() => changeFilter('active')} sx={filter == 'active' ? {backgroundColor: 'primary.dark', color: 'white'} : {backgroundColor: 'primary.main '}}>Active</Button>
        <Button onClick={() => changeFilter('completed')} sx={filter == 'completed' ? {backgroundColor: 'primary.dark', color: 'white'} : {backgroundColor: 'primary.main '}}>Completed</Button>
      </ButtonGroup>

      <Stack spacing={2} direction="row">
        <TextField id="outlined-basic" label="Task name" variant="outlined" onChange={updateInput} value={inputValue}/>
        <Button variant="contained" onClick={handleClickAdd}>Add</Button>
        <Button variant="contained" onClick={resetCompletedTask}>Clear Completed</Button>
      </Stack>
      
      <List>
        {filteredTask.length !== 0 
          ? filteredTask.map((item) => <ListItem key={item.id}><Checkbox checked={item.done} onChange={() => toggleCheckbox(item.id)}/>{item.text} <Button color="error" sx={{ml: 2, fontSize: 10}} variant="outlined" onClick={(() => deleteTask(item.id))}>delete</Button></ListItem>) 
          : <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>Empty List</Typography>}
      </List>

      <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>{`Total task: ${count.total}, completed task: ${count.completed}`} </Typography>
      <Button variant="contained" color="error" onClick={resetAll}>Reset All</Button>
      
    </>
  )
}

export default App
