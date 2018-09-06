if(process.env.NODE_ENV == 'production'){
module.exports = {mongoURI: 'mongodb://kharbash:sunil123@ds245772.mlab.com:45772/vidjot-prod'}
}else{
module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}