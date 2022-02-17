const connect = require("../utils/connect");
var unserialize=require("php-serialization").unserialize;
var moment = require('moment-timezone');



module.exports = async () => {



  var therapistArray = [
    [ 2108, '+65', '2', 'Alice', 'Ho', 'Tan', '91502691' ],
    [ 2117, '+65', '2', 'Alyssa', '', 'Fernandez', '92270011' ],
    [ 2124, '+65', '2', 'Edmund', '', 'Chong', '96729150' ],
    [ 2505, '+65', '2', 'Karen', '', 'Chok', '82222358' ],
    [ 2560, '+65', '2', 'Lira', '', 'Low', '0788243906' ],
    [ 2998, '+65', '2', 'Rashmi', '', 'Kunzru', '88785532' ],
    [ 5957, '+65', '2', 'Alicia', '', 'Prescott', '431245764' ],
    [ 7155, '+65', '2', 'Desieree', '', 'Makalew', '91911075' ],
    [ 7654, '+65', '2', 'Alexandra', '', 'Oh', '81265787' ],
    [ 11949, '+65', '2', 'Ser', '', 'Fee', '87761420' ],
    [ 12205, '+65', '2', 'Punitha', '', 'Gunasegaran', '97985232' ],
    [ 13366, '+65', '2', 'Joseph', '', 'Quek', '91786090' ],
    [ 15355, '+65', '2', 'Priyahnisha', '', 'N', '97769067' ],
    [ 18914, '+65', '2', 'Jeanette', '', 'Houmayune', '98736150' ],
    [ 19968, '+65', '2', 'Beena', '', 'D Raj', '90466269' ],
    [ 20326, '+65', '2', 'Kayden', '', 'Sharon Perera', '91266276' ],
    [ 21195, '+65', '2', 'Li Nah', '', 'Loh', '93868999' ],
    [ 23557, '+65', '2', 'Rathi', '', 'Lieberum', '91704019' ],
    [ 1517, '+65', '2', 'Michael', '', 'Thong', '81682985' ],//issue
    [ 57, '+65', '2', 'Darren', '', 'Lim', '96677264' ], // issue
    [ 55, '+65', '2', 'Elisa', '', 'Kang', '94308666' ], // issue
  ];
    
    var userArray = [
        {
            "post_id":"",
            "calender_id":"107"
        },{
            "post_id":"2108",
            "mobile":"91502691",
            "calender_id":"124"
        },{
            "post_id":"",
            "mobile":"",
            "calender_id":"125"
        },{
            "post_id":"2117",
            "mobile":"92270011",
            "calender_id":"126"
        },{
            "post_id":"",
            "mobile":"",
            "calender_id":"127"
        },{
            "post_id":"2124",
            "mobile":"96729150",
            "calender_id":"128"
        },{
            "post_id":"",
            "mobile":"",
            "calender_id":"129"
        },{
            "post_id":"",
            "mobile":"",
            "calender_id":"130"
        },{
            "post_id":"2505",
            "mobile":"82222358",
            "calender_id":"138"
        },{
            "post_id":"2560",
            "mobile":"0788243906",
            "calender_id":"139"
        },{
            "post_id":"23557",
            "mobile":"91704019",
            "calender_id":"140"
        },{
            "post_id":"2998",
            "mobile":"88785532",
            "calender_id":"141"
        },{
            "post_id":"5957",
            "mobile":"431245764",
            "calender_id":"142"
        },{
            "post_id":"7155",
            "mobile":"91911075",
            "calender_id":"144"
        },{
            "post_id":"7654",
            "mobile":"81265787",
            "calender_id":"145"
        },{
            "post_id":"11949",
            "mobile":"87761420",
            "calender_id":"146"
        },{
            "post_id":"12205",
            "mobile":"97985232",
            "calender_id":"147"
        },{
            "post_id":"",
            "mobile":"",
            "calender_id":"148"
        },{
            "post_id":"13366",
            "mobile":"91786090",
            "calender_id":"149"
        },{
            "post_id":"15355",
            "mobile":"97769067",
            "calender_id":"150"
        },{
            "post_id":"18914",
            "mobile":"98736150",
            "calender_id":"152"
        },{
            "post_id":"19968",
            "mobile":"90466269",
            "calender_id":"153"
        },{
            "post_id":"20326",
            "mobile":"91266276",
            "calender_id":"154"
        },{
            "post_id":"21195",
            "mobile":"93868999",
            "calender_id":"155"
        },{
            "post_id":"25286",
            "mobile":"",
            "calender_id":"157"
        },{
            "post_id":"25290",
            "mobile":"",
            "calender_id":"158"
        }
    ];
    

    const db = await connect();

    async  function getUserId(calendar_id) {
        var user_id = "";
        for (const iterator of userArray) {

            if(iterator.calender_id == calendar_id)
            {
                console.log(iterator);
                const [rows9, fields9] = await db.connection1.query('Select * from users WHERE mobile_no = ?', [ iterator.mobile]);
                if (rows9.length > 0)
                {
                    user_id = rows9[0].id;
                    return user_id;
                }else
                {
                    return "";
                }
                
                 break;
            }
            
        }
        return user_id;
        
        
    }

    // console.log(await getUserId("155"));
    // return;
    

    const [rows500, fields500] = await db.connection.execute(
        "SELECT option_value FROM `xalfyiBase_options` WHERE option_name = 'booked_disabled_timeslots'"
      );


    var result=unserialize(rows500[0].option_value);

    var disabledDatesArray = [];

    for(var attributename in result.__attr__)
    {
        var dates = result.__attr__[attributename].val.__attr__;
        var datesArray = [];
        var dateslotsUserObj = {};
        dateslotsUserObj.calendar_id = attributename;

        var therapist_id = await getUserId(attributename);
       

        for (const key of Object.keys(dates)) {
            var dateslotsObj = {};
            dateslotsObj.date = key;
            var timeslots = [];

            // console.log();
            if (dates[key].val.__attr__ !== undefined)
            {
                for (const iterator of Object.keys(dates[key].val.__attr__)) {
                    var timeSlotsObj = {};
                    const start_time_old = iterator.split("-")[0];
                    const end_time_old = iterator.split("-")[1];
                    const start_time = moment(start_time_old, 'HHmm').format('hh:mm A');
                    const end_time = moment(end_time_old, 'HHmm').format('hh:mm A');
                    timeSlotsObj.start_time = start_time;
                    timeSlotsObj.end_time = end_time;


                    var date = moment(key)
                    var now = moment();

                    // if (now < date)
                    // {
                        // await db.connection1.query('UPDATE tbl_avalability_time_slots SET ? WHERE id = ?', [{ "is_booked": 1 }, slot_id_fk]);
                        const [rows104, fields104] = await db.connection1.query("UPDATE tbl_avalability_time_slots SET ? WHERE id = (SELECT tbl_avalability_time_slots.id FROM `tbl_avalability` LEFT JOIN tbl_avalability_time_slots ON tbl_avalability_time_slots.avalability_id_fk = tbl_avalability.id WHERE tbl_avalability.slot_date = ? AND time_slot = ? AND end_time_slot = ? AND therapist_id_fk = ? limit 1)",[{ "is_close": 1 },key,start_time,end_time,therapist_id]);
                    // }

                    
                    // console.log("DELETE from tbl_avalability_time_slots WHERE id = (SELECT tbl_avalability_time_slots.id FROM `tbl_avalability` LEFT JOIN tbl_avalability_time_slots ON tbl_avalability_time_slots.avalability_id_fk = tbl_avalability.id WHERE tbl_avalability.slot_date = '"+key+"' AND time_slot = '"+start_time+"' AND end_time_slot = '"+end_time+" AND therapist_id_fk = "+therapist_id+"')");
                    
                    timeslots.push(timeSlotsObj);
                }
                dateslotsObj.slots = timeslots;
                datesArray.push(dateslotsObj);
            }
           
        }
        
        dateslotsUserObj.datesArray = datesArray;
        disabledDatesArray.push(dateslotsUserObj);
    }
    
    console.log("I am done");

};

// sql: "DELETE from tbl_avalability_time_slots WHERE id = (SELECT tbl_avalability_time_slots.id FROM `tbl_avalability` LEFT JOIN tbl_avalability_time_slots ON tbl_avalability_time_slots.avalability_id_fk = tbl_avalability.id WHERE tbl_avalability.slot_date = '2021-05-21' AND time_slot = '09:00 PM' AND end_time_slot = '10:00 PM' AND therapist_id_fk = 6)",