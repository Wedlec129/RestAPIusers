import express from 'express';
import { readFileSync, writeFileSync } from 'fs';

//npm run dev

const PORT = 4444;
const app = express();
app.use(express.json());

const filePath = 'User.json';

//CRUD

/// GET http://localhost:4444/api/users
/// get all user

/// GET http://localhost:4444/api/users/2
//  get user wehre id == 2

// POST http://localhost:4444/api/users                  {in body {"name":"alex","age":"18"}} json
// CREAT new user

// DELITE http://localhost:4444/api/users/2
// delite user wehre id == 2

// PUT http://localhost:4444/api/users/2             {"age"="26"} or {"name":"alex","age":"20"} json
// update user where id==2 uodate info in body


app.get('/', (req, res) => {
    res.end("Welcome ");
});

app.get('/api/users', (req, res) => {
  try {
    const content = readFileSync(filePath, 'utf8');
    const users = JSON.parse(content);

    res.status(200).json(users);
  } catch (error) {
    console.error('Error reading or parsing JSON:', error);
    res.status(500).send('Server Error');
  }
});


// получение одного пользователя по id
app.get("/api/users/:id", (req, res) => {
    try {
        const content = readFileSync(filePath, 'utf8');
        const users = JSON.parse(content);
    
        const id = req.params.id; // Получаем id пользователя из запроса
        console.log(id);

        const user = users.find(u => u.id == id); // Ищем пользователя в сохраненных данных

        //res.json(user);
        res.status(200).json(user);
        
      } catch (error) {
        console.error('Error reading or parsing JSON:', error);
        res.status(500).send('Server Error');
      }

});


// получение отправленных данных
app.post('/api/users', (req, res) => {
    try {
    const content = readFileSync(filePath, 'utf8');
    const users = JSON.parse(content);
  
      const { name, age } = req.body;                   //!!! определяем стукт тела

      const id = Math.max(...users.map(user => user.id), 0) + 1;

      const newUser = { id, name, age };                      //!!! новый юзер

      users.push(newUser);
  
      writeFileSync(filePath, JSON.stringify(users, null, 2));
      res.send(newUser);
    } catch (error) {
      console.error('Error reading or parsing JSON:', error);
      res.status(500).send('Server Error');
    }
  });
  

// удаление пользователя по id
app.delete("/api/users/:id", function(req, res){
    try {
        const id = req.params.id;
        let data = readFileSync(filePath, "utf8");
        let users = JSON.parse(data);
        let index = -1;
        // находим индекс пользователя в массиве
        for(var i=0; i < users.length; i++){
            if(users[i].id==id){
                index=i;
                break;
            }
        }
        if(index > -1){
            // удаляем пользователя из массива по индексу
            const user = users.splice(index, 1)[0];
            data = JSON.stringify(users);
            writeFileSync(filePath, data);
            // отправляем удаленного пользователя
            res.send(user);
        }
        else{
            res.status(404).send();
        }
    } catch (error) {
        console.error('Error reading or parsing JSON:', error);
        res.status(500).send('Server Error');
    }

});

// обновление пользователя по id
app.put("/api/users/:id", function(req, res) {
    try {
        const id = req.params.id;
        let data = readFileSync(filePath, "utf8");
        let users = JSON.parse(data);
        let index = -1;
    
        // находим индекс пользователя в массиве
        for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            index = i;
            break;
        }
        }
    
        if (index > -1) {
        // обновляем параметры пользователя, если они присутствуют в запросе
        const updatedFields = Object.keys(req.body);
        updatedFields.forEach(field => {
            if (users[index].hasOwnProperty(field)) {
            users[index][field] = req.body[field];
            }
        });
    
        data = JSON.stringify(users);
        writeFileSync(filePath, data);
        // отправляем обновленного пользователя
        res.send(users[index]);
        } else {
        res.status(404).send();
        }
    } catch (error) {
        console.error('Error reading or parsing JSON:', error);
        res.status(500).send('Server Error');
    }

  });


app.listen(PORT, () => {
  console.log('SERVER START on port: ' + PORT);
});