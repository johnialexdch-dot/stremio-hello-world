
/////////////////////////////////////////////////////////////
// Node JS script that logins successfully to www.zamunda.net
/////////////////////////////////////////////////////////////

const superagent = require('superagent') //HTTP library
const charset = require('superagent-charset'); //Required for Windows 1251 charset

charset(superagent);
const agent = superagent.agent() //Required for cookies storring and reusing


async function zamunda_login() {

    await agent.post('https://zamunda.net/takelogin.php')
        .buffer(true)
        .send({ username: "coyec75395", password: "rxM6N.h2N4aYe7_" })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .charset('cp1251')
        .end((error, response) => {

            // console.log(response.text)

            if (error) {
                console.error('Login Failed. Error:', error.message);

            } else {

                if (response.text.includes("coyec75395")) { //If username is found in response.text Login was sucessful
                    console.log("Login Succesful!")

                } else {
                    console.log("Login Failed!")
                }
            }

        })
}

zamunda_login()


