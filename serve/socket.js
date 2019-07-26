let ws = require('ws') //引入websocket模块
let uuid = require('uuid') //引入创建唯一id模块
let qs = require('qs');
const jwt = require('jsonwebtoken')

let socketServe = ws.Server;
let wss = new socketServe({ port: 3100 });
let clients = []; //创建客户端列表，用于保存客户端及相关连接信息
let clientIndex = 0


/* 验证身份 */
function checkUser(url) {
    if (url && url.includes("?")) {
        let prarms = qs.parse(url.split('?')[1]);
        if (!prarms) {
            return false
        }
        let token = prarms.token
        let secretOrPrivateKey = "key100"; // 这是加密的key（密钥）
        let pass = null
        jwt.verify(token, secretOrPrivateKey, function(err, decode) {
            if (err) { //  时间失效的时候/ 伪造的token
                pass = false
            } else {
                pass = decode
            }
        })
        return pass
    } else {
        return false
    }
}
/**
 * 广播所有客户端消息
 * @param {String} type  广播方式（admin为系统消息，user为用户消息）
 * @param {String} message   消息
 * @param {String} nickname  用户昵称，广播方式为admin时可以不存在
 */
function broadcastSend(type, message, nickname, id) {
    console.log(id, 111);
    clients.forEach((client, index) => {
        if (client.ws.readyState === ws.OPEN) {
            if (type === 'user') {
                type = id === client.id ? 'userSelf' : type
            }
            client.ws.send(JSON.stringify({ type, nickname, message }))
        }
    })
}

//监听连接
wss.on('connection', (ws, req) => {
    console.log(req.url, 22);
    let clientObj = checkUser(req.url);
    /* 如果没通过身份，就关闭连接 */
    if (clientObj === false) {
        ws.close()
        return
    }
    let client_uuid = uuid.v4();
    let nickname = clientObj.name
    clients.push({
        id: client_uuid,
        ws,
        nickname
    });
    console.log(`client ${client_uuid} connected`);
    //关闭服务，从客户端监听列表删除
    function closeSocket() {
        for (let i = 0; i < clients.length; i++) {
            console.log(clients[i], 2);
            if (clients[i].id === client_uuid) {
                let disconnect_message = `${nickname} has disconnected`;
                broadcastSend('admin', disconnect_message, nickname);
                clients.splice(i, 1)
            }
        }
    }
    /* 监听消息 */
    ws.on('message', message => {
        broadcastSend('user', message, nickname, client_uuid);
    })

    ws.on('close', function() {
        closeSocket();
    })
})

module.exports = wss