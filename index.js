const twilioService = require('./services/twilio.js')
const watsonAssistant = require('./services/watsonAssistant')
const express = require('express')
const app = express()
app.use(express.urlencoded({ extended: true }))
var usuarios = []

async function createWatsonAssistantSession(){
    return await watsonAssistant.createSession({
        assistantId: process.env.watsonAssistantSkill
    })
        .then(res => {
        console.log(res.result.session_id)
        return res.result.session_id
        })
        .catch(err => {
        console.log(err);
        });
}
async function sendToWatson(numero, mensaje){
    console.log(`Info usuario ${numero} | ${usuarios[numero]}`)
    if(usuarios[numero] == undefined){
        let session = await createWatsonAssistantSession()
        usuarios[numero] = {sessionId: session, sessionExpirationDate: new Date()}
        console.log(`Nueva Info usuario ${numero} | ${JSON.stringify(usuarios[numero])}`)
    }else if(usuarios[numero].sessionExpirationDate < new Date()){
        let session = await createWatsonAssistantSession()
        usuarios[numero] = {sessionId: session, sessionExpirationDate: new Date()}
        console.log(`Info renovada usuario ${numero} | ${JSON.stringify(usuarios[numero])}`)
    }
    watsonAssistant.message(
        {
          input: { text: mensaje, options: {return_context: true} },
          assistantId: process.env.watsonAssistantSkill,
          sessionId: usuarios[numero].sessionId
        })
        .then(response => {
          usuarios[numero].sessionExpirationDate = new Date()
          usuarios[numero].sessionExpirationDate.setMinutes( usuarios[numero].sessionExpirationDate.getMinutes() + 5 );
          console.log(`nueva fecha ${usuarios[numero].sessionExpirationDate}`)
          twilioService.sendWhatsappMessage(numero,response.result.output.generic[0].text)
        })
        .catch(err => {
            console.log(err)
        });

}
    
app.post('/twilio', async function (req, res) {
    console.log(`Nuevo mensaje de ${req.body.From} mensaje: ${req.body.Body}`)
    sendToWatson(req.body.From, req.body.Body)
    res.send('ok')
})
    
app.listen(8080)

