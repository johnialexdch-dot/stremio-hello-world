
/////////////////////////////////////////////////////////
// Node JS script that fails to login to www.zamunda.net
/////////////////////////////////////////////////////////

const axios = require('axios');
const { wrapper }  = require('axios-cookiejar-support'); //https://github.com/3846masa/axios-cookiejar-support
const { CookieJar }  = require('tough-cookie');
const iconv = require('iconv-lite');

// Create a new CookieJar
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function zamunda_login() {
    try {

        // Make a POST request to perform the login
        const response = await client.post('https://zamunda.net/takelogin.php', {
            username: "coyec75395",
            password: "rxM6N.h2N4aYe7_"
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },

            responseType: 'arraybuffer', // Buffer the response
        });

        // Decode the response using iconv-lite with Windows-1251 encoding
        const decodedResponse = iconv.decode(response.data, 'win1251');
        
        // console.log(decodedResponse);
        
        if (decodedResponse.includes("coyec75395")){ //If username is found in decodedResponse Login was sucessful
            console.log("Login Successful")
        }else{
            console.log("Login Failed")
        }

    } catch (error) {
        // Handle errors
        console.error('Login Failed. Error:', error.message);
        throw error;
    }
}

zamunda_login();