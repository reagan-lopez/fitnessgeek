/*
	Copyright © 2013 Reagan Lopez
	[This program is licensed under the "MIT License"]
	Please see the file LICENSE in the source
	distribution of this software for license terms
*/
	// global variables
	var MPS_TO_MPH = 2.23694; 			// Meters per second to Miles per hour conversion constant
	var DIST_IN_MILES = 3958.755866;
	var METER_TO_FEET = 3.28084;
	var MSEC_TO_HR = 0.0000002778;
	var KELVIN_TO_FAHRENHEIT = -457.87;
	var UOM_DIST = "M";					// Unit of Measure of distance is Miles
	var watchID = null; 				// watch id
	var desired_speed = 0;
	var geo_latitude = 0;
	var geo_longitude = 0;
	var geo_speed = 0;	
	var geo_altitude = 0;
	var geo_timestamp = 0;
	var prev_ts = 0;
	var prev_latitude = 0;	
	var prev_longitude = 0;
	var	curr_tot_distance = 0;
	var	curr_tot_distance_no_trim = 0;
	var	curr_tot_time = -5;
	var	curr_speed = 0;
	var	curr_elevation = 0;
	var	curr_temperature = 0;
	var	curr_heartrate = 0;
	var	tot_distance = 0;
	var	tot_time = 0;
	var	avg_speed = 0;
	var	avg_elevation = 0;
	var	avg_temperature = 0;
	var	avg_heartrate = 0;
	var	create_ts = 0;
	var	update_ts = 0;
	var	created_by = 'phone_app';
	var	updated_by = 'phone_app';	
	var startFlag = 0;
	var activity_start_ts = 0;
	var user_id = 1;
	var first_name = 'Reagan';
	var middle_name = 'Joseph';	
	var last_name = 'Lopez';
	var gender = 'M';
	var age = 30;
	var weight = 140;
	var activity_id = 0;
	var timeCounter;
	var activity_status = 'COMPLETED';
	var log_cnt = 0;
 
/*************************************************************************************************************************************/
// Function to initialize variables.
/*************************************************************************************************************************************/	
	function startInitialize() {
		watchID = null; 
		desired_speed = 0;
		geo_latitude = 0;
		geo_longitude = 0;
		geo_speed = 0;	
		geo_altitude = 0;
		geo_timestamp = 0;
		prev_ts = 0;
		prev_latitude = 0;	
		prev_longitude = 0;
		curr_tot_distance = 0;
		curr_tot_distance_no_trim = 0;
		curr_tot_time = -5;
		curr_speed = 0;
		curr_elevation = 0;
		curr_temperature = 0;
		curr_heartrate = 0;
		tot_distance = 0;
		tot_time = 0;
		avg_speed = 0;
		avg_elevation = 0;
		avg_temperature = 0;
		avg_heartrate = 0;
		create_ts = 0;
		update_ts = 0;
		created_by = 'phone_app';
		updated_by = 'phone_app';	
		startFlag = 0;
		activity_start_ts = 0;
		user_id = 1;
		first_name = 'Reagan';
		middle_name = 'Joseph';	
		last_name = 'Lopez';
		gender = 'M';
		age = 30;
		weight = 140;
		activity_id = 0;
		timeCounter;
		activity_status = 'COMPLETED';
		log_cnt = 0;               
	} 
	
/*************************************************************************************************************************************/
// Function for activity content.
/*************************************************************************************************************************************/	
	function showActivity() {
		$("#activity-content").show();
		$("#history-content").hide();
		$("#music-content").hide();               
	}	

/*************************************************************************************************************************************/
// Function for history content.
/*************************************************************************************************************************************/	
	function showHistory() {
		$("#activity-content").hide();
		$("#history-content").show();
		$("#music-content").hide();
		
		var db = window.openDatabase("Database", "1.0", "FitnessGeek", 200000);
		db.transaction(fetchLatestActivity, errorCB); 
		$('input:radio[name="radio-mini"]').filter('[value="choice-latest"]').next().click();

	}
	
/*************************************************************************************************************************************/
// Function for music content.
/*************************************************************************************************************************************/        
	function showMusic() {
		$("#activity-content").hide();
		$("#history-content").hide();
		$("#music-content").show();
	}

/*************************************************************************************************************************************/
// Function for timer.
/*************************************************************************************************************************************/	
	function setTime() {
		if (curr_tot_time <= 0) {
			if (curr_tot_time == 0) {
				document.getElementById("id-time").innerHTML = 'GO';
				document.getElementById("id-time").style.color = "green";
			} else {
				document.getElementById("id-time").style.color = "red";
				document.getElementById("id-time").innerHTML = 'Countdown: ' + Math.abs(curr_tot_time);
			}
		} else {
			document.getElementById("id-time").style.color = "green";
			document.getElementById("id-time").innerHTML = pad(parseInt(curr_tot_time/3600)) + ":" + pad(parseInt((curr_tot_time%3600)/60)) + ":" + pad(parseInt((curr_tot_time%3600)%60));			
		}
		++curr_tot_time;
	} 
	
/*************************************************************************************************************************************/
// Function to pad to 2 places.
/*************************************************************************************************************************************/ 
	function pad(val) {
		var valString = val + "";
		if(valString.length < 2) {
			return "0" + valString;
		} else {
			return valString;
		}
	}	

/*************************************************************************************************************************************/
// Function to calculate distance between two geolocation points. Refer to link http://www.movable-type.co.uk/scripts/latlong.html
/*************************************************************************************************************************************/
/*
	function getDistance(lat1, lon1, lat2, lon2)
	{
		var dLat = (lat2-lat1) * (Math.PI / 180);
		var dLon = (lon2-lon1) * (Math.PI / 180);
		var lat1 = lat1 * (Math.PI / 180);
		var lat2 = lat2 * (Math.PI / 180);

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		
		return c;
	}
*/

/*************************************************************************************************************************************/
// Function to get the weather from open weather API.
/*************************************************************************************************************************************/
	function getWeather() {
		var weather = "http://api.openweathermap.org/data/2.5/weather?lat=" + geo_latitude + "&lon=" + geo_longitude + "&callback=getTemperature";
		$.ajax({
			url: weather,
			dataType: 'jsonp',
			jsonp: false,
		});
	}
	
/*************************************************************************************************************************************/
// Function to get the temperature from open weather API.
/*************************************************************************************************************************************/
	function getTemperature(data) {
		curr_temperature = parseFloat(((data.main.temp*9/5) - 459.67).toFixed(2));
		//avg_temperature = curr_temperature;
	}

/*************************************************************************************************************************************/
// Function to display the motion data from the geolocation.
/*************************************************************************************************************************************/
	function onSuccess(position)
	{

		geo_latitude = position.coords.latitude;
		geo_longitude = position.coords.longitude;
		geo_speed = position.coords.speed; //MPS
		geo_altitude = position.coords.altitude; //Feet
		geo_timestamp = position.timestamp; //DOMTimeStamp

		if (curr_tot_time > 0) {		
			++log_cnt;
			create_ts = (new Date()).getTime();
			update_ts = create_ts;
					
			if (startFlag == 0) {
				var db1 = window.openDatabase("Database", "1.0", "FitnessGeek", 200000);
				db1.transaction(fetchPrevActivity, errorCB);		
				curr_tot_distance = 0;
				curr_tot_distance_no_trim = 0;
				prev_latitude = geo_latitude;
				prev_longitude = geo_longitude;	
				prev_ts = create_ts;
				activity_start_ts = create_ts;
				getWeather();			
				startFlag = 1;			
			}

			if (curr_tot_time % 30 == 0) {
				getWeather();
			}

			curr_tot_distance_no_trim = curr_tot_distance_no_trim + (geo_speed * MPS_TO_MPH * (create_ts - prev_ts) * MSEC_TO_HR);
			curr_tot_distance = parseFloat((curr_tot_distance_no_trim).toFixed(2));
			curr_speed = parseFloat((geo_speed * MPS_TO_MPH).toFixed(2));
			curr_elevation = Math.round(geo_altitude);
			curr_heartrate = 0;

			//populate html fields
			document.getElementById("id-distance").innerHTML = curr_tot_distance + " mi"; 
			document.getElementById("id-speed").innerHTML = curr_speed + " mph";
			if (curr_speed < desired_speed) {
				document.getElementById("id-speed").style.color = "red";
				setTimeout(function(){playBeep()},1000);
			} else {
				document.getElementById("id-speed").style.color="green";
			}
		
			document.getElementById("id-elevation").innerHTML = curr_elevation + " ft";
			document.getElementById("id-temperature").innerHTML = curr_temperature + " F";
	/*	
				//temp_pace = (60/(geo_speed * MPS_TO_MPH)).toFixed(2);
				//document.getElementById("id-pace").innerHTML = (temp_pace.replace(".","'")) + '"';			
	*/		
			
			var db2 = window.openDatabase("Database", "1.0", "FitnessGeek", 200000);
			db2.transaction(insertActivityLog, errorCB);

			prev_latitude = geo_latitude;
			prev_longitude = geo_longitude;	
			prev_ts = create_ts;
			avg_speed = avg_speed + curr_speed;
			avg_elevation = avg_elevation + curr_elevation;
			avg_temperature = avg_temperature + curr_temperature;
			avg_heartrate = avg_heartrate + curr_heartrate;
		}

	}

/*************************************************************************************************************************************/
// Function to display an alert if there is a problem getting the geolocation.
/*************************************************************************************************************************************/
	function onError(error)
	{
		alert('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n');
	}

/*************************************************************************************************************************************/
// Function to clear the watch that was started earlier.
/*************************************************************************************************************************************/
	function clearWatch()
	{
		if (watchID != null)
		{
			navigator.geolocation.clearWatch(watchID);
			watchID = null;
		}
	}

/*************************************************************************************************************************************/
// Function to create the tables.
/*************************************************************************************************************************************/	
    function createTables(tx) {	
		//tx.executeSql('DROP TABLE IF EXISTS user');
		//tx.executeSql('DROP TABLE IF EXISTS activity');
		//tx.executeSql('DROP TABLE IF EXISTS activity_log');
		
        tx.executeSql('CREATE TABLE IF NOT EXISTS user (user_id , first_name, middle_name, last_name, gender, age, weight, created_by, updated_by, create_ts, update_ts)'); 
        tx.executeSql('CREATE TABLE IF NOT EXISTS activity (user_id , activity_id, activity_status, tot_distance, tot_time, avg_speed, avg_elevation, avg_temperature, avg_heartrate, created_by, updated_by, create_ts, update_ts)'); 		
        tx.executeSql('CREATE TABLE IF NOT EXISTS activity_log (user_id, activity_id, curr_tot_distance, curr_tot_time, curr_speed, curr_elevation, curr_temperature, curr_heartrate, created_by, updated_by, create_ts, update_ts)');
		tx.executeSql('SELECT * FROM user', [], insertUser, errorCB);
	
	}
	
/*************************************************************************************************************************************/
// Function to fetch previous activity ID from 'activity' table.
/*************************************************************************************************************************************/	
    function fetchPrevActivity(tx) {
        tx.executeSql('SELECT MAX(activity_id) AS activity_id FROM activity', [], setActivityID, errorCB);
    } 

/*************************************************************************************************************************************/
// Function to insert into 'user' table.
/*************************************************************************************************************************************/	
    function insertUser(tx, results) {
	//alert('results.rows.length' + results.rows.length);
		if (results.rows.length == 0) {
		    //alert('insertUser1');
			tx.executeSql('INSERT INTO user VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[user_id, first_name, middle_name, last_name, gender, age, weight, created_by, updated_by, (new Date()).getTime(), (new Date()).getTime()]);	
			syncUser();
		}
	}
	
	
/*************************************************************************************************************************************/
// Function to set the 'activity_id' fetched from 'activity' table.
/*************************************************************************************************************************************/	
    function setActivityID(tx, results) {
		if (results.rows.length == null) {
			activity_id = 1;
		} else {
			activity_id = results.rows.item(0).activity_id + 1;
		}
	}

/*************************************************************************************************************************************/
// Function to insert into 'activity_log' table.
/*************************************************************************************************************************************/	
    function insertActivityLog(tx) {
		tx.executeSql('INSERT INTO activity_log VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[user_id, activity_id, curr_tot_distance, curr_tot_time, curr_speed, curr_elevation, curr_temperature, curr_heartrate, created_by, updated_by, create_ts, update_ts]);		
	}

/*************************************************************************************************************************************/
// Function to insert into 'activity' table.
/*************************************************************************************************************************************/	
    function insertActivity(tx) {
		avg_speed = parseFloat((avg_speed/log_cnt).toFixed(2));
		avg_elevation = parseFloat((avg_elevation/log_cnt).toFixed(2));
		avg_temperature = parseFloat((avg_temperature/log_cnt).toFixed(2));
		avg_heartrate = parseFloat((avg_heartrate/log_cnt).toFixed(2));
		tx.executeSql('INSERT INTO activity VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		[user_id, activity_id, activity_status, curr_tot_distance, curr_tot_time, avg_speed, avg_elevation, avg_temperature, avg_heartrate, created_by, updated_by, activity_start_ts, update_ts]);
		syncActivity();
    }

/*************************************************************************************************************************************/
// Function to delete from 'activity_log' table.
/*************************************************************************************************************************************/	
    function deleteActivityLog(tx) {
		//alert('deleteActivityLog');
		tx.executeSql('DELETE FROM activity_log');     
	}	

/*************************************************************************************************************************************/
// Function to fetch latest activity from 'activity' table.
/*************************************************************************************************************************************/	
    function fetchLatestActivity(tx) {
        tx.executeSql('SELECT * FROM activity WHERE create_ts = (SELECT MAX(create_ts) FROM activity)', [], setActivityHistory, errorCB);
    }	

/*************************************************************************************************************************************/
// Function to fetch longest activity from 'activity' table.
/*************************************************************************************************************************************/	
    function fetchLongestActivity(tx) {
         tx.executeSql('SELECT * FROM activity WHERE tot_distance = (SELECT MAX(tot_distance) FROM activity)', [], setActivityHistory, errorCB);
    }
	
/*************************************************************************************************************************************/
// Function to fetch fastest activity from 'activity' table.
/*************************************************************************************************************************************/	
    function fetchFastestActivity(tx) {
        tx.executeSql('SELECT * FROM activity WHERE avg_speed = (SELECT MAX(avg_speed) FROM activity)', [], setActivityHistory, errorCB);
    }	
	

/*************************************************************************************************************************************/
// Function to fetch previous activities from 'activity' table.
/*************************************************************************************************************************************/	
    function fetchActivityHistory(tx) {
        tx.executeSql('SELECT * FROM activity WHERE tot_time > 0 ORDER BY create_ts DESC', [], setActivityHistory, errorCB);
    }
	
/*************************************************************************************************************************************/
// Function to set the activity history fetched from 'activity' table.
/*************************************************************************************************************************************/	
    function setActivityHistory(tx, results) {
	$("#history-details").empty();
	$("#no-activity").empty();
/*	
		var html_code_a = '<div class="ui-block-a"><div class="ui-bar ui-bar-c ui-center" style="height:30px">';	
		var html_code_a = '<div class="ui-block-a"><div class="ui-bar ui-bar-c ui-center" style="height:30px">';
		var html_code_b = '<div class="ui-block-b"><div class="ui-bar ui-bar-c ui-center" style="height:30px">';
		var html_code_c = '<div class="ui-block-c"><div class="ui-bar ui-bar-c ui-center" style="height:30px">';
		var html_code_d = '<div class="ui-block-d"><div class="ui-bar ui-bar-c ui-center" style="height:30px">';
		var html_code_e = '<div class="ui-block-e"><div class="ui-bar ui-bar-c ui-center" style="height:30px">';
		var html_code_end = '</div></div>';

		if (results.rows.length == 0) {
			$("#history-details").append('<div style="color: red">No activity history!</div>');
		} else {
			for (var i=0;i<results.rows.length;i++) {			
				$("#history-details").append(html_code_a + results.rows.item(i).activity_id + html_code_end);
				$("#history-details").append(html_code_b + (new Date(results.rows.item(i).create_ts).toLocaleString()) + html_code_end);
				$("#history-details").append(html_code_c + results.rows.item(i).tot_distance + html_code_end);			
				$("#history-details").append(html_code_d + pad(parseInt(results.rows.item(i).tot_time/3600)) + ":" + pad(parseInt((results.rows.item(i).tot_time%3600)/60)) + ":" + pad(parseInt((results.rows.item(i).tot_time%3600)%60)) + html_code_end);
				$("#history-details").append(html_code_e + results.rows.item(i).avg_speed + html_code_end);	
			}
		}
*/
		//$("#history-details").append('<ul data-role="listview" data-inset="true">');
/*		
		if (results.rows.length == 0) {
			$("#no-activity").append('<div style="color: red" align="center">No activity history!</div>');
		} else {
		    $("#no-activity").hide();
			for (var i=0;i<results.rows.length;i++) {			
				$("#history-details").append('<li data-role="list-divider">' + (new Date(results.rows.item(i).create_ts).toLocaleString()) + '</li>');
				$("#history-details").append('<h2>' + results.rows.item(i).tot_distance + ' mi' + '</h2>');
				$("#history-details").append('<p><strong>' + '(' + pad(parseInt(results.rows.item(i).tot_time/3600)) + ":" + pad(parseInt((results.rows.item(i).tot_time%3600)/60)) + ":" + pad(parseInt((results.rows.item(i).tot_time%3600)%60)) + ') (' + results.rows.item(i).avg_speed + ' mph) (' + results.rows.item(i).avg_elevation + ' ft) (' + results.rows.item(i).avg_temperature + ' F)' + '</strong></p>');		
			}	
			$("#history-details").listview("refresh");		
		}
*/

		if (results.rows.length == 0) {
			$("#no-activity").append('<div style="color: red" align="center">No activity history!</div>');
		} else {
		    $("#no-activity").hide();
			for (var i=0;i<results.rows.length;i++) {	
				$("#history-details").append('<div data-role="content"><div class="ui-grid-a">');			
				//$("#history-details").append('<div data-role="header" align="center"><h3>' + new Date(results.rows.item(i).create_ts).getFullYear() + '-' + pad(parseInt(new Date(results.rows.item(i).create_ts).getMonth())) + '-' + pad(parseInt(new Date(results.rows.item(i).create_ts).getDate())) + ' ' + pad(parseInt(new Date(results.rows.item(i).create_ts).getHours())) + ':' + pad(parseInt(new Date(results.rows.item(i).create_ts).getMinutes())) + ':' + pad(parseInt(new Date(results.rows.item(i).create_ts).getSeconds())) + '</h3></div>');
				$("#history-details").append('<div class="ui-block-a ui-block-aaa"><div class="ui-bar ui-bar-a ui-left" style="height:30px">' + new Date(results.rows.item(i).create_ts).getFullYear() + '-' + pad(parseInt(new Date(results.rows.item(i).create_ts).getMonth())) + '-' + pad(parseInt(new Date(results.rows.item(i).create_ts).getDate())) + '</div></div>');
				$("#history-details").append('<div class="ui-block-b ui-block-bbb"><div class="ui-bar ui-bar-a ui-left" style="height:30px">' + pad(parseInt(new Date(results.rows.item(i).create_ts).getHours())) + ':' + pad(parseInt(new Date(results.rows.item(i).create_ts).getMinutes())) + ':' + pad(parseInt(new Date(results.rows.item(i).create_ts).getSeconds())) + '</div></div>');
				$("#history-details").append('<div class="ui-block-a ui-block-aaa"><div class="ui-bar ui-bar-c ui-left" style="height:30px">' + results.rows.item(i).tot_distance + ' mi' + '</div></div>');
				$("#history-details").append('<div class="ui-block-b ui-block-bbb"><div class="ui-bar ui-bar-c ui-left" style="height:30px">' + pad(parseInt(results.rows.item(i).tot_time/3600)) + ":" + pad(parseInt((results.rows.item(i).tot_time%3600)/60)) + ":" + pad(parseInt((results.rows.item(i).tot_time%3600)%60)) + '</div></div>');
				$("#history-details").append('<div class="ui-block-a ui-block-aaa"><div class="ui-bar ui-bar-c ui-left" style="height:30px">' + results.rows.item(i).avg_speed + ' mph' + '</div></div>');
				$("#history-details").append('<div class="ui-block-b ui-block-bbb"><div class="ui-bar ui-bar-c ui-left" style="height:30px">' + results.rows.item(i).avg_elevation + ' ft' + '</div></div>');
				$("#history-details").append('<div class="ui-block-a ui-block-aaa"><div class="ui-bar ui-bar-c ui-left" style="height:30px">' + results.rows.item(i).avg_temperature + ' F' + '</div></div>');
				$("#history-details").append('<div class="ui-block-b ui-block-bbb"><div class="ui-bar ui-bar-c ui-left" style="height:30px">' + results.rows.item(i).avg_heartrate + ' bpm' + '</div></div>');
				$("#history-details").append('</div></div>');
				//$("#history-details").append(html).trigger("create");				
			}	
		}
	}	
	
/*************************************************************************************************************************************/
// Function to handle sql errors.
/*************************************************************************************************************************************/		
    function errorCB(err) {
       alert("Error processing SQL: "+err.code);
    }	


/*************************************************************************************************************************************/
// Function to sync the 'user' table to the server.
/*************************************************************************************************************************************/	
	function syncUser() {
		var root1 = {};
		var records = [];
		root1.records = records;						
		var records = { "user_id": user_id, "first_name": first_name, "middle_name": middle_name, "last_name": last_name, "gender": gender, "age": age, "weight": weight, "created_by": created_by, "updated_by": updated_by, "create_ts": (new Date()).getTime(), "update_ts": (new Date()).getTime() };
		root1.records.push(records); 
		//alert('row.updated_by= ' + row.updated_by);


		$.ajax({
			type: "POST",
			url: "http://web.cecs.pdx.edu/~rlop2/QL/fitnessgeek/user.php",
			data: JSON.stringify(root1),
			success: function(data) {
				console.log(data);
				//alert('data= ' + data);
			}
		});
		console.log(root1);
		//alert('JSON.stringify(root1)= ' + JSON.stringify(root1));
		console.log(JSON.stringify(root1));
	}	
	

/*************************************************************************************************************************************/
// Function to sync the 'activity' table to the server.
/*************************************************************************************************************************************/	
	function syncActivity() {
		var root1 = {};
		var records = [];
		root1.records = records;						
		var records = { "user_id": user_id, "activity_id": activity_id, "activity_status": activity_status, "tot_distance": curr_tot_distance, "tot_time": curr_tot_time, "avg_speed": avg_speed, "avg_elevation": avg_elevation, "avg_temperature": avg_temperature, "avg_heartrate": avg_heartrate, "created_by": created_by, "updated_by": updated_by, "create_ts": activity_start_ts, "update_ts": update_ts };
		root1.records.push(records); 
		//alert('row.updated_by= ' + row.updated_by);


		$.ajax({
			type: "POST",
			url: "http://web.cecs.pdx.edu/~rlop2/QL/fitnessgeek/activity.php",
			data: JSON.stringify(root1),
			success: function(data) {
				console.log(data);
				//alert('data= ' + data);
			}
		});
		console.log(root1);
		//alert('JSON.stringify(root1)= ' + JSON.stringify(root1));
		console.log(JSON.stringify(root1));
	}


/*************************************************************************************************************************************/
// Function to sync the 'activity_log' table to the server
/*************************************************************************************************************************************/	
	function syncActivityLog() {

		var db = window.openDatabase("Database", "1.0", "FitnessGeek", 200000);
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.'); 
			return;
		}
		
		db.transaction(function(transaction) {
			transaction.executeSql('SELECT * FROM activity_log;', [], function(transaction, result) { 
				if (result != null && result.rows != null) {
					var root1 = {};
					var records = [];
					root1.records = records;
					for (var i = 0; i < result.rows.length; i++) {
						console.log("here I am 7");
						var row = result.rows.item(i); 
						//alert('row.activity_id= ' + row.activity_id);						
						var records = { "user_id": row.user_id, "activity_id": row.activity_id, "curr_tot_distance": row.curr_tot_distance, "curr_tot_time": row.curr_tot_time, "curr_speed": row.curr_speed, "curr_elevation": row.curr_elevation, "curr_temperature": row.curr_temperature, "curr_heartrate": row.curr_heartrate, "created_by": row.created_by, "updated_by": row.updated_by, "create_ts": row.create_ts, "update_ts": row.update_ts };
						root1.records.push(records); 
						//alert('row.updated_by= ' + row.updated_by);
					}

					$.ajax({
						type: "POST",
						url: "http://web.cecs.pdx.edu/~rlop2/QL/fitnessgeek/activity-log.php",
						data: JSON.stringify(root1),
						success: function(data) {
							console.log(data);
							//alert('data= ' + data);
						}
					});
					console.log(root1);
					//alert('JSON.stringify(root1)= ' + JSON.stringify(root1));
					console.log(JSON.stringify(root1));
				} 
			}, errorHandler)
		});
	}

/*************************************************************************************************************************************/
// Function to handle sync errors.
/*************************************************************************************************************************************/
	function errorHandler(transaction, error) { 
		alert('Error: ' + error.message + ' code: ' + error.code);
	}

/*************************************************************************************************************************************/
// Function to play notification sound. The notification sound set for the phone will be played.
// To change the sound, the notification sound in the phone must be changed. The program need not be compiled again.
/*************************************************************************************************************************************/
	function playBeep()
	{
		navigator.notification.beep(1);
	}