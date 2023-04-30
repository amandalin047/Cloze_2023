function applyLabelandUpload() {

   const threads = GmailApp.getInboxThreads(0,3);
   threads.forEach(threadValue1);
}

function threadValue1(thrd) {
  const amanda = "amanda.lin0103@gmail.com";

  const [upload_subject, fail_subject] = ["RE: Submission Received", "RE: Subission Failed"];
  const upload_body_1 = "We've received your submission!";
  const upload_body_2 = "We've received your submission! However, we cannot find your email address <> in the [] Google form..."
  const [a, d, f] = [GmailApp.getUserLabelByName("Uploaded"), GmailApp.getUserLabelByName("Pending"), GmailApp.getUserLabelByName("Failed")];

  const messages = thrd.getMessages();

  var [check, sendER] = ["", ""];
  messages.forEach((messageValue)=>{
    
    try {
      var sender = messageValue.getFrom().split("<")[1].split(">")[0];
    }
    catch(err){
      var sender = messageValue.getFrom();
    }
    sendER = sender;

    const folder1 = DriveApp.getFolderById("ID1");
    const folder2_1 = DriveApp.getFolderById("ID2_1");
    const folder2_2 = DriveApp.getFolderById("ID2_1");
    const folder3 = DriveApp.getFolderById("ID2");

    const responses1 = SpreadsheetApp.openByUrl("URL1").getSheetByName("Sheet 1");
    const responses2_1 = SpreadsheetApp.openByUrl("URL2_1").getSheetByName("Sheet 1");
    const responses2_2 = SpreadsheetApp.openByUrl("URL2_2").getSheetByName("Sheet 1");
    //const responses3 = SpreadsheetApp.openByUrl("URL3").getSheetByName("Sheet 1");
    
    var attach = messageValue.getAttachments();
   
    if(thrd.getLabels().includes(d)){
      Logger.log("pending");
      if (attach.length > 0){
        Logger.log("attachmet(s) found");

        attach.forEach((attachValue) => {
          Logger.log(attachValue.getName());
          if (attachValue.getName().includes("plaus")){

            folder1.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
            thrd.addLabel(a);
            if (!responses1.getRange("D:D").getValues().flat().includes(sender)){
              check += "[plausibility & expectancy] ";
            } else {
              var vals = responses1.getRange("D:D").getValues().flat();
              var row = vals.indexOf(sender) + 1 ;
              var cell = responses1.getRange(row, 14);
              Logger.log("cell value");
              Logger.log(cell.getValue());
              cell.setValue("V");
            }
            
          } else if (attachValue.getName().includes("frame") || attachValue.getName().includes("sentence")){

            folder2_1.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
            thrd.addLabel(a);
            if (!responses2_1.getRange("D:D").getValues().flat().includes(sender)){
              check += "[sentence valence & arousal] ";
            } else {
              var vals = responses2_1.getRange("D:D").getValues().flat();
              var row = vals.indexOf(sender) + 1 ;
              var cell = responses1.getRange(row, 14);
              Logger.log("cell value");
              Logger.log(cell.getValue());
              cell.setValue("V");
            }

          } else if (attachValue.getName().includes("word")){

            folder2_2.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
            thrd.addLabel(a);
            if (!responses2_2.getRange("D:D").getValues().flat().includes(sender)){
              check += "[word valence & arousal] ";
            } else {
              var vals = responses2_2.getRange("D:D").getValues().flat();
              var row = vals.indexOf(sender) + 1 ;
              var cell = responses1.getRange(row, 14);
              Logger.log("cell value");
              Logger.log(cell.getValue());
              cell.setValue("V");
            }
            
          } else if (attachValue.getName().includes("fami")){

            folder3.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
            thrd.addLabel(a);
            if (!responses3.getRange("D:D").getValues().flat().includes(sender)){
              check += "[familiarity & concreteness]";
            } else {
              var vals = responses3.getRange("D:D").getValues().flat();
              var row = vals.indexOf(sender) + 1 ;
              var cell = responses1.getRange(row, 14);
              Logger.log("cell value");
              Logger.log(cell.getValue());
              cell.setValue("V");
            }
            
          } else {
            thrd.addLabel(f);
            messageValue.forward(amanda, {subject: fail_subject});
          }
       })

      } else {
        messageValue.star();
        thrd.addLabel(f);
        messageValue.forward(amanda, {subject: fail_subject});
      }

    }
  })

if (thrd.getLabels().includes(a) && thrd.getLabels().includes(f)){
  thrd.removeLabel(f);
}

if (thrd.getLabels().includes(d)){
  if (check == "") {
    try{
        MailApp.sendEmail(sendER, upload_subject, upload_body_1);
       }
    catch(err){
        messageValue.star();
        MailApp.sendEmail(amanda, upload_subject, upload_body_1);
       }
  } else {
    try{
       MailApp.sendEmail(sendER, upload_subject, upload_body_2.split("[")[0] + check + upload_body_2.split("]")[1].split("<")[0] +    sendER + upload_body_2.split("]")[1].split(">")[1])
       }
    catch{
       MailApp.sendEmail(amanda, upload_subject, upload_body_2.split("[")[0] + check + upload_body_2.split("]")[1].split("<")[0] + sendER + upload_body_2.split("]")[1].split(">")[1])
        }
  } 

thrd.removeLabel(d);
Logger.log("removed label");
}
}
