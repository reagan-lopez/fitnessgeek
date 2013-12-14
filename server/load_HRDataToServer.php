<!--
	Copyright © 2013 Ajita Srivastava
	[This program is licensed under the "MIT License"]
	Please see the file LICENSE in the source
	distribution of this software for license terms
-->
<?php
    $handle = @fopen("heart_rate_details.txt", "r");
    $conn = mysql_connect("db.cecs.pdx.edu","rlop2","ql123");
    mysql_select_db("rlop2",$conn);

    while (!feof($handle)) // Loop til end of file.
    {
        $buffer = fgets($handle, 4096);
        list($a,$b)=explode("|",$buffer);
        $sql = "INSERT INTO heart_rate1 VALUES('".$a."',".$b.")";
        mysql_query($sql,$conn);
    }
    
    $handle1 = @fopen("exercise_details.txt", "r");
    while (!feof($handle1)) // Loop til end of file.
    {
        $buffer1 = fgets($handle1, 4096);
        list($a1,$b1,$c,$d,$e)=explode("|",$buffer1);
        $sql1 = "INSERT INTO exercise_details (duration,calories,resting,average,maximum) VALUES('".$a1."',".$b1.",".$c.",".$d.",".$e.")";
        mysql_query($sql1,$conn) or die(mysql_error());
    }
?>