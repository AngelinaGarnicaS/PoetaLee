const params = new URLSearchParams(window.location.search);
const idPoeta = parseInt(params.get("id"));

if (isNaN(idPoeta)) {
  document.body.innerHTML = "<p>Error: ID inválido</p>";
} else {
  Promise.all([
    fetch("bibliografia.json").then(res => res.json()),
    fetch("escritor.json").then(res => res.json()),
    fetch("libros.json").then(res => res.json()),
    fetch("costos.json").then(res => res.json()),
    fetch("fragmentos.json").then(res => res.json())  
  ])
    .then(([bibliografia, escritores, libros, costos, fragmentos]) => {
      const biblio = bibliografia.find(p => p.id === idPoeta);
      const escritor = escritores.find(e => e.id_personal === idPoeta);

      if (!biblio || !escritor) {
        document.body.innerHTML = "<p>Poeta no encontrado.</p>";
        return;
      }

      // Mostrar datos del poeta
      document.getElementById("nombre-artistico").textContent = biblio.nombre_artistico;
      document.getElementById("imagen").src = biblio.imagen;
      document.getElementById("generos").textContent = biblio.generos_literarios;
      document.getElementById("años").textContent = biblio.años_activo;
      document.getElementById("premios").textContent = biblio.premios;
      document.getElementById("total").textContent = biblio.obras;
      document.getElementById("primera").textContent = biblio.primera_obra;
      document.getElementById("ultima").textContent = biblio.ultima_obra;
      document.getElementById("obra").textContent = biblio.obra_mas_conocida;
      document.getElementById("adaptaciones").textContent = biblio.adaptaciones_cinematograficas;
      document.getElementById("dato-biblio").textContent = biblio.dato_interesante;

      document.getElementById("nombre-completo").textContent = escritor.nombre_completo;
      document.getElementById("nacimiento").textContent = escritor.fecha_nacimiento;
      document.getElementById("fallecimiento").textContent = escritor.fecha_fallecimiento;
      document.getElementById("lugar").textContent = escritor.lugar_nacimiento;
      document.getElementById("nacionalidad").textContent = escritor.nacionalidad;
      document.getElementById("religion").textContent = escritor.religión;
      document.getElementById("padres").textContent = escritor.padres;
      document.getElementById("hermanos").textContent = escritor.hermanos;
      document.getElementById("pareja").textContent = escritor.pareja;
      document.getElementById("hijos").textContent = escritor.hijos;
      document.getElementById("ocupacion").textContent = escritor.ocupacion;
      document.getElementById("vivio").textContent = escritor.vivió_en;
      document.getElementById("dato-personal").textContent = escritor.dato_interesante;

      // Mostrar libros del autor
      const contenedorLibros = document.getElementById("libros-container");
      contenedorLibros.innerHTML = ""; // Limpiar si hubiera contenido

      // Modal elementos
      const modal = document.getElementById("modalLibro");
      const modalTitulo = document.getElementById("modalTitulo");
      const modalPortada = document.getElementById("modalPortada");
      const modalEditorial = document.getElementById("modalEditorial");
      const modalPaginas = document.getElementById("modalPaginas");
      const modalAno = document.getElementById("modalAno");
      const modalSinopsis = document.getElementById("modalSinopsis");
      const modalCostos = document.getElementById("modalCostos");
      const cerrarModal = document.getElementById("cerrarModal");

      // Filtrar libros que tengan id_autor igual al idPoeta
      const librosDelAutor = libros.filter(libro => libro.id_autor === idPoeta);

      if (librosDelAutor.length === 0) {
        contenedorLibros.textContent = "No se encontraron libros para este autor.";
      } else {
        librosDelAutor.forEach(libro => {
          const divLibro = document.createElement("div");
          divLibro.style.width = "120px";
          divLibro.style.textAlign = "center";
          divLibro.style.cursor = "pointer";

          divLibro.innerHTML = `
            <img src="${libro.portada}" alt="Portada de ${libro.titulo}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); margin-bottom: 8px;">
            <p style="font-size: 14px;">${libro.titulo}</p>
          `;


          divLibro.addEventListener("click", () => {
            modalTitulo.textContent = `${libro.titulo}`;
            modalPortada.src = libro.portada;
            modalPortada.alt = `Portada de ${libro.titulo}`;
            modalEditorial.textContent = libro.editorial;
            modalPaginas.textContent = libro.paginas;
            modalAno.textContent = libro.año;
            modalSinopsis.textContent = libro.sinopsis;
          
           const frag = fragmentos.find(f => f.id_libro === libro.id);
              if (frag) {
                // PDF
                const enlacePDF = document.getElementById("modalPDF");
                if (frag.pdf) {
                  enlacePDF.href = frag.pdf;
                  enlacePDF.textContent = "Ver aquí";
                } else {
                  enlacePDF.textContent = "No disponible";
                  enlacePDF.removeAttribute("href");
                }

                // Fragmento
                document.getElementById("modalFragmento").textContent = frag.fragmento || "No disponible.";

                // Audio
                const audioElem = document.getElementById("modalAudio");
                if (frag.audio) {
                  audioElem.src = frag.audio;
                  audioElem.style.display = "block";
                } else {
                  audioElem.style.display = "none";
                }
              } else {
                document.getElementById("modalPDF").textContent = "No disponible";
                document.getElementById("modalPDF").removeAttribute("href");
                document.getElementById("modalFragmento").textContent = "No disponible.";
                document.getElementById("modalAudio").style.display = "none";
              }

            // Mostrar costos del libro
            const costoLibro = costos.find(c => c.id_libro === libro.id);
            if (costoLibro) {
              modalCostos.innerHTML = `
                <h3>Dónde puedes comprarlo:</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Amazon MX</th>
                      <th>BuscaLibre</th>
                      <th>Sanborns</th>
                      <th>Casa del Libro MX</th>
                      <th>Librerías Gandhi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${costoLibro.amazon_mx || "No disponible"}</td>
                      <td>${costoLibro.buscalibre || "No disponible"}</td>
                      <td>${costoLibro.sanborns || "No disponible"}</td>
                      <td>${costoLibro.casa_del_libro_mx || "No disponible"}</td>
                      <td>${costoLibro.librerias_gandhi || "No disponible"}</td>
                    </tr>
                  </tbody>
                </table>
              `;
            } else {
              modalCostos.innerHTML = "<p>No hay información de precios para este libro.</p>";
            }

            modal.style.display = "flex"; // Mostrar modal
          });

          contenedorLibros.appendChild(divLibro);
        });
      }

      // Cerrar modal al hacer click en el botón de cerrar
      cerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
      });

      // Cerrar modal al hacer click fuera de la caja modal
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
      document.body.innerHTML = "<p>Error al cargar la información del poeta.</p>";
    });
}
