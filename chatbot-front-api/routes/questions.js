const express = require('express');
const status = require('http-status');
const { prisma, handleError } = require('../db');
const { checkUserIsAdmin } = require('../util');

const router = express.Router();

router.get('/', checkContainsCategoryId, (req, res) => {
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

router.post('/', checkUserIsAdmin, checkContainsCategoryId, checkContainsQuestionBody, (req, res) => {
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

router.patch('/:id', checkUserIsAdmin, checkContainsId, checkContainsQuestionBody, (req, res) => {
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

router.delete('/:id', checkUserIsAdmin, checkContainsId, (req, res) => {
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

function checkContainsId(req, res, next) {
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

function checkContainsQuestionBody(_req, res, next) {
  for (const key of ['question', 'answer']) {
    if (!checkContainsKey(key)) {
      return res.status(status.BAD_REQUEST).send({
        error: `invalid ${key} param`,
      });
    }
  }
  return next();
}
function checkContainsKey(req, key) {
  if (key && (!(key in req.body) || !req.body[key])) {
    return false;
  }
  return true;
}

function checkContainsCategoryId(req, res, next) {
  const id = Number(req.query.category, 10);
  if (!id) {
    return res.status(status.BAD_REQUEST).send({
      error: 'invalid category id param',
    });
  }
  if (Number.isNaN(id)) {
    return res.status(status.BAD_REQUEST).send({
      error: 'id is not a number',
    });
  }
  req.query.category = id;
  return next();
}

module.exports = {
  router,
};
