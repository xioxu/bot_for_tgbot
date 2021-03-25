//提供给TG bot的回调地址要以这个key结尾，以防止被其它人恶意访问
const SECRET_KEY="abcd12345";

//Server酱 key，用于推送微信信息
const WechatKey = "XXXXXX";

//仅用于调试，重复信息到bot，一般应保持为空, 12345:ABCDE
const TG_KEY="";
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
        if(data.message !== undefined){
            await sendMessageWechat(data.message);
            return new Response(
                "Success",
                { status: 200 });;
        }
    }

    return new Response(
        "Accessing is not allowed.",
        { status: 403 });;
}


async function sendMessageWechat(message){
    debug(message);
    let msgUrl = `https://sc.ftqq.com/${WechatKey}.send`;
    try {
        await fetch(msgUrl,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `text=${message.text}`
            });
    }catch(e){
        console.log(e);
    }
}

async function debug(message){
    if(TG_KEY){
        var data = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    "chat_id": message.chat.id,
                    "text": message.text,
            })
          }
        fetch(`https://api.telegram.org/bot${TG_KEY}/sendMessage`, data);
    }
}