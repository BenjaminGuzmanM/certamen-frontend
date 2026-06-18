// =========================================================
// TeslaSys Chile - Sistema de Registro de Solicitudes de Soporte
// =========================================================

// ---------------------------------------------------------
// Arreglo principal: aquí se almacenan todas las solicitudes
// ---------------------------------------------------------
let solicitudes = [];

// ---------------------------------------------------------
// Referencias a elementos del DOM (se reutilizan en varias funciones)
// ---------------------------------------------------------
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputArea = document.getElementById("area");
const selectTipo = document.getElementById("tipo");
const textareaDescripcion = document.getElementById("descripcion");

const mensajeEstado = document.getElementById("mensajeEstado");
const cuerpoTabla = document.getElementById("cuerpoTabla");
const totalSolicitudes = document.getElementById("totalSolicitudes");

const btnRegistrar = document.getElementById("btnRegistrar");
const btnLimpiar = document.getElementById("btnLimpiar");


// ---------------------------------------------------------
// Función: mostrarMensaje
// Muestra un mensaje de error o éxito en pantalla usando el DOM
// ---------------------------------------------------------
function mostrarMensaje(texto, tipo) {
  // tipo puede ser "error" o "exito"
  mensajeEstado.textContent = texto;
  mensajeEstado.className = "mensaje mensaje--" + tipo;
}


// ---------------------------------------------------------
// Función: validarDatos
// Recibe los valores capturados y valida que cumplan las reglas
// del Requerimiento N°2. Devuelve true si todo es correcto.
// ---------------------------------------------------------
function validarDatos(nombre, correo, area, tipo, descripcion) {

  // Ningún campo puede quedar vacío
  if (nombre === "" || correo === "" || area === "" || tipo === "" || descripcion === "") {
    mostrarMensaje("⚠ Debe completar todos los campos antes de registrar la solicitud.", "error");
    return false;
  }

  // El correo debe contener el símbolo @
  if (!correo.includes("@")) {
    mostrarMensaje("⚠ El correo electrónico ingresado no es válido (debe contener @).", "error");
    return false;
  }

  // Si todas las validaciones pasaron
  return true;
}


// ---------------------------------------------------------
// Función: registrarSolicitud  (Requerimiento N°3)
// 1. Captura los datos
// 2. Valida la información
// 3. Crea el objeto
// 4. Lo agrega al arreglo con push()
// ---------------------------------------------------------
function registrarSolicitud() {

  // 1. Capturar los datos del formulario usando variables
  let nombre = inputNombre.value.trim();
  let correo = inputCorreo.value.trim();
  let area = inputArea.value.trim();
  let tipo = selectTipo.value;
  let descripcion = textareaDescripcion.value.trim();

  // 2. Validar la información
  let esValido = validarDatos(nombre, correo, area, tipo, descripcion);

  if (!esValido) {
    // Si no es válido, se detiene aquí (el mensaje de error ya se mostró)
    return;
  }

  // 3. Crear el objeto solicitud
  let nuevaSolicitud = {
    nombre: nombre,
    correo: correo,
    area: area,
    tipo: tipo,
    descripcion: descripcion
  };

  // 4. Agregar el objeto al arreglo
  solicitudes.push(nuevaSolicitud);

  // Mostrar mensaje de éxito
  mostrarMensaje("✔ Solicitud registrada exitosamente.", "exito");

  // Actualizar la tabla en pantalla sin recargar la página
  renderizarTabla();

  // Limpiar el formulario para una nueva solicitud
  limpiarFormulario();
}


// ---------------------------------------------------------
// Función: limpiarFormulario  (Requerimiento N°3)
// Vacía todos los campos del formulario
// ---------------------------------------------------------
function limpiarFormulario() {
  inputNombre.value = "";
  inputCorreo.value = "";
  inputArea.value = "";
  selectTipo.value = "";
  textareaDescripcion.value = "";
}


// ---------------------------------------------------------
// Función: eliminarSolicitud
// Elimina una solicitud del arreglo según su posición (índice)
// ---------------------------------------------------------
function eliminarSolicitud(indice) {
  solicitudes.splice(indice, 1);
  renderizarTabla();
}


// ---------------------------------------------------------
// Función: renderizarTabla  (Requerimiento N°5)
// Recorre el arreglo de solicitudes con forEach y genera
// dinámicamente las filas de la tabla en el DOM.
// ---------------------------------------------------------
function renderizarTabla() {

  // Limpiar el contenido actual de la tabla
  cuerpoTabla.innerHTML = "";

  // Si no hay solicitudes registradas
  if (solicitudes.length === 0) {
    let filaVacia = document.createElement("tr");
    filaVacia.innerHTML = `<td colspan="6" class="tabla-vacia">Aún no hay solicitudes registradas.</td>`;
    cuerpoTabla.appendChild(filaVacia);
  } else {
    // Recorrer el arreglo de solicitudes con forEach
    solicitudes.forEach(function (solicitud, indice) {
      let fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${indice + 1}</td>
        <td>${solicitud.nombre}</td>
        <td>${solicitud.area}</td>
        <td><span class="etiqueta etiqueta--${solicitud.tipo.toLowerCase()}">${solicitud.tipo}</span></td>
        <td>${solicitud.descripcion}</td>
        <td><button class="btn-eliminar" data-indice="${indice}" title="Eliminar solicitud">🗑</button></td>
      `;

      cuerpoTabla.appendChild(fila);
    });
  }

  // Actualizar el contador total de solicitudes
  totalSolicitudes.textContent = "Total de solicitudes registradas: " + solicitudes.length;
}


// ---------------------------------------------------------
// Eventos asociados a los botones
// ---------------------------------------------------------
btnRegistrar.addEventListener("click", registrarSolicitud);
btnLimpiar.addEventListener("click", limpiarFormulario);

// Evento delegado para los botones de eliminar (se crean dinámicamente)
cuerpoTabla.addEventListener("click", function (evento) {
  if (evento.target.classList.contains("btn-eliminar")) {
    let indice = parseInt(evento.target.getAttribute("data-indice"));
    eliminarSolicitud(indice);
  }
});


// ---------------------------------------------------------
// Inicialización: renderizar la tabla vacía al cargar la página
// ---------------------------------------------------------
renderizarTabla();