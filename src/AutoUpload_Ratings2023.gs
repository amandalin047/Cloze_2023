function applyLabelandUpload() {
   const threads = GmailApp.getInboxThreads(0,10);
   threads.forEach(threadValue1);
  }

function threadValue1(thrd) {

  const [a, d, f] = [GmailApp.getUserLabelByName("Uploaded"), GmailApp.getUserLabelByName("Pending"), GmailApp.getUserLabelByName("Failed")];
  const [plaus, sentence, word, fam] = ["plaus", "sentence", "word", "fami"];
  const amanda = "amanda.lin0103@gmail.com";

  const messages = thrd.getMessages();
  
  var count = 0;
  messages.forEach((messageValue)=>{
   count += 1;
    
    try {
      var sender = messageValue.getFrom().split("<")[1].split(">")[0];
    }
    catch(err){
      var sender = messageValue.getFrom();
    }
    
    var subject = messageValue.getSubject();

    const [upload_subject, fail_subject] = ["RE: Submission Received", "RE: Subission Failed"];
    const upload_body = "同學您好，\n\n我們收到您的填答了，感謝您的參與！\n\n再麻煩您於\n\n04/27(四) 09:00~12:00、\n04/27(四)13:00-16:00、 \n05/02(二)09:00-12:00、\n05/03(三) 09:00-12:00、\n05/04(四)09:00-12:00、\n05/04(四)13:00-16:00\n\n擇一至心理系北館3樓N319室填寫領據並領取受試者費，謝謝您！\n\n台大語言所 腦與語言處理實驗室\n\n\n--\n國立台灣大學 語言學研究所\n腦與語言處理實驗室\n\nBrain and Language Processing Lab,\nGraduate Institute of Linguistics, National Taiwan University";
    
    //const upload_alt = "同學您好，\n\n我們收到您的填答了，感謝您的參與！\n\n那麼再麻煩您於 04/27(四) 09:00~12:00 至心理系北館3樓N319室填寫領據並領取受試者費。\n其他亦可領取之時段為\n\n04/27(四)13:00-16:00、 \n05/02(二)09:00-12:00、\n05/03(三) 09:00-12:00、\n05/04(四)09:00-12:00、\n05/04(四)13:00-16:00\n\n謝謝您！\n\n台大語言所 腦與語言處理實驗室\n\n\n--\n國立台灣大學 語言學研究所\n腦與語言處理實驗室\n\nBrain and Language Processing Lab,\nGraduate Institute of Linguistics, National Taiwan University";

    const folder1 = DriveApp.getFolderById("15l6ScjexAyPKHqEf9-rnksbEaUsPWRp7");
    const folder2_1 = DriveApp.getFolderById("1DVxiR6GuanW3hl095hiDJ6P_gfBT_ltA");
    const folder2_2 = DriveApp.getFolderById("16RwkDdt4K3EgBZ_j_6e3J0djU54_XzRe");
    const folder3 = DriveApp.getFolderById("1nfGs6F_ZeIi0zqSh92N3UzN8C_HIQPLV");
    
    var attach = messageValue.getAttachments();
    Logger.log([count, attach])
    
    if(thrd.getLabels().includes(d)){

      try{
        if (attach.length > 0){
          attach.forEach((attachValue)=>{
            const yes = "yes";
            Logger.log(yes);

            //let time=Utilities.formatDate(new Date(),Session.getScriptTimeZone(), "yyMMddHHmmss");
            
            if(subject.includes(plaus)){
              folder1.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
              thrd.addLabel(a);
              try{
                MailApp.sendEmail(sender, upload_subject, upload_body);
              }
              catch(err){
                messageValue.star();
                MailApp.sendEmail(amanda, upload_subject, upload_body);
              }
              
            } else if(subject.includes(sentence)){
              folder2_1.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
              thrd.addLabel(a);
              try{
                MailApp.sendEmail(sender, upload_subject, upload_body);
              }
              catch(err){
                messageValue.star();
                MailApp.sendEmail(amanda, upload_subject, upload_body);
              }

            } else if(subject.includes(word)){
              folder2_2.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
              thrd.addLabel(a);
              try{
                MailApp.sendEmail(sender, upload_subject, upload_body);
              }
              catch(err){
                messageValue.star();
                MailApp.sendEmail(amanda, upload_subject, upload_body);
              }

            } else if (subject.includes(fam)){
              folder3.createFile(attachValue.copyBlob()).setName(attachValue.getName()+sender);
              thrd.addLabel(a);
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
}




const spreadsheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1hJRiihu04qXwB6dzAwquHVDKCh2LCSEPfBx6j3mBRfk/edit#gid=0");
const sheet = spreadsheet.getSheetByName("Sheet1");




// exports senders and counts list numbers
function exportSenders_countList () {
  sheet.getRange("A:F").clearContent();
  var [list1_1, list1_2, list2_1, list2_2, list3_1, list3_2] = [0,0,0,0,0,0];

  const folder = DriveApp.getFolderById("16RwkDdt4K3EgBZ_j_6e3J0djU54_XzRe");
  const files = folder.getFiles();
 
  var [sender, list_num, row] = ["", "", 1];

  while (files.hasNext()) {
    let f = files.next();
    let name = f.getName();
    
    if (name.includes("1-1")) {
      list1_1 += 1;
      list_num = "List1-1";
      sender = name.slice(35);
    } else if (name.includes("1-2")) {
      list1_2 += 1;
      list_num = "List1-2";
      sender = name.slice(35);
    } else if (name.includes("2-1")) {
      list2_1 += 1;
      list_num = "List2-1";
      sender = name.slice(35);
    } else if (name.includes("2-2")) {
      list2_2 += 1;
      list_num = "List2-2";
      sender = name.slice(35);
    } else if (name.includes("3-1")) {
      list3_1 += 1;
      list_num = "List3-1";
      sender = name.slice(35);
    } else if (name.includes("3-2")) {
      list3_2 += 1;
      list_num = "List3-2";
      sender = name.slice(35);
    }
    var [cell_sender, cell_file] = [sheet.getRange(row, 1), sheet.getRange(row, 2)];
    cell_sender.setValue(sender);
    cell_file.setValue(list_num);


    row += 1;
  }
  Logger.log([list1_1, list1_2, list2_1, list2_2, list3_1, list3_2]);
  const cell_F1 = sheet.getRange(1,6);
  const [cell1_1, cell1_2] = [sheet.getRange(2,6), sheet.getRange(3,6)];
  const [cell2_1, cell2_2] = [sheet.getRange(4,6), sheet.getRange(5,6)];
  const [cell3_1, cell3_2] = [sheet.getRange(6,6), sheet.getRange(7,6)];
  
  cell_F1.setValue("Count");
  cell1_1.setValue(list1_1);
  cell1_2.setValue(list1_2);
  cell2_1.setValue(list2_1);
  cell2_2.setValue(list2_2);
  cell3_1.setValue(list3_1);
  cell3_2.setValue(list3_2);

}