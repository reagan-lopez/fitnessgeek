/*
	Copyright © 2013 Ajita Srivastava
	[This program is licensed under the "MIT License"]
	Please see the file LICENSE in the source
	distribution of this software for license terms
*/
require 'rexml/document'
require 'date'

if ARGV.count == 1 then
  file = ARGV.first  
  
  if File.exists?(file) then
    xmlfile = File.open(file, 'rb')    
    xmldoc = REXML::Document.new(xmlfile.read)         
    hrmdata = xmldoc.elements['polar-exercise-data/calendar-items/exercise/result/samples/sample/values'].get_text
    date1 = xmldoc.elements['polar-exercise-data/calendar-items/exercise/time'].get_text
    date1 = "#{date1}"[0..18]
    date2 = DateTime.parse(date1)
    #date2 = date2 + 8/24.0
    formatted_date_new = date2.strftime('%Y-%m-%d %H:%M:%S')

    open("heart_rate_details.txt", 'w') { |f|
      "#{hrmdata}".split(',').each do |v|
        f << "#{formatted_date_new}|#{v}\n"
        date3 = date2 +1/86400.0
        formatted_date = date2.strftime('%Y-%m-%d %H:%M:%S')
        formatted_date_new = date3.strftime('%Y-%m-%d %H:%M:%S')
        if formatted_date == formatted_date_new then
            date3 = date3 + 1/86400.0
            formatted_date_new = date3.strftime('%Y-%m-%d %H:%M:%S')
            date2 = date3
            else
            date2 = date3
        end
      end
    }
    tot_duration =xmldoc.elements['polar-exercise-data/calendar-items/exercise/result/duration'].get_text
    calories = xmldoc.elements['polar-exercise-data/calendar-items/exercise/result/calories'].get_text
    resting = xmldoc.elements['polar-exercise-data/calendar-items/exercise/result/user-settings/heart-rate/resting'].get_text
    average = xmldoc.elements['polar-exercise-data/calendar-items/exercise/result/heart-rate/average'].get_text
    maximum = xmldoc.elements['polar-exercise-data/calendar-items/exercise/result/heart-rate/maximum'].get_text
    
    open("exercise_details.txt",'w'){|f|
        f<<"#{tot_duration}|#{calories}|#{resting}|#{average}|#{maximum}\n"}
  else
    puts "Could not find #{ARGV.first}"
  end  
else
  puts "Usage: 'ruby xml2hrm polarpersonaltrainer.xml'"
end