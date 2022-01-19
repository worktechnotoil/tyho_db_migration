const connect = require("../utils/connect");
//"SELECT * FROM xalfyiBase_postmeta"

module.exports = async () => {
  const db = await connect();
  const arr = [];
  const field = [
    "clients-types",
    "communication-pref",
    "education",
    "please-include-a-description-about-yourself-for-your-profile",
    "languages",
    "first-name",
    "middle-name",
    "last-name",
    "phone-number",
    "current-occupation",
    "length-of-experience",
    "area-of-expertise-specialisation",
    "full_name",
    "therapeutic-approaches",
    "current--last-place-of-practice",
    "educational-qualifications",
    "professional-certifications",
    "professional-memberships",
    "specific-groups",
    "not-to-work-with",
    "teenagers",
    "preferred-modes-of-communication",
    "available-time-slots",
    "_appointment_user_reminder_sent",
    "approximate-availability-hours-per-week",
  ];

  const applications = [
    { key: "first-name", ch: "first_name" },
    { key: "middle-name", ch: "middle_name" },
    { key: "last-name", ch: "last_name" },
    { key: "current-occupation", ch: "last-name" },
    { key: "length-of-experience", ch: "last-name" },
    { key: "area-of-expertise-specialisation", ch: "last-name" },
    { key: "languages", ch: "last-name" },
    { key: "clients-types", ch: "last-name" },
    { key: "therapeutic-approaches", ch: "last-name" },
    { key: "current--last-place-of-practice", ch: "last-name" },
    { key: "educational-qualifications", ch: "last-name" },
    { key: "professional-certifications", ch: "last-name" },
    { key: "professional-memberships", ch: "last-name" },
    { key: "specific-groups", ch: "last-name" },
    { key: "not-to-work-with", ch: "last-name" },
    { key: "preferred-modes-of-communication", ch: "last-name" },
    { key: "approximate-availability-hours-per-week", ch: "last-name" },
  ];

  const [rows, fields] = await db.connection.execute(
    "SELECT * FROM `xalfyiBase_posts` WHERE `post_type` LIKE 'tyho-wellbeing-coach'"
  );
  const [rows1, fields1] = await db.connection.execute(
    "SELECT * FROM xalfyiBase_postmeta"
  );

  rows.map((result) => {
    let obj = {};
    obj.postid = result.ID;
    rows1.map((result1) => {
      if (result1.post_id === result.ID) {
        if (field.includes(result1.meta_key)) {
          const ke = result1.meta_key;
          obj[ke] = result1.meta_value;
        }
      }
    });
    arr.push(obj);
  });
};
