const axios = require('axios')
const xss = require('xss')
const sqlstring = require('sqlstring')
const empty = require('is-empty')

const S3_PATH = process.env.NODE_ENV === 'production' ? 'https://s3.ap-northeast-2.amazonaws.com/moducampus' : 'https://s3.ap-northeast-2.amazonaws.com/moducampus.staging'
const SITE_DOMAIN = process.env.NODE_ENV === 'production' ? 'moducampus.com' : 'staging.moducampus.com'

const response = (e, r, m) => {
  return {
    result: e ? 'true' : 'false',
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
      univ_libraries L 
    WHERE
      L.status = '판매중'
        AND
      L.cam_id = ${cam_id}
        AND
      (
        L.kinds like ${sqlstring.escape(`%${q}%`)}
          OR
        L.class_name like ${sqlstring.escape(`%${q}%`)}
          OR
        L.professor like ${sqlstring.escape(`%${q}%`)}
          OR
        L.description like ${sqlstring.escape(`%${q}%`)}
          OR
        L.major_name like ${sqlstring.escape(`%${q}%`)}
          OR
        L.doc_title like ${sqlstring.escape(`%${q}%`)}
      )`

  const sqlDataList = `
    SELECT 
      L.id,
      IFNULL((SELECT count(R.rating) as rating FROM univ_libraries_rating R WHERE R.library_id = L.id group by R.library_id),0) as rating,
      L.class_name,
      L.professor,
      L.crspd_year,
      L.semester,
      L.kinds,
      L.description,
      L.doc_title,
      L.major,
      L.major_name,
      L.team,
      L.file_name_orig,
      L.cam_id
    FROM 
      univ_libraries L 
    WHERE
      L.status = '판매중'
        AND
      L.cam_id = ${cam_id}
        AND
      (
        L.kinds like ${sqlstring.escape(`%${q}%`)}
          OR
        L.class_name like ${sqlstring.escape(`%${q}%`)}
          OR
        L.professor like ${sqlstring.escape(`%${q}%`)}
          OR
        L.description like ${sqlstring.escape(`%${q}%`)}
          OR
        L.major_name like ${sqlstring.escape(`%${q}%`)}
          OR
        L.doc_title like ${sqlstring.escape(`%${q}%`)}
      )
    ORDER BY
      rating DESC,
      L.crspd_year DESC,
      L.reg_date DESC
    LIMIT 
      0,${limit}`

  axios.post('http://dbpool.moducampus.com/api/pool', {
    sql: `${sqlCampusInfo};${sqlDataSize};${sqlDataList}`,
    params: {},
  }).then((res) => {
    const campusInfo = res.data.data[0][0]
    const dataSize = res.data.data[1][0].count
    const dataList = res.data.data[2]
    dataList.filter((item) => {
      const i = item
      i.thumbnail = `${S3_PATH}/${campusInfo.logo}`
      i.link = `http://${SITE_DOMAIN}/intro?cam_id=${campusInfo.cam_id}&utm_source=facebook&utm_medium=chatbot&utm_campaign=${campusInfo.cam_name}&utm_term=학습자료&utm_content=${q}`
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

