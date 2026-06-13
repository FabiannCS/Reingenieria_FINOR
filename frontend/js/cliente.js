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
            $('#tablaClientes').DataTable().destroy();
        }
        else{
            $('#tablaClientes').DataTable({
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
                }
            });
        }
    }
    catch (error) {
        console.error('Error al cargar los clientes:', error);
        alert('Revisar el servidor o conexion')
    }
}

document.addEventListener('DOMContentLoaded', cargarClientes);

//formulario para nuevo cliente
const modalCliente = new bootstrap.Modal(document.getElementById('modalCliente'));
const formCliente = document.getElementById('formCliente');

document.getElementById('nuevoCliente').addEventListener('click', () => {

    formCliente.reset();
    document.getElementById('clienteId').value = "";
    document.getElementById('modalTitulo').innerText = "Nuevo Cliente";
    
    modalCliente.show();
});

document.getElementById('btnGuardar').addEventListener('click', async () => {
    
    const nuevoCliente = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        fechaRegistro: document.getElementById('date').value,
        estado: document.getElementById('estado').value
    };

    try {
        
        await axios.post(API_URL, nuevoCliente);
        
        modalCliente.hide();
        
        await cargarClientes();
        

    } catch (error) {
        console.error("Error al guardar el cliente:", error);
        alert("Hubo un error al intentar guardar los datos");
    }
});