const express = require('express');
const app = express();
const port = 5000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');

app.use(express.json());
app.use(cors());

//? Test Route 
app.get('/test', (req, res) => {
  res.send('Test Route is functioning');
})

//? List all comments
app.get('/comments', async (req, res) => {

  try {
    const comments = await prisma.comment.findMany()
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//? Add a comment, with new text (from "Admin" user), with the current time
app.post('/comments', async (req, res) => {
  try {
    const newComment = await prisma.comment.create({
      data: {
        author: "Admin", 
        text: req.body.text, 
        date: new Date(), 
        likes: req.body.likes || 0, 
        image: req.body.image 
      }
    });
    res.json(newComment)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

//? Edit text of an existing comment
app.patch('/comments', async (req, res) => {
  const {id, text} = req.body

  try {
    const updatedComment = await prisma.comment.update({
      where: { id: id },
      data: { text: text }
    });
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//? Delete an existing comment by ID from the request body
app.delete('/comments', async (req, res) => {
  const { id } = req.body;

  try {
    await prisma.comment.delete({
      where: { id: id }
    });
    res.json({ message: 'Comment Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



