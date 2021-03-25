# 部署方法

## 准备
1. 注册一个telegram bot，记录bot的token
1. 注册server酱，获得一个token
2. 注册Cloudflare
   
## 开始部署
### 代码修改
1. 打开代码index.js
1. 修改代码中的 SECRET_KEY 为一个不易被人知晓的值
2. 把在server酱获取到的key填入 WechatKey
3. TG_KEY可以保持为空

### CF
1. 基于index.js中的代码， 打开Cloudflare，创建一个worker，默认会分配一个域名
2. 如果需要使用自己域名访问的话，需要配置上route，例如配置为  tg.yourdomain.com/bot*
3. 使用自己域名的情况下记得添加DNS A记录 tg.yourdomain.com 到任意ip地址，只要开启proxied就可以

### 配置telegram bot回调地址
1. 浏览器直接访问 访问 https://api.telegram.org/bot（token）/setwebhook?url=callback url
2. 注意这里回调地址需要以代码中的SECRET_KEY保持一致，例如https://tg.yourdomain.com/bot/abcd12345
   
至此配置完成。

## 调试
直接在TG上给bot发送信息，信息应该可以通过server酱发送到微信上，如果没有收到的话多半是回调地址不正确, 另外也可能是server酱的问题，可以在代码中把bot的token填入TG_KEY, 然后在TG上发给bot的信息会自动收到同样内容。

实测发现server酱有时候延迟比较大，因此可以先使用TG测试通的话再清除 TG_KEY 的值就可以了。