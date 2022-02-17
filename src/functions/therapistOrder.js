const connect = require("../utils/connect");
const moment = require("moment");
var unserialize=require("php-serialization").unserialize;
const { NULL } = require("mysql/lib/protocol/constants/types");

module.exports = async () => {



  const db = await connect();
  

  const [rows, fields] = await db.connection.execute(
    "SELECT * FROM `xalfyiBase_posts` WHERE `post_status` LIKE 'wc-completed' ORDER BY `ID` DESC"
  );
  const [rows1, fields1] = await db.connection.execute(
    "SELECT * FROM xalfyiBase_postmeta"
  );

  const [rows2, fields2] = await db.connection.execute(
    "SELECT * FROM xalfyiBase_woocommerce_order_itemmeta"
  );

  const [rows3, fields3] = await db.connection.execute(
    "SELECT * FROM xalfyiBase_posts WHERE post_type LIKE 'tyho-wellbeing-coach'"
  );

  const [rows4, fields4] = await db.connection1.execute(
    "SELECT * FROM `users`"
  );

  const [rows5, fields5] = await db.connection.execute(
    "SELECT * FROM `xalfyiBase_users`"
  );


// -- Coupons code starts --

  const [rows10, fields10] = await db.connection.execute(
    "SELECT * FROM `xalfyiBase_posts` WHERE `post_type` = 'shop_coupon' AND (post_status = 'publish' OR post_status = 'trash')"
  );

  const [rows12, fields12] = await db.connection.execute(
    "SELECT * FROM `xalfyiBase_postmeta` ORDER BY `meta_id` DESC"
  );

  const [rows13, fields13] = await db.connection.execute(
    "SELECT * FROM `xalfyiBase_wc_order_coupon_lookup`"
  );

  

  var therapistArray = [
    {"name":"Lira Low","mobile":"0788243906","email":"liralow@gmail.com"},
    {"name":"Li Nah Loh","mobile":"93868999","email":"healingmoonwarrior@gmail.com"},
    {"name":"Kayden Sharon Perera","mobile":"91266276","email":"kaydensp@gmail.com"},
    {"name":"Alexandra Oh","mobile":"81265787","email":"lextremelybalanced@gmail.com"},
    {"name":"Alyssa Fernandez","mobile":"92270011","email":"alyssa.rose@gmail.com"},
    {"name":"Ser Fee","mobile":"87761420","email":"serfee@re-narrate.com"},
    {"name":"Jeanette Houmayune","mobile":"98736150","email":"jeanette.houmayune@gmail.com"},
    {"name":"Priyahnisha N","mobile":"97769067","email":"resetright@gmail.com"},
    {"name":"Beena D R","mobile":"90466269","email":"beena7_2000@yahoo.com.sg"},
    {"name":"Rashmi Kunzru","mobile":"88785532","email":"rashmi@pathwayscounselling.co"},
    {"name":"Joseph Quek","mobile":"91786090","email":"josephquek11@gmail.com"},
    {"name":"Desieree Makalew","mobile":"91911075","email":"desieree@gmail.com"},
    {"name":"Edmund Chong","mobile":"96729150","email":"edmund@healingspace.sg"},
    {"name":"Punitha Gunasegaran","mobile":"97985232","email":"punitha51@hotmail.com"},
    {"name":"Karen Chok","mobile":"82222358","email":"karen.integrow@gmail.com"},
    {"name":"Alicia Prescott","mobile":"431245764","email":"prescott.alicia@gmail.com"},
    {"name":"Alice Ho Tan","mobile":"91502691","email":"alice.integrow@gmail.com"},
    {"name":"Michael Thong","mobile":"81682985","email":"thong.michael@gmail.com"},//Disabled therapist
    {"name":"Rathi Lieberum","mobile":"91704019","email":"rathidavy@gmail.com"},
    {"name":"Darren Lim","mobile":"96677264","email":"dwklim@gmail.com"},//Disabled therapist
    {"name":"Elisa Kang","mobile":"94308666","email":"elisa.kang@gmail.com"},//Disabled therapist
  ];



async function getCouponsCustomerEmails(value)
{

    var result=unserialize(value);
    for(var attributename in result.__attr__){
        if (attributename == day)
        {
            // console.log(attributename);
            var timeObj ={};
            timeObj.day  = day;
            var timeslots = [];

            for (var key in result[attributename].__attr__){

                var timeSlotsObj ={};
                const start_time_old = key.split("-")[0];
                const end_time_old = key.split("-")[1];

                const start_time = moment(start_time_old, 'HHmm').format('hh:mm A');

                const end_time = moment(end_time_old, 'HHmm').format('hh:mm A');
                
                timeSlotsObj.start_time = start_time;
                timeSlotsObj.end_time = end_time;
                timeslots.push(timeSlotsObj);
                // console.log(key);
            }
            timeObj.timeslots = timeslots;
            return timeObj;
            break;
        }
    }
}


  function getCouponIdFromOrderId(order_id) {
    var coupon_ids = "";
    var coupon_code = "";
    rows13.map((result) => {
      if (result.order_id == order_id)
      {
        coupon_ids = result.coupon_id;
      }
    });
    coupons.map((result) => {
      if (result.coupon_id == coupon_ids)
      {
        coupon_code = result.post_name;
      }
    });
    return coupon_code;
  }

  
function getCouponsCustomerEmails(value)
{
    var couponsEmail = [];
    var result=unserialize(value);
    for(var attributename in result.__attr__){
        couponsEmail.push(result.__attr__[attributename].val.replace("*","")) ;
    }
    return couponsEmail.join();
}


  var CurrentDate = moment().format("YYYY-MM-DD HH:mm:ss");

  var coupons = [];
  rows10.map((result) => {
    let obj = {};
    obj.post_name=result.post_title;
    obj.coupon_id=result.ID;

    if (result.post_status == "publish")
    {
      obj.is_delete = "0";
    }else if (result.post_status == "trash")
    {
      obj.is_delete = "1";
    }

    
    obj.date_of_issue = moment(result.post_date_gmt, "YYYY-MM-DD").format("YYYY-MM-DD");

    // post_date_gmt
    // rows10

    rows12.map((result1) => {
        if (result.ID == result1.post_id)
        {
            
            if (result.ID == result1.post_id)
            {
                // date_expires
                if (result1.meta_key == "date_expires") {
                    var date_expir = moment.unix(result1.meta_value).format("YYYY-MM-DD");
                    obj.date_expires=date_expir;
                }

                if (result1.meta_key == "usage_limit_per_user") {
                    obj.usage_limit_per_user = result1.meta_value;
                }

                if (result1.meta_key == "usage_limit") {
                    obj.usage_limit = result1.meta_value;
                }

                if (result1.meta_key == "coupon_amount") {
                    obj.coupon_amount = result1.meta_value;
                }

                if (result1.meta_key == "discount_type") {
                    obj.discount_type = result1.meta_value == "fixed_cart" ? "1" : "2";
                    obj.currency = result1.meta_value == "fixed_cart" ? "5" : "";
                }

                if (result1.meta_key == "customer_email") {
                  obj.emails = getCouponsCustomerEmails(result1.meta_value);
                }

                // if (result1.meta_key == "customer_email") {
                //   obj.emails = getCouponsCustomerEmails(result1.meta_value);
                // }

                
            }
        }
    });

    
    coupons.push(obj);

  });

  const [rows104, fields104] = await db.connection1.query('Delete from tbl_coupon');

  console.log("Deleted old tbl_coupon");

  // console.log(coupons[0].emails === undefined ? "2" : "1");
  // return;

  for (const obj of coupons) {

    if (obj.emails === undefined)
    {
      obj.client_type = "2";
    }else
    {
      obj.client_type = "1";
    }



    var values_tbl_coupon = [
      [obj.date_of_issue,1,1, obj.discount_type,obj.post_name,obj.usage_limit_per_user,
        obj.date_expires,obj.usage_limit,obj.coupon_amount,CurrentDate,CurrentDate,obj.emails,obj.is_delete,obj.client_type,obj.currency]];

        

        
    var sql_tbl_coupon =
        "INSERT INTO tbl_coupon (date_of_issue,issued_by,created_by,discount_type,discount_code,per_user_limit,expiry_date,usage_limit,discount_value,created_at,updated_at,email_domains,is_delete,client_type,currency) VALUES ?";

    const [rows5, fields5] = await db.connection1.query(sql_tbl_coupon, [values_tbl_coupon]);

    // console.log(rows5.insertId)
  }
  


// -- Coupons code finish--

  const arr = [];

  rows.map((value, index) => {
    let obj = {};
    rows1.map((value1, index2) => {
      if (value.ID == value1.post_id) {
        if (value1.meta_key == "_booked_wc_order_appointments") {
          obj.post_id = value1.post_id;
          let res = value1.meta_value.replace("a:1:{i:0;i:", "");
          let res1 = res.replace(";}", "");
          obj.appointment_id = res1;
          arr.push(obj);
        }
      }
    });
  });


  // console.log(rows1[0]);
  // console.log(arr[0]);

  // return;

  arr.map((value, index) => {    
    
    rows1.map((value1, index2) => {
      if (value.appointment_id == value1.post_id) {

        // console.log("value.appointment_id ::: "+value.appointment_id);
        // console.log("value1.post_id ::: "+value1.post_id);


        arr[index].appointment_id = value.appointment_id;
        arr[index].post_id = value.post_id;

        if (value1.meta_key == "_appointment_timestamp") {
          arr[index].appointment_timestamp = value1.meta_value;
          arr[index].appointment_timestamp_actualy_date = moment.unix(value1.meta_value).tz("UTC").format("YYYY-MM-DD");
        }

        if (value1.meta_key == "_appointment_timeslot") {
          arr[index].appointment_timeslot = value1.meta_value;


          const start_time_old = value1.meta_value.split("-")[0];
          const end_time_old = value1.meta_value.split("-")[1];

          const start_time = moment(start_time_old, 'HHmm').format('hh:mm A');

          const end_time = moment(end_time_old, 'HHmm').format('hh:mm A');

          arr[index].start_time = start_time;
          arr[index].end_time = end_time;
        }

        if (value1.meta_key == "_appointment_user") {
          arr[index].appointment_user_id = value1.meta_value;
        }
      }
    });
  });

  

  arr.map((value, index) => {
    rows2.map((value1, index2) => {
      if (
        value1.meta_key == "booked_wc_appointment_id" &&
        value1.meta_value == value.appointment_id
      ) {
        arr[index].order_item_id = value1.order_item_id;
      }
    });
  });

  // console

  arr.map((value, index) => {
    rows2.map((value1, index2) => {
      if (
        value1.order_item_id == value.order_item_id &&
        value1.meta_key == "booked_wc_appointment_cal_name"
      ) {
        arr[index].booked_wc_appointment_cal_name = value1.meta_value;
      }
    });
  });

  // console.log( [...new Set(arr.map(({booked_wc_appointment_cal_name})=>booked_wc_appointment_cal_name))].length);

  // therapistArray = [
  //   {"name":"Lira Low","mobile":"0788243906","email":"liralow@gmail.com"},


  // console.log(mytky);
  // return;
  

  arr.map((value, index) => {
    // rows5.map((value1, index1) => {

      therapistArray.map((value4, index) => {

        if (value4.name == value.booked_wc_appointment_cal_name) {

          // console.log(value4.name);
          // console.log(value1.display_name);
          // console.log(value4.email);
          // console.log(value4.mobile);

          // return;
          value.newArray = value4.name;
          // value.therapist_email_new = value4.email;

          value.therapist_email = value4.email;
          value.therapist_user_login = value4.mobile;
          
          rows4.map((value2, index2) => {
              if (value2.email == value.therapist_email) {
                value.therapist_id = value2.id;
              }
            });
  
          rows4.map((value2, index2) => {
            if (value2.post_id == value.appointment_user_id) {
              value.client_id = value2.id;
            }
          });
  
        }
      });
      // return;
      
    // });
    // return;
  });

  // return;

  // console.log(arr);
  // return;
  

  rows1.map((value1, index1) => {
    arr.map((value2, index2) => {
      if (value2.post_id == value1.post_id) {
        if (value1.meta_key == "_order_total") {
          value2.total_amount = value1.meta_value;
        }
        if (value1.meta_key == "_cart_discount") {
          value2.discount_amount = value1.meta_value;
        }
        if (value1.meta_key == "_billing_postcode") {
          value2.zip_code = value1.meta_value;
        }
        if (value1.meta_key == "_billing_phone") {
          value2.phone_no = value1.meta_value;
        }
        if (value1.meta_key == "_billing_country") {
          value2.country = value1.meta_value;
        }
        if (value1.meta_key == "_transaction_id") {
          value2.transaction_id = value1.meta_value;
        }
        if (value1.meta_key == "_billing_city") {
          value2.city = value1.meta_value;
        }
        if (value1.meta_key == "_completed_date") {
          value2.date_paid = moment(value1.meta_value).tz("UTC").format("YYYY-MM-DD HH:mm:ss");
        }

        if (value1.meta_key == "_payment_method") {
          value2.payment_method = value1.meta_value;
          
        }

        value2.city = value2.city ? value2.city : "";

        
        value2.order_status = 1;
        value2.service_id_fk = 1;
        value2.time_zone = "Asia/Singapore";
        value2.country_id_fk = 5;
        var val = Math.floor(1000 + Math.random() * 9000);
        value2.session_id = val;

      }
    });
  });

  // console.log(arr);
  // return;

  // printFiles();

  console.log("Mapping done deleting of old data started");

  const [rows102, fields102] = await db.connection1.query('TRUNCATE TABLE tbl_order ');

  console.log("Deleted old tbl_order");

  const [rows103, fields103] = await db.connection1.query('TRUNCATE TABLE tbl_order_session ');

  console.log("Deleted old tbl_order_session");
  


  console.log("Deletion completed insertion started");

  // async function printFiles () {  
    for (const records of arr) {



      if (records.appointment_timestamp_actualy_date === undefined)
      {
        continue;
      }

      // if (records.therapist_id === undefined)
      // {
      //   continue;
      // }


      // console.log(records);
      // return;
      
      const [rows9, fields9] = await db.connection1.query('Select * from tbl_avalability WHERE slot_date = ? AND therapist_id_fk = ?', [ records.appointment_timestamp_actualy_date,records.therapist_id]);


      var tbl_avalability_id = "";

      if (rows9.length > 0)
      {
        tbl_avalability_id = rows9[0].id;
      }else
      {

        var values_tbl_avalability = [
          [records.therapist_id, records.appointment_timestamp_actualy_date,CurrentDate,CurrentDate]];

        var sql_tbl_avalability =
        "INSERT INTO tbl_avalability (therapist_id_fk,slot_date,created_at,updated_at) VALUES ?";

        const [rows5, fields5] = await db.connection1.query(sql_tbl_avalability, [values_tbl_avalability]);
        tbl_avalability_id = rows5.insertId;
      }
      
      const [rows900, fields900] = await db.connection1.query('SELECT tbl_avalability_time_slots.id FROM `tbl_avalability` LEFT JOIN tbl_avalability_time_slots ON tbl_avalability_time_slots.avalability_id_fk = tbl_avalability.id WHERE tbl_avalability.slot_date = ? AND time_slot = ? AND therapist_id_fk = ?', [ records.appointment_timestamp_actualy_date,records.start_time,records.therapist_id]);
      
      var slot_id_fk = "";

      if (rows900.length > 0)
      {
        slot_id_fk = rows900[0].id;
        await db.connection1.query('UPDATE tbl_avalability_time_slots SET ? WHERE id = ?', [{ "is_booked": 1 }, slot_id_fk]);
      }else
      {
        var values_tbl_avalability_time_slots = [
          [tbl_avalability_id,records.start_time,records.end_time,0,1,0,0,0,1,0,CurrentDate,CurrentDate]];
  
        var sql_values_tbl_avalability = 
        "INSERT INTO tbl_avalability_time_slots (avalability_id_fk,time_slot,end_time_slot,audio,video,textbasedchat,inperson,homevisit,is_booked,is_close,created_at,updated_at) VALUES ?";
  
        const [rows6, fields6] = await db.connection1.query(sql_values_tbl_avalability, [values_tbl_avalability_time_slots]);
  
        slot_id_fk = rows6.insertId;
      }
      

      var totalAmount = parseFloat(records.total_amount) + parseFloat(records.discount_amount);


      records.amount = parseFloat(records.total_amount).toFixed(2);

      records.service_amount = parseFloat(totalAmount).toFixed(2);
      records.total_amount = parseFloat(totalAmount).toFixed(2);

      // 0 : stripe, 1 : wallet, 2 : coupon, 3: wallet+coupon, 4: wallet+stripe, 5: coupon+stripe, 6:wallet+stripe+coupon


      var payment_mode = 0;


      var coupon = getCouponIdFromOrderId(records.post_id);

      if (records.payment_method == "stripe")
      {
        if (records.discount_amount == 0)
        {
          
          payment_mode = 0;
        }else
        {
          if (coupon == "")
          {
            payment_mode = 0;
          }else
          {
            payment_mode = 5;
          }
          
        }
      }else if (records.payment_method == "wpuw")
      {
        if (records.discount_amount == 0)
        {
          payment_mode = 1;
        }else
        {
          if (coupon == "")
          {
            payment_mode = 0;
          }else
          {
            payment_mode = 3;
          }
          
        }
      }
    // records.discount_amount
    // records.total_amount



      var values_tbl_order = [[payment_mode,records.therapist_id,records.client_id,1,1,5,records.transaction_id,records.amount,records.total_amount,records.discount_amount,records.service_amount,0,records.zip_code,records.phone_no,records.country_id_fk,records.city,"",records.order_status,records.time_zone,records.date_paid,records.date_paid,coupon]];

      var sql_tbl_order = 
      "INSERT INTO tbl_order (type_of_payment_mode,therapist_id_fk,client_id_fk,service_id_fk,medium_id_fk,country_id_fk,transaction_id,amount,total_amount,discount_amount,service_amount,medium_amount,zip_code,phone_no,country,city,state,order_status,time_zone,created_at,updated_at,discount_coupon) VALUES ?";

      const [rows7, fields7] = await db.connection1.query(sql_tbl_order, [values_tbl_order]);

      var order_id_pk = rows7.insertId;

      var values_tbl_order = [[records.appointment_timestamp,records.appointment_timestamp_actualy_date,records.session_id,order_id_pk,slot_id_fk,0,0,0,records.date_paid,records.date_paid]];

      var sql_tbl_order = 
      "INSERT INTO tbl_order_session (timestamp,booking_date,session_id,order_id_fk,slot_id_fk,no_show_by_therapist,no_show_by_client,session_status,created_at,updated_at) VALUES ?";

      const [rows8, fields8] = await db.connection1.query(sql_tbl_order, [values_tbl_order]);


      // break;

    }
  // }
  

  // var sql =
  // "UPDATE `users` SET email = CONCAT(MD5(UUID()),'@mailinator.com')";
  // const [rows7, fields7] = await db.connection1.query(sql, []);

  
    console.log("Looo krlo baat");
};
