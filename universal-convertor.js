module.exports = function(RED){
  

// Text Conversion modules
function convertTextToJson(str){
var cells = str.split('\n').map(function (el) { return el.split(/\s+/); });
var headings = cells.shift();
var obj = cells.map(function (el) {
  var obj = {};
  for (var i = 0, l = el.length; i < l; i++) {
    obj[headings[i]] = isNaN(Number(el[i])) ? el[i] : +el[i];
  }
  return obj;
});
var json = JSON.stringify(obj);
return json;
}

function convertTextToCsv(str){
    let csv = str.split('\n') 
            .map(line => line.split(/\s+/).join(','))  
            .join('\n') 
            
return csv;
}

function convertTextToXML(str){
    // var parsed = JSON.parse(str)
    str = convertTextToJson(str)
        var parsed = JSON.parse(str)

    return convertJsonToXml(parsed)
}

//CSV conversion Modules
function convertCsvToText(str){
    let text = str.split('\n') 
            .map(line => line.split(',').join(' '))  
            .join('\n') 
            
return text;
}

function convertCsvToJson(str){

    var array=str.split("\n");
    let result = [];
    let headers = array[0].split(",")
    for (let i = 1; i < array.length; i++) {
        let obj = {}
        let str = array[i]
        let s = ''
        let flag = 0
        for (let ch of str) {
        	if (ch === '"' && flag === 0) {
        	flag = 1
        	}
        	else if (ch === '"' && flag == 1) flag = 0
        	if (ch === ',' && flag === 0) ch = '|'
        	if (ch !== '"') s += ch
        }
    let properties = s.split("|")
    for (let j in headers) {
    	if (properties[j].includes(",")) {
    	obj[headers[j]] = properties[j]
    		.split(",").map(item => item.trim())
    	}
    	else obj[headers[j]] = properties[j]
    }
    result.push(obj)
        
    }
  var json = JSON.stringify(result);
  return json;
}

function convertCsvToXml(str){
    var json = convertCsvToJson(str)
    str = JSON.parse(json)
    var xml = convertJsonToXml(str)

return xml;
}

//Json conversion modules
function convertJsonToXml(obj){
    
    var xml = '';
    for (var prop in obj) {
        if (obj[prop] instanceof Array) {
            for (var array in obj[prop]) {
                xml += '<' + prop + '>';
                xml += convertJsonToXml(new Object(obj[prop][array]));
                xml += '</' + prop + '>';
            }
        } else {
            xml += '<' + prop + '>';
            typeof obj[prop] == 'object' ? xml += convertJsonToXml(new Object(obj[prop])) : xml += obj[prop];
            xml += '</' + prop + '>';
        }
    }
    
     xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml;

    
}

function convertJsonToCSV(objArray) {
     let rows = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let  header = "";
    Object.keys(rows[0]).map(pr => (header += pr + ","));

    let str = "";
    rows.forEach(row => {
        let line = "";
        let columns =
            typeof row !== "object" ? JSON.parse(row) : Object.values(row);
        columns.forEach(column => {
            if (line !== "") {
                line += ",";
            }
            if (typeof column === "object") {
                line += JSON.stringify(column);
            }  else {
                line += column;
            }
        });
        str += line + "\r\n";
    });
    return header + "\r\n" + str;
}

function convertJsonToText(objArray) {
     let rows = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let  header = "";
    Object.keys(rows[0]).map(pr => (header += pr + " "));

    let str = "";
    rows.forEach(row => {
        let line = "";
        let columns =
            typeof row !== "object" ? JSON.parse(row) : Object.values(row);
        columns.forEach(column => {
            if (line !== "") {
                line += " ";
            }
            if (typeof column === "object") {
                line += JSON.stringify(column);
            }  else {
                line += column;
            }
        });
        str += line + "\r\n";
    });
    return header + "\r\n" + str;
}

// var xmlToJson = function (xml) {
//     'use strict';
//     var obj = {};
//     if (xml.nodeType == 1) {
//         if (xml.attributes.length > 0) {
//             obj["@attributes"] = {};
//             for (var j = 0; j < xml.attributes.length; j++) {
//                 var attribute = xml.attributes.item(j);
//                 obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
//             }
//         }
//     } else if (xml.nodeType == 3) { 
//         obj = xml.nodeValue;
//     }            
//     if (xml.hasChildNodes()) {
//         for (var i = 0; i < xml.childNodes.length; i++) {
//             var item = xml.childNodes.item(i);
//             var nodeName = item.nodeName;
//             if (typeof (obj[nodeName]) == "undefined") {
//                 obj[nodeName] = xmlToJson(item);
//             } else {
//                 if (typeof (obj[nodeName].push) == "undefined") {
//                     var old = obj[nodeName];
//                     obj[nodeName] = [];
//                     obj[nodeName].push(old);
//                 }
//                 obj[nodeName].push(xmlToJson(item));
//             }
//         }
//     }
//     return obj;
// };

function convert(n){
    RED.nodes.createNode(this,n);
    this.inputFormat = n.inputFormat 
    this.outputFormat = n.outputFormat 
    this.data = n.data
    this.property = n.property||"payload";
    var node = this
    this.on("input", function(msg){
    var input = node.inputFormat;
    var output = node.outputFormat;
    var str = node.data
    var outData = ""
    if(input == "plainText"){
        switch(output){
            case "json":
                outData = convertTextToJson(str);
                break;
            case "csv":
                outData = convertTextToCsv(str);
                break;
            case "xml":
                outData = convertTextToXML(str);
                break;
        }
    }
    else if(input == "csv"){
        switch(output){
            case "plainText":
                outData = convertCsvToText(str);
                break;
            case "json":
                outData = convertCsvToJson(str);
                break;
            case "xml":
                outData = convertCsvToXml(str);
                break;
        }
    }
    else if(input == "json"){
        switch(output){
            case "plainText":
                outData = convertJsonToText(str);
                break;
            case "csv":
                outData = convertJsonToCSV(str);
                break;
            case "xml":
                var obj = JSON.parse(str);
                var data = '<data>' + convertJsonToXml(obj) + '</data>';
                outData = data ;
                break;
        }
    }
    // else if(input == "xml"){
    //      switch(output){
    //          case "json":
    //              const DOMParser = context.global.get('DOMParser')
    //              const parser = new DOMParser()
    //              var xmlDoc = parser.parseFromString(str,"text/xml");

    //              var jsonText = JSON.stringify(xmlToJson(xmlDoc)); // xmlDoc = xml dom document
    // // console.log(jsonText);
    //              msg.payload = jsonText;
    //              break;
    //      }
    // }
    RED.util.setMessageProperty(msg,node.property,outData);
    node.send(msg);
    });
}
RED.nodes.registerType("universal-convertor",convert);
}