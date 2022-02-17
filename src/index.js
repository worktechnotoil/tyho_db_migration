const connect = require("./utils/connect");
const therapist = require("./functions/therapist");
const therapistOrder = require("./functions/therapistOrder");
const RemoveDisabledSlots = require("./functions/RemoveDisabledSlots");
const coupons = require("./functions/coupons");
// const moment = require("moment");
var HTMLParser = require('node-html-parser');
var unserialize=require("php-serialization").unserialize;
var moment = require('moment-timezone');



// var appointment_timestamp_actualy_date = moment("2022-02-08 00:29:40").tz("UTC").format("YYYY-MM-DD HH:mm:ss");
// console.log(appointment_timestamp_actualy_date);

RemoveDisabledSlots();

// var currentDate = moment().tz("Asia/Singapore").format('YYYY-MM-DD');
// module.exports = async () => {

// var value = 'a:12:{s:3:"Thu";a:7:{s:9:"1300-1400";i:1;s:9:"1415-1515";i:1;s:9:"1600-1700";i:1;s:9:"1900-2000";i:1;s:9:"0900-1000";i:1;s:9:"1000-1100";i:1;s:9:"1100-1200";i:1;}s:11:"Thu-details";a:7:{s:9:"1300-1400";a:1:{s:5:"title";s:0:"";}s:9:"1415-1515";a:1:{s:5:"title";s:0:"";}s:9:"1600-1700";a:1:{s:5:"title";s:0:"";}s:9:"1900-2000";a:1:{s:5:"title";s:0:"";}s:9:"0900-1000";a:1:{s:5:"title";s:0:"";}s:9:"1000-1100";a:1:{s:5:"title";s:0:"";}s:9:"1100-1200";a:1:{s:5:"title";s:0:"";}}s:3:"Wed";a:3:{s:9:"1200-1300";i:1;s:9:"1315-1415";i:1;s:9:"1700-1800";i:1;}s:11:"Wed-details";a:3:{s:9:"1200-1300";a:1:{s:5:"title";s:0:"";}s:9:"1315-1415";a:1:{s:5:"title";s:0:"";}s:9:"1700-1800";a:1:{s:5:"title";s:0:"";}}s:3:"Mon";a:5:{s:9:"1600-1700";i:1;s:9:"1900-2000";i:1;s:9:"1430-1530";i:1;s:9:"1200-1300";i:1;s:9:"1300-1400";i:1;}s:11:"Mon-details";a:5:{s:9:"1600-1700";a:1:{s:5:"title";s:0:"";}s:9:"1900-2000";a:1:{s:5:"title";s:0:"";}s:9:"1430-1530";a:1:{s:5:"title";s:0:"";}s:9:"1200-1300";a:1:{s:5:"title";s:0:"";}s:9:"1300-1400";a:1:{s:5:"title";s:0:"";}}s:3:"Sat";a:2:{s:9:"1400-1500";i:1;s:9:"1515-1615";i:1;}s:11:"Sat-details";a:2:{s:9:"1400-1500";a:1:{s:5:"title";s:0:"";}s:9:"1515-1615";a:1:{s:5:"title";s:0:"";}}s:3:"Tue";a:4:{s:9:"1600-1700";i:1;s:9:"1900-2000";i:1;s:9:"1200-1300";i:1;s:9:"1315-1415";s:1:"1";}s:11:"Tue-details";a:4:{s:9:"1600-1700";a:1:{s:5:"title";s:0:"";}s:9:"1900-2000";a:1:{s:5:"title";s:0:"";}s:9:"1200-1300";a:1:{s:5:"title";s:0:"";}s:9:"1315-1415";a:1:{s:5:"title";s:0:"";}}s:3:"Fri";a:0:{}s:11:"Fri-details";a:0:{}}';

// var days = ["Mon-details","Tue-details","Wed-details","Thu-details","Fri-details","Sat-details"];

// (async()=>{
//     // await getDataa(value,"5");
// })();   

// var calender = '[booked-calendar calendar=124]';
// calender = calender.split("=")[1];
// calender = calender.replace("]", "");
// console.log(calender);


// async function getDataa(value,therapist_id)
// {
//     for (let index = 0; index < 1; index = index + 1) {
//         var threeMonthAfterDate = moment().tz("Asia/Singapore").add(index, 'day').format('YYYY-MM-DD');
    
//         var dateFormat = moment().tz("Asia/Singapore").add(index, 'day').format('ddd')+"-details"
    
//         var therapistAvai = await getTherapistAvailability(value,therapist_id,dateFormat);
    
//         console.log(therapistAvai);

//         var values_tbl_avalability = [
//             [therapist_id, threeMonthAfterDate,CurrentDate,CurrentDate]];
  
//           var sql_tbl_avalability =
//           "INSERT INTO tbl_avalability (therapist_id_fk,slot_date,created_at,updated_at) VALUES ?";
  
//           const [rows5, fields5] = await db.connection1.query(sql_tbl_avalability, [values_tbl_avalability]);
//           var tbl_avalability_id = rows5.insertId;

//         for (const iterator of therapistAvai.timeslots) {
//             console.log(iterator.start_time);
//             console.log(iterator.end_time);

//             var values_tbl_avalability_time_slots = [
//                 [tbl_avalability_id,iterator.start_time,iterator.end_time,0,1,0,0,0,1,0,CurrentDate,CurrentDate]];
        
//             var sql_values_tbl_avalability = 
//             "INSERT INTO tbl_avalability_time_slots (avalability_id_fk,time_slot,end_time_slot,audio,video,textbasedchat,inperson,homevisit,is_booked,is_close,created_at,updated_at) VALUES ?";
    
//             const [rows6, fields6] = await db.connection1.query(sql_values_tbl_avalability, [values_tbl_avalability_time_slots]);
        
//         }
        
//     }
// }


// async function getTherapistAvailability(value,therapist_id,day)
// {
//     var result=unserialize(value);
//     for(var attributename in result.__attr__){
//         if (attributename == day)
//         {
//             console.log(attributename);
//             var timeObj ={};
//             timeObj.day  = day;
//             var timeslots = [];

//             for (var key in result[attributename].__attr__){

//                 var timeSlotsObj ={};
//                 const start_time_old = key.split("-")[0];
//                 const end_time_old = key.split("-")[1];

//                 const start_time = moment(start_time_old, 'HHmm').format('hh:mm A');

//                 const end_time = moment(end_time_old, 'HHmm').format('hh:mm A');
                
//                 timeSlotsObj.start_time = start_time;
//                 timeSlotsObj.end_time = end_time;
//                 timeslots.push(timeSlotsObj);
//                 // console.log(key);
//             }
//             timeObj.timeslots = timeslots;
//             return timeObj;
//             break;
//         }
//     }
// }


// console.log(currentDate);


// var timeSlotsArray = [];

// var days = ["Thu","Wed"];

// for(var day of days){
//     for(var attributename in result.__attr__){
//         if (attributename == day)
//         {
//             // console.log(attributename);
//             var timeObj ={};
//             timeObj.day  = day;
//             var timeslots = [];

//             console.log(result[attributename].__attr__);

//             for (var key in result[attributename].__attr__){


//                 // console.log(key);

//                 var timeSlotsObj ={};
//                 const start_time_old = key.split("-")[0];
//                 const end_time_old = key.split("-")[1];

//                 const start_time = moment(start_time_old, 'HHmm').format('hh:mm A');

//                 const end_time = moment(end_time_old, 'HHmm').format('hh:mm A');
                
//                 timeSlotsObj.start_time = start_time;
//                 timeSlotsObj.end_time = end_time;
//                 timeslots.push(timeSlotsObj);
//                 // console.log(key);
//             }
//             timeObj.timeslots = timeslots;
//             timeSlotsArray.push(timeObj);
//             break;
//         }
//     }
// }

// console.log(timeSlotsArray);



// a:11:{s:6:"Monday";s:4:"true";s:7:"Tuesday";s:5:"false";s:9:"Wednesday";s:4:"true";s:8:"Thursday";s:5:"false";s:6:"Friday";s:5:"false";s:8:"Saturday";s:4:"true";s:6:"Sunday";s:4:"true";s:7:"Morning";s:5:"false";s:9:"Afternoon";s:5:"false";s:7:"Evening";s:5:"false";s:5:"Night";s:5:"false";}
// const root = HTMLParser.parse('<ul><li>English</li><li>Mandarin Chinese</li></ul>');

// console.log(root.querySelector('ul').childNodes);

// for (const iterator of root.querySelector('ul').childNodes) {
//     console.log(iterator.text);
// }



// const dateTimeString = moment.unix(1466760005).format("DD-MM-YYYY HH:mm:ss");

// const start_time = moment("1830", 'HHmm').format('hh:mm a');

// const end_time = moment("1930", 'HHmm').format('hh:mm a');


// console.log(start_time);
// console.log(end_time);

// function getCouponsCustomerEmails(value)
// {
//     var couponsEmail = [];
//     var result=unserialize(value);
//     for(var attributename in result.__attr__){
//         couponsEmail.push(result.__attr__[attributename].val.replace("*","")) ;
//     }
//     return couponsEmail.join();
// }

// var emails = getCouponsCustomerEmails('a:3:{i:0;s:12:"*@wrs.com.sg";i:1;s:12:"*@mandai.com";i:2;s:15:"*@mandai.org.sg";}');
// console.log(emails);

// var date = moment("2022-10-14")
// var now = moment();

// if (now > date)
// {
//     console.log("Today date greater");
// }else
// {
//     console.log("Today date less");
// }

// console.log(date);
// console.log(now);

// 
// therapistOrder();
// therapist();
// coupons();

// console.log(moment("2022-01-14 08:31:03", "YYYY-MM-DD").format("YYYY-MM-DD"));


// };


