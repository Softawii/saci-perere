const express = require('express');
const status = require('http-status');
const { param, body, query } = require('express-validator');
const { prisma, Prisma, handleError } = require('../db');
const {
  checkUserIsAdmin, validateRequest, checkAccessToken, isUserAuthenticated,
} = require('../util');

const router = express.Router();

router.get('/', query('categories').isBoolean().toBoolean().optional({ nullable: true }), validateRequest, (req, res) => {
  const { isAuthenticated, userId } = isUserAuthenticated(req);
  if (isAuthenticated) {
    /* eslint-disable indent */
    prisma.$queryRaw`
      SELECT t.id, t.name, t.description, CASE WHEN f.user_id IS NOT NULL THEN true ELSE false END AS favorite
      FROM saci.topic t
      LEFT OUTER JOIN saci.user_topic_favorite f ON f.topic_id = t.id and f.user_id = ${userId};
    `.then(result => {
      res.json(result || []);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch categories',
      });
    });
    /* eslint-enable indent */
  } else {
    prisma.topic.findMany({
      include: {
        categories: req.query.categories === true,
      },
    }).then(result => {
      res.json(result || []);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch topics',
      });
    });
  }
});

router.get('/:id', query('categories').isBoolean().toBoolean().optional({ nullable: true }), param('id').isInt().toInt(10), validateRequest, (req, res) => {
  prisma.topic.findUnique({
    where: {
      id: req.params.id,
    },
    include: {
      categories: req.query.categories === true,
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

router.post('/', checkUserIsAdmin, body('name').isString(), body('description').isString().optional({ nullable: true }), validateRequest, (req, res) => {
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

router.patch('/:id', checkUserIsAdmin, param('id').isInt().toInt(10), validateRequest, (req, res) => {
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

router.delete('/:id', checkUserIsAdmin, param('id').isInt().toInt(10), validateRequest, (req, res) => {
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

router.post('/favorite/:id', checkAccessToken, param('id').isInt().toInt(10), validateRequest, (req, res) => {
  prisma.user_topic_favorite.create({
    data: {
      topic: {
        connect: {
          id: req.params.id,
        },
      },
      user: {
        connect: {
          id: req.userId,
        },
      },
    },
  }).then(_res => {
    res.sendStatus(status.CREATED);
  }).catch(reason => {
    const message = handleError(reason, 'topic|user');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to set favorite topic',
      });
    }
  });
});

router.delete('/favorite/:id', checkUserIsAdmin, param('id').isInt().toInt(10), validateRequest, (req, res) => {
  prisma.user_topic_favorite.delete({
    where: {
      user_id_topic_id: {
        topic_id: req.params.id,
        user_id: req.userId,
      },
    },
  }).then(_res => {
    res.sendStatus(status.NO_CONTENT);
  }).catch(reason => {
    const message = handleError(reason, 'topic');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to delete favorite topic',
      });
    }
  });
});

module.exports = {
  router,
};
