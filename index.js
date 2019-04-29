const server=require("express")();
const line=require("@line/bot-sdk");
const request=require('request');

const gglplaceApi=`https://maps.googleapis.com/maps/api/place/nearbysearch/json?`;
const key="AIzaSyD1kAwMRJfaAHuEtlL3qGRDlVxde0jiyKM";
const line_config={
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
};

server.listen(process.env.PORT || 3000);
const bot=new line.Client(line_config)
server.post('/bot/webhook',line.middleware(line_config),(req,res,next)=>{
    res.sendStatus(200);
    console.log(req.body);
    let evt_prc=[];
    req.body.events.forEach((event) => {
        if(event.type=="message" && event.message.type=="text"){
            if(event.message.text=="飲食店"){
                request.get({
                    uri: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
                    headers: {'Content-type': 'application/json'},
                    qs:{
                        key: key,
                        query: "レストラン",
                        language: "ja",
                        radius: 1500,
                        location: "33.583389,130.421172"
                    },
                    json: true
                },function(err,req,data){
                    console.log(data.results);
                    const resp={
                        "type": "template",
                        "altText": "カルーセルテキスト",
                        "template":{
                            "type": "carousel",
                            "columns":[
                                {
                                    "title": "menu",
                                    "text": "text",
                                    "actions":[{
                                        "type":"message",
                                        "label":"にゃ",
                                        "text":"にゃ"
                                    }]
                                },
                                {
                                    "title": "menu2",
                                    "text": "text",
                                    "actions":[{
                                        "type":"message",
                                        "label":"にゃ",
                                        "text":"にゃ"
                                    }]
                                }
                            ]
                        }
                    };
                    bot.replyMessage(event.replyToken,resp);
                })
            }
        }
    });
});