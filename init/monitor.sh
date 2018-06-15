#!/bin/bash
readonly PROG_DIR=$(readlink -m $(dirname $0))
shtd=$PROG_DIR/../shtd
log=$PROG_DIR/../logs/monitor.log

function auto_restart(){
	status=`$shtd status`
	if [ "$status" == "SHT server is not running" ];then
		$shtd restart
		echo "`date +%F' '%H:%M:%S`[error]	SHT server is not running and restarted" >> $log
	else
		echo "`date +%F' '%H:%M:%S`[info]	SHT server is running" >> $log
	fi	
	/etc/init.d/ntp stop
	sleep 2
	ntpdate pool.ntp.org >> $log
	/etc/init.d/ntp start
}

auto_restart
