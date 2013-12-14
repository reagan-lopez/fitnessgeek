<!--
	Copyright © 2013 Reagan Lopez
	[This program is licensed under the "MIT License"]
	Please see the file LICENSE in the source
	distribution of this software for license terms
-->
<?php

//CONNECT TO THE DATABASE
 $DB_HOST = 'db.cecs.pdx.edu';
 $DB_USER = 'rlop2';
 $DB_PASS = 'ql123';
 $DB_NAME = 'rlop2';
 
 
$con = mysqli_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if (mysqli_connect_errno()) {
  printf("Connect failed: %s\n", mysqli_connect_error());
  exit();
}

//Extract raw post data into a variable and perform JSON parse
 $postdata = file_get_contents("php://input"); 
 $data = json_decode($postdata, true);
echo "Debug: $postdata ";
   if (is_array($data['records'])) {
      foreach ($data['records'] as $record) {
		$user_id = $record['user_id'];
		$activity_id = $record['activity_id'];
		$curr_tot_distance = $record['curr_tot_distance'];
		$curr_tot_time = $record['curr_tot_time'];
		$curr_speed = $record['curr_speed'];
		$curr_elevation = $record['curr_elevation'];
		$curr_temperature = $record['curr_temperature'];
		$curr_heartrate = $record['curr_heartrate'];
		$created_by = $record['created_by'];
		$updated_by = $record['updated_by'];
		$create_ts = $record['create_ts'];
		$update_ts = $record['update_ts'];
        $result = mysqli_query($con,"INSERT INTO activity_log VALUES($user_id, $activity_id, $curr_tot_distance , $curr_tot_time, $curr_speed, $curr_elevation, $curr_temperature , $curr_heartrate, '$created_by', '$updated_by', $create_ts, $update_ts)");
      }
   }
   mysql_close($con);
?>