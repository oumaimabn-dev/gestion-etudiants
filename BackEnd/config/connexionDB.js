const mongoose = require('mongoose')
function connection(){
    mongoose.connect('mongodb://localhost:27017/ExamensDB')
    .then(()=>console.log('connexion bien établir'))
    .catch(e=>console.log(e))
}
module.exports=connection;