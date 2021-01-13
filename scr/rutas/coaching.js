const express = require('express');
const router = express.Router();

//const controlador = require('../controler/controlerCoaching');
const controler = require('../controler/controlerCoaching');

//////////////////// call pages//////////////////////////

router.get('/', controler.index);

router.get('/addCoaching', controler.registroCoaching);

router.get('/sesionCoaching', controler.sesionCoaching);

router.get('/commentaryClient', controler.commentaryClient);

router.get('/see/:nombre/:identificacion/:email/:comentario/:imagen', controler.seeCommentary );

router.get('/deleteCommentary/:id', controler.deleteCommentary);

router.get('/newUser', controler.newUser);

router.get('/cerrarSesion', controler.cerrarSesion);

router.get('/listCoaching', controler.listCoaching);

router.get('/searchCoacheeR', controler.rowsCoachee);

router.get('/searchSesionR', controler.rowsSession);

router.get('/schedule', controler.schedule);

router.get('/newEvent', controler.newEvents);





///////////////////////////////////////////////////////////////////////////////////////

////////////////////////call methods///////////////////////////////////////////////

// router.post('/encyptPassNewUser', controler.encyptPassNewUser);

// router.post('/encyptPassAuthenticate', controler.encyptPassAuthenticate);

router.post('/addNewUser', controler.addNewUser);

router.post('/login', controler.authenticate);

router.post('/addCoaching', controler.addCoaching);

router.post('/searchCoachee', controler.searchCoachee);

router.post('/addSesion', controler.addSesion);

router.get('/delete/:id', controler.deleteCoachee);

router.get('/deleteS/:id_sesion/:id_registro', controler.deleteSession);

router.get('/updateS/:id_sesion', controler.searchSesionData);

router.get('/update/:id', controler.searchCoacheeData);

router.get('/plusSession', controler.newSessionPlus);

router.get('/plus/:name', controler.sessionPlus);

router.post('/updateCoachee', controler.updateCoachee );

router.get('/listSession', controler.listSession );

router.get('/listCommentary', controler.listCommentary );

router.post('/searchCommentary', controler.searchCommentary);

router.post('/searchCoacheeSession', controler.searchCoacheeSession);

router.post('/updateSession', controler.updateSession);

router.post('/addCommentaryClient', controler.addCommentary);

router.get('/sendMail', controler.sendMail);

router.get('/event/:day/:month/:year', controler.viewEvents);

router.post('/addNewEvent', controler.addNewEvent);

router.get('/deleteE/:id_event', controler.deleteEvent);

router.get('/tomorrow', controler.tomorrow);

module.exports = router;
