const express = require('express');
const status = require('http-status');
const { param, body, query } = require('express-validator');
const { prisma, handleError } = require('../db');
const {
  checkUserIsAdmin,
} = require('../util');

const router = express.Router();

router.get('/', query('categories').isBoolean().toBoolean(), (req, res) => {
  prisma.topic.findMany({
    include: {
      categories: req.query.categories,
    },
  }).then(result => {
    res.json(result || []);
  }).catch(reason => {
    console.error(reason);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: 'failed to fetch topics',
    });
  });
});

router.get('/:id', query('categories').isBoolean().toBoolean(), param('id').isInt().toInt(10), (req, res) => {
  prisma.topic.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      categories: req.query.categories,
    },
  }).then(result => {
    res.json(result || {});
  }).catch(reason => {
    console.error(reason);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: 'failed to fetch topic',
    });
  });
});

router.post('/', checkUserIsAdmin, body('name').isString(), body('description').isString().optional({ nullable: true }), (req, res) => {
  prisma.topic.create({
    data: {
      name: req.body.name,
      description: req.body.description || null,
    },
  }).then(result => {
    res.json(result || {});
  }).catch(reason => {
    const message = handleError(reason, 'topic');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to create topic',
      });
    }
  });
});

router.patch('/:id', checkUserIsAdmin, param('id').isInt().toInt(10), (req, res) => {
  const data = {};
  const columns = ['name', 'description'];
  for (const column of columns) {
    if (column in req.body) {
      data[column] = req.body[column];
    }
  }
  prisma.topic.update({
    where: {
      id: req.params.id,
    },
    data,
  }).then(result => {
    res.json(result || {});
  }).catch(reason => {
    const message = handleError(reason, 'topic');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to update topic',
      });
    }
  });
});

router.delete('/:id', checkUserIsAdmin, param('id').isInt().toInt(10), (req, res) => {
  prisma.topic.delete({
    where: {
      id: req.params.id,
    },
  }).then(_result => {
    res.sendStatus(204);
  }).catch(reason => {
    const message = handleError(reason, 'topic');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to delete topic',
      });
    }
  });
});

module.exports = {
  router,
};
