const API_URL = 'http://localhost:8000/clientes';

async function cargarClientes() {
    try {
        if ($.fn.DataTable.isDataTable('#tablaClientes')){
            $('#tablaClientes').DataTable().destroy();
            document.querySelector('#tablaClientes tbody').innerHTML = "";
        }

        const response = await axios.get(API_URL);
        const clientes = response.data;

        const filtro = document.getElementById('filtroEstado').value;

        const tbody = document.querySelector('#tablaClientes tbody');
        tbody.innerHTML = "";

        clientes.forEach(cliente => {
            if (filtro === "Todos" || cliente.estado === filtro){

                const bgColor = cliente.estado === 'activo' ? 'bg-success' : 'bg-danger';

                const fila = `
                    <tr>
                        <td>${cliente.id}</td>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.apellido}</td>
                        <td>${cliente.telefono}</td>
                        <td>${cliente.fechaRegistro}</td>
                        <td>
                            <span class="badge ${bgColor}">${cliente.estado}</span>
                        </td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editarCliente(${cliente.id})">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cliente.id})">Eliminar</button>
                    </td>
                </tr>`;
                tbody.innerHTML += fila;
            }
        });

        //Inicializar la Tabla
        $('#tablaClientes').DataTable({
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
                }
            });
        }
        catch (error) {
            console.error('Error al cargar los clientes:', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarClientes);
//filtro dee estado
document.getElementById('filtroEstado').addEventListener('change', cargarClientes);


//formulario para nuevo cliente
const modalCliente = new bootstrap.Modal(document.getElementById('modalCliente'));
const formCliente = document.getElementById('formCliente');

document.getElementById('nuevoCliente').addEventListener('click', () => {

    formCliente.reset();
    document.getElementById('clienteId').value = "";
    document.getElementById('modalTitulo').innerText = "Nuevo Cliente";
    
    modalCliente.show();
});

//funcion para guardar cliente
document.getElementById('btnGuardar').addEventListener('click', async () => {

    const id = document.getElementById('clienteId').value;
    
    const clienteData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        fechaRegistro: document.getElementById('date').value,
        estado: document.getElementById('estado').value
    };

    try {
        if (id) {
            await axios.put(`${API_URL}/${id}`, clienteData);
            alert("Cliente actualizado correctamente");
        }
        else {
            await axios.post(API_URL, clienteData);
            alert("Cliente creado correctamente");
        }

        modalCliente.hide();
        formCliente.reset();
        document.getElementById('clienteId').value = "";
        await cargarClientes();
        
    } catch (error) {
        console.error("Error al guardar el cliente:", error);
        alert("Hubo un error al intentar guardar los datos");
    }
});

//funcion para eliminar cliente
async function eliminarCliente(id){
    if(confirm("¿Seguro que quieres eliminar  este cliente?")){
        try {
            await axios.delete(`${API_URL}/${id}`);

            await cargarClientes();
        }
        catch (error){
            console.error("Error al eliminar Cliente:", error);
            alert("Hubo un error");
        }
    }
}

//funcion para cargar datos al editar cliente
async function editarCliente(id){
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        const cliente = response.data;

        document.getElementById('clienteId').value = cliente.id;
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('apellido').value = cliente.apellido;
        document.getElementById('telefono').value = cliente.telefono;
        document.getElementById('date').value = cliente.fechaRegistro;
        document.getElementById('estado').value = cliente.estado;

        document.getElementById('modalTitulo').innerText = "Editar Cliente";
        modalCliente.show();
    }
    catch (error){
        console.error("Error al obtener datos del Cliente:", error);
        alert("No se pudo cargar los datos del cliente");
    }
}