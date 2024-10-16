const http = require('http');

let students = [
  { id: 1, name: 'Yahya Al-Faruq', age: 16, class: 'XI' },
  { id: 2, name: 'Hanif', age: 17, class: 'X' }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (url === '/students' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(students));
  }


  else if (url === '/students' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newStudent = JSON.parse(body);
      newStudent.id = students.length + 1;
      students.push(newStudent);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newStudent));
    });
  }

  // PUT update a student by ID
  else if (url.startsWith('/students/') && method === 'PUT') {
    const id = parseInt(url.split('/')[2]);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const updatedStudent = JSON.parse(body);
      const index = students.findIndex(student => student.id === id);
      if (index !== -1) {
        students[index] = { id, ...updatedStudent };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(students[index]));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Student not found' }));
      }
    });
  }


  else if (url.startsWith('/students/') && method === 'DELETE') {
    const id = parseInt(url.split('/')[2]);
    const index = students.findIndex(student => student.id === id);
    if (index !== -1) {
      students.splice(index, 1);
      res.writeHead(204); 
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Student not found' }));
    }
  }


  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});