const mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment    = require('./models/comment')
    
var seeds = [
    {
        name: "Cloud's Rest", 
        image:'https://images.unsplash.com/photo-1534187886935-1e1236e856c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=935&q=80',
        description: 'Sometimes somewhere'
    },
    {
        name: "Starry Night", 
        image:'https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
        description: 'Calm place out there'
    },
    {
        name: "Into the Woods", 
        image:'https://images.unsplash.com/photo-1498227953826-450c4200f708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
        description: 'Chilling time'
    }
];
// function seedDB(){
//     Campground.remove({}, function(err){
// });
// }

// Refactored callbacks 
async function seedDB(){
    await Campground.deleteMany({});
    console.log('Campgrounds removed')
    await Comment.deleteMany({});
    console.log('Comments removed')

    for(const seed of seeds){
        let campground = await Campground.create(seed);
        console.log('Campground created')
        let comment = await Comment.create(
            {
                text: ' This place is great',
                author: 'You'
            }
        )
        console.log('Comment created')
        campground.comments.push(comment);
        campground.save();
    }
}

module.exports = seedDB;
