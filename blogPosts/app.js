const express = require('express');
const bodyParser = require("body-parser");
const sql = require('mssql');

const app = express();

const port = 3000;

// configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MSSQL database connection settings
const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'your_database',
  options: {
    encrypt: true
  }
};

// CREATE Blog Post
app.post('/blog-posts', (req, res) => {
  const { title, content } = req.body;
  const newPost = { title, content };

  (async function () {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('title', sql.NVarChar, title)
        .input('content', sql.NVarChar, content)
        .execute('sp_create_blog_post');
      res.status(201).json(newPost);
    } 
    catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create blog post' });
    }
  })();
});

// RETRIEVE Blog Posts
app.get('/blog-posts', (req, res) => {
  (async function () {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().execute('sp_get_all_blog_posts');
      res.json(result.recordset);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve blog posts' });
    }
  })();
});

// RETRIEVE Single Blog Post
app.get('/blog-posts/:id', (req, res) => {
  const id = req.params.id;
  (async function () {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('id', sql.Int, id)
        .execute('sp_get_blog_post_by_id');
      const post = result.recordset[0];
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve blog post' });
    }
  })();
});

// UPDATE Blog Post
app.put('/blog-posts/:id', (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;

  (async function () {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('title', sql.NVarChar, title)
        .input('content', sql.NVarChar, content)
        .execute('sp_update_blog_post');
      res.json({ message: 'Blog post updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update blog post' });
    }
  })();
});

// DELETE Blog Post
app.delete('/blog-posts/:id', (req, res) => {
  const id = req.params.id;
  (async function () {
    try {
      const pool = await sql.connect(dbConfig);
      await pool.request()
        .input('id', sql.Int, id)
        .execute('sp_delete_blog_post');
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete blog post' });
    }
  })();
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});