// Automatically applies labels and uploads email attachments
function applyLabelandUpload() {
   const threads = GmailApp.getInboxThreads(0,50);
   threads.forEach(threadValue1);
  }

function threadValue1(thrd) {

  const [a, d, f] = [GmailApp.getUserLabelByName("Uploaded"), GmailApp.getUserLabelByName("Pending"), GmailApp.getUserLabelByName("Failed")];
  const [plaus, sentence, word, fam] = ["plaus", "sentence", "word", "fami"];
  const amanda = "Someone@SomeMail.com";

  const messages = thrd.getMessages();
  
  messages.forEach((messageValue)=>{
    try {
      var sender = messageValue.getFrom().split("<")[1].split(">")[0];
    }
    catch(err){
      var sender = messageValue.getFrom();
    }
    
    var subject = messageValue.getSubject();

    const [upload_subject, fail_subject] = ["RE: Submission Received", "RE: Subission Failed"];
    const upload_body = "Hey there：\n\nWe have received your submission. Thank you for participating.\n\nBest regards,\nSomeone";
    const folder1 = DriveApp.getFolderById("SomeID1");
    const folder2_1 = DriveApp.getFolderById("SomeID2");
    const folder2_2 = DriveApp.getFolderById("SomeID3");
    const folder3 = DriveApp.getFolderById("SomeID4");
    
    var attach = messageValue.getAttachments();
    
    if(thrd.getLabels().includes(d)){

      try{
        if (attach.length > 0){
          attach.forEach((attachValue)=>{

            let time=Utilities.formatDate(new Date(),Session.getScriptTimeZone(), "yyMMddHHmmss");
            
            if(subject.includes(plaus)){
              folder1.createFile(attachValue.copyBlob()).setName(attachValue.getName()+time);
              thrd.addLabel(a);
              thrd.removeLabel(d);
              try{
                MailApp.sendEmail(sender, upload_subject, upload_body);
              }
              catch(err){
                messageValue.star();
                MailApp.sendEmail(amanda, upload_subject, upload_body);
              }
              
            } else if(subject.includes(sentence)){
              folder2_1.createFile(attachValue.copyBlob()).setName(attachValue.getName()+time);
              thrd.addLabel(a);
              thrd.removeLabel(d);
              try{
                MailApp.sendEmail(sender, upload_subject, upload_body);
              }
              catch(err){
                messageValue.star();
                MailApp.sendEmail(amanda, upload_subject, upload_body);
              }

            } else if(subject.includes(word)){
              folder2_2.createFile(attachValue.copyBlob()).setName(attachValue.getName()+time);
              thrd.addLabel(a);
              thrd.removeLabel(d);
              try{
                MailApp.sendEmail(sender, upload_subject, upload_body);
              }
              catch(err){
                messageValue.star();
                MailApp.sendEmail(amanda, upload_subject, upload_body);
              }

            } else if (subject.includes(fam)){
              folder3.createFile(attachValue.copyBlob()).setName(attachValue.getName()+time);
              thrd.addLabel(a);
              thrd.removeLabel(d);
              try{
                MailApp.sendEmail(sender, upload_subject, upload_body);
              }
              catch(err){
                messageValue.star();
                MailApp.sendEmail(amanda, upload_subject, upload_body);
              }

            } else {
              messageValue.star();
              thrd.addLabel(f);
              thrd.removeLabel(d);
              messageValue.forward(amanda, {subject: fail_subject});
            }

          })
        } else{
          messageValue.star();
          thrd.addLabel(f);
          thrd.removeLabel(d);
          messageValue.forward(amanda, {subject: fail_subject});
        }

      }
      catch (err){
        messageValue.star();
        messageValue.forward(amanda, {subject: fail_subject});
        console.error(err);
      } 
    }
  })
}



// Exports the email addresses of the senders whose responses have been uploaded (labelled as "Uploaded")
function exportSenders() {
  const threads = GmailApp.getInboxThreads(0,50);
  threads.forEach(threadValue2);
}

var row = 0;
function threadValue2(thrd) {  
  const spreadsheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/url");
  const sheet = spreadsheet.getSheetByName("Sheet1");
  const check = GmailApp.getUserLabelByName("Uploaded");

  const messages = thrd.getMessages();
  
  messages.forEach((messageValue)=>{
    if(thrd.getLabels().includes(check)){
      try {
        var sender = messageValue.getFrom().split("<")[1].split(">")[0];
      }
      catch(err){
        var sender = messageValue.getFrom();
      }
      row += 1;
      Logger.log(sender);
      Logger.log(row);
      var cell = sheet.getRange(row, 1);
      cell.setValue(sender);
    }
  })

}