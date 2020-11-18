const express = require('express');
const router = express.Router();
const collections  = require('../config/mongo').collections
const _ = require('lodash');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

const projectNameGenerator = require("project-name-generator")
const { createKey, createCodec } = require('json-crypto');

const codec = createCodec(process.env.ENCRYPTION_KEY);

router.get('/', ensureAuthenticated, (req, res) => {

  res.redirect('/' + projectNameGenerator().dashed)
    
})

router.get('/login', (req, res) => {

  res.render('login.ejs')
    
})

router.post('/login', (req, res, next) => {

  passport.authenticate('simpleauth', function(err, user, info) {
    
    if (err) { return next(err); }
    if (!user) { 
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }

      res.redirect('/')
      
    });
  })(req, res, next);  
    
})

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/delete/:projectname', ensureAuthenticated, async (req, res) => {

	await collections.notes.deleteOne({projectname: req.params.projectname})

	let onenote = await collections.notes.findOne({})

	if (onenote) {
  	return res.redirect('/' + onenote.projectname)
	}

  res.redirect('/' + projectNameGenerator().dashed)
    
})

router.get('/:projectname', ensureAuthenticated, async (req, res) => {

	let notes = await collections.notes.find({}).toArray()

	//console.log(notes)

  res.render('index.ejs', {
    projectname: req.params.projectname,
    notes: notes
  })
    
})

router.post('/note/:projectname', async (req, res) => {

  if (!req.isAuthenticated()) {
	  return res.json({status:"error", msg:"failed updating"});
  }

  collections.notes.findOneAndUpdate(
    {projectname: req.params.projectname},
    { $set: {
    	content: codec.encrypt(req.body.content),
    	updated: Date.now()
    } },
    { upsert: true }, 
    function (err, noteupdate) {
      if (err) {
        console.log(err)
        res.json({status:"error", msg:"failed updating"})  
        return;
      }
      var msg = ''
      if (!noteupdate.lastErrorObject.updatedExisting) {
        console.log("Added Note", req.params.projectname )
        msg = 'new'
      } else {
        console.log("Updated Note", req.params.projectname )
        msg = 'update'
      }
			res.json({status:"ok", msg: msg})
      
    }
  );
    
})

router.get('/note/:projectname', async (req, res) => {

  if (!req.isAuthenticated()) {
    return res.json({status:"error", msg:"failed updating"});
  }

	var note = await collections.notes.findOne({projectname: req.params.projectname})

	res.json({status:"ok", msg:"", content: (note) ? codec.decrypt(note.content) : ''})
    
})

module.exports = router;
