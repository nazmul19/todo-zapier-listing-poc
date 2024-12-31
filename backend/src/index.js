const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage
const db = {
	todos: [],
	users: [{
		username: 'admin',
		password: bcrypt.hashSync('admin123', 10)
	}],
	apiKeys: ['default-api-key'] // Add more keys as needed
};

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
	const apiKey = req.headers['x-api-key'];
	const authHeader = req.headers['authorization'];
	
	if (apiKey && db.apiKeys.includes(apiKey)) {
		return next();
	}

	if (!authHeader) return res.sendStatus(401);
	
	const token = authHeader.split(' ')[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, 'your-secret-key', (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};

// Auth routes
app.post('/api/login', async (req, res) => {
	const { username, password } = req.body;
	const user = db.users.find(u => u.username === username);
	
	if (!user || !bcrypt.compareSync(password, user.password)) {
		return res.status(401).json({ message: 'Invalid credentials' });
	}

	const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });
	res.json({ token });
});

// Todo routes
app.get('/api/todos', authenticateToken, (req, res) => {
	res.json(db.todos);
});

app.post('/api/todos', authenticateToken, (req, res) => {
	const todo = {
		id: Date.now().toString(),
		text: req.body.text,
		completed: false,
		createdAt: new Date()
	};
	db.todos.push(todo);
	res.status(201).json(todo);
});

app.put('/api/todos/:id', authenticateToken, (req, res) => {
	const todo = db.todos.find(t => t.id === req.params.id);
	if (!todo) return res.status(404).json({ message: 'Todo not found' });
	
	Object.assign(todo, req.body);
	res.json(todo);
});

app.delete('/api/todos/:id', authenticateToken, (req, res) => {
	const index = db.todos.findIndex(t => t.id === req.params.id);
	if (index === -1) return res.status(404).json({ message: 'Todo not found' });
	
	db.todos.splice(index, 1);
	res.status(204).send();
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});