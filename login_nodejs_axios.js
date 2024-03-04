
/////////////////////////////////////////////////////////
// Node JS script that fails to login to www.zamunda.net
/////////////////////////////////////////////////////////

const axios = require('axios');
const iconv = require('iconv-lite');

async function zamunda_login() {
    try {
        // Make a POST request
        const response = await axios.post('https://zamunda.net/takelogin.php', {
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
        console.log(decodedResponse);
        return decodedResponse;

    } catch (error) {
        // Handle errors
        console.error('Error:', error.message);
        throw error;
    }
}

zamunda_login();