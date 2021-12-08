const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(
            'mongodb+srv://HuyLe:HuyLe@cluster0.sit2m.mongodb.net/DutClassRoom?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
        console.log('Connect successfully !');
    } catch (error) {
        console.log(error.message);
        console.log('Connect fail!');
    }
}

module.exports = { connect };
