const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');


// // 1) PARAM MIDDLEWARE
// exports.checkID = (req, res, next, val)=>{
//     if (req.params.id * 1 > users.length) {
//         return res.status(404).json({ // !REMEMBER TO ADD 'RETURN'
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next() // !REMEMBER TO ADD NEXT()
// }

const filterObj = (obj, ...allowedFields) => {

    const newObj = {};
    //Object.keys() method returns an array of a given object's own property names
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    })
    return newObj;
}


// 2) ROUTES HANDLERS
//GET ALL
exports.getAllUsers = async (req, res) => {
    try {
        //should be in 'try - catch'
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            },
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

//UPDATE ME
exports.updateMe = catchAsync(async (req, res, next) => {

    //  1)  Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError("This route isn't for password updates. Please use '/updateMyPassword", 400));
    }

    //  2)  Update user document
    //  'req.body' is the whole data,
    //  'name' & 'email' are the properties that we want to keep
    const filteredBody = filterObj(req.body, 'name', 'email');

    // we can use findByIdAndUpdate because we're not working with sensitive data
    // (id, <data that should be updated>, options we have to pass in :
    //                                   1. to return an updated object
    //                                   2. mongoose should validate the data)
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

//GET ONE
exports.getUser = async (req, res) => {

    //FOR REFERENCE
    //converting ':id' into a number
    //const id = req.params.id * 1;
    //
    //to find all users with satisfying criterion
    // const user = users.find(el => el.id === id);
    //
    // res.status(201).json({
    //     status: 'success',
    //     data: {
    //         user,
    //     }
    // })

    try {
        //it's req.params.id because we have ' .route('/:id')'
        const user = await User.findById(req.params.id);
        //User.findOne({ _id: req.params.id });

        res.status(201).json({
            status: 'success',
            data: {
                user,
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

//POST
exports.createUser = async (req, res) => {
    //FOR REFERENCES
    // //creating an id for a new project
    // const newId = users[users.length - 1].id + 1;
    //
    // //copies all properties 'req.body' into a new object {id: newId}
    // const newUser = Object.assign({id: newId}, req.body);
    //
    // //adds new object into the read array of objects
    // users.push(newUser);
    //
    // //writes new object into the json file
    // fs.writeFile(
    //     `${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(users), err => {
    //         res.status(201).json({
    //             status: 'success',
    //             data: {
    //                 user: newUser,
    //             },
    //         })
    //     })

    //we're using 'try-catch' because of 'async'
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

//PATCH
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            //return a modified document rather than an original
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

//DELETE
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id, req.body);
        res.status(204).json({
            status: 'success',
            data: null,
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }

}

//DELETE ME
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

//FOR REFERENCES
// app.get('/api/v1/users', getAllUsers);
// app.get('/api/v1/users/:id', getUser);
// app.post('/api/v1/users',createUser)
// app.patch('/api/v1/users/:id', updateUser);
// app.delete('/api/v1/users/:id', deleteUser);