/* jshint esversion: 2015 */
const express = require('express');
const _ = require('lodash');
const { User, Challenge, Mentor, Track, Submission, Post } = require('./db/models');
const { mongoose } = require('./db/mongoose');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Header", "");
    next();
});

app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});


/** USERS ROUTES START */
 /**
 * Desc: All the User related routes will be found here.
 */

 /** USER SIGN-UP ROUTE
  * purpose: used to sign up new user into codera.
  * uri: /users/signup
  * req.body {
  *     firstName: string,
  *     lastName: string, [optional]
  *     userName: string,
  *     email: string,
  *     password: string
  * }
  * res.body {
  *     success: boolean,
  *     message: string,
  *     fail: ['userName', 'email']
  * }
  */

  app.post('/users/signup', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ userName: userName }).then((userDoc) => {
        if (userDoc) {
            res.send({
                success: false,
                message: 'The given ' + userName + ' is already associated with another account.',
                fail: 'userName'
            });
        } else {
            User.findOne({ email: email }).then((userDoc2) => {
                if (userDoc2) {
                    res.send({
                        success: false,
                        message: 'The given ' + email + ' is already associated with another account.',
                        fail: 'email'
                    });
                } else {
                    const newUser = new User({
                        firstName,
                        lastName,
                        userName,
                        email,
                        password
                    });

                    newUser.save().then(() => {
                        res.send({
                            success: true,
                            message: 'User Registered Successfully.'
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }).catch((err) => {
        console.log(err);
    });

  });

 /** USER SIGN-IN ROUTE
  * purpose: used to sign on using user login credentials.
  * uri: /users/signin
  * req.body {
  *     userName: string,
  *     password: string
  * }
  * res.body {
  *     success: boolean,
  *     message: string,
  *     userName: string,
  *     fail: ['email', 'password']
  * }
  */

  app.post('/users/signin', (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;

    User.findOne({ userName: userName }).then((userDoc) => {
        if (userDoc) {
            if (userDoc.password === password) {
                res.send({
                    success: true,
                    message: 'user logged in successfully.',
                    userName: userDoc.userName
                });
            } else {
                res.send({
                    success: false,
                    message: 'The password entered is incorrect.',
                    fail: 'password'
                });
            }
        } else {
            res.send({
                success: false,
                message: 'There is no account found associated with given user name ' + userName,
                fail: 'userName'
            });
        }
    }).catch((err) => {
        console.log(err);
    });

  });

 /** FETCH USER CURRENT LEARNING TRACK
  * purpose: used to retrive users current learning trackId.
  * uri: /users/fetch/track/current  
  * req.body {
  *     userName: string
  * }
  * res.body {
  *     success: boolean,
  *     message: string,
  *     trackId: string
  * }
  */

  app.post('/users/fetch/track/current', (req, res) => {
    User.findOne({ userName: req.body.userName }).then((userDoc) => {
        if (userDoc.currentLearnTrackId) {
            res.send({
                success: true,
                message: 'Successfully retirved user Track',
                trackId: userDoc.currentLearnTrackId
            });
        } else {
            res.send({
                success: false,
                message: 'Not learning new Languages'
            });
        }
    }).catch((err) => {
        console.log(err);
    });
  });

 /** SET USER LEARN TRACK
  * purpose: used to save user current learn track.
  * req.body {
  *   userName: string,
  *   trackId: string
  * }
  * res.body {
  *   success: boolean,
  *   message: string
  * }  
  */ 

  app.post('/users/track/set', (req, res) => {
    User.findOneAndUpdate({ userName: req.body.userName }, { $set: { currentLearnTrackId: req.body.trackId } }).then((userDoc) => {
      res.send({
        success: true,
        message: 'Track Saved Sucessfully'
      });
    }).catch((err) => {
      console.log(err);
    });
  });




/** USERS ROUTES END */


/** CHALLENGE ROUTES START */
 /**
 * Desc: All the Challenge related routes will be found here.
 */


 /** CREATE NEW CHALLENGE
  * purpose: used to create new challenge by user.
  * uri: /challenge/create
  * req.body {
  *     title: string,
  *     description: string,
  *     problemStatement: string,
  *     inputFormat: string,
  *     outputFormat: string,
  *     constraints: string,
  *     createdBy: string
  * }
  * res.body {
  *     success: boolean,
  *     message: string,
  *     fail: ['title']
  * }
  */

  app.post('/challenge/create', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const problemStatement = req.body.problemStatement;
    const inputFormat = req.body.inputFormat;
    const outputFormat = req.body.outputFormat;
    const constraints = req.body.constraints;
    const createdBy = req.body.createdBy;

    Challenge.findOne({ title: title }).then((challengeDoc) => {
        if (challengeDoc) {
            res.send({
                success: false,
                message: 'The title is already taken change the title and try again.',
                fail: 'title'
            });
        } else {
            const newChallenge = new Challenge({
                title,
                description,
                problemStatement,
                inputFormat,
                outputFormat,
                constraints,
                createdBy
            });

            newChallenge.save().then(() => {
                res.send({
                    success: true,
                    message: 'Challenge created successfully'
                });
            }).catch((err) => {
                console.log(err);
            });
        }
    }).catch((err) => {
        console.log(err);
    });

  });

 /** EDIT A CHALLENGE
  * purpose: used to edit already existing challenge created by a user.
  * uri: /challenge/edit/:challengeId
  * req.body {
  *     title: string,
  *     description: string,
  *     difficult: string,
  *     badge: number,
  *     problemStatement: string,
  *     inputFormat: string,
  *     outputFormat: string,
  *     constraints: string
  * }
  * res.body {
  *     success: boolean,
  *     message: string,
  *     fail: ['title']
  * }
  */

  app.patch('/challenge/edit/:challengeId', (req, res) => {
    const title = req.body.title;
    const _cId = req.params.challengeId;
    
    Challenge.findById({ _id: _cId }).then((challengeDoc) => {
        if (challengeDoc) {
            Challenge.findByIdAndUpdate({ _id: _cId }, { $set: req.body }).then((challengeDoc3) => {
                res.send({
                    success: true,
                    message: 'Challenge Updated Successfully.'
                    });
                }).catch((err) => {
                    console.log(err);
                });
        } else {
            res.send({
                success: false,
                message: 'There is No Challenge available in given Id'
            });
        }
    }).catch((err) => {
        console.log(err);
    });

  });

 /** DELETE A CHALLENGE
  * purpose: used to delete existing challenge created by a user.
  * uri: /challenge/delete/:challengeId
  * req.body {
  *     no inputs
  * }
  * res.body {
  *     success: boolean,
  *     message: string
  * }
  */

  app.delete('/challenge/delete/:challengeId', (req, res) => {
    const _challengeId = req.params.challengeId;
    Challenge.findByIdAndDelete({ _id: _challengeId }).then((challengeDoc) => {
        res.send({
            success: true,
            message: 'Challenge Deleted Successfully.'
        });
    }).catch((err) => {
        console.log(err);
    });
  });

 /** FETCH ALL CHALLENGES (EDIT)
  * purpose: used to fetch all the challenges for view.
  * uri: /challenge/fetch/all
  * req.body {
  *     createdBy: string
  * }
  * res.body [{
  *     _id: mongoose.Types.objectId,
  *     title: string
  * }]
  */

  app.post('/challenge/fetch/all', (req, res) => {
    const createdBy = req.body.createdBy;

    Challenge.find({ createdBy: createdBy }).then((challengeDocs) => {
        const Docs = _.map(challengeDocs, (doc) => {
            return _.pick(doc, ['_id', 'title']);
        });
        res.send(Docs);
    }).catch((err) => {
        console.log(err);
    });

  });

 /** FETCH ALL CHALLENGES (VIEW)
  * purpose: used to fetch all the challenges for user view.
  * uri: /challenge/fetch/view 
  * req.body {
  * 
  * }
  * res.body {
  *     title: string,
  *     createdBy: string,
  *     tags: [string],
  *     //status: string,
  *     //submissions: number,
  *     comments: number,
  *     badge: number
  * }
  */ 


 app.get('/challenge/fetch/view', (req, res) => {
     
     async function query() {
         const challengesDoc = await Challenge.find({});
         const Docs = _.map(challengesDoc, (doc) => {
             const Doc = new Object({
                 '_id': doc._id,
                 'title': doc.title,
                 'createdBy': doc.createdBy,
                 'tags': doc.tags,
                 'comments': doc.comments.length,
                 'badge': doc.badge
                });
                return Doc;
            });
            res.send(Docs);
        }
        query();
    });
    
 /** FETCH SINGLE CHALLENGE RANDOM (VIEW)
  * purpose: used to fetch a single random challenge for to view.
  * uri: /challenge/fetch/view/random
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     title: string,
  *     createdBy: string,
  *     tags: [string],
  *     //status: string,
  *     //submissions: number,
  *     comments: number,
  *     badge: number
  * }
  */

  app.get('/challenge/fetch/view/random', (req, res) => {
    Challenge.aggregate([{ $sample: { size: 1 } }]).then((challengeDoc) => {
        const Doc = _.map(challengeDoc, (doc) => {
            return new Object({
                '_id': doc._id,
                'title': doc.title,
                'createdBy': doc.createdBy,
                'tags': doc.tags,
                'comments': doc.comments === undefined ? 0 : doc.comments.length,
                'badge': doc.badge
            });
        });
        res.send(Doc[0]);
    });
  });
    
 /** FETCH SINGLE CHALLENGE (EDIT) 
  * purpose: used to fetch a single challenge for to edit.
  * uri: /challenge/fetch/:challengeId
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     challengeDoc (refer Challenge Model)
  * }
  */
 
 
 app.get('/challenge/fetch/:challengeId', (req, res) => {
     const _challengeId = req.params.challengeId;
     
     Challenge.findById({ _id: _challengeId }).then((challengeDoc) => {
         const Doc = _.pick(challengeDoc, ['_id', 'title', 'problemStatement', 'difficult', 'description', 'inputFormat', 'outputFormat', 'constraints']);
         res.send(Doc);
        });
        
    });
    
    /** FETCH SINGLE CHALLENGE (VIEW)
     * purpose: used to fetch a single challenge for to view.
     * uri: /challenge/fetch/view/:challengeId
     * req.body {
     *     no parameters
  * }
  * res.body {
  *     challengeDoc (refer Challenge Model)
  * }
  */

  app.get('/challenge/fetch/view/:challengeId', (req, res) => {
    const _challengeId = req.params.challengeId;
    Challenge.findById({ _id: _challengeId }).then((challengeDoc) => {
        res.send(challengeDoc);
    });
  });




 /** ADD NEW TEST CASE
  * purpose: used to add new test case for a challenge.
  * uri: /challenge/:challengeId/testcase/new
  * req.body {
  *     sample: boolean,
  *     stdIn: string,
  *     stdOut: string,
  *     explanation: string
  * }
  * res.body {
  *     success: boolean,
  *     message: string
  * }
  */

  app.post('/challenge/:challengeId/testcase/new', (req, res) => {
    const _challengeId = req.params.challengeId;

    Challenge.findByIdAndUpdate({ _id: _challengeId }, { $push: { testCase: req.body } }).then((challengeDoc) => {
        res.send({
            success: true,
            message: 'Test case Added Successfully'
        });
    }).catch((err) => {
        console.log(err);
    });

  });

 /** EDIT TEST CASE
  * purpose: used to edit already existing test case for a challenge.
  * uri: /challenge/:challengeId/testcase/edit/:testCaseId
  * req.body {
  *    sample: boolean,
  *    stdIn: string,
  *    stdOut: string,
  *    explanation: string
  * }
  * res.body {
  *    success: boolean,
  *    message: string
  * }
  */

  app.patch('/challenge/:challengeId/testcase/edit/:testCaseId', (req, res) => {
    const _challengeId = req.params.challengeId;
    const _testCaseId = req.params.testCaseId;

    Challenge.updateOne({ "testCase._id": _testCaseId }, { $set: { 'testCase.$.sample': req.body.sample, 'testCase.$.explanation': req.body.explanation, 'testCase.$.stdIn': req.body.stdIn, 'testCase.$.stdOut': req.body.stdOut } }).then((challengeDoc) => {
        res.send({
            success: true,
            message: 'Test case updated successfully.'
        });
    }).catch((err) => {
        console.log(err);
    });

  });

 /** DELETE TEST CASE
  * purpose: used to delete existing test case for a challenge.
  * uri: /challenge/:challengeId/testcase/delete/:testCaseId
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     success: boolean,
  *     message: string
  * }
  */

  app.delete('/challenge/:challengeId/testcase/delete/:testCaseId', (req, res) => {
      const _challengeId = req.params.challengeId;
      const _testCaseId = req.params.testCaseId;

      Challenge.updateOne({ _id: _challengeId }, { $pull: { testCase: { _id: _testCaseId } } }).then((challengeDoc) => {
        res.send({
            success: true,
            message: 'Test case deleted successfully.'
        });
      }).catch((err) => {
        console.log(err);
      });
  });

 /** FETCH ALL TEST CASE (EDIT)
  * purpose: used to fetch all test case for a given challenge id.
  * uri: /challenge/:challengeId/testCase/fetch/all
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     _id: mongoose.Types.objectId
  * }
  */

  app.get('/challenge/:challengeId/testCase/fetch/all', (req, res) => {
    const _challengeId = req.params.challengeId;

    Challenge.findById({ _id: _challengeId }).then((challengeDoc) => {
        const Docs = _.map(challengeDoc.testCase, (doc) => {
            return _.pick(doc, ['_id']);
        });
        res.send(Docs);
    }).catch((err) => {
        console.log(err);
    });

  });

 /** FETCH SINGLE TEST CASE (EDIT)
  * purpose: used to fetch single test case for to edit.
  * uri: /challenge/:challengeId/testcase/fetch/:testCaseId
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     test cases
  * }
  */
 
  app.get('/challenge/:challengeId/testcase/fetch/:testCaseId', (req, res) => {
    const _challengeId = req.params.challengeId;
    const _testCaseId = req.params.testCaseId;

    Challenge.findOne({ _id: _challengeId, 'testCase._id': _testCaseId }, { 'testCase.$._id': _testCaseId }).then((challengeDoc) => {
        res.send(challengeDoc.testCase[0]);
    }).catch((err) => {
        console.log(err);
    })

  });


 /** FETCH ALL CHALLENGES LIST
  * purpose: used to fetch all available challenge for to show list.
  * uri: /challenge/fetch/list/all
  * req.body {
  *   no parameters
  * }
  * res.body {[
  *   _id,
  *   title
  * ]}
  */

  app.get('/challenge/fetch/list/all', (req, res) => {
    Challenge.find({}).then((challengeDocs) => {
      const Docs = _.map(challengeDocs, (doc) => {
        return _.pick(doc, ['_id', 'title']);
      });
      res.send(Docs);
    }).catch((err) => {
      console.log(err);
    });
  });



/** CHALLENGE ROUTES END */

/** TRACK ROUTES START */
 /**
  * Desc: All the Track related routes will be found here.
  */

 /** CREATE NEW TRACK
  * purpose: used to create new track by user.
  * uri: /track/create
  * req.body {
  *     trackName: string,
  *     description: string,
  *     createdBy: string
  * }
  * res.body {
  *     success: boolean,
  *     message: string,
  *     fail: ['trackName']
  * }
  */
 
  app.post('/track/create', (req, res) => {
    const trackName = req.body.trackName;
    const description = req.body.description;
    const createdBy = req.body.createdBy;

    Track.findOne({ trackName: trackName }).then((trackDoc) => {
        if (trackDoc) {
            res.send({
                success: false,
                message: 'The Track is already exist',
                fail: 'trackName'
            });
        } else {
            const newTrack = new Track({
                trackName,
                description,
                createdBy
            });

            newTrack.save().then(() => {
                res.send({
                    success: true,
                    message: 'Track Created Successfully.'
                });
            }).catch((err) => {
                console.log(err);
            });

        }
    }).catch((err) => {
        console.log(err);
    });

  });
 
 /** FETCH TRACKS ALL (VIEW)
  * purpose: used to fetch all tracks for edit.
  * uri: /tracks/fetch/view/all
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     _id,
  *     trackName
  * }
  */

  app.get('/track/fetch/view/all', (req, res) => {
    Track.find({}).then((trackDoc) => {
      const Docs = _.map(trackDoc, (doc) => {
        return _.pick(doc, ['_id', 'trackName']);
      });
      res.send(Docs);
    }).catch((err) => {
      console.log(err);
    });
  });


 /** FETCH TRACKS (EDIT)
  * purpose: used to fetch all tracks for edit.
  * uri: /tracks/fetch/all
  * req.body {
  *     createdBy
  * }
  * res.body {
  *     _id,
  *     trackName
  * }
  */ 

  app.post('/track/fetch/all', (req, res) => {
    const createdBy = req.body.createdBy;

    Track.find({ createdBy: createdBy }).then((trackDocs) => {
        const Docs = _.map(trackDocs, (doc) => {
            return _.pick(doc, ['_id', 'trackName']);
        });
        res.send(Docs);
    }).catch((err) => {
        console.log(err);
    });

  });

 /** DELETE A TRACk
  * purpose: used to delete a track from codera.
  * uri: /track/:trackId/delete
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     success: boolean,
  *     message: string
  * }
  */

  app.delete('/track/:trackId/delete', (req, res) => {
      const _trackId = req.params.trackId;
      Track.findByIdAndDelete({ _id: _trackId }).then((trackDoc) => {
        res.send({
            success: true,
            message: 'Track Deleted Successfully.'
        });
      }).catch((err) => {
        console.log(err);
      });
  });

 /** CREATE NEW TUTORIAL
  * purpose: used to create new tutorial for the track.
  * uri: /track/:trackId/tutorial/new
  * req.body {
  *     topic: string,
  *     topicDescription: string,
  *     content: string,
  *     //challenges: [ mongoose.Types.ObjectId ]
  * }
  * res.body {
  *     success: boolean,
  *     message: string,
  *     fail: ['topic']
  * }
  */

  app.post('/track/:trackId/tutorial/new', (req, res) => {
    const _trackId = req.params.trackId;
    const topic = req.body.topic;
    const topicDescription = req.body.topicDescription;
    const content = req.body.content;
    //const challenges = req.body.challenges;
    async function query() {
        /*let related = [];
        for(let i = 0;i < challenges.length;i++) {
            const challenge = await Challenge.findById({ _id: challenges[i] });
            related.push(_.pick(challenge, ['_id', 'title', 'difficult']));
        }
        let relatedChallenge = [];
        related.forEach((relDoc) => {
            relatedChallenge.push({
                _challengeId: relDoc._id,
                challengeName: relDoc.title,
                difficult: relDoc.difficult
            });
        });*/
        const setBody = {
            topic,
            topicDescription,
            content//,
            //relatedChallenge
        };
        await Track.findByIdAndUpdate({ _id: _trackId }, { $push: { tutorial: setBody } });
        res.send({
            success: true,
            message: 'Tutorial Added Successfully.'
        }); 
    }
    Track.findOne({ _id: _trackId, tutorial: { $elemMatch: { topic: topic } } }).then((trackDoc) => {
        if (trackDoc) {
            res.send({
                success: false,
                message: 'Tutorial Topic is already exist.',
                fail: 'topic'
            });
        } else {
            query();
        }
    });
  });


 /** FETCH TUTORIALS FROM TRACK (EDIT)
  * purpose: used to fetch all the available track for edit.
  * uri: /track/:trackId/tutorial/fetch/all
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     _id,
  *     topic
  * }
  */

  app.get('/track/:trackId/tutorial/fetch/all', (req, res) => {
    const _trackId = req.params.trackId;
    Track.findById({ _id: _trackId }).then((trackDoc) => {
        const Docs = _.map(trackDoc.tutorial, (doc) => {
            return _.pick(doc, ['_id', 'topic']);
        });
        res.send(Docs);
    });
  });




 /** DELETE TUTORIAL
  * purpose: used to remove tutorial from a track.
  * uri: /track/:trackId/tutorial/delete/:tutorialId
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     success: boolean,
  *     message: string
  * }
  */ 

  app.delete('/track/:trackId/tutorial/delete/:tutorialId', (req, res) => {
    const _trackId = req.params.trackId;
    const _tutorialId = req.params.tutorialId;
    Track.updateOne({ _id: _trackId }, { $pull: { tutorial: { _id: _tutorialId } } }).then((trackDoc) => {
        res.send({
            success: true,
            message: 'Tutorial Removed Successfully.'
        });
    }).catch((err) => {
        console.log(err);
    });
  });

 


 /** ADD RELATED CHALLENGE
  * purpose: used to add new related challenge to the track tutorial.
  * uri: /track/:trackId/tutorial/:tutorialId/add/related
  * req.body {
  *     challengeId: mongoose.Types.objectId
  * }
  * res.body {
  *     success: boolean,
  *     message: string
  * }  
  */ 

  app.patch('/track/:trackId/tutorial/:tutorialId/add/related', (req, res) => {
    const _trackId = req.params.trackId;
    const _tutorialId = req.params.tutorialId;
    const _challengeId = req.body.challengeId;
    async function query() {
        let related = [];
        const challenge = await Challenge.findById({ _id: _challengeId });
        related.push(_.pick(challenge, ['_id', 'title', 'difficult']));
        let relChallenge = [];
        relChallenge.push({
            _challengeId: related[0]._id,
            challengeName: related[0].title,
            difficult: related[0].difficult
        });
        await Track.updateOne({ 'tutorial._id': _tutorialId }, { $push: { 'tutorial.$.relatedChallenge': relChallenge[0] } });
        res.send({
            success: true,
            message: 'Related Challenges Updated Successfully.'
        });
    }
    query();
  });

 /** FETCH RELATED CHALLENGE (EDIT)
  * purpose: used to fetch all related challenges from a tutorial.
  * uri: /track/trackId/tutorial/:tutorialId/fetch/all
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     _challengeId,
  *     challengeName
  * }
  */

  app.get('/track/:trackId/tutorial/:tutorialId/fetch/all', (req, res) => {
    const _trackId = req.params.trackId;
    const _tutorialId = req.params.tutorialId;

    Track.find({ _id: _trackId, 'tutorial._id': _tutorialId }, { 'tutorial.$._id': _tutorialId }).then((trackDoc) => {
        const Docs = _.map((trackDoc[0].tutorial[0]).relatedChallenge, (doc) => {
            return _.pick(doc, ['_challengeId', 'challengeName']);
        });
        res.send(Docs);
    }).catch((err) => {
        console.log(err);
    });

  });


 /** DELETE RELATED CHALLENGE
  * purpose: used to remove related challenge from the track tutorial.
  * uri: /track/:trackId/tutorial/:tutorialId/delete/related/:challengeId
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     success: boolean,
  *     message: string
  * }
  */

  app.delete('/track/:trackId/tutorial/:tutorialId/delete/related/:challengeId', (req, res) => {
    const _trackId = req.params.trackId;
    const _tutorialId = req.params.tutorialId;
    const _challengeId = req.params.challengeId;

    Track.updateOne({ 'tutorial._id': _tutorialId }, { $pull: { 'tutorial.$.relatedChallenge': { _challengeId: _challengeId } } }).then((trackDoc) => {
        console.log(trackDoc);
        res.send({
            success: true,
            message: 'Challenge Removed Successfully.'
        });
    }).catch((err) => {
        console.log(err);
    });

  });

 /** FETCH TUTORIAL DETAILS
  * purpose: used to fetch tutorial details.
  * uri: /track/:trackId/tutorial/fetch/:tutorialId
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     _id,
  *     topic,
  *     topicDescription,
  *     content
  * }
  */ 

  app.get('/track/:trackId/tutorial/fetch/:tutorialId', (req, res) => {
    const _trackId = req.params.trackId;
    const _tutorialId = req.params.tutorialId;

    Track.find({ _id: _trackId, 'tutorial._id': _tutorialId }, { 'tutorial.$._id':_tutorialId }).then((trackDoc) => {
        const Doc = _.map(trackDoc[0].tutorial, (doc) => {
            return _.pick(doc, ['_id', 'topic', 'topicDescription', 'content']);
        });
        res.send(Doc[0]);
    }).catch((err) => {
        console.log(err);
    });

  });


 /** EDIT TUTORIAL DETAILS
  * purpose: used to edit tutorial details and modify the contents.
  * uri: /track/:trackId/tutorial/:tutorialId/edit/details
  * req.body {
  *     topic: string,
  *     topicDescription: string,
  *     content: string
  * } 
  * res.body {
  *     success: boolean,
  *     message: string,
  * }
  */

  app.patch('/track/:trackId/tutorial/:tutorialId/edit/details', (req, res) => {
    const _trackId = req.params.trackId;
    const _tutorialId = req.params.tutorialId;
    const topic = req.body.topic;
    const topicDescription = req.body.topicDescription;
    const content = req.body.content;
    Track.updateOne({ 'tutorial._id': _tutorialId }, { $set: { 'tutorial.$.topic': topic, 'tutorial.$.topicDescription': topicDescription, 'tutorial.$.content': content } }).then((trackDoc) => {
        res.send({
            success: true,
            message: 'Tutorial Updated Successfully'
        });
    }).catch((err) => {
        console.log(err);
    });
  });


 /** FETCH TRACK FOR USER VIEW
  * purpose: used to fetch full track for user view.
  * uri: /track/:trackId/fetch
  * req.body {
  *     no parameters
  * }
  * res.body {
  *     trackDoc
  * }
  */ 

  app.get('/track/:trackId/fetch', (req, res) => {
    const _trackId = req.params.trackId;

    Track.findById({ _id: _trackId }).then((trackDoc) => {
        res.send(trackDoc);
    }).catch((err) => {
        console.log(err);
    });

  });

  


/** TRACK ROUTES END */


/** POST ROUTES START */

 /** NEW FORUM POST
  * purpose: used to post new forum post.
  * uri: /forum/post/new
  * req.body {
  *     title: string,
  *     content: string,
  *     postBy: string
  * }
  * res.body {
  *     success: boolean,
  *     message: string
  * }
  */

  app.post('/forum/post/new', (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const postBy = req.body.postBy;
    const postedOn = Date.now();
    const newPost = new Post({
        title,
        content,
        postBy,
        postedOn
    });

    newPost.save().then(() => {
        res.send({
            success: true,
            message: 'Post added successfully'
        });
    }).catch((err) => {
        console.log(err);
    });

  });

 /** FETCH POST VIEW
  * purpose: used to view forum post.
  * uri: /forum/post/fetch/all
  */

  app.get('/forum/post/fetch/all', (req, res) => {
    Post.find({}).then((postDoc) => {
        const Docs = _.map(postDoc, (doc) => {
            return new Object({
                '_id': doc._id,
                'title': doc.title,
                'content': doc.content,
                'postBy': doc.postBy,
                'postedOn': doc.postedOn,
                'comments': (doc.comments === undefined || doc.comments === null) ? 0 : doc.comments.length,
                'tags': doc.tags
            });
        });
        res.send(Docs);
    }).catch((err) => {
        console.log(err);
    });
  });

 /** FETCH POST BY ID (VIEW)
  * purpose: used to view single post.
  * uri: /forum/post/fetch/:postId
  */

  app.get('/forum/post/fetch/:postId', (req, res) => {
    Post.findById({ _id: req.params.postId }).then((postDoc) => {
        res.send(postDoc);
    }).catch((err) => {
        console.log(err);
    });
  });
 
 /** ADD NEW COMMENT TO THE POST
  * purpose: used to comment under the post.
  * uri: /forum/post/:postId/comment/new
  * req.body {
  *     comment: string,
  *     commentedBy: string
  * }
  */


  app.post('/forum/post/:postId/comment/new', (req, res) => {
    const _postId = req.params.postId;
    const comment = req.body.comment;
    const commentedBy = req.body.commentedBy;
    const commentedOn = req.body.commentedOn;

    Post.findOneAndUpdate({ _id: _postId }, { $push: { comments: { comment, commentedBy, commentedOn } } }).then((PostDoc) => {
        res.send({
            success: true,
            message: 'Comment Posted Successfully'
        });
    }).catch((err) => {
        console.log(err);
    });


  });

 /** ADD NEW REPLY COMMENT TO THE POST
  * purpose: used to reply comment under the post.
  * uri: /forum/post/:postId/comment/:commentId/reply/new
  * req.body {
  *     replyComment: string,
  *     repliedBy: string
  * }
  */

  app.post('/forum/post/:postId/comment/:commentId/reply/new', (req, res) => {
    const _postId = req.params.postId;
    const _commentId = req.params.commentId;
    const replyComment = req.body.replyComment;
    const repliedBy = req.body.repliedBy;
    const repliedOn = Date.now();

    Post.updateOne({ 'comments._id': _commentId }, { $push: { 'comments.$.reply': { replyComment, repliedBy, repliedOn } } }).then((PostDoc) => {
        res.send({
            success: true,
            message: 'Reply Posted Successfully'
        });
    }).catch((err) => {
        console.log(err);
    });

  });


 /** DELETE A REPLY
  * purpose: used to delete a reply made by a user.
  * uri: /forum/post/:postId/comment/:commentId/reply/:replyId/delete
  * req.body {
  *     no parameters
  * }
  */

  app.delete('/forum/post/:postId/comment/:commentId/reply/:replyId/delete', (req, res) => {
    const _postId = req.params.postId;
    const _commentId = req.params.commentId;
    const _replyId = req.params.replyId;

    Post.updateOne({ 'comments._id': _commentId }, { $pull: { 'comments.$.reply': { _id: _replyId } } }).then((postDoc) => {
        res.send({
            success: true,
            message: 'Reply Deleted Successfully'
        });
    }).catch((err) => {
        console.log(err);
    });

  });

 /** DELETE A COMMENT
  * purpose: used to delete a comment made by the user.
  * uri: /forum/post/:postId/comment/:commentId/delete
  * req.body {
  *     no parameters
  * }
  */

  app.delete('/forum/post/:postId/comment/:commentId/delete', (req, res) => {
      const _postId = req.params.postId;
      const _commentId = req.params.commentId;

      Post.updateOne({ _id: _postId }, { $pull: { comments: { _id: _commentId } } }).then((postDoc) => {
        res.send({
            success: true,
            message: 'Comment Deleted Successfully'
        });
      }).catch((err) => {
        console.log(err);
      });

  });


/** POST ROUTES END */

