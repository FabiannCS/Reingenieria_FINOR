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
                let botonAction = '';
                if (cliente.estado === 'activo'){
                    botonAction = `<button class="btn btn-outline-danger btn-sm rounded-pill mx-1 shadow-sm" onclick="eliminarCliente(${cliente.id})" title="Desactivar">
                            <i class="bi bi-trash3"></i>
                        </button>`;
                }else{
                    botonAction = `<button class="btn btn-outline-success btn-sm rounded-pill mx-1 shadow-sm" onclick="activarCliente(${cliente.id})" title="Activar">
                            <i class="bi bi-arrow-repeat"></i>
                        </button>`;
                }

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
                            <button class="btn btn-outline-warning btn-sm rounded-pill mx-1 shadow-sm" onclick="editarCliente(${cliente.id})" title="Editar">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                            ${botonAction}
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
            Swal.fire({
            icon: 'error',
            title: 'Fallo de conexión',
            text: 'No se pudo conectar con el servidor de FastAPI.'
        });
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
            Swal.fire({ icon: 'success', title: 'Cliente actualizado', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
        }
        else {
            await axios.post(API_URL, clienteData);
            Swal.fire({ icon: 'success', title: 'Cliente creado correctamente', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
        }

        modalCliente.hide();
        formCliente.reset();
        document.getElementById('clienteId').value = "";
        await cargarClientes();
        
    } catch (error) {
        console.error("Error al guardar el cliente:", error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Hubo un problema al guardar los datos' });
    }
});

//funcion para eliminar cliente
async function eliminarCliente(id){

    const resultado = await Swal.fire({
        title: '¿Estás seguro?',
        text: "El cliente pasará a estado Inactivo",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
    });

    if(resultado.isConfirmed){
        try {
            await axios.delete(`${API_URL}/${id}`);
            await cargarClientes();
            Swal.fire('¡Desactivado!', 'El cliente ha sido desactivado.', 'success');
        }
        catch (error){
            console.error("Error al eliminar Cliente:", error);
            Swal.fire('Error', 'Hubo un error al intentar desactivar', 'error');
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

async function activarCliente(id){
    const resultado = await Swal.fire({
        title: '¿Estás seguro?',
        text: "El cliente pasará a estado Activo",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, activar',
        cancelButtonText: 'Cancelar'
    });

    if(resultado.isConfirmed){
        try {
            await axios.put(`${API_URL}/${id}`, { estado: 'activo'})
            await cargarClientes();
        }
        catch (error){
            console.error("Error al activar cliente:", error);
            Swal.fire('Error', 'Hubo un error al intentar activar el cliente', 'error');
        }
    }
}