const connect = require("../utils/connect");

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
    "SELECT * FROM xalfyiBase_users"
  );

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
        if (value1.meta_key == "_appointment_timestamp") {
          arr[index].appointment_timestamp = value1.meta_value;
        }

        if (value1.meta_key == "_appointment_timeslot") {
          arr[index].appointment_timeslot = value1.meta_value;
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
    rows3.map((value1, index1) => {
      if (value.booked_wc_appointment_cal_name == value1.display_name) {
        value.user_login = value1.user_login;
        value.user_email = value1.user_email;
        value.therapist_id_fk = value1.ID;
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
        value2.service_amount = value2.total_amount;
        value2.amount = value2.total_amount - value2.discount_amount;
        value2.order_status = 1;
        value2.service_id_fk = 1;
        value2.time_zone = "Asia/Singapore";
        value2.country_id_fk = 5;
      }
    });
  });

  console.log(arr);
};
