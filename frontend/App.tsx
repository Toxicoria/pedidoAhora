import React, { useState, useEffect } from 'react';
import { List, Settings } from 'lucide-react';

// Define las interfaces para los datos de la API
interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
}

// URL base de la API
const API_URL = 'http://127.0.0.1:8000';

// Componente para la vista del cliente
const ClientView: React.FC<{ productos: Producto[] }> = ({ productos }) => (
  <div className="p-8">
    <h2 className="text-3xl font-bold mb-6 text-center">Productos disponibles</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {productos.length > 0 ? (
        productos.map((producto) => (
          <div key={producto.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold mb-2">{producto.nombre}</h3>
            <p className="text-gray-600 mb-4">{producto.descripcion}</p>
            <span className="text-2xl font-bold text-blue-600">${producto.precio.toFixed(2)}</span>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">No hay productos para mostrar.</p>
      )}
    </div>
  </div>
);

// Componente para la vista del administrador
const AdminView: React.FC<{
  productos: Producto[];
  fetchProductos: () => void;
  setEditingProduct: (product: Producto | null) => void;
}> = ({ productos, fetchProductos, setEditingProduct }) => {

  // Función para manejar la eliminación de un producto
  const handleDelete = async (id: number) => {
    // Reemplazando `window.confirm` con un mensaje simple
    const isConfirmed = true; 
    if (isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/productos/${id}`, {
          method: 'DELETE',
        });
        if (response.status === 204) {
          fetchProductos();
        } else {
          throw new Error('Error al eliminar el producto');
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Panel de Administración</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tabla de productos */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Lista de Productos</h3>
          {productos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productos.map((producto) => (
                    <tr key={producto.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{producto.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${producto.precio.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setEditingProduct(producto)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(producto.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500">No hay productos para administrar.</p>
          )}
        </div>
        {/* Formulario de producto */}
        <ProductForm fetchProductos={fetchProductos} setEditingProduct={setEditingProduct} />
      </div>
    </div>
  );
};

// Componente del formulario para crear/editar productos
const ProductForm: React.FC<{ fetchProductos: () => void; setEditingProduct: (product: Producto | null) => void }> = ({
  fetchProductos,
  setEditingProduct,
}) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  const [editing, setEditing] = useState<Producto | null>(null);

  // Carga los datos del producto a editar
  useEffect(() => {
    if (setEditingProduct) {
      setEditingProduct((product) => {
        setEditing(product);
        if (product) {
          setNombre(product.nombre);
          setDescripcion(product.descripcion || '');
          setPrecio(product.precio.toString());
        } else {
          // Limpia el formulario si no hay producto para editar
          setNombre('');
          setDescripcion('');
          setPrecio('');
        }
        return product; // Devuelve el producto para el estado
      });
    }
  }, [setEditingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      nombre,
      descripcion: descripcion || null,
      precio: parseFloat(precio),
    };

    try {
      if (editing) {
        // Lógica para actualizar
        const response = await fetch(`${API_URL}/productos/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Error al actualizar el producto');
      } else {
        // Lógica para crear
        const response = await fetch(`${API_URL}/productos/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Error al crear el producto');
      }

      fetchProductos(); // Actualiza la lista de productos
      setEditing(null); // Sale del modo edición
      setNombre('');
      setDescripcion('');
      setPrecio('');

    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
      <h3 className="text-xl font-semibold mb-4">{editing ? 'Editar Producto' : 'Crear Producto'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />
        <textarea
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
          step="0.01"
          className="w-full px-4 py-2 border rounded-md"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {editing ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setNombre('');
                setDescripcion('');
                setPrecio('');
              }}
              className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const App: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isAdminView, setIsAdminView] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  // Función para obtener los productos del backend
  const fetchProductos = async () => {
    try {
      const response = await fetch(`${API_URL}/productos/`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Hubo un problema con la petición:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased text-gray-800">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">App de Productos</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAdminView(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${!isAdminView ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-300 hover:text-white'}`}
          >
            <List size={20} />
            Vista Cliente
          </button>
          <button
            onClick={() => setIsAdminView(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition ${isAdminView ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-300 hover:text-white'}`}
          >
            <Settings size={20} />
            Vista Administrador
          </button>
        </div>
      </header>

      {isAdminView ? (
        <AdminView productos={productos} fetchProductos={fetchProductos} setEditingProduct={setEditingProduct} />
      ) : (
        <ClientView productos={productos} />
      )}
    </div>
  );
};

export default App;
