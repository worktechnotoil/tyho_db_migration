const connect = require("../utils/connect");
const moment = require("moment");
var unserialize=require("php-serialization").unserialize;



module.exports = async () => {
  const db = await connect();

  var CurrentDate = moment().format("YYYY-MM-DD HH:mm:ss");
  // getLanguageId();
 


  

getCommunicationPref('a:2:{i:0;s:5:"Audio";i:1;s:5:"Video";}');
async function getCommunicationPref(value) {
  var array = [];
  var result=unserialize(value);
  for(var attributename in result.__attr__){

    const [rows, fields] = await db.connection1.query('SELECT * FROM `mediums` WHERE medium = ?', [ result.__attr__[attributename].val]);
    array.push(rows[0].id);
  }
  return array.join();   
}
  
  // const [rows10, fields] = await db.connection.execute(
  //   "SELECT * FROM `xalfyiBase_posts` WHERE `post_type` = 'shop_coupon' AND post_status = 'publish'"
  // );

  // const [rows12, fields1] = await db.connection.execute(
  //   "SELECT * FROM `xalfyiBase_postmeta` ORDER BY `meta_id` DESC"
  // );

  

  // var coupons = [];
  // rows10.map((result) => {
  //   let obj = {};
  //   rows12.map((result1) => {
  //       if (result.ID == result1.post_id)
  //       {
  //           obj.post_name=result.post_name;
  //           if (result.ID == result1.post_id)
  //           {
  //               // date_expires
  //               if (result1.meta_key == "date_expires") {
  //                   var date_expir = moment.unix(result1.meta_value).format("YYYY-MM-DD");
  //                   obj.date_expires=date_expir;
  //               }

  //               if (result1.meta_key == "usage_limit_per_user") {
  //                   obj.usage_limit_per_user = result1.meta_value;
  //               }

  //               if (result1.meta_key == "usage_limit") {
  //                   obj.usage_limit = result1.meta_value;
  //               }

  //               if (result1.meta_key == "coupon_amount") {
  //                   obj.coupon_amount = result1.meta_value;
  //               }

  //               if (result1.meta_key == "discount_type") {
  //                   obj.discount_type = result1.meta_value;
  //               }
  //           }
  //       }
  //   });

  //   coupons.push(obj);

  // });

};
