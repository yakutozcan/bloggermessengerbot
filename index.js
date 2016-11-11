var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));
app.set('verify_token', (process.env.VERIFY_TOKEN || 'TEST'));
app.set('page_access_token', (process.env.PAGE_ACCESS_TOKEN || 'NULL'));

app.get('/', function (req, res) {
        res.send('Calisiyor! yakutozcan.blogspot.com 👻');
});

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === app.get('verify_token')) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Dogrulama kodu hatali');
    }
});

app.post('/webhook/', function (req, res) {
    console.log (req.body);
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text) {
            text = event.message.text;
            if(text == "yakut")
                {
                     sendTextMessage(sender,"haydut 😏")
                    }else if(text == "Lamba")
                {
                     sendGenericMessage(sender)
                    }else{
                     sendTextMessage(sender, "Komut yok : "+ text.substring(0, 200) + " 👻");
                }
            } else if (event.postback) {
             var Secilen = JSON.stringify(event.postback);
             var SplitSecilen = Secilen.toString().split(":"); 
             var CleanWord =  SplitSecilen[1].split("\"").join("").toString();
             console.log("GeriDonen:" + CleanWord);
             sendTextMessageImage(CleanWord);
        }
    }
    res.sendStatus(200);
});

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:app.get('page_access_token')},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Mesaj gönderilemedi: ', error);
        } else if (response.body.error) {
            console.log('Hata: ', response.body.error);
        }
    });
}
function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Lamba",
                    "subtitle": "Lamba açılsın mı?",
                    "image_url": "https://cdn2.iconfinder.com/data/icons/pictograms-vol-1/400/lamp-128.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Lamba Aç",
                        "payload":"LambaAc ",
                    }, {
                        "type": "postback",
                        "title": "Lamba Kapat",
                        "payload":"LambaKapat ",
                    }],
                }]
            }
        }
    }
    request({
       url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:app.get('page_access_token')},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Hata mesaj gonderilmedi: ', error)
        } else if (response.body.error) {
            console.log('Hata: ', response.body.error)
        }
    })
}
function sendTextMessageImage(textTCP){
    client.write(textTCP+"\n");
    if(textTCP.indexOf("LambaAc") > -1){
        sendTextMessage(sender,"Lamba Açılıyor..")
    }else if(textTCP.indexOf("LambaKapat") > -1) {
        sendTextMessage(sender,"Lamba Kapatılıyor..")
        }
client.on('data', function(data) {
    console.log('VERI: ' + data);
    client.destroy();
});
client.on('close', function() {
    console.log('Baglanti Kapandi');
});
}
app.listen(app.get('port'), function() {
    console.log('Node calisiyor: ', app.get('port'));
});
