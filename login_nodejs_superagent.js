
////////////////////////////////////////////////////////////////////////////////
// Node JS script that logins successfully to www.zamunda.net and execute Search
////////////////////////////////////////////////////////////////////////////////

const superagent = require('superagent') //HTTP library
const charset = require('superagent-charset'); //Required for Windows 1251 charset

charset(superagent); 
const agent = superagent.agent() //Required for cookies storring and reusing


async function zamunda_login() {

    return await agent.post('https://zamunda.net/takelogin.php')
        .buffer(true)
        .send({ username: "coyec75395", password: "rxM6N.h2N4aYe7_" })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .charset('cp1251 ')
}


zamunda_login()
    .then(() => { //Execute Search
        return agent.get('https://zamunda.net/bananas?search=prison+break&gotonext=1&incldead=&field=name')
            .buffer(true)
            .charset('cp1251 ')
    })
    .then(response => {

        console.log(response.text)
    })


