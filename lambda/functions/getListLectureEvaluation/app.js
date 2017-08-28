const getListLectureEvaluation = require('./getListLectureEvaluation.js')

const event = {
  cam_id: 266,
  q: '독일',
  limit: 5,
}

const context = {
  succeed(result) {
    console.log('====== succeed start =====')
    console.log(result)
    console.log('====== succeed end =====')
  },
  fail(err) {
    console.log('====== fail start =====')
    console.log(err)
    console.log('====== fail start =====')
  },
  done(err, result) {
    console.log('====== done start =====')
    console.log(err)
    console.log(result)
    console.log('====== done end =====')
  },
  functionName: 'getListLectureEvaluation',
}

const callback = (err, result) => {
  console.log('====== callback start =====')
  console.log(err)
  console.log(result)
  console.log('====== callback end =====')
}

getListLectureEvaluation.handler(event, context, callback)
