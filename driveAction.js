const fs = require('fs');
const readline = require('readline');
const {google, drive_v2} = require('googleapis');
const {log} = console;
const TOKEN_PATH = 'token.json';
const  SCOPES = ['https://www.googleapis.com/auth/drive']
fs.readFile('cread.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // log(JSON.parse(content))
    // Authorize a client with credentials, then call the Google Drive API.
    // authorize(JSON.parse(content), listFiles);
    // authorize(JSON.parse(content), fileGet);
  });

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });

    


  }

  function listFiles(auth) {
    const drive = google.drive({version: 'v3', auth});
    drive.files.list({
      pageSize: 10,
      q:"1HNYyTkSEg5kS3o_Rrj81S06QLoa5JSRN"
      // fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        console.log('Files:');
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log('No files found.');
      }
    });
  }

  function fileGet(auth){
    const drive = google.drive({version: 'v2', auth});
    drive.children.list({
        folderId:"1HNYyTkSEg5kS3o_Rrj81S06QLoa5JSRN",
        // childId:"1Ail_Xe-e6NYhL8QJpFL-wFPxVpJtx7Ac"
    },(err, res)=>{
        if(res){
          res.data.items.forEach(e=>{
           fileInfo(auth, e.id)
            console.log(e);
          })
        }else{
          console.log(err)
        }
    })
  }


  function fileInfo(auth,id){
    const drive = google.drive({version:"v3", auth})
    drive.files.get({
      fileId:'1HNYyTkSEg5kS3o_Rrj81S06QLoa5JSRN',
      // childId:"1Ail_Xe-e6NYhL8QJpFL-wFPxVpJtx',
      fields:"name,kind,mimeType,webViewLink,fileExtension,size"
    },(err, res)=>{
      if(res){
        console.log(res.data)
      }else{
        console.log(err)
      }
    })
  }

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
class App{
  constructor({
    folderId,
    credFile,

  }){
    this.call = 0;
    this.readFile(credFile,async (data)=>{
      this.drive = google.drive({version:"v3", auth:data})
      this.drive2 = google.drive({version:"v2", auth:data})
    this.main = []
    // log(JSON.stringify(await this.builderHelper((await this.getFileById(folderId)).data,this.main)))

      let folderDetail = (await this.getFileById(folderId)).data
    fs.writeFile(`${folderDetail.name}o${folderDetail.id}.json`, JSON.stringify(await this.builderHelper((await this.getFileById(folderId)).data,this.main)), (err) => {
      if (err) return console.error(err);
      console.log('SAVED', `${folderDetail.name}-${folderDetail.id}.json`);
    });
      // log((await this.getFileById(folderId)).data)
      // console.log((await this.drive2.children.list({
      //     folderId,
      //     fields:"*"
      // })).data)
    })
  }

  authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  readFile(filePath, cb){
    fs.readFile(filePath, (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // log(JSON.parse(content))
      // Authorize a client with credentials, then call the Google Drive API.
      // authorize(JSON.parse(content), listFiles);
      this.authorize(JSON.parse(content), cb);
    });
  }

  getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    })
  }

  getListById(id){
   return this.drive2.children.get({folderId:id, childId:"",fields:"*"})
  }

   getFileById(id){
    return this.drive.files.get({fileId:id, fields:"id,name,kind,mimeType,webViewLink,fileExtension,size"})
  }
  
  async builder(data){
    return new Promise(async(res,rej)=>{
      console.log(this.call++)
  
        // await delay(1000)
    if(data['mimeType']=='application/vnd.google-apps.folder'){
      // log(data)
      let temp={};
      let _this = this;
      temp['name'] = data.name;
      temp['type'] = 'folder';
      
      let _data = await this.getFileList(data.id);
      // log(_data.data.items)
      // let promiseList =await Promise.all( _data.data.files.map(async e=>{
      //   // log(e)
      //   return (await _this.getFileList(e.id)).data;
      //   // log(_itemByFetch.data)
      // }))
      // await delay(2000)
      temp['items']=await Promise.all(_data.data.files.map(async (e,i)=>{
          return await _this.builder(e)
          // await new Promise(resolve => setTimeout(()=>{log("33"); return _this.builder(e)}, 1000));
      })
      )
      return res(temp);
    }else{
      return res(data);
    }

    })
    // console.log(data);
    
  }

  builderHelper(
    data, main
  ){
    return Promise.resolve(
   this.builder(data)
    ) 

  }

  getFileList(id){
    return this.drive.files.list({
      q:`"${id}" in parents`

    })
  }



 

}

let p = new App({credFile:"cread2.json", folderId:'10EhNSvz5JzUynBO561s_upbfWhP31bha'})
// https://drive.google.com/drive/folders/1STAT5_I1oZNtv2G8t9o3oRCL-NJgIyXK?usp=sharing