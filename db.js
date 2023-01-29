const mongoose = require('mongoose')
const mongoURL = "mongodb://0.0.0.0:27017/inotebook?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
// const connectToMongo = ()=> {
//     mongoose.connect(mongoURL,options,(err) => {
//          if(err) console.log(err) 
//          else console.log("mongdb is connected");
//         }
//     })
// }
const connectToMongo = ()=> {
mongoose 
 .connect(mongoURL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true})   
 .then(() => console.log("Database connected!"))
 .catch(err => console.log(err));
}

module.exports = connectToMongo;