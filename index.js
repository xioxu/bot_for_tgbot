//提供给TG bot的回调地址要以这个key结尾，以防止被其它人恶意访问
const SECRET_KEY="abcd12345";

//Server酱 key，用于推送微信信息
const WechatKey = "XXX";

//钉钉机器人配置，保持为空的的话则不会推送给钉钉
const DD_WEBHOOK = "https://oapi.dingtalk.com/robot/send?access_token=XXXX";
//添加钉钉机器人的时候，构选 【加签】 后会得到一个key，注意不要勾选其它安全选项
const DD_SECRET_KEY = "XXX";


/**
 * 根据CF规范注册fetch event.
 */
addEventListener('fetch', (event) => {
    event.respondWith(handleRequest(event.request));
});

/**
 * request处理函数
 * @param {Request} request the incoming request.
 */
async function handleRequest(request) {
    let url = new URL(request.url)

    if (request.method == 'POST' && url.pathname.endsWith(SECRET_KEY)) {
        let data = await request.json()
        if (data.message !== undefined) {
            await sendMessageWechat(data.message);
            sendToDingDing(data.message);

            return new Response(
                "Success",
                { status: 200 });;
        }
    }

    return new Response(
        "Accessing is not allowed.",
        { status: 403 });;
}

/**
 * 通过server酱发送信息
 */
async function sendMessageWechat(message) {
    if (WechatKey) {
        let msgUrl = `https://sc.ftqq.com/${WechatKey}.send`;
        try {
            await fetch(msgUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `text=${message.text}`
            });
        } catch (e) {
            console.log(e);
        }
    }
}


/**
 * 钉钉发送信息时候的签名函数
 */
function sign(secret, content) {
    const str = crypto.createHmac('sha256', secret).update(content)
        .digest()
        .toString('base64');
    return encodeURIComponent(str);
}

/**
 * 发送钉钉信息
 */
function sendToDingDing(message) {
    if (DD_WEBHOOK && DD_SECRET_KEY) {
        let timestamp = Date.now();
        let signStr = '&timestamp=' + timestamp + '&sign=' + sign(DD_SECRET_KEY, timestamp + '\n' + DD_SECRET_KEY);

        let msgReq = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "msgtype": "text", "text": { "content": message.text } })
        };

        fetch(DD_WEBHOOK + signStr, msgReq);
    }
}