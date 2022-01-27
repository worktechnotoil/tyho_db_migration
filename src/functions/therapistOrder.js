const connect = require("../utils/connect");
const moment = require("moment");

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
    "SELECT * FROM `xalfyiBase_posts` WHERE `post_type` = 'shop_coupon' AND post_status = 'publish'"
  );

  const [rows12, fields12] = await db.connection.execute(
    "SELECT * FROM `xalfyiBase_postmeta` ORDER BY `meta_id` DESC"
  );

  const [rows13, fields13] = await db.connection.execute(
    "SELECT * FROM `xalfyiBase_wc_order_coupon_lookup` ORDER BY `id` DESC"
  );


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


  var CurrentDate = moment().format("YYYY-MM-DD HH:mm:ss");

  var coupons = [];
  rows10.map((result) => {
    let obj = {};
    obj.post_name=result.post_name;
    obj.coupon_id=result.ID;

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

                    obj.currency = obj.discount_type == "fixed_cart" ? "5" : "";

                    
                }
            }
        }
    });

    
    coupons.push(obj);

  });

  const [rows104, fields104] = await db.connection1.query('Delete from tbl_coupon');

  console.log("Deleted old tbl_coupon");

  // console.log(coupons);
  // return;

  for (const obj of coupons) {
    var values_tbl_coupon = [
      [1,1, obj.discount_type,obj.post_name,obj.usage_limit_per_user,
        obj.date_expires,obj.usage_limit,obj.coupon_amount,CurrentDate,CurrentDate]];


    var sql_tbl_coupon =
        "INSERT INTO tbl_coupon (issued_by,created_by,discount_type,discount_code,per_user_limit,expiry_date,usage_limit,discount_value,created_at,updated_at) VALUES ?";

    const [rows5, fields5] = await db.connection1.query(sql_tbl_coupon, [values_tbl_coupon]);

    console.log(rows5.insertId)
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

  arr.map((value, index) => {
    rows1.map((value1, index2) => {

      if (value.appointment_id == value1.post_id) {

        arr[index].appointment_id = value.appointment_id;
        arr[index].post_id = value1.post_id;

        if (value1.meta_key == "_appointment_timestamp") {
          arr[index].appointment_timestamp = value1.meta_value;
          arr[index].appointment_timestamp_actualy_date = moment.unix(value1.meta_value).format("YYYY-MM-DD");
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

  arr.map((value, index) => {
    rows5.map((value1, index1) => {
      if (value.booked_wc_appointment_cal_name == value1.display_name) {

        value.therapist_email = value1.user_email;
        value.therapist_user_login = value1.user_login;
        
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
  });

 

  

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


  // printFiles();

  console.log("Mapping done deleting of old data started");

  const [rows100, fields100] = await db.connection1.query('TRUNCATE TABLE tbl_avalability ');

  console.log("Deleted old tbl_avalability");

  const [rows101, fields101] = await db.connection1.query('TRUNCATE TABLE tbl_avalability_time_slots ');

  console.log("Deleted old tbl_avalability_time_slots");

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
      
      const [rows9, fields9] = await db.connection1.query('Select * from tbl_avalability WHERE slot_date = ?', [ records.appointment_timestamp_actualy_date]);


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


      
      var values_tbl_avalability_time_slots = [
        [tbl_avalability_id,records.start_time,records.end_time,0,1,0,0,0,1,0,CurrentDate,CurrentDate]];

      var sql_values_tbl_avalability = 
      "INSERT INTO tbl_avalability_time_slots (avalability_id_fk,time_slot,end_time_slot,audio,video,textbasedchat,inperson,homevisit,is_booked,is_close,created_at,updated_at) VALUES ?";

      const [rows6, fields6] = await db.connection1.query(sql_values_tbl_avalability, [values_tbl_avalability_time_slots]);

      var slot_id_fk = rows6.insertId;

      var totalAmount = parseFloat(records.total_amount) + parseFloat(records.discount_amount);


      records.amount = parseFloat(records.total_amount).toFixed(2);

      records.service_amount = parseFloat(totalAmount).toFixed(2);
      records.total_amount = parseFloat(totalAmount).toFixed(2);


      var values_tbl_order = [[records.therapist_id,records.client_id,1,1,5,records.transaction_id,records.amount,records.total_amount,records.discount_amount,records.service_amount,0,records.zip_code,records.phone_no,records.country_id_fk,records.city,"",records.order_status,records.time_zone,CurrentDate,CurrentDate,getCouponIdFromOrderId(records.post_id)]];

      var sql_tbl_order = 
      "INSERT INTO tbl_order (therapist_id_fk,client_id_fk,service_id_fk,medium_id_fk,country_id_fk,transaction_id,amount,total_amount,discount_amount,service_amount,medium_amount,zip_code,phone_no,country,city,state,order_status,time_zone,created_at,updated_at,discount_coupon) VALUES ?";

      const [rows7, fields7] = await db.connection1.query(sql_tbl_order, [values_tbl_order]);

      var order_id_pk = rows7.insertId;

      var values_tbl_order = [[records.appointment_timestamp_actualy_date,records.session_id,order_id_pk,slot_id_fk,1,1,0,CurrentDate,CurrentDate]];

      var sql_tbl_order = 
      "INSERT INTO tbl_order_session (booking_date,session_id,order_id_fk,slot_id_fk,no_show_by_therapist,no_show_by_client,session_status,created_at,updated_at) VALUES ?";

      const [rows8, fields8] = await db.connection1.query(sql_tbl_order, [values_tbl_order]);


      // break;

    }
  // }
  
    console.log("Looo krlo baat");
};
