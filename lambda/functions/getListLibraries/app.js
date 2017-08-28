const index = require('./getListLibraries.js')

const event = {
  cam_id: 266,
  q: '기출문제',
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

index.handler(event, context, callback)


/*

vpc : Default vpc-78370911 (172.31.0.0/16)
subnet : subnet-d9266194, subnet-926d63fb
securityGroup : sg-b3e6d4db

*/
