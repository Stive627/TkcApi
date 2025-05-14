function getUrlKey(url){
    const arr = url?.split('/')
    return arr?.slice(-1)[0]
}
function getUrlKeys(array){
    const arr = array.map(elt => ({Key:getUrlKey(decodeURI(elt))})) 
    return arr
}
module.exports = {getUrlKey, getUrlKeys}