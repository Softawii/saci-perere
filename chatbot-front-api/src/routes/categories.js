const express = require('express');
const status = require('http-status');
const { param, body } = require('express-validator');
const { prisma, handleError } = require('../db');
const {
  isUserAuthenticated, checkAccessToken, checkUserIsAdmin,
} = require('../util');

const router = express.Router();

router.get('/', (req, res) => {
  const { isAuthenticated, userId } = isUserAuthenticated(req);
  if (isAuthenticated) {
    /* eslint-disable indent */
    prisma.$queryRaw`
      SELECT c.id, c.name, c.description, CASE WHEN f.user_id IS NOT NULL THEN true ELSE false END AS favorite
      FROM saci.category c
      LEFT OUTER JOIN saci.user_favorite f ON f.category_id = c.id and f.user_id = ${userId};
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
    prisma.category.findMany()
      .then(result => {
        res.json(result || []);
      }).catch(reason => {
        console.error(reason);
        res.status(status.INTERNAL_SERVER_ERROR).json({
          message: 'failed to fetch categories',
        });
      });
  }
});

router.get('/:id', param('id').isInt().toInt(10), (req, res) => {
  const { isAuthenticated, userId } = isUserAuthenticated(req);
  if (isAuthenticated) {
    /* eslint-disable indent */
    prisma.$queryRaw`
      SELECT c.id, c.name, c.description, CASE WHEN f.user_id IS NOT NULL THEN true ELSE false END AS favorite
      FROM saci.category c
      LEFT JOIN saci.user_favorite f ON f.category_id = c.id AND f.user_id = ${userId}
      WHERE c.id = ${req.params.id};
    `.then(result => {
      res.json(result?.[0] || {});
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch category',
      });
    });
    /* eslint-enable indent */
  } else {
    prisma.category.findUnique({
      where: {
        id: req.params.id,
      },
    }).then(result => {
      if (!result) {
        res.sendStatus(404);
        return;
      }
      res.json(result || {});
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: `failed to fetch category ${req.params.id}`,
      });
    });
  }
});

router.post('/', checkUserIsAdmin, body('name').isString(), body('description').isString().optional({ nullable: true }), (req, res) => {
  prisma.category.create({
    data: {
      name: req.body.name,
      description: req.body.description || null,
    },
  }).then(result => {
    res.json(result || {});
  }).catch(reason => {
    const message = handleError(reason, 'category');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to create category',
      });
    }
  });
});

router.post('/favorite/:id', checkAccessToken, param('id').isInt().toInt(10), (req, res) => {
  prisma.user_favorite.create({
    data: {
      category: {
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
    const message = handleError(reason, 'category|user');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to set favorite',
      });
    }
  });
});

router.delete('/favorite/:id', checkUserIsAdmin, param('id').isInt().toInt(10), (req, res) => {
  prisma.user_favorite.delete({
    where: {
      user_id_category_id: {
        category_id: req.params.id,
        user_id: req.userId,
      },
    },
  }).then(_res => {
    res.sendStatus(status.NO_CONTENT);
  }).catch(reason => {
    const message = handleError(reason, 'category');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to set favorite',
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
  prisma.category.update({
    where: {
      id: req.params.id,
    },
    data,
  }).then(result => {
    res.json(result || {});
  }).catch(reason => {
    const message = handleError(reason, 'category');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to update category',
      });
    }
  });
});

router.delete('/:id', checkUserIsAdmin, param('id').isInt().toInt(10), (req, res) => {
  prisma.category.delete({
    where: {
      id: req.params.id,
    },
  }).then(_result => {
    res.sendStatus(204);
  }).catch(reason => {
    const message = handleError(reason, 'category');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to delete category',
      });
    }
  });
});

module.exports = {
  router,
};
