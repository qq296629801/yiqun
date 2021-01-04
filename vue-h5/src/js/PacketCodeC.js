// noinspection JSAnnotator
/**
 * WebSocket数据包编解码器
 *
 * @author yemao
 * @date 2019-04-21
 */
const PacketCodeC = {
  encode (packet) {
    let bytes = stringToBytes(JSON.stringify(packet))
    let buffer = new ArrayBuffer(11 + bytes.length)
    if (buffer.byteLength !== 11 + bytes.length) {
      return null
    }
    let dataView = new DataView(buffer)

    dataView.setInt32(0, 0x12345678)
    dataView.setInt8(4, packet.version)
    dataView.setInt8(5, 1) // 写死1表示json序列化
    dataView.setInt8(6, packet.command)
    dataView.setInt32(7, bytes.length)
    for (let i = 11; i < bytes.length + 11; i++) {
      dataView.setUint8(i, bytes[i - 11])
    }
    return dataView.buffer
  },
  decode (buffer) {
    let dataView = new DataView(buffer)
    let lenght = dataView.getInt32(7)
    let bytes = []
    for (let i = 11; i < lenght + 11; i++) {
      bytes[i - 11] = dataView.getUint8(i)
    }
    let json = bytesToString(bytes)
    return JSON.parse(json)
  }
}

var stringToBytes = (str) => {
  let bytes = []
  let len, c
  len = str.length
  for (let i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if (c >= 0x010000 && c <= 0x10FFFF) {
      bytes.push(((c >> 18) & 0x07) | 0xF0)
      bytes.push(((c >> 12) & 0x3F) | 0x80)
      bytes.push(((c >> 6) & 0x3F) | 0x80)
      bytes.push((c & 0x3F) | 0x80)
    } else if (c >= 0x000800 && c <= 0x00FFFF) {
      bytes.push(((c >> 12) & 0x0F) | 0xE0)
      bytes.push(((c >> 6) & 0x3F) | 0x80)
      bytes.push((c & 0x3F) | 0x80)
    } else if (c >= 0x000080 && c <= 0x0007FF) {
      bytes.push(((c >> 6) & 0x1F) | 0xC0)
      bytes.push((c & 0x3F) | 0x80)
    } else {
      bytes.push(c & 0xFF)
    }
  }
  return bytes
}

var bytesToString = (bytes) => {
  if (typeof bytes === 'string') {
    return bytes
  }
  let str = ''
  let _arr = bytes
  for (let i = 0; i < _arr.length; i++) {
    let one = _arr[i].toString(2)
    let v = one.match(/^1+?(?=0)/)
    if (v && one.length === 8) {
      let bytesLength = v[0].length
      let store = _arr[i].toString(2).slice(7 - bytesLength)
      for (let st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2)
      }
      str += String.fromCharCode(parseInt(store, 2))
      i += bytesLength - 1
    } else {
      str += String.fromCharCode(_arr[i])
    }
  }
  return str
}
export default PacketCodeC
