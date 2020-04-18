const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validarUuid(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error : 'Invalid repository ID.'})
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repositore = { id: uuid(), title, url, techs, likes:0 }

  repositories.push(repositore);

  return response.json(repositore);
});

app.put("/repositories/:id", validarUuid, (request, response,) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositoreIndex = repositories.findIndex(repositore => repositore.id === id);

    if(repositoreIndex < 0) {
      return response.status(400).json({error: 'Respository not found.'})
    }
    
    const repositore = repositories[repositoreIndex];

    repositories[repositoreIndex] = {...repositore, title, url, techs};

    return response.json(repositories[repositoreIndex]);
});

app.delete("/repositories/:id", validarUuid, (request, response) => {
  const { id } = request.params;

  const repositoreIndex = repositories.findIndex(repositore => repositore.id === id);

  if(repositoreIndex < 0) {
    return response.status(400).json({error: 'Respository not found.'})
  }

  repositories.splice(repositoreIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", validarUuid, (request, response) => {
  const { id } = request.params;

  const repositoreIndex = repositories.findIndex(repositore => repositore.id === id);

  console.log(repositoreIndex);

  if(repositoreIndex < 0) {
    return response.status(400).json({error: 'Respository not found.'})
  }

  let repositore = repositories[repositoreIndex];

  let { likes } = repositore;

  likes = likes+1;

  repositore = {...repositore, likes}

  repositories[repositoreIndex] = {...repositore};

  return response.json(repositore);
});

module.exports = app;
