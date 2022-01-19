  const [rows, fields] = await db.execute(
    "SELECT * FROM `xalfyiBase_posts` WHERE `post_type` LIKE 'tyho-wellbeing-coach'"
  );
  console.log("hii");


//  results.map((result) => {
//         db.execute(
//           "SELECT * FROM xalfyiBase_postmeta",
//           function (error1, results1, fields1) {
//             if (error1) throw error1;
//             let obj = {};
//             results1.map((result1) => {
//               if (result1.post_id === result.ID) {
//                 if (field.includes(result1.meta_key)) {
//                   const ke = result1.meta_key;
//                   obj[ke] = result1.meta_value;
//                   arr.push[1];
//                 }
//               }
//             });
//             arr.push(obj);
//           }
//         );
//         console.log(arr.length);
//       });


 const [rows, fields] = await db.execute(
   "SELECT * FROM `xalfyiBase_posts` WHERE `post_type` LIKE 'tyho-wellbeing-coach'"
 );
 const [rows1, fields1] = await db.execute("SELECT * FROM xalfyiBase_postmeta");

 rows.map((result) => {
   ids.push(result.ID);
 });