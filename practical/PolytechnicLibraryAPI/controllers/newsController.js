const newsArticle = require("../models/newsArticle");
// const db2Config = require("./dbConfig").db2

const getAllNews = async (req, res) => {
  try {
    const news = await newsArticle.getAllNews();
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving news");
  }
};

const getNewsById = async (req, res) => {
  const newsId = parseInt(req.params.newsid);
  try {
    const news = await newsArticle.getNewsById(newsId);
    if (!news) {
      return res.status(404).send("News Article not found");
    }
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving news");
  }
};

const createNews = async (req, res) => {
  const newNewsArticle = req.body;
  try {
    const createdNews = await newsArticle.createNews(newNewsArticle);
    res.status(201).json(createdNews);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating news");
  }
};

const updateNews = async (req, res) => {
  const newsId = parseInt(req.params.newsid);
  const newArticleData = req.body;

  try {
    const updatedNewsArticle = await newsArticle.updateNews(newsId, newArticleData);
    if (!updatedNewsArticle) {
      return res.status(404).send("News not found");
    }
    res.json(updatedNewsArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating news");
  }
};

const deleteNews = async (req, res) => {
  const newsId = parseInt(req.params.newsid);

  try {
    const success = await newsArticle.deleteNews(newsId);
    if (!success) {
      return res.status(404).send("News not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting news");
  }
};

module.exports = {
  getAllNews,
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
};