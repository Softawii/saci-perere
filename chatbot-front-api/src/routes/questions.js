const express = require('express');
const status = require('http-status');
const { param, query, body } = require('express-validator');
const { prisma, handleError } = require('../db');
const {
  checkUserIsAdmin, checkAccessToken, validateRequest, cache, objectHash,
} = require('../util');

const router = express.Router();

router.get('/unknown', query('page').isInt().toInt(10).default(1), checkAccessToken, async (req, res) => {
  const { page } = req.query;
  const pageSize = 50;
  const cacheKey = objectHash({
    ...req.body,
    url: req.originalUrl,
  });
  console.log({cacheKey});
  const isCached = cache.has(cacheKey);
  if (isCached) {
    res.json(cache.get(cacheKey));
  } else {
    const count = await prisma.unknown_question.count();
    prisma.unknown_question.findMany({
      take: pageSize,
      skip: pageSize * (page - 1),
    }).then(result => {
      const data = {
        data: result,
        count,
        pageSize,
        pages: Math.ceil(count / pageSize),
      };

      cache.set(cacheKey, data);
      res.json(data);
    }).catch(reason => {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to fetch unknown questions',
      });
    });
  }
});

router.delete('/unknown/:id', checkUserIsAdmin, param('id').isInt().toInt(10), validateRequest, (req, res) => {
  prisma.unknown_question.delete({
    where: {
      id: req.params.id,
    },
  }).then(result => {
    res.sendStatus(status.NO_CONTENT);
  }).catch(reason => {
    const message = handleError(reason, 'unknown question');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to delete unknown question',
      });
    }
  });
});

router.get('/', query('category').isInt().toInt(10), validateRequest, (req, res) => {
  prisma.question.findMany({
    where: {
      category_id: req.query.category,
    },
  }).then(result => {
    res.json(result || []);
  }).catch(reason => {
    console.error(reason);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: 'failed to fetch questions',
    });
  });
});

router.get('/:id', param('id').isInt().toInt(10), validateRequest, (req, res) => {
  prisma.question.findUnique({
    where: {
      id: req.params.id,
    },
  }).then(result => {
    res.json(result || {});
  }).catch(reason => {
    console.error(reason);
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: 'failed to fetch question',
    });
  });
});

router.post('/', checkUserIsAdmin, query('category').isInt().toInt(10), body(['question', 'answer']).isString(), validateRequest, (req, res) => {
  prisma.question.create({
    data: {
      value: req.body.question,
      category: {
        connect: {
          id: req.query.category,
        },
      },
      answer: {
        create: {
          value: req.body.answer,
        },
      },
    },
    include: {
      answer: true,
      category: true,
    },
  }).then(result => {
    res.json(result || {});
  }).catch(reason => {
    const message = handleError(reason, 'question');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to create question',
      });
    }
  });
});

router.patch('/:id', checkUserIsAdmin, param('id').isInt().toInt(10), body(['question', 'answer']).isString(), validateRequest, (req, res) => {
  prisma.question.update({
    where: {
      id: req.params.id,
    },
    data: {
      value: req.body.question,
      answer: {
        update: {
          value: req.body.answer,
        },
      },
    },
    include: {
      answer: true,
    },
  }).then(result => {
    res.json(result || {});
  }).catch(reason => {
    const message = handleError(reason, 'question');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to update question',
      });
    }
  });
});

router.delete('/:id', checkUserIsAdmin, param('id').isInt().toInt(10), validateRequest, (req, res) => {
  prisma.question.delete({
    where: {
      id: req.params.id,
    },
  }).then(result => {
    const answerId = result.answer_id;
    // If answer is not referenced by any question, delete
    prisma.question.findFirst({
      where: {
        answer_id: answerId,
      },
    }).then(question => {
      if (!question) {
        prisma.answer.delete({
          where: {
            id: answerId,
          },
        }).then(_answer => {
          // deleted with success
        }).catch(reason => {
          console.error(`failed to delete answer "${answerId}"}`, reason);
        });
      } else {
        // is referenced somewhere else, not deleting
      }
    }).catch(reason => {
      console.error(`failed to find related questions with answer_id "${answerId}"}`, reason);
    });
    res.sendStatus(status.OK);
  }).catch(reason => {
    const message = handleError(reason, 'question');
    if (message) {
      res.status(status.BAD_REQUEST).json({
        message,
      });
    } else {
      console.error(reason);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        message: 'failed to delete question',
      });
    }
  });
});

module.exports = {
  router,
};
