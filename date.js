
module.exports=getDate;

function getDate(){
  var today = new Date();
  var currentDay = today.getDay();
  var options={
    year:"numeric",month:"long",weekday:"long",hour:"numeric",
    minute:"numeric",second:"numeric"
  };
  var day = today.toLocaleDateString("en-US",options);
  return day;
}
