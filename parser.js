
module.exports =  function(fullCmd) {


    let command = fullCmd.substring(0, fullCmd.indexOf('<'));
    fullCmd = fullCmd.replace(command, '');
    fullCmd = fullCmd.replace(/</g, '');
    fullCmd = fullCmd.replace(/>/g, ' '); //(new RegExp('>','g'),' ');
    fullCmd = fullCmd.replace(/\r\n/g, '');
// JS object
    const obj = {COMMAND: command};
    let parts = fullCmd.split(/\s+/);
    parts.forEach((e) => {
        let name = e.substring(0, e.indexOf('='));
        let value = e.substring(e.indexOf('=') + 1, e.length);
        if (name !== '') {
            if (value == 'TRUE' | 'FALSE') value = value === 'TRUE' ? true : false;
            if (!isNaN(parseFloat(value))) value = parseFloat(value);
            obj[name] = value;
        }
    });
// json string
    let json = JSON.stringify(obj, null, 4);

    let msgJson = {payload: json, topic: "Json string"};
    let msgObj = {payload: obj, topic: "JS object"};

    return [msgJson, msgObj]

}