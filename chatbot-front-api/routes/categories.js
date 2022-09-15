const express = require('express');
const status = require('http-status');
const auth = require('./auth');
const { prisma, handleError } = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  prisma.category.findMany()
    .then(result => {
      res.json(result || []);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch categories',
      });
    });
});

router.get('/:id', checkContainsIdParam, (req, res) => {
  prisma.category.findUnique({
    where: {
      id: req.params.id,
    },
  }).then(result => {
    res.json(result || []);
  }).catch(reason => {
    console.error(reason);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: `failed to fetch category ${req.params.id}`,
    });
  });
});

router.post('/', auth.checkAccessToken, checkContainsName, (req, res) => {
  prisma.category.create({
    data: {
      name: req.body.name,
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

router.patch('/:id', auth.checkAccessToken, checkContainsIdParam, (req, res) => {
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

router.delete('/:id', auth.checkAccessToken, checkContainsIdParam, (req, res) => {
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

function checkContainsIdParam(req, res, next) {
  const id = Number(req.params.id, 10);
  if (!id) {
    return res.status(status.BAD_REQUEST).send({
      error: 'invalid id param',
    });
  }
  if (Number.isNaN(id)) {
    return res.status(status.BAD_REQUEST).send({
      error: 'id is not a number',
    });
  }
  req.params.id = id;
  return next();
}

function checkContainsName(req, res, next) {
  if (!req.body.name) {
    return res.status(status.BAD_REQUEST).send({
      error: 'missing name',
    });
  }
  return next();
}

module.exports = {
  router,
};
