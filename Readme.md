# 背景
在我们使用TG的bot后，其实是希望可以及时获取到bot的推送信息的，但是因为XXX的缘故，我们需要找寻另外的方法接受推送的信息。

# 技术原理
本项目技术原理比较简单，就是利用了TG bot的回调url，在机器人收到信息后，将之转发到 **微信** 或者 **钉钉** ，其中微信推送使用的是server酱。

# 服务器成本
我们可以利用cloudflare进行部署，因此是 零成本。

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

## 发送给钉钉机器人
1. 在创建机器人后我们会获得一个webhook和一个secret key，将之填入代码相应位置即可。

## 注意
1. 在钉钉中可以随意添加一个人创建群组，继而就可以添加钉钉机器人了
2. 在添加机器人的时候，需要注意安全选项只能用**签名**那一个选项，其它不要勾选
3. 在机器人添加好后，可以编辑群组，移除掉其它成员后群组依然可以接受机器人信息