/* global angular */

var listavooFilters = angular.module('listavooFilters', [])
	.filter('dateFormat', function() {
      return function(input) {
        if(!input) return "";
        input = new Date(input);
        var res = (input.getMonth()+1) + "/" + input.getDate() + "/" + input.getFullYear() + " ";
        var hour = input.getHours();
        var ampm = "AM";
        if(hour === 12) ampm = "PM";
        if(hour > 12){
          hour-=12;
          ampm = "PM";
        }
        var minute = input.getMinutes()+1;
        if(minute < 10) minute = "0" + minute;
        res += hour + ":" + minute + " " + ampm;
        return res;
      
      };
	})
	.filter('horaFormat', function() {
      return function(input) {
        if(!input) return "";
        input = new Date(input);                
        var time = input.getHours();        
        var minute = input.getMinutes()+1;
        if(minute < 10) minute = "0" + minute;
        time += ":" + minute;
        return time;
      
      };
	});
