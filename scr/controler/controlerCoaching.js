const controler = {}
const nodemailer = require ('nodemailer');

require('dotenv').config();

const Cryptr = require('cryptr'),
cryptr = new Cryptr('devnami');

const bcrypt = require('bcrypt');

///////////meethods to call pages///////////////////////
controler.index = ('/', (req, res) => {
    res.render('index', {
      wrong_data: false,
      newUser: false
    });
  });

controler.sesionCoaching = ('/', (req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  res.render('sesionCoaching', {
    existe: false,
    cantSesion:'__',
    nombre_coachee:'',
    guardo:false
  });
});

controler.registroCoaching = ('/', (req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  const event_tomorrow_v = req.session.event_tomorrow_v;
  req.session.event_tomorrow_v = false;
  res.render('addCoaching', {
    registrado: false,
    registra: false,
    nombre: req.session.nombre_user,
    newSession: false,
    event_tomorrow_v
  });
});



controler.newUser = ('/', (req, res) =>{
  res.render('addUser', {
    email_exists: 0
  });
});

controler.cerrarSesion = ('/', (req, res) =>{
  delete req.session.nombre_user;
  delete req.session.id_sesion;
  delete req.session.day;
  delete req.session.month_text;
  delete req.session.year;
  delete req.session.message;
  delete req.session.existe_event;
  delete req.session.existe;
  delete req.session.problem;
  delete req.session.delete;
  delete req.session.update;
  delete req.session.message;
  delete req.session.nombre_coachee;
  delete req.session.num_sesion;
  delete req.session.exitoMil;
  delete req.session.exito;
  delete req.session.palabra_clave;
  delete req.session.rows;

  res.redirect('/');
});

controler.schedule = ('/', (req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  res.render('calendar');
});

controler.viewEvents= ('/', (req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.session.day = req.params.day;
  req.session.month_text = req.params.month;
  req.session.year = req.params.year;
  req.session.message = false;
  req.session.existe_event = false;
  res.redirect('/newEvent');
});

const event_tomorrow = () => {
    var fecha=new Date();
    var manana=new Date(fecha.getTime() + 24*60*60*1000);
    var mes = manana.getMonth() + 1;
    var dia = manana.getDate();
    if (mes < 10) {
      mes = '0'+mes;
    }
    if(dia < 10){
      dia = '0'+dia;
    }

    var date = manana.getFullYear()+'-'+mes+'-'+dia;

    return date;
};


/////////////////////page new event/////////////////////////////

controler.tomorrow = ('/', (req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  var fecha=new Date();
  var manana=new Date(fecha.getTime() + 24*60*60*1000);
  var mes = manana.getMonth();
  var dia = manana.getDate();

  if(dia < 10){
    dia = '0'+dia;
  }
  var monthName = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio",
                   "Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  var mes_text = monthName[mes];

  req.session.day = dia;
  req.session.month_text = mes_text;
  req.session.year = manana.getFullYear();

  res.redirect('/newEvent');
});

controler.newEvents= ('/', (req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  var day = req.session.day;
  var month_text = req.session.month_text;
  var year = req.session.year;
  var message = req.session.message;
  var existe_event =req.session.existe_event;

  var monthName = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio",
                   "Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  var month = 0;
  for (var i = 0; i < monthName.length; i++) {
    if(req.session.month_text === monthName[i]){
        month = i+1;
      }
  }
  req.session.month = month;
  var date = req.session.year +'-'+month+'-'+req.session.day;

 req.getConnection((err, conn) => {
    conn.query('call sp_select_evente(?,?)', [date, req.session.nombre_user], (err, rows) => {
      res.render('events', {
        day,
        month_text,
        year,
        message,
        existe_event,
        data: rows
      });
    });
 });
});

//////////////////////////add new event/////////////////////////////
controler.addNewEvent = ('/', (req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
   if(req.body.final_minutos > req.body.inicio_minutos ||  req.body.inicio_horario != req.body.final_horario || req.body.final_hora > req.body.inicio_hora){

     var inicio = req.body.inicio_hora;
     var final = req.body.final_hora;
     var month = req.session.month;
     var date = req.session.year +'-'+month+'-'+req.session.day;
     var hora_inicio =  '0'+inicio+':'+ req.body. inicio_minutos+':00';
     var hora_fin = '0'+final +':'+ req.body.final_minutos+':00';

       req.getConnection((err, conn) => {
         conn.query('call sp_exists_event(?,?,?,?,?,?)', [date, hora_inicio, hora_fin, req.session.nombre_user, req.body.inicio_horario, req.body.final_horario], (err, rows) => {
           console.log(rows[0][0].exists_event);
            if(rows[0][0].exists_event < 1){
              req.getConnection((err, conn) => {
                conn.query('call sp_insert_event(?,?,?,?,?,?,?,?)', [date, req.session.nombre_user, req.body.place, req.body.description_event, hora_inicio, hora_fin, req.body.final_horario, req.body.inicio_horario], (err, rows) => {
                 if(err){
                   res.json(err)
                 }else {
                   req.session.existe_event = false;
                   req.session.message = false;
                   res.redirect('/newEvent');
                 }
                });
              });

            }else{
              req.session.existe_event = true;
              res.redirect('/newEvent');
            }
         });
       });
   }else{
     req.session.message = true;
     res.redirect('/newEvent');
   }

});

//////////////////////////delete events////////////////////////////
controler.deleteEvent = ('/', (req, res)=>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) =>{
    conn.query('call sp_delete_event (?)', [req.params.id_event], (err, rows) =>{
      if(err){
        res.json(err);
      }else{
        req.session.existe_event = false;
        req.session.message = false;
        res.redirect('/newEvent');
      }
    });
  });
});

///////////add new user////////////////
controler.addNewUser = ('/', (req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_exists_user(?, ?)', [req.body.user_name, req.body.user_email], (err, rows) => {
      if(err){
        res.json(err);
      }else if(rows[0][0].exists_user < 1){
        if(req.body.user_password == req.body.user_confirm_password) {
          var password_encrypt = cryptr.encrypt(req.body.user_password);
          req.getConnection((err, conn) => {
            conn.query('call sp_insert_user(?, ?, ?)',
            [ req.body.user_name, req.body.user_email, password_encrypt], ( err, rows) => {
                if(err){
                  res.json( err );
                }else {
                  res.render('index', {
                    newUser: true,
                    wrong_data :false
                  });
                  }
                });
            });
        }else {
            res.render('addUser',{
              email_exists:3
            });
        }
      }
      else{
        res.render('addUser',{
          email_exists:2
        });
      }
    });
  });
});


////////authenticate use to login/////////////////////
controler.authenticate = ('/', (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('call sp_authenticate_user(?)', [req.body.user_email], (err, rows) => {
      if(err){
        res.json(err);
      }else if(rows[0][0].exists_user > 0) {
        var pass = rows[0][0].contrasenna;
        var password_decrypt = cryptr.decrypt(pass);
        if(password_decrypt === req.body.user_password){

          req.session.nombre_user = rows[0][0].nombre_completo;
          const nombre = req.session.nombre_user;
          req.session.existe = false;
          req.session.problem = false;
          req.session.delete = false;
          req.session.update = false;

          var date = event_tomorrow();

          req.getConnection ((err, conn) =>{
            conn.query('call sp_event_tomorrow(?,?)', [date, req.session.nombre_user], (err, rows) => {
              if(err){
                res.json(err);
              }else{
                if(rows[0][0].event_tomorrow > 0){
                  req.session.event_tomorrow_v = true;
                }
                res.redirect('/addCoaching');
              }
            });
          });
        }
        else{
          res.render('index', {
            wrong_data: 2,
            newUser: false
          });
        }
      }else{
        res.render('index', {
          wrong_data: 1,
          newUser: false
        });
      }
    });
  });
});


////////////////////////add coaching/////////////////////////
////////////////////penfdiente al cambio esperado///////////////

controler.addCoaching = ('/', (req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_exists_coaching(?, ?)', [req.body.name_coachee, req.session.nombre_user], (err, rows) => {
      if(err){
        res.json(err);
      }else {
        if (rows[0][0].exists_coachee < 1) {
          console.log(rows);
          req.getConnection((err, conn) => {
            conn.query('call sp_insert_coachee (?,?,?,?,?,?,?,?,?,?,?) ',
            [req.session.nombre_user, req.body.name_coachee, req.body.telefono, req.body.email, req.body.contexto, req.body.observacion, req.body.image_input, req.body.verbal, req.body.para_verbal, req.body.no_verbal, req.body.rol_emociones], ( err, rows) => {
                if(err){
                  res.json( err );
                }else {
                  res.render('addCoaching', {
                    registrado: false,
                    registra: true,
                    nombre: req.session.nombre_user,
                    newSession: false,
                    event_tomorrow_v: false
                  });
                  }
                });
            });
        }else{
          res.render('addCoaching', {
            registrado: true,
            registra: false,
            nombre: req.session.nombre_user,
            newSession: false,
            event_tomorrow_v: false
          });
        }
      }
    });
  });
});


////////////////////////////search coachee to new session ////////////////////////
controler.sessionPlus = ('/', (req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.session.nombre_coachee = req.params.name;
  res.redirect('/plusSession');
});

controler.newSessionPlus = ('/', (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('call sp_exists_coachee(?, ?)', [req.session.nombre_coachee, req.session.nombre_user], (err, rows) => {
      if(err){
        res.json(err);
      }else {
          req.session.id_registro = rows[0][0].id_registro;
          req.getConnection((err, conn) => {
            conn.query('call sp_num_session(?, ?)', [req.session.nombre_coachee, req.session.nombre_user], (err, rows) => {

              req.session.num_sesion = 1 + rows[0][0].numero_sesion;

              res.render('sesionCoaching', {
                existe:false,
                cantSesion: req.session.num_sesion,
                nombre_coachee: req.session.nombre_coachee,
                guardo:false
              });
            });
          });
      }
    });
  });
});



controler.searchCoachee = ('/', (req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_exists_coachee(?, ?)', [req.body.nombre_coachee, req.session.nombre_user], (err, rows) => {
      if(err){
        res.json(err);
      }else {
       if(rows[0][0].exists_caochee < 1){
         res.render('sesionCoaching', {
           existe:true,
           cantSesion:'__',
           nombre_coachee:req.body.nombre_coachee,
           guardo:false
         });
        }
        else{
          req.session.id_registro = rows[0][0].id_registro;
          req.getConnection((err, conn) => {
            conn.query('call sp_num_session(?, ?)', [req.body.nombre_coachee, req.session.nombre_user], (err, rows) => {

              req.session.num_sesion = 1 + rows[0][0].numero_sesion;
              req.session.nombre_coachee = req.body.nombre_coachee;

              res.render('sesionCoaching', {
                existe:false,
                cantSesion:req.session.num_sesion,
                nombre_coachee:req.session.nombre_coachee,
                guardo:false
              });
            });
          });
        }
      }
    });
  });
});


const date_today = () => {
    var fecha=new Date();
    console.log(fecha + 'vamos a aver que pode wey');
    var hoy=new Date(fecha.getTime() + 24*60*60*1000);
    var mes = hoy.getMonth() + 1;
    var dia = hoy.getDate() - 1;
    if (mes < 10) {
      mes = '0'+mes;
    }
    if(dia < 10){
      dia = '0'+dia;
    }
    var date = hoy.getFullYear()+'-'+mes+'-'+dia;
    return date;
};

///////////////////add a nuew session/////////////////////////////
controler.addSesion = ('/', (req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  if(req.session.num_sesion !== undefined){
    var date = date_today();
    if(req.body.dia !== 'Día'&& req.body.mes !== 'Mes' && req.body.anno !== 'Año' ){
      var vMes = req.body.mes;
      var vDia = req.body.dia;
      if(req.body.mes < 10){
        vMes = '0'+req.body.mes;
      }
      if(req.body.dia < 10){
        vDia = '0'+req.body.dia;
      }
      date = req.body.anno +'-'+vMes+'-'+vDia;
    }
    req.getConnection((err, conn) => {
      conn.query('call sp_insert_session(?,?,?,?,?)',  [  req.session.num_sesion, date, req.session.id_registro ,  req.session.nombre_coachee, req.body.tema], (err, rows) => {
        if (err) {
          res.json(err);
        }else{
          req.getConnection((err, conn) => {
            conn.query('call sp_insert_situacion_actual(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',  [req.body.newItem_actual_1, req.body.newItem_actual_2, req.body.newItem_actual_3, req.body.newItem_actual_4, req.body.newItem_actual_5, req.body.newItem_actual_6, req.body.newItem_actual_7, req.body.newItem_actual_8, req.body.newItem_actual_9, req.body.newItem_actual_10, req.body.newItem_actual_11, req.body.newItem_actual_12, req.body.newItem_actual_13, req.body.newItem_actual_14, req.body.newItem_actual_15], (err, rows) => {
              if(err){
                res.json(err);
              }
            });
          });

          req.getConnection((err, conn) => {
            conn.query('call sp_insert_situacion_ideal(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',  [ req.body.newItem_ideal_1, req.body.newItem_ideal_2, req.body.newItem_ideal_3, req.body.newItem_ideal_4, req.body.newItem_ideal_5, req.body.newItem_ideal_6, req.body.newItem_ideal_7, req.body.newItem_ideal_8, req.body.newItem_ideal_9, req.body.newItem_ideal_10, req.body.newItem_ideal_11, req.body.newItem_ideal_12, req.body.newItem_ideal_13, req.body.newItem_ideal_14, req.body.newItem_ideal_15], (err, rows) => {
              if(err){
                res.json(err);
              }
            });
          });

          req.getConnection((err, conn) => {
            conn.query('call sp_insert_plan_accion(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',  [req.body.newItem_accion_1, req.body.newItem_accion_2, req.body.newItem_accion_3, req.body.newItem_accion_4, req.body.newItem_accion_5, req.body.newItem_accion_6, req.body.newItem_accion_7, req.body.newItem_accion_8, req.body.newItem_accion_9, req.body.newItem_accion_10], (err, rows) => {
              if(err){
                res.json(err);
              }
            });
          });

          req.getConnection((err, conn) => {
            conn.query('call sp_insert_opciones(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',  [req.body.newItem_opcion_1, req.body.newItem_opcion_2, req.body.newItem_opcion_3, req.body.newItem_opcion_4, req.body.newItem_opcion_5, req.body.newItem_opcion_6, req.body.newItem_opcion_7, req.body.newItem_opcion_8, req.body.newItem_opcion_9, req.body.newItem_opcion_10], (err, rows) => {
              if(err){
                res.json(err);
              }
            });
          });
          res.render('sesionCoaching', {
            existe:false,
            cantSesion: '__',
            nombre_coachee: '',
            guardo:true
          });
        }
      });
    });
  }else{
    res.render('sesionCoaching', {
      existe:true,
      cantSesion:'__',
      nombre_coachee : '',
      guardo: false
    });
  }

});


////////////////list the coaching/////////////////////
controler.listCoaching = ('/', (req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_list_coaching(?)', [req.session.nombre_user], (err, rows) => {
        if(err){
           res.json( err );
        }else {
          var problem = req.session.problem;
          var deleteInf = req.session.delete;
          var updateInfo = req.session.update;
          req.session.update = false;
          req.session.problem = false;
          req.session.delete = false;
          res.render('infoCoaching', {
            updateInfo,
            deleteInf,
            problem,
            data: rows
          });
        }
    });
  });
});


controler.searchCoacheeSession = ('/', (req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_search_coachee_session(?,?)', [req.body.nombre_coachee, req.session.nombre_user], (err, rows) => {
      if(err){
        res.json(err);
      }else {

       if(rows[0][0].exists_caochee < 1){
        req.session.existe = true;
         res.redirect('/listSession');
       }else{
              req.session.nombre_coachee = req.body.nombre_coachee;
              res.redirect('/listSession');
        }
      }
    });
  });
});

controler.listSession = ('/', (req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_list_session(?, ?)', [req.session.nombre_coachee, req.session.nombre_user], (err, rows) => {
        if(err){
           res.json( err );
        }else {
          var problem = req.session.problem;
          var deleteInf = req.session.delete;
          var updateInfo = req.session.update;
          req.session.update = false;
          req.session.problem = false;
          req.session.delete = false;
          var nombre = req.session.nombre_coachee;
          var existe = req.session.existe;
          req.session.existe = false;
          res.render('infoSession', {
            updateInfo,
            deleteInf,
            problem,
            nombre,
            existe,
            data: rows
          });
        }
    });
  });
});


//function to delete users
controler.deleteCoachee = ((req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
    req.getConnection((err, conn) => {
      conn.query('call sp_delete_coachee (?)', [req.params.id], ( err, rows) => {
          if(err){
            req.session.problem = true;
            res.redirect('/listCoaching');
          }else {
            req.getConnection((err, conn) => {
              conn.query('call sp_delete_all_session (?)', [req.params.id], ( err, rows) => {
                if (err) {
                  req.session.problem = true;
                  res.redirect('/listCoaching');
                }else {
                  req.session.delete = true;
                  res.redirect('/listCoaching');
                }
              });
            });
          }
        });
      });
    });

controler.deleteSession = ((req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_delete_session (?,?)', [req.params.id_registro, req.params.id_sesion], ( err, rows) => {
      if (err) {
        req.session.problem = true;
        res.redirect('/listSession');
      }else {
        req.session.delete = true;
        res.redirect('/listSession');
      }
    });
  });
  });

controler.searchCoacheeData = ((req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.session.id_registro = req.params.id;
  res.redirect('/searchCoacheeR');
});

controler.rowsCoachee = ((req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_row_coachee(?)', [req.session.id_registro], ( err, rows) => {
        if(err){
          res.json( err );
        }else {
          res.render('searchCoachee', {data: rows});
        }
      });
   });
});

controler.searchSesionData = ((req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.session.id_sesion = req.params.id_sesion;
  req.session.exitoMil = 0;
  res.redirect('/searchSesionR');
});

controler.rowsSession = ((req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_row_session (?)', [req.session.id_sesion], ( err, rows) => {
        if(err){
          res.json( err );
        }else {

          var actual = [rows[0][0].actual_1, rows[0][0].actual_2,rows[0][0].actual_3,rows[0][0].actual_4,rows[0][0].actual_5,
          rows[0][0].actual_6, rows[0][0].actual_7, rows[0][0].actual_8, rows[0][0].actual_9, rows[0][0].actual_10,rows[0][0].actual_11,rows[0][0].actual_12,rows[0][0].actual_13,
          rows[0][0].actual_14,rows[0][0].actual_15];

          var ideal = [rows[0][0].ideal_1, rows[0][0].ideal_2,rows[0][0].ideal_3,
          rows[0][0].ideal_4, rows[0][0].ideal_5,rows[0][0].ideal_6, rows[0][0].ideal_7, rows[0][0].ideal_8,rows[0][0].ideal_9,rows[0][0].ideal_10,rows[0][0].ideal_11,
          rows[0][0].ideal_12,rows[0][0].ideal_13,rows[0][0].ideal_14,rows[0][0].ideal_15];

          var opcion = [rows[0][0].opcion_1, rows[0][0].opcion_2,rows[0][0].opcion_3,rows[0][0].opcion_4,rows[0][0].opcion_5,
          rows[0][0].opcion_6, rows[0][0].opcion_7, rows[0][0].opcion_8, rows[0][0].opcion_9,rows[0][0].opcion_10];

          var accion = [rows[0][0].accion_1, rows[0][0].accion_2,rows[0][0].accion_3,rows[0][0].accion_4,rows[0][0].accion_5,
          rows[0][0].accion_6, rows[0][0].accion_7, rows[0][0].accion_8, rows[0][0].accion_9,rows[0][0].accion_10];

          var num_actual = 0;
          var num_ideal = 0;
          var num_accion = 0;
          var num_opcion = 0;

          for (var i = 0; i < accion.length; i++) {
            if(accion[i] !== null){
              num_accion ++;
            }
          }

          for (var i = 0; i < opcion.length; i++) {
            if(opcion[i] !== null){
              num_opcion ++;
            }
          }

          for (var i = 0; i < actual.length; i++) {
            if(actual[i] !== null){
              num_actual ++;
            }
          }

          for (var i = 0; i < ideal.length; i++) {
            if(ideal[i] !== null){
              num_ideal ++;
            }
          }
          req.session.nombre_coachee = rows[0][0].nombre_coachee;
          req.session.tema = rows[0][0].tema;
          req.session.num_sesion = rows[0][0].num_sesion;
          res.render('searchSession', {
            tema: rows[0][0].tema,
            nombre_coachee: rows[0][0].nombre_coachee,
            num_sesion: rows[0][0].num_sesion,
            data_actual: actual,
            data_ideal: ideal,
            data_opcionS: opcion,
            data_accion: accion,
            num_actual,
            num_ideal,
            num_accion,
            num_opcion,
            email: req.session.exitoMil
          });
        }
      });
   });
});

controler.updateCoachee = ((req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
        conn.query('call sp_update_coachee(?,?,?,?,?,?,?,?,?,?,?)',
        [req.body.name_coaching, req.body.name_coachee, req.body.telefono, req.body.email, req.body.contexto, req.body.observacion, req.body.verbal, req.body.para_verbal, req.body.no_verbal, req.body.rol_emociones, req.session.id_registro], (err, rows) => {
          if(err){
            req.session.problem = true;
            res.redirect('/listCoaching');
          }else {
            req.session.update = true;
            res.redirect('/listCoaching');
          }
        });
      });
    });

controler.updateSession = ((req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  var if_date = 'N';
  var date = date_today();
  if(req.body.dia !== 'Día'&& req.body.mes !== 'Mes' && req.body.anno !== 'Año' ){
    if_date = 'S';
    var vMes = req.body.mes;
    var vDia = req.body.dia;
    if(req.body.mes < 10){
      vMes = '0'+req.body.mes;
    }
    if(req.body.dia < 10){
      vDia = '0'+req.body.dia;
    }
    date = req.body.anno +'-'+vMes+'-'+vDia;
  }
  req.getConnection((err, conn) => {
        conn.query('call sp_update_session(?, ?,?,?,?,?,?,?,?,?,?, ?,?,?,?,?,?,?,?,?,?, ?,?,?,?,?,?,?,?,?,?, ?,?,?,?,?,?,?,?,?,?, ?,?,?,?,?,?,?,?,?,?, ?, ?,?)',
        [req.body.tema,

          req.body.newItem_actual_1, req.body.newItem_actual_2, req.body.newItem_actual_3, req.body.newItem_actual_4, req.body.newItem_actual_5, req.body.newItem_actual_6, req.body.newItem_actual_7, req.body.newItem_actual_8, req.body.newItem_actual_9, req.body.newItem_actual_10, req.body.newItem_actual_11, req.body.newItem_actual_12, req.body.newItem_actual_13, req.body.newItem_actual_14, req.body.newItem_actual_15,

          req.body.newItem_ideal_1, req.body.newItem_ideal_2, req.body.newItem_ideal_3, req.body.newItem_ideal_4, req.body.newItem_ideal_5, req.body.newItem_ideal_6, req.body.newItem_ideal_7, req.body.newItem_ideal_8, req.body.newItem_ideal_9, req.body.newItem_ideal_10, req.body.newItem_ideal_11, req.body.newItem_ideal_12, req.body.newItem_ideal_13, req.body.newItem_ideal_14, req.body.newItem_ideal_15,

          req.body.newItem_accion_1, req.body.newItem_accion_2, req.body.newItem_accion_3, req.body.newItem_accion_4, req.body.newItem_accion_5, req.body.newItem_accion_6, req.body.newItem_accion_7, req.body.newItem_accion_8, req.body.newItem_accion_9, req.body.newItem_accion_10,

          req.body.newItem_opcion_1, req.body.newItem_opcion_2, req.body.newItem_opcion_3, req.body.newItem_opcion_4, req.body.newItem_opcion_5, req.body.newItem_opcion_6, req.body.newItem_opcion_7, req.body.newItem_opcion_8, req.body.newItem_opcion_9, req.body.newItem_opcion_10,

          req.session.id_sesion, date, if_date], (err, rows) => {
          if(err){
            req.session.problem = true;
            res.redirect('/listSession');
          }else {
            req.session.update = true;
            res.redirect('/listSession');
          }
        });
      });
    });



    controler.searchCommentary = ('/', (req, res) => {
      if(req.session.nombre_user == undefined){
        res.redirect('/');
      }
      req.getConnection((err, conn) => {
        conn.query('call sp_search_commentary(?,?)', [req.body.palabra_clave, req.session.nombre_user], (err, rows) => {
          if(err){
            res.json(err);
          }else {
           if(rows == undefined){
             req.session.existe = true;
           }
           req.session.palabra_clave = req.body.palabra_clave;
           res.redirect('/listCommentary');
          }
        });
      });
    });

    controler.seeCommentary = ('/', (req, res) => {
      req.session.nombre = req.params.nombre;
      req.session.identificacion = req.params.identificacion;
      req.session.email = req.params.email;
      req.session.comentario = req.params.comentario;
      req.session.imagen = req.params.imagen;

      res.redirect('/commentaryClient');
    });

    controler.commentaryClient = ('/', (req, res) => {
      if(req.session.nombre_user == undefined){
        res.redirect('/');
      }

        var nombre = req.session.nombre;
        var identificacion = req.session.identificacion;
        var email = req.session.email;
        var comentario = req.session.comentario;
        var imagen = req.session.imagen;

        delete req.session.nombre;
        delete req.session.identificacion;
        delete req.session.email;
        delete req.session.comentario;
        delete req.session.imagen;

        const exito = req.session.exito;
        delete req.session.exito;

        res.render('commentaryClient', {
          exito,
          nombre,
          identificacion,
          email,
          comentario,
          imagen
        });
    });

controler.addCommentary = ((req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
    req.getConnection((err, conn) => {
      conn.query('call sp_add_commentary (?,?,?,?,?,?)', [req.body.nombre_completo, req.body.identificacion, req.body.email, req.body.comentario, req.body.image_input, req.session.nombre_user], (err, rows) => {
        if(err){
          req.session.exito = 2;
          res.redirect('/commentaryClient');
        }else{
          req.session.exito = 1;
          res.redirect('/commentaryClient');
        }
      }

      );
    });
});

controler.listCommentary = ('/', (req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_search_commentary(?,?)', [req.session.palabra_clave, req.session.nombre_user], (err, rows) => {
      if(err){
        res.json(err);
      }else {
       if(rows == undefined){
         req.session.existe = true;
         res.redirect('/listCommentary');
       }else{
         var problem = req.session.problem;
         var deleteInf = req.session.delete;
         var updateInfo = req.session.update;
         req.session.update = false;
         req.session.problem = false;
         req.session.delete = false;
         var palabra_clave = req.session.palabra_clave;
         var existe = req.session.existe;
         req.session.existe = false;
         res.render('infoCommentary', {
           updateInfo,
           deleteInf,
           problem,
           palabra_clave,
           existe,
           data: rows
         });
        }
      }
    });
  });

});

controler.deleteCommentary = ('/', (req, res) => {
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_delete_commentary(?)', [req.params.id], (err, rows)=>{
      if(err){
        req.session.problem = true;
      }else {
        req.session.delete = true;
        res.redirect('/listCommentary');
      }
    });
  });
});


controler.sendMail = ((req, res) =>{
  if(req.session.nombre_user == undefined){
    res.redirect('/');
  }
  req.getConnection((err, conn) => {
    conn.query('call sp_select_email_coachee(?)', [req.session.nombre_coachee], (err, rows)=>{
      if(err){
        res.json( err );
      }else if(rows[0][0].correo === '' ){
        req.session.exitoMil = 1;
        res.redirect('/searchSesionR');
      }else {
        req.getConnection((err, conn) => {
          conn.query('call sp_plan_accion(?)', [req.session.id_sesion], (err, rows2)=>{
            if(err){
              res.json( err );
            }else{
              var n1 =''; var n2 =''; var n3 =''; var n4 =''; var n5 ='';
              var n6 =''; var n7 =''; var n8 =''; var n9 =''; var n10 ='';

              if(rows2[0][0].item_1 !== null){
                 n1 = '1)  '+ rows2[0][0].item_1+ '.';
              }
              if(rows2[0][0].item_2 !== null){
                var n2 ='2)  '+ rows2[0][0].item_2+ '.';
              }
              if(rows2[0][0].item_3 !== null){
                var n3 = '3)  '+ rows2[0][0].item_3+ '.';
              }
              if(rows2[0][0].item_4 !== null){
                var n4 = '4)  '+ rows2[0][0].item_4+ '.';
              }
              if(rows2[0][0].item_5 !== null){
                var n5 = '5)  '+ rows2[0][0].item_5+ '.';
              }
              if(rows2[0][0].item_6 !== null){
                var n6 = '6)  '+ rows2[0][0].item_6+ '.';
              }
              if(rows2[0][0].item_7 !== null){
                var n7 = '7)  '+ rows2[0][0].item_7+ '.';
              }
              if(rows2[0][0].item_8 !== null){
                var n8 = '8)  '+ rows2[0][0].item_8+ '.';
              }
              if(rows2[0][0].item_9 !== null){
                var n9 = '9)  '+ rows2[0][0].item_9 + '.';
              }
              if(rows2[0][0].item_10 !== null){
                var n10 = '10)  '+ rows2[0][0].item_10 + '.';
              }

              contentHTML = `
              <h3>Hola ${req.session.nombre_coachee} reciba un cordial saludo de parte de Human Ecoligy.</h3>
              <h4>Tú plan de acción para la sesión # ${req.session.num_sesion}.</h4>
              <h4>Tema: ${req.session.tema }.</h4>
              <p> ${n1} <br/> <br/>${n2} <br/><br/>${n3}<br/><br/> ${n4} <br/><br/> ${n5}<br/><br/> ${n6}<br/> <br/>${n7} <br/><br/>${n8}<br/><br/> ${n9}<br/> <br/>${n10} </p>
              `;

              const transport = nodemailer.createTransport({
                service: 'gmail',
                auth:{
                  user: process.env.EMAIL,
                  pass: process.env.EMAIL_PASS
                },
                tls:{
                  rejectUnauthorized: false
                }
              });

              transport.sendMail({
                form: "'Human Ecology app coaching' <" + process.env.EMAIL +">",
                to: rows[0][0].correo,
                subject: 'Plan de acción Coaching empresarial y profesional',
                html: contentHTML
              });

              req.session.exitoMil = 2;
              res.redirect('/searchSesionR');
            }
          });
        });
      }
    });
  });
});

  module.exports = controler;
