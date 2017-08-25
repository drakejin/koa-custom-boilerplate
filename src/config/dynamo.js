/*
accessKeyId     : your AWS access key id
secretAccessKey : your AWS secret access key
region          : the region where the domain is hosted
useEnvironment  : use process.env values for AWS access, secret, & region
tableName       : DynamoDB table name
dynamoDoc       : if this is set to true, the *meta* parameter will be stored 
as a subobject using DynamoDB's DocumentClient rather than as a JSON string.
*/

module.exports = {
  production: {
    accessKeyId: '######',
    secretAccessKey: '#####',
    region: 'ap-northeast-2',
    tableName: 'log',
    dynamoDoc: true,
  },
  staging: {
    accessKeyId: '######',
    secretAccessKey: '#####',
    region: 'ap-northeast-2',
    tableName: 'log.staging',
    dynamoDoc: true,
  },
  development: {
    accessKeyId: '######',
    secretAccessKey: '#####',
    region: 'ap-northeast-2',
    tableName: 'log.staging',
    dynamoDoc: true,
  },

}
