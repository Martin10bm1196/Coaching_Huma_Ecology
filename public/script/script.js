

function deleteCoachee(id_registro){
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'si_elimina',
      cancelButton: 'no_elimina'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: 'Estas seguro?',
    text: "Es posible que exista informacion que dependa de estos datos, tambien sera eliminada!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si eliminalo!',
    cancelButtonText: 'No, cancela!',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      window.location.href = "/delete/" +id_registro;
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
      position: 'center',
      icon: 'info',
      title: 'Cancelado!',
      text: 'La infomacion no sufrio cambios.',
      showConfirmButton: false,
      buttons: false,
      timer: 2500
    })
    }
  })
}

function deleteSesion(id_registro, id_sesion){
  console.log('entro');
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'si_elimina',
      cancelButton: 'no_elimina'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: 'Estas seguro?',
    text: "Es posible que exista informacion que dependa de estos datos, tambien sera eliminada!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si eliminalo!',
    cancelButtonText: 'No, cancela!',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      window.location.href = "/deleteS/"+id_sesion+"/"+id_registro;
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
      position: 'center',
      icon: 'info',
      title: 'Cancelado!',
      text: 'La infomacion no sufrio cambios.',
      showConfirmButton: false,
      buttons: false,
      timer: 2500
    })
    }
  })
}

function deleteEvent(id_event){
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'si_elimina',
      cancelButton: 'no_elimina'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: 'Estas seguro?',
    text: "Si realiza esta acción no podra visualizar mas la infomación en el sistema",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si eliminalo!',
    cancelButtonText: 'No, cancela!',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      window.location.href = "/deleteE/" +id_event;
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
      position: 'center',
      icon: 'info',
      title: 'Cancelado!',
      text: 'La infomacion no sufrio cambios.',
      showConfirmButton: false,
      buttons: false,
      timer: 2500
    })
    }
  })
}

function deleteCommentary(id_commentary){
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'si_elimina',
      cancelButton: 'no_elimina'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: 'Estas seguro?',
    text: "Si realiza esta acción no podra visualizar mas la infomación en el sistema",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si eliminalo!',
    cancelButtonText: 'No, cancela!',
    reverseButtons: true
  }).then((result) => {
    if (result.value) {
      window.location.href = "/deleteCommentary/" +id_commentary;
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
      position: 'center',
      icon: 'info',
      title: 'Cancelado!',
      text: 'La infomacion no sufrio cambios.',
      showConfirmButton: false,
      buttons: false,
      timer: 2500
    })
    }
  })
}

var i = 1;
var a = 1;
var e = 1;
var o = 1;
var bool_a= true;
var bool_i= true;
var bool_e= true;
var bool_o = true;

  function newItem( h , num_btn ){


    var item = document.createElement('input');

    if(h === 'actual'){
      if(bool_i){
        i = num_btn;
        bool_i = false;
      }
      if(i > 14){
        Swal.fire({
          toast: true,
          position: 'center',
          icon: 'warning',
          title: 'Maximo alcanzado',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        i++;
        item.setAttribute("name", "newItem_"+ h +"_"+i);
        item.setAttribute("id",  h+"_"+i);
        item.setAttribute("type", "text");
        item.setAttribute("maxlength", "250");
        var padre = document.getElementById(h);
        var buttom = document.getElementById("btn");
      }

    }
    if(h === 'ideal') {
      if(bool_a){
        a = num_btn;
        bool_a = false;
      }
      if(a > 14){
        Swal.fire({
          toast: true,
          position: 'center',
          icon: 'warning',
          title: 'Maximo alcanzado',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
      a++;
        item.setAttribute("name", "newItem_"+ h +"_"+a);
        item.setAttribute("id",  h+"_"+a);
        item.setAttribute("type", "text");
        item.setAttribute("maxlength", "250");
        var padre = document.getElementById(h);
        var buttom = document.getElementById("btn1");
      }
    }
    if(h === 'opcion') {
      if(bool_e){
        e = num_btn;
        bool_e = false;
      }
      if(e > 9){
        Swal.fire({
          toast: true,
          position: 'center',
          icon: 'warning',
          title: 'Maximo alcanzado',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        e++;
        item.setAttribute("name", "newItem_"+ h +"_"+e);
        item.setAttribute("id",  h+"_"+e);
        item.setAttribute("type", "text");
        item.setAttribute("maxlength", "250");
        var padre = document.getElementById(h);
        var buttom = document.getElementById("btn2");
      }
    }
    if(h === 'accion') {
      if(bool_o){
        o = num_btn;
        bool_o = false;
      }
      if(o > 9){
        Swal.fire({
          toast: true,
          position: 'center',
          icon: 'warning',
          title: 'Maximo alcanzado',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        o++;
        item.setAttribute("name", "newItem_"+ h +"_"+o);
        item.setAttribute("id",  h+"_"+o);
        item.setAttribute("type", "text");
        item.setAttribute("maxlength", "250");
        var padre = document.getElementById(h);
        var buttom = document.getElementById("btn3");
      }
    }

    padre.insertBefore(item, buttom);
  }

  function delateItem (d, num_del){

    if(d === 'actual') {
      if(bool_i){
        if(num_del > 2){
          i = num_del;
        }
        bool_i = false;
      }
      var item = document.getElementById(d+"_"+i);
      if(i < 2){
        Swal.fire({
          toast: true,
          position: 'center',
          icon: 'warning',
          title: 'No hay elemetos a eliminar',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        i--;
        var padre = item.parentNode;
        padre.removeChild(item);
      }
    }

    if(d === 'accion') {
      if(bool_o){
        if(num_del > 2){
          o = num_del;
        }
        bool_o = false;
      }
      var item = document.getElementById(d+"_"+o);
      if(o < 2){
        Swal.fire({
          toast: true,
          position: 'center',
          icon: 'warning',
          title: 'No hay elemetos a eliminar',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        o--;
        var padre = item.parentNode;
        padre.removeChild(item);
      }
    }

    if(d === 'ideal') {
      if(bool_a){
        if(num_del > 2){
          a = num_del;
        }
        bool_a = false;
      }
      var item = document.getElementById(d+"_"+a);
      if(a < 2){
        Swal.fire({
          toast: true,
          position: 'center',
          icon: 'warning',
          title: 'No hay elemetos a eliminar',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        a--;
        var padre = item.parentNode;
        padre.removeChild(item);
      }
    }
    if(d === 'opcion') {
      if(bool_e){
        if(num_del > 2){
          e = num_del;
        }
        bool_e = false;
      }
      var item = document.getElementById(d+"_"+e);
      if(e < 2){
        Swal.fire({
          toast: true,
          position: 'center',
          icon: 'warning',
          title: 'No hay elemetos a eliminar',
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        e--;
        var padre = item.parentNode;
        padre.removeChild(item);
      }
    }
  }
