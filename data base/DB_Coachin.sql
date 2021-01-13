create database DB_Coaching;

  use db_coaching;

    create table tb_usuario(
      id int AUTO_INCREMENT primary key ,
      nombre_completo varchar (150),
      email varchar (100),
      contrasenna varchar(50)
    );


  create table tb_registro_coaching(
    id_registro int AUTO_INCREMENT primary key ,
    nombre_coaching varchar (150),
    nombre_coachee varchar (150),
    telefono varchar (25),
    correo varchar(150),
    contexto varchar (550),
    observaciones varchar(550),
    verbal varchar(550),
    para_verbal varchar(550),
    no_verbal varchar(550),
    rol_emociones varchar(550)
  );


  create table tb_sesion_coaching(
      id_sesion int primary key ,
      id_registro int,
      nombre_coachee varchar (150),
      tema varchar (150)
  );

    create table tb_situacion_actual(
	id_registro int,
    id_sesion int,
    item_1 varchar (50),
    item_2 varchar (50),
    item_3 varchar (50),
    item_4 varchar (50),
    item_5 varchar (50),
    item_6 varchar (50),
    item_7 varchar (50),
    item_8 varchar (50),
    item_9 varchar (50),
    item_10 varchar (50),
    item_11 varchar (50),
    item_12 varchar (50),
    item_13 varchar (50),
    item_14 varchar (50),
    item_15 varchar (50)
  );

    create table tb_situacion_ideal(
	id_registro int,
    id_sesion int,
    item_1 varchar (50),
    item_2 varchar (50),
    item_3 varchar (50),
    item_4 varchar (50),
    item_5 varchar (50),
    item_6 varchar (50),
    item_7 varchar (50),
    item_8 varchar (50),
    item_9 varchar (50),
    item_10 varchar (50),
    item_11 varchar (50),
    item_12 varchar (50),
    item_13 varchar (50),
    item_14 varchar (50),
    item_15 varchar (50)
  );

  create table tb_opciones(
	id_registro int,
    id_sesion int,
    item_1 varchar (50),
    item_2 varchar (50),
    item_3 varchar (50),
    item_4 varchar (50),
    item_5 varchar (50),
    item_6 varchar (50),
    item_7 varchar (50),
    item_8 varchar (50),
    item_9 varchar (50),
    item_10 varchar (50)
  );

  create table tb_plan_accion(
	id_registro int,
    id_sesion int,
    item_1 varchar (50),
    item_2 varchar (50),
    item_3 varchar (50),
    item_4 varchar (50),
    item_5 varchar (50),
    item_6 varchar (50),
    item_7 varchar (50),
    item_8 varchar (50),
    item_9 varchar (50),
    item_10 varchar (50)
  );


  alter table tb_situacion_ideal add foreign key (id_sesion) references tb_sesion_coaching (id_sesion);

  alter table tb_opciones add foreign key (id_sesion) references tb_sesion_coaching (id_sesion);

  alter table tb_plan_accion add foreign key (id_sesion) references tb_sesion_coaching (id_sesion);

  alter table tb_situacion_actual add foreign key (id_sesion) references tb_sesion_coaching (id_sesion);

  alter table tb_sesion_coaching add foreign key (id_registro) references tb_registro_coaching (id_registro);

  alter table tb_situacion_ideal add foreign key (id_registro) references tb_registro_coaching (id_registro);

  alter table tb_opciones add foreign key (id_registro) references tb_registro_coaching (id_registro);

  alter table tb_plan_accion add foreign key (id_registro) references tb_registro_coaching (id_registro);

   alter table tb_situacion_actual add foreign key (id_registro) references tb_registro_coaching (id_registro);
