import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

function App() {
	const [todos, setTodos] = useState([]);
	const [newTodo, setNewTodo] = useState('');
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		if (token) {
			fetchTodos();
		}
	}, [token]);

	const fetchTodos = async () => {
		try {
			const response = await axios.get(`${API_URL}/todos`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setTodos(response.data);
		} catch (error) {
			console.error('Error fetching todos:', error);
		}
	};

	const login = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${API_URL}/login`, { username, password });
			const { token } = response.data;
			localStorage.setItem('token', token);
			setToken(token);
		} catch (error) {
			alert('Login failed');
		}
	};

	const addTodo = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${API_URL}/todos`,
				{ text: newTodo },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setTodos([...todos, response.data]);
			setNewTodo('');
		} catch (error) {
			console.error('Error adding todo:', error);
		}
	};

	const toggleTodo = async (todo) => {
		try {
			const response = await axios.put(
				`${API_URL}/todos/${todo.id}`,
				{ ...todo, completed: !todo.completed },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setTodos(todos.map(t => t.id === todo.id ? response.data : t));
		} catch (error) {
			console.error('Error updating todo:', error);
		}
	};

	const deleteTodo = async (id) => {
		try {
			await axios.delete(`${API_URL}/todos/${id}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			setTodos(todos.filter(t => t.id !== id));
		} catch (error) {
			console.error('Error deleting todo:', error);
		}
	};

	if (!token) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<form onSubmit={login} className="bg-white p-8 rounded-lg shadow-md">
					<h2 className="text-2xl mb-4">Login</h2>
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full p-2 mb-4 border rounded"
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full p-2 mb-4 border rounded"
					/>
					<button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
						Login
					</button>
				</form>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
			<div className="relative py-3 sm:max-w-xl sm:mx-auto">
				<div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
					<div className="max-w-md mx-auto">
						<div className="divide-y divide-gray-200">
							<div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
								<form onSubmit={addTodo} className="flex gap-4">
									<input
										type="text"
										value={newTodo}
										onChange={(e) => setNewTodo(e.target.value)}
										className="flex-1 px-4 py-2 border rounded-lg"
										placeholder="Add a new todo"
									/>
									<button
										type="submit"
										className="bg-blue-500 text-white px-4 py-2 rounded-lg"
									>
										Add
									</button>
								</form>
								
								<div className="space-y-4">
									{todos.map(todo => (
										<div key={todo.id} className="flex items-center gap-4">
											<input
												type="checkbox"
												checked={todo.completed}
												onChange={() => toggleTodo(todo)}
												className="h-4 w-4"
											/>
											<span className={`flex-1 ${todo.completed ? 'line-through' : ''}`}>
												{todo.text}
											</span>
											<button
												onClick={() => deleteTodo(todo.id)}
												className="text-red-500"
											>
												Delete
											</button>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;