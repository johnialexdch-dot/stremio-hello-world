const fetch = require('node-fetch');
const fs = require('fs');
const AdmZip = require('adm-zip');
const axios = require('axios');
const FormData = require('form-data');


async function subtitles_start() {

    var output = []

    const input = new Set()
    input.add('https://yavka.net/subs/19089/BG')

    try {

        for (const subtitle_link of input) {
            // console.log(subtitle_link)

            // var fileName = null;
            var downloaded_buffer = null

            if (subtitle_link.includes('yavka.net')) {
                const hidden_tockens = await yavka_get_hidden_tockens(subtitle_link)
                downloaded_buffer = await yavka_download(url = subtitle_link, hidden_tockens_input = hidden_tockens) // With backslash at the end of the url
            }


            if (downloaded_buffer != null) {

                // Extract downloaded .zip file
                const extract_output_buffer = await extract_into_memory(downloaded_buffer)
                // console.log(extract_output)

                // Find subtitles file
                const subtitles_files_data = await find_subtitles_file(extract_output_buffer)
                console.log(subtitles_files_data)

                // Upload subtitles to wwww.file.io (current implementation works for single subtitle file)
                // const upload_response = await upload_buffer_to_fileIO(subtitles_files_data)
                // console.log("Subtitles uploaded to:", upload_response.link)
                // console.log(upload_response.data)

                 // Add file.io URLs to output
                //  for (const item of upload_response) {
                //     // console.log(item.data.link)
                //     output.push({
                //         // url: 'http://127.0.0.1:11470/subtitles.vtt?from=' + item.data.link,
                //         url: item.data.link,
                //         lang: 'bul'
                //     })
                // }

                const upload_response = await upload_to_local_server(subtitles_files_data)

                // Add file.io URLs to output
                for (const item of upload_response) {
                    // console.log(item.data.link)
                    output.push({
                        // url: 'http://127.0.0.1:11470/subtitles.vtt?from=' + item.data.link,
                        url: upload_response,
                        lang: 'bul'
                    })
                }




            } else {
                console.log('\x1b[31m%s\x1b[0m', 'Subtitles Filename is Null')
            }

        }

        // const wait_seconds = await waitSeconds(seconds = 3)
        // return output

    } catch (error) {
        console.log("Error Download Subtitles:", error)
    }

    console.log('Output = ', output)
    return output
}

async function yavka_get_hidden_tockens(url) {

    // Run the first fetch to get the hidden tocken needed to download the subtitles
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to download file, status ${response.status}`);

        }

        console.log('Response is OK')

        const response_text = await response.text()
        const response_lines = response_text.split('\n')

        // the search query will find the line before the line with hidden_tocken
        const search_query = 'action = "' + url + '/" method = "POST">'
        var hidden_tocken_found = false
        var hidden_tocken

        // loop over each line in response_text
        for (const line of response_lines) {

            // look for line before the line with hidden_tocken
            if (line.includes(search_query)) {
                // console.log(line)
                hidden_tocken_found = true
                continue
            }

            // look for line with hidden_tocken
            if (hidden_tocken_found == true) {
                console.log('Hidden Tocken Line: \n', line, '\n')
                // get the hidden_tocken
                hidden_tocken = line
                break
            }

        }

        // regular expression to extract "value="" from hidden tocken
        const value_regex = /value="([^"]+)"/;

        // Use match() to find matches in the input string
        const value_matches = await hidden_tocken.match(value_regex);

        // Extract the captured subtext from the match
        const hidden_tocken_value = await value_matches && value_matches[1];

        console.log('Hidden Tocken Value = ', hidden_tocken_value)

        // regular expression to extract "value="" from hidden tocken
        const name_regex = /name="([^"]+)"/;

        // Use match() to find matches in the input string
        const name_matches = await hidden_tocken.match(name_regex);

        // Extract the captured subtext from the match
        const hidden_tocken_name = await name_matches && name_matches[1];

        console.log('Hidden Tocken Name = ', hidden_tocken_name)

        return {
            hidden_tocken_name: hidden_tocken_name,
            hidden_tocken_value: hidden_tocken_value
        }

    } catch (error) {
        console.error('Download failed:', error.message);
    }

}

async function yavka_download(url, hidden_tockens_input) {

    console.log('hidden_tocken_name=', hidden_tockens_input.hidden_tocken_name)
    console.log('hidden_tocken_value=', hidden_tockens_input.hidden_tocken_value)
    // Run the first fetch to get the hidden tocken needed to download the subtitles
    try {
        const response = await fetch(url+ "/", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "Referer": url,
            },
            "body": hidden_tockens_input.hidden_tocken_name + "=" + encodeURIComponent(hidden_tockens_input.hidden_tocken_value) + "&lng=BG",
            "method": "POST"
        });

        if (!response.ok) {
            throw new Error(`Failed to download file, status ${response.status}`);
        }

        console.log('Response is OK')
        // console.log('Response Headers', response.headers)

        const buffer = await response.buffer(); // Get the response body as a buffer
        return buffer

    } catch (error) {
        console.error('Download failed:', error.message);
    }

}


async function extract_into_memory(buffer) {

    ////////////////////////////////////////////////////////////////////////////
    // EXTRACT INTO MEMORY
    ////////////////////////////////////////////////////////////////////////////


    const zip = new AdmZip(buffer); // Create a new instance of AdmZip with the buffer
    const zipEntries = zip.getEntries(); // Get all entries in the zip archive

    // Extract each entry into memory
    const extractedFiles = zipEntries.map(entry => {
        return {
            name: entry.entryName,
            data: entry.getData()
        };
    });
    console.log("Extracted file = ", extractedFiles)

    return extractedFiles

    // console.log('Extracted File, File 1 = ', extractedFiles[0].data)

}

function find_subtitles_file(buffer_array) {

    var output = []

    for (const item of buffer_array) {

        if (item.name.endsWith('.srt')) {
            console.log('Subtitles File Found:', item.name)
            output.push(item)
        }
    }

    return output

}

async function upload_buffer_to_fileIO(input) {

    var output = []

    for (const item of input) {

        subs_filename = item.name
        subs_encoded_data = item.data.toString('utf-8')
        // console.log(subs_encoded_data)

        const form = new FormData();
        form.append('name', subs_filename)
        form.append('text', subs_encoded_data)
        form.append('maxDownloads', '1');
        form.append('autoDelete', 'true');

        try {
            const axios_output = await axios.post('https://file.io/', form, {
                headers: {
                    ...form.getHeaders(),
                    'accept': 'application/json'
                }
            });

            // console.log('axios_output = ', axios_output)
            output.push(axios_output)

        } catch (error) {
            console.error('ERROR uploading file to www.file.io', error);
        }

        return output

    }
}

async function upload_to_local_server(input) {

    const http = require('http');
    // const fs = require('fs');
    // const path = require('path');


    // console.log(input[0].data.toString('utf-8'))

    const server = http.createServer((req, res) => {

        const data = input[0].data.toString('utf-8')
        res.writeHead(200, { 'Content-Type': 'text/plain;charset=UTF-8' });
        res.end(data);


    });

    const PORT = 3000;
  
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });

    return `http://localhost:${PORT}`

}

module.exports = {
    subtitles_start,
}


