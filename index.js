const { encodeURI: encode, decode } = require('js-base64').Base64
const querystring = require('querystring')

module.exports = {
  // Subscribe 服务器订阅接口文档
  // https://github.com/shadowsocksrr/shadowsocks-rss/wiki/Subscribe-%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%AE%A2%E9%98%85%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3
  subscribe: {
    encode(v) {
      return encode(v.map(i => `ssr://${encode(`${i.server}:${i.server_port}:${i.protocol}:${i.method}:${i.obfs}:${encode(i.password)}/?${querystring.stringify(Object.keys(i.query).reduce((obj, k) => {
        obj[k] = encode(i.query[k])
        return obj
      }, {}))}`)}`).join('\n'))
    },
    decode(v) {
      const data = []
      decode(v).split('\n').forEach(i => {
        if (!i) return
        const [items, query] = decode(i.replace(/^ssr:\/\//, '')).split('/?')
        const [server, server_port, protocol, method, obfs, _password] = items.split(':')
        const qs = querystring.parse(query)
        data.push({
          server,
          server_port,
          protocol,
          method,
          obfs,
          password: decode(_password),
          query: Object.keys(qs).reduce((obj, k) => {
            obj[k] = decode(qs[k])
            return obj
          }, {}),
        })
      })
      return data
    },
  }
}
