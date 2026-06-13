const API_URL = 'http://localhost:8000/clientes';

async function cargarClientes() {
    try {
        const response = await axios.get(API_URL);
        const clientes = response.data;

        const tbody = document.querySelector('#tablaClientes tbody');
        tbody.innerHTML = "";

        clientes.forEach(cliente => {
            const fila = `
                <tr>
                    <td>${cliente.id}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.fechaRegistro}</td>
                    <td>
                        <span class="badge bg-success">${cliente.estado}</span>
                    </td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="prepararEdicion(${cliente.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cliente.id})">Eliminar</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });

        if ($.fn.DataTable.isDataTable('#tablaClientes')){
            $('#tablaClientes'),DataTable().destroy();
        }
        else{
            $('#tablaClientes').DataTable({
                Language: {
                    url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
                }
            });
        }
    }
    catch (error) {
        console.error('Error al cargar los clientes:', error);
        alert('Revisar el servicdor o conexion')
    }
}

document.addEventListener('DOMContentLoaded', cargarClientes);