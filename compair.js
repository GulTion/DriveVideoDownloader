const fs = require("fs");

const parent = "Mastering Data Structures & Algorithms using C and C++o1B3XH4PTmpUerDDkLnxqxgoKtfo6XuY9T.json"
const child = "Mastering Data Structures & Algorithms using C and C++o1ZU8cE9BDjdcBPPe-e6L1em3uOtGbsIOj.json"
const {log} = console

const mapper = {}
fs.readFile(parent, (err, content)=>{
    fs.readFile(child, (err, childContent)=>{

        const data = JSON.parse(content);
        const childData = JSON.parse(childContent)

        addToMapper(childData, mapper);
        reducerToMap(data, mapper);
        
        fs.writeFile(`--${parent}`, JSON.stringify(data), (err)=>{
            log(err)
        })

    })

})

const addToMapper = (obj, map)=>{
    if(obj.type=="folder"){
        mapper[obj.name] = 1
        obj.items.forEach(e=>{
            addToMapper(e, map)
        })
    }else{
        if(obj.mimeType=="video/mp4")
        mapper[obj.name] = 1
    }
}

const reducerToMap = (obj, map)=>{
    if(obj.type=="folder"){
        
        obj.items = obj.items.filter(e=>reducerToMap(e, map));
        if(map[obj.name]==1)
            return true;
        // log(obj.items)
    }else{
        if(obj.mimeType=="video/mp4"){
            if(map[obj.name]==1)
            return false;
        return true;
        }
        return false;
        

    }
}


