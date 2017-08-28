const axios = require('axios')
const xss = require('xss')
const sqlstring = require('sqlstring')
const empty = require('is-empty')

const S3_PATH = process.env.NODE_ENV === 'production' ? 'https://s3.ap-northeast-2.amazonaws.com/moducampus' : 'https://s3.ap-northeast-2.amazonaws.com/moducampus.staging'
const SITE_DOMAIN = process.env.NODE_ENV === 'production' ? 'moducampus.com' : 'staging.moducampus.com'

const response = (e, r, m) => {
  return {
    result: e ? 'false' : 'true',
    data: r,
    message: m,
  }
}

exports.handle = (event, context, callback) => {
  if (empty(event.cam_id)) callback(null, response(1, [], 'empty "cam_id"'))
  if (empty(event.q)) callback(null, response(1, [], '검색어를 입력해 주셔야 합니다.'))
  if (empty(event.limit)) callback(null, response(1, [], 'empty "limit"'))

  const cam_id = sqlstring.escape(xss(event.cam_id))
  const q = xss(event.q)
  const limit = parseInt(xss(event.limit), 10)

  console.log(cam_id)
  console.log(q)
  console.log(limit)

  if (q.length < 2) callback(null, response(1, [], `'${q}', 검색은 두 글자 이상 입력해주셔야 합니다.`))
  if (isNaN(limit)) callback(null, response(1, [], `${limit}, limit is only accepted by type of Number`))

  const sqlCampusInfo = `
    SELECT 
      C.cam_id as cam_id,
      C.cam_name as cam_name,
      (SELECT f_save_name FROM univ_media M WHERE M.media_id = C.logo) as logo
    FROM
      univ_campus C
    WHERE
      C.status = 'opened'
        AND
      C.cam_id = ${cam_id}`

  const sqlDataSize = `
    SELECT 
      count(*) as count
    FROM
      univ_board B, univ_board_ex_rate R
    WHERE
      B.board_id = R.board_id
        AND
      B.cat_id = 4
        AND
      B.post_type='rate'
        AND
      B.status = 'public'
        AND
      B.campus_id = ${cam_id}
        AND
      (
        ${q === '교양' ? ' R.class_type = "non-major" OR ' : ''}
        ${q === '전공' ? ' R.class_type = "major" OR ' : ''}
        R.dept like ${sqlstring.escape(`%${q}%`)}
          OR
        R.class_name like ${sqlstring.escape(`%${q}%`)}
          OR
        R.professor like ${sqlstring.escape(`%${q}%`)}
          OR
        R.comment like ${sqlstring.escape(`%${q}%`)}
          OR
        R.txt_lec like ${sqlstring.escape(`%${q}%`)} 
          OR
        R.txt_tip like ${sqlstring.escape(`%${q}%`)}
      )`

  const sqlDataList = `
    SELECT 
      B.board_id,
      R.class_name,
      R.professor,
      R.rate_avg,
      R.rate_interest,
      R.rate_diffcult as rate_difficult,
      R.rate_achieve,
      R.grade,
      R.comment,
      R.txt_lec,
      R.txt_tip
    FROM
      univ_board B, univ_board_ex_rate R
    WHERE
      B.board_id = R.board_id
        AND
      B.cat_id = 4
        AND
      B.post_type='rate'
        AND
      B.status = 'public'
        AND
      B.campus_id = ${cam_id}
        AND
      (
        ${q === '교양' ? ' R.class_type = "non-major" OR ' : ''}
        ${q === '전공' ? ' R.class_type = "major" OR ' : ''}
        R.dept like ${sqlstring.escape(`%${q}%`)}
          OR
        R.class_name like ${sqlstring.escape(`%${q}%`)}
          OR
        R.professor like ${sqlstring.escape(`%${q}%`)}
          OR
        R.comment like ${sqlstring.escape(`%${q}%`)}
          OR
        R.txt_lec like ${sqlstring.escape(`%${q}%`)} 
          OR
        R.txt_tip like ${sqlstring.escape(`%${q}%`)}
      )
    ORDER BY 
      B.likes_cnt DESC, 
      B.reg_date DESC, 
      B.hits_cnt DESC 
    LIMIT 
      0,${limit}
      `
  axios.post('http://dbpool.moducampus.com/api/pool', {
    sql: `${sqlCampusInfo};${sqlDataSize};${sqlDataList}`,
    params: {},
  }).then((res) => {
    const campusInfo = res.data.data[0][0]
    const dataSize = res.data.data[1][0].count
    const dataList = res.data.data[2]
    const grade = ['비공개', 'F', 'D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+']
    dataList.filter((item) => {
      const i = item
      i.thumbnail = `${S3_PATH}/${campusInfo.logo}`
      i.link = `http://${SITE_DOMAIN}/board/view/${i.board_id}?utm_source=facebook&utm_medium=chatbot&utm_campaign=${campusInfo.cam_name}&utm_term=강의평가&utm_content=${q}`
      i.grade = grade[i.grade]
      return i
    })
    console.log(dataList)
    return {
      list: dataList,
      size: dataSize,
    }
  }).then((obj) => {
    if (obj.size === 0) {
      callback(null, response(1, [], `'${q}' 에 대한 검색 결과가 존재하지 않습니다.`))
    } else {
      callback(null, response(undefined, obj, `'${q}' 에 대한 검색 결과 입니다.`))
    }
  }).catch((error) => {
    callback(null, response(1, [], error.toString()))
  })
}
