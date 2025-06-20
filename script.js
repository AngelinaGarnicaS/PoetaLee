let bibliografia = [];
let escritores = [];

async function cargarDatos() {
  bibliografia = await fetch('bibliografia.json').then(res => res.json());
  escritores = await fetch('escritor.json').then(res => res.json());

  const contenedor = document.getElementById("poeta-container");
  contenedor.innerHTML = ""; 

  // tarjetas de los poetas
  bibliografia.forEach(biblio => {
    const escritor = escritores.find(e => e.id_personal === biblio.id);

    if (escritor) {
      const tarjeta = document.createElement("div");
      tarjeta.className = "tarjeta-poeta";
      tarjeta.dataset.nombre = biblio.nombre_artistico.toLowerCase(); // Guardamos el nombre del poeta en minúsculas
      tarjeta.dataset.nacionalidad = escritor.nacionalidad.toLowerCase(); // Guardamos la nacionalidad en minúsculas

      tarjeta.innerHTML = `
        <img src="${biblio.imagen}" class="poeta-imagen" alt="${biblio.nombre_artistico}">
        <h2>${biblio.nombre_artistico}</h2>
        <p>Nacionalidad: ${escritor.nacionalidad}</p>
        <a href="poeta.html?id=${biblio.id}" style="text-decoration: none; color: #66451f;">Ver más</a>
      `;
      contenedor.appendChild(tarjeta);
    }
  });
}

// Función para buscar poetas por nombre
function buscarPoetas() {
  const input = document.getElementById("buscador").value.toLowerCase();
  const tarjetas = document.querySelectorAll(".tarjeta-poeta");

  tarjetas.forEach(tarjeta => {
    const nombrePoeta = tarjeta.dataset.nombre;
    
    if (nombrePoeta.includes(input)) {
      tarjeta.style.display = "block"; // Muestra la tarjeta
    } else {
      tarjeta.style.display = "none"; // Oculta la tarjeta
    }
  });
}

// Función para filtrar poetas por nacionalidad
function filtrarPorNacionalidad() {
  const selectedNacionalidad = document.getElementById("nacionalidad-filter").value.toLowerCase();
  const tarjetas = document.querySelectorAll(".tarjeta-poeta");

  tarjetas.forEach(tarjeta => {
    const nacionalidadPoeta = tarjeta.dataset.nacionalidad;
    
    if (selectedNacionalidad === "" || nacionalidadPoeta === selectedNacionalidad) {
      tarjeta.style.display = "block"; // Muestra la tarjeta
    } else {
      tarjeta.style.display = "none"; // Oculta la tarjeta
    }
  });
}

cargarDatos();