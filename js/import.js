var dataxml = '';

var buoyXML = '';
var sensorXML = '';
var commXML = '';
var telegramXML = '';

var mode = 1;

var filename = '';
$(document).ready(function() {

	//updateAppName();
	updateUserName();

	// $(document).on('click', '.browse', function() {
	// 	var file = $(this).parent().parent().parent().find('.file');
	// 	file.trigger('click');
	// });

	// $(document).on('change', '.file', function() {

	// 	var file = $(this).prop('files')[0];
	// 	document.getElementById("selectedFile").value = file.name;
	// 	document.getElementById("upload").disabled = false;
	// 	document.getElementById("uploadFW").disabled = false;

	// });

	$("#xmlDLCofig").click(function() {	createXMLFile(); });
	$("#xmlDLCofig_csv").click(function() {	create_CSV_File(); });

	
	 $("#xmlDLData").click(function() {downLoadDataFile();});
	 $("#xmlDLLog").click(function() {downLoadLogFile();});

	 
	 
	// $("#reset").click(function() {reset();});

});

function setMode(option){

	mode = option;
}

/*
function downLoadLogFile() {

		$.ajax({
			cache : false,
			url : 'log/CTI_SeaL_Log.log',
			type : 'GET',
			dataType : "text",
			success : function(data) {

				var date = new Date();

				var date_str = ('0' + date.getDate()).substr(-2, 2)
						+ '_'
						+ ('0' + (date.getMonth() + 1)).substr(-2, 2)
						+ '_'
						+ (date.getFullYear() + '_' + date.getHours() + '_'
								+ date.getMinutes() + ':' + ('0' + date
								.getSeconds()).substr(-2, 2));

				var filename = "log_" + date_str + ".log";

				//var datas = formatLog(data);

				var blob = new Blob([ data ], {
					type : "text/plain;charset=utf-8"
				});
				saveAs(blob, filename);
			}
		});

	}
*/

$(function() {
	$("#submitcontinue").bind("click", function() {
		var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xml)$/;
		if (regex.test($("#fileBrowse").val().toLowerCase())) {
			if (typeof (FileReader) != "undefined") {
				var reader = new FileReader();
				reader.onload = function(e) {

					if(mode === 1){
					var xml = jQuery(e.target.result);

					uploadXML(xml);
				}else{
					alert(e.target.result);
					}
				}
				if(mode === 1)
					reader.readAsText($("#fileBrowse")[0].files[0]);
				else
				reader.readAsArrayBuffer($("#fileBrowse")[0].files[0]);
				
			} else {
				alert("This browser does not support HTML5.");
			}
		} else {
			alert("Please upload a valid XML file.");
		}
	});
});



function uploadXML(xml) {

	var buoy = jQuery(xml).find("buoy");

	var bxml = getXMLAString(buoy);

	var sensors = jQuery(xml).find("sensors");

	var sxml = getXMLAString(sensors);

	var comm = jQuery(xml).find("communications");

	var cxml = getXMLAString(comm);

	var tele = jQuery(xml).find("telegrams");

	var txml = getXMLAString(tele);

	var root = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE xml><databuoy>\n';

	var b = root + bxml + "</databuoy>";
	var s = root + sxml + "</databuoy>";
	var c = root + cxml + "</databuoy>";
	var t = root + txml + "</databuoy>";
	
	console.log(b);
	console.log(s);
	console.log(c);
	console.log(t);


	// Uploading Buoy
	$.ajax({
		url : '/cgi-bin/BuoyConfig.cgi', // CGI URL
		type : "POST",
		dataType : "text",
		contentType : "text/xml",
		cache : false,
		async : false,
		data : b,
		success : function(d) {
			b = '0';
		}
	});

	// Uploading Sensor
	$.ajax({
		url : '/cgi-bin/SensorConfig.cgi', // CGI URL
		type : "POST",
		async : false,
		cache : false,
		dataType : "text",
		contentType : "text/xml",
		data : s,
		success : function(d) {
			s = '0';
		}
	});

	// Uploading Communication
	// pending Comm CGI URL
	$.ajax({
		url : '/cgi-bin/CommunicationConfig.cgi', // CGI URL
		type : "POST",
		async : false,
		cache : false,
		dataType : "text",
		contentType : "text/xml",
		data : c,
		success : function(d) {
			c = '0';
		}
	});

	// Uploading Telegram
	$.ajax({
		url : '/cgi-bin/Telegram.cgi', // CGI URL
		type : "POST",
		async : false,
		cache : false,
		dataType : "text",
		contentType : "text/xml",
		data : t,
		success : function(d) {
			t = '0';
		}
	});

	if (b === '0' && s === '0' && c === '0' && t === '0') {

		alert("Configuration uploaded successfully");

	} else {

		alert("Parsing error.\nPlease check config file.");

	}

}


function downLoadDataFile() {
	
		// Buoy Data
	$.ajax({
		cache : false,
		async : false,
		url : "cgi-bin/downloadRecords.cgi",
		type : 'GET',
		dataType : "text",
		success : function(data) {
				//alert(data);
				window.location.replace(data);
				//window.location.replace("tmp/Recordings.tar.bz");
		}
	});
}

function saveDataFile() {
	
		$.ajax({
		cache : false,
		async : false,
		url : "tmp/Recordings.tar.bz",
		type : 'GET',
		dataType : "text",
		success : function(data) {
			
		}
	});

}

function downLoadLogFile() 
{
	// Buoy Data
	$.ajax({
		cache : false,
		async : false,
		url : "cgi-bin/downloadLog.cgi",
		type : 'GET',
		dataType : "text",
		success : function(data) {
				window.location.replace(data);
				//window.location.replace("tmp/CTI_SeaL_Log.tar.bz2");
		}
	});
}

function saveLogFile() {
	
		$.ajax({
		cache : false,
		async : false,
		url : "tmp/Recordings.tar.bz2",
		type : 'GET',
		dataType : "text",
		success : function(data) {
			
		}
	});

}

function create_CSV_File()
{
	// Buoy Data
	$.ajax({
		cache : false,
		async : false,
		url : "cgi-bin/download_CSV.cgi",
		type : 'GET',
		dataType : "text",
		success : function(data) {
				window.location.replace(data);
				//window.location.replace("tmp/CTI_SeaL_Log.tar.bz2");
		}
	});

}

function createXMLFile() {

	// Buoy Data
	$.ajax({
		cache : false,
		async : false,
		url : "xml/BuoyConfig.xml",
		type : 'GET',
		dataType : "text",
		success : function(data) {
			buoyXML = jQuery(data);
		}
	});

	// Sensor Data
	$.ajax({
		cache : false,
		async : false,
		url : "xml/SensorConfig.xml",
		type : 'GET',
		dataType : "xml",
		success : function(data) {
			sensorXML = jQuery(data);
		}
	});

	// Communication Data
	$.ajax({
		cache : false,
		async : false,
		url : "xml/CommConfig.xml",
		type : 'GET',
		dataType : "xml",
		success : function(data) {
			commXML = jQuery(data);
		}
	});

	// Telegram Data
	$.ajax({
		cache : false,
		async : false,
		url : "xml/TelegramConfig.xml",
		type : 'GET',
		dataType : "xml",
		success : function(data) {
			telegramXML = jQuery(data);
		}
	});

	// <buoy LocationID="Chennai" LoggerID="Nor-1" lat="55.66" lon="66.55" serial="CTI-Seal-001"></buoy>

	var root = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE xml><databuoy>\n';

	var b = buoyXML.find("buoy");

	var locationid = jQuery(b).attr("LocationID");

	var buoyid = jQuery(b).attr("LoggerID");

	var buoyElement = getXMLAString(buoyXML.find("buoy"));

	var sensorElement = getXMLAString(sensorXML.find("sensors"));

	var commElement = getXMLAString(commXML.find("communications"));

	var telegramElement = getXMLAString(telegramXML.find("telegrams"));

	var finalXML = root + buoyElement + sensorElement + commElement
			+ telegramElement + '</databuoy>';

	console.log(finalXML);
	console.log("\n------------------------------------------------\n");
	finalXML = vkbeautify.xml(finalXML);
	
	console.log(finalXML);
	
	var time = new Date();

	var dateString = addZ(time.getDate()) + "_" + addZ(time.getMonth() + 1)
			+ "_" + time.getFullYear() + "_" + time.getHours() + "_"
			+ time.getMinutes() + "_" + time.getSeconds();

	filename = buoyid + "_" + locationid + "_" + dateString + ".xml";

	var blob = new Blob([ finalXML ], {
		type : "text/plain;charset=utf-8"
	});

	saveAs(blob, filename);

}

function addZ(n) {
	return n < 10 ? '0' + n : '' + n;
}

function getXMLAString(xml) {

	var xmlString = '';

	if (window.ActiveXObject) {

		xmlString = xml.xml;

	} else {

		var oSerializer = new XMLSerializer();

		xmlString = oSerializer.serializeToString(xml[0]);

	}

	xmlString = xmlString.replace('xmlns="http://www.w3.org/1999/xhtml" ', '');

	return xmlString;
}
