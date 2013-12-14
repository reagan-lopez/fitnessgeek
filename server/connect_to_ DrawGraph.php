<!--
	Copyright © 2013 Ajita Srivastava
	[This program is licensed under the "MIT License"]
	Please see the file LICENSE in the source
	distribution of this software for license terms
-->
<?php

$dsn = "mysql:host=db.cecs.pdx.edu;dbname=rlop2";
$username = "rlop2";
$password = "ql123";

$pdo = new PDO($dsn, $username, $password);
$id=$_POST['selectFieldValue'];
$rows = array();
    if($id == "Longest")
    {
        $stmt = $pdo->prepare("SELECT * FROM heart_rate1 JOIN activity_log JOIN activity WHERE activity.activity_id = activity_log.activity_id and TIME = FROM_UNIXTIME(activity_log.create_ts/1000) and activity.tot_distance =(SELECT MAX(activity.tot_distance) FROM activity)");
    }
    else if($id == "Latest")
    {
        $stmt = $pdo->prepare("SELECT * FROM heart_rate1 JOIN activity_log JOIN activity WHERE activity.activity_id = activity_log.activity_id and TIME = FROM_UNIXTIME(activity_log.create_ts/1000) and activity.create_ts =(SELECT MAX(activity.create_ts) FROM activity)");
    }
    else if($id == "Fastest")
    {
        $stmt = $pdo->prepare("SELECT * FROM heart_rate1 JOIN activity_log JOIN activity WHERE activity.activity_id = activity_log.activity_id and TIME = FROM_UNIXTIME(activity_log.create_ts/1000) and activity.avg_speed =(SELECT MAX(activity.avg_speed) FROM activity)");
    }
    else
    {
	$stmt = $pdo->prepare("SELECT * FROM heart_rate1 JOIN activity_log WHERE TIME = FROM_UNIXTIME(create_ts/1000) and activity_id = (select activity_id from activity where from_unixtime(activity.create_ts/1000)='".$id."')");
    }
	$stmt->execute();
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(array('Result' =>$rows));
    
?>