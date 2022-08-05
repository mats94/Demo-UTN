require('dotenv').config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

function sendWhatsappMessage(receiver, body){
    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            body: body,
            to: `${receiver}`
        })
        .then(message => console.log(message.sid));
}
module.exports = {
    sendWhatsappMessage
}