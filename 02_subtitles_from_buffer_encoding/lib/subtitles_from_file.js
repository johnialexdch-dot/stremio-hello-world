// This module takes care of subtitles operations like downloading, parsing and etc.

const fetch = require('node-fetch');
const fs = require('fs');
const extract = require('extract-zip');


async function subtitles_start() {

    const input = new Set()
    input.add('https://yavka.net/subs/19089/BG')


    output = []

    try {

        for (const subtitle_link of input) {
            // console.log(subtitle_link)

            var fileName = null;

            
            if (subtitle_link.includes('yavka.net')) {
                const hidden_tockens = await yavka_get_hidden_tockens(subtitle_link)
                fileName = await yavka_download(url = subtitle_link, hidden_tockens_input = hidden_tockens) 
            }


            if (fileName != null) {

                // Extract downloaded .zip file
                const extract_output = await extract_zip(zipFilePath = fileName)
                console.log(extract_output)

                // Find subtitles file
                const subtitles_files = find_subtitles_file(extract_output)
                console.log(subtitles_files)

                // // Upload subtitles to wwww.file.io (current implementation works for single subtitle file)
                const upload_response = await upload_to_file_io(subtitles_files.extract_dir + subtitles_files.subtitles_file)
                console.log("Subtitles uploaded to:", upload_response.data.link)
                // console.log(upload_response.data)

                output.push({
                    url: upload_response.data.link,
                    lang: 'bul'
                })
            }else{
                console.log('\x1b[31m%s\x1b[0m','Subtitles Filename is Null')
            }

        }

        console.log(output)
        return output

    } catch (error) {
        console.log("Error Download Subtitles:", error)
    }

}



async function subtitles_start_buffer(input) {

    var output = []

    try {

        for (const subtitle_link of input) {
            // console.log(subtitle_link)

            // var fileName = null;
            var downloaded_buffer = null

            // Download subs from subs.sab.bz
            // if (subtitle_link.includes('subs.sab.bz')) {
            //     fileName = await subtitles_sub_sab_bz(subtitle_link)
            // }

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
                const upload_response = await upload_buffer_to_fileIO(subtitles_files_data)
                // console.log("Subtitles uploaded to:", upload_response.link)
                // console.log(upload_response.data)

                // Add file.io URLs to output
                for (const item of upload_response) {
                    // console.log(item.data.link)
                    output.push({
                        // url: 'http://127.0.0.1:11470/subtitles.vtt?from=' + item.data.link,
                        url: item.data.link,
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
        const response = await fetch(url, {
            "headers": {
                // "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                // "accept-language": "en-US,en;q=0.9",
                // "cache-control": "no-cache",
                // "pragma": "no-cache",
                // "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Microsoft Edge\";v=\"122\"",
                // "sec-ch-ua-mobile": "?0",
                // "sec-ch-ua-platform": "\"Windows\"",
                // "sec-fetch-dest": "document",
                // "sec-fetch-mode": "navigate",
                // "sec-fetch-site": "none",
                // "sec-fetch-user": "?1",
                // "upgrade-insecure-requests": "1",
                //"cookie": "ups=56f0viRjnYMY9x%2BKiBWzMQ%3D%3D; tru=hn2OxppF%2FA6pjNQRBvir5w%3D%3D; sy=hn2OxppF%2FA6pjNQRBvir5w%3D%3D; up=hn2OxppF%2FA6pjNQRBvir5w%3D%3D; PHPSESSID=2d805c2ef7ed1f2c099a51006f276e72; mybb[lastvisit]=1710584568; mybb[lastactive]=1710584568; sid=8892d7a883bcbba90ec1a7aea95e1e1a; _pk_id.1.d887=2b02db8e783a1300.1710584574.; _pk_ses.1.d887=1; _ga_FHWWTM5T6K=GS1.1.1710584574.1.0.1710584574.0.0.0; _ga=GA1.2.527299065.1710584574; _gid=GA1.2.609579916.1710584574"
            },
            // "referrerPolicy": "strict-origin-when-cross-origin",
            // "body": null,
            // "method": "GET"
        });

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
                // console.log('Hidden Tocken Line: \n', line, '\n')
                // get the hidden_tocken
                hidden_tocken = line
                break
            }

        }

        // Hidden tocken line example:
        // <input type="hidden" name="o9XpnC4" value="/xuOXqTQL6rBUswr2r9gLoSd9fPLeaBO3dQbPYF/O+vKMnj7qChZQkqblvmvv0QH/3JxOXBgawmfjRQ4qwuf4VSIcssvAJJgJ+9No2yWHVQUHIHjnopkXv/KaAnhRTHfX4YCl6JOSi+e9gb8xqa3eDMqcDHvuw/oKoJc78B7uIc=" />

        // regular expression to extract "value="" from hidden tocken
        const value_regex = /value="([^"]+)"/;

        // Use match() to find matches in the input string
        const value_matches = await hidden_tocken.match(value_regex);

        // Extract the captured subtext from the match
        const hidden_tocken_value = await value_matches && value_matches[1];

        // console.log('Hidden Tocken Value = ', hidden_tocken_value)

        // regular expression to extract "value="" from hidden tocken
        const name_regex = /name="([^"]+)"/;

        // Use match() to find matches in the input string
        const name_matches = await hidden_tocken.match(name_regex);

        // Extract the captured subtext from the match
        const hidden_tocken_name = await name_matches && name_matches[1];

        // console.log('Hidden Tocken Name = ', hidden_tocken_name)

        return {
            hidden_tocken_name: hidden_tocken_name,
            hidden_tocken_value: hidden_tocken_value
        }


    } catch (error) {
        console.error('Download failed:', error.message);
    }

}

async function yavka_download(url, hidden_tockens_input) {

    // console.log('hidden_tocken_name=', hidden_tockens_input.hidden_tocken_name)
    // console.log('hidden_tocken_value=', hidden_tockens_input.hidden_tocken_value)
    // Run the first fetch to get the hidden tocken needed to download the subtitles
    try {
        const response = await fetch(url + "/", {
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

        // get file-name from respose.headers(content-disposition)
        var fileName = null
        const contentDisposition = response.headers.get('content-disposition');
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match && match[1]) {
              fileName =  match[1];
            }
        }

        console.log('fileName = ', fileName)

        // Create a writable stream to save the file
        // const filePath = 'download/file.txt'
        const fileStream = fs.createWriteStream("download/" + fileName);

        // Pipe the response body (a readable stream) into the file stream
        response.body.pipe(fileStream);

        // Wait for the file to finish writing
        await new Promise((resolve, reject) => {
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });

        console.log(`File downloaded successfully to ${fileName}`);

        return fileName

    } catch (error) {
        console.error('Download failed:', error.message);
    }

}

async function extract_zip(zipFileName) {


    const extract_dir = process.cwd() + '\\download\\'
    const zipFilePath = extract_dir + zipFileName


    var output = []
    output.extract_dir = extract_dir

    try {
        const extract_output = await extract(zipFilePath, { dir: extract_dir })
        console.log('ZIP extraction successful. Extract dir: ', extract_dir);

        // List extracted files
        try {
            const files = fs.readdirSync(extract_dir);
            // console.log('Files in the directory:', files);
            output = files

        } catch (error) {
            console.error(`Error reading directory: ${error.message}`);
        }


    } catch (error) {
        console.error(`Error extracting ZIP: ${error.message}`);
    }

    console.log("End extract_zip()")

    return output
}

function find_subtitles_file(files) {

    const output = {}
    output.extract_dir = process.cwd() + '\\download\\'

    for (const file of files) {

        if (file.endsWith('.srt')) {
            console.log('Subtitles File Found:', file)
            output.subtitles_file = file
        }
    }

    return output

}

function upload_to_file_io(input) {

    const axios = require('axios');
    const FormData = require('form-data');
    const fs = require('fs');

    const form = new FormData();
    form.append('file', fs.createReadStream(input));
    form.append('file.name', 'sample_name');
    form.append('maxDownloads', '1');
    form.append('autoDelete', 'true');

    try {
        const output = axios.post('https://file.io/', form, {
            headers: {
                ...form.getHeaders(),
                'accept': 'application/json'
            }
        });

        return output

    } catch (error) {
        console.error('ERROR uploading file to www.file.io', error);
    }
}



module.exports = {
    subtitles_start,
}


// subtitles_start()