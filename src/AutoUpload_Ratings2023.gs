function applyLabelandUpload() {
   const threads = GmailApp.getInboxThreads(0,10);
   threads.forEach(threadValue1);
  }


function threadValue1(thrd) {

  const [a, d, f] = [GmailApp.getUserLabelByName("Uploaded"), GmailApp.getUserLabelByName("Pending"), GmailApp.getUserLabelByName("Failed")];
  const amanda = "somebody@somemail.com";

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
    const upload_body_1 = "We've received your submission!";
    const upload_body_2 = "We've received your submission! However, we could not find your email address <> in the form...";
    

    const folder1 = DriveApp.getFolderById("ID1");
    const folder2_1 = DriveApp.getFolderById("ID2_1");
    const folder2_2 = DriveApp.getFolderById("ID2_2");
    const folder3 = DriveApp.getFolderById("ID3");

    //const responses1 = SpreadsheetApp.openByUrl("url1").getSheetByName("Sheet 1");
    //const responses2_1 = SpreadsheetApp.openByUrl("url2_1").getSheetByName("Sheet 1");
    const responses2_2 = SpreadsheetApp.openByUrl("url2_2").getSheetByName("Sheet 1");
    //const responses3 = SpreadsheetApp.openByUrl("url3").getSheetByName("Sheet 1");
    
    var attach = messageValue.getAttachments();
   
    if(thrd.getLabels().includes(d)){

      try{
        if (attach.length > 0){
          attach.forEach((attachValue)=>{
            
            if(subject.includes("plaus")){
              folder1.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
              thrd.addLabel(a);
              Logger.log("added label")
              if (responses1.getRange("D:D").getValues().flat().includes(sender)) {
                try{
                  MailApp.sendEmail(sender, upload_subject, upload_body_1);
                }
                catch(err){
                  messageValue.star();
                  MailApp.sendEmail(amanda, upload_subject, upload_body_1);
                }
              } else{
                try {
                  MailApp.sendEmail(sender, upload_subject, upload_body_2.split("<")[0]+sender+upload_body_2.split(">")[1]);
                }
                catch (err){
                  MailApp.sendEmail(amanda, upload_subject, upload_body_2.split("<")[0]+sender+upload_body_2.split(">")[1]);
                }
              }
              
            } else if(subject.includes("sentence")){
              folder2_1.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
              thrd.addLabel(a);
              if (responses2_1.getRange("D:D").getValues().flat().includes(sender)) {
                try{
                  MailApp.sendEmail(sender, upload_subject, upload_body_1);
                }
                catch(err){
                  messageValue.star();
                  MailApp.sendEmail(amanda, upload_subject, upload_body_1);
                }
              } else{
                messageValue.star();
                try {
                  MailApp.sendEmail(sender, upload_subject, upload_body_2.split("<")[0]+sender+upload_body_2.split(">")[1]);
                }
                catch (err){
                  MailApp.sendEmail(amanda, upload_subject, upload_body_2.split("<")[0]+sender+upload_body_2.split(">")[1]);
                }
              }

            } else if(subject.includes("word")){
              folder2_2.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
              thrd.addLabel(a);
              if (responses2_2.getRange("D:D").getValues().flat().includes(sender)) {
                try{
                  MailApp.sendEmail(sender, upload_subject, upload_body_1);
                }
                catch(err){
                  messageValue.star();
                  MailApp.sendEmail(amanda, upload_subject, upload_body_1);
                }
              } else{
                messageValue.star();
                try {
                  MailApp.sendEmail(sender, upload_subject, upload_body_2.split("<")[0]+sender+upload_body_2.split(">")[1]);
                }
                catch (err){
                  MailApp.sendEmail(amanda, upload_subject, upload_body_2.split("<")[0]+sender+upload_body_2.split(">")[1]);
                }
              }

            } else if (subject.includes("fami")){
              folder3.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
              thrd.addLabel(a);
              if (responses3.getRange("D:D").getValues().flat().includes(sender)) {
                try{
                  MailApp.sendEmail(sender, upload_subject, upload_body_1);
                }
                catch(err){
                  messageValue.star();
                  MailApp.sendEmail(amanda, upload_subject, upload_body_1);
                }
              } else{
                messageValue.star();
                try {
                  MailApp.sendEmail(sender, upload_subject, upload_body_2.split("<")[0]+sender+upload_body_2.split(">")[1]);
                }
                catch (err){
                  MailApp.sendEmail(amanda, upload_subject, upload_body_2.split("<")[0]+sender+upload_body_2.split(">")[1]);
                }
              }

            } else {
              messageValue.star();
              thrd.addLabel(f);
              messageValue.forward(amanda, {subject: fail_subject});
            }

          })
        } else{
          messageValue.star();
          thrd.addLabel(f);
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
thrd.removeLabel(d);
if (thrd.getLabels().includes(a) && thrd.getLabels().includes(f)){
  thrd.removeLabel(f);
}
}
