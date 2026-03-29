import React, { useState } from 'react';
import EncabezadoSuplementos from '../../components/EncabezadoSuplementos';
import TarjetaProducto from '../../components/TarjetaProducto';
import BarraDeFiltros from '../../components/BarraDeFiltros';

// --- Base de Datos Ficticia
const suplementos = [
  { id: 1, nombre: 'Proteína Whey Gold Standard', categoria: 'Proteína', precio: 75000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Proteína', descripcion: 'Proteína de suero de leche de alta calidad para recuperación.' },
  { id: 2, nombre: 'Creatina Monohidratada Micronizada', categoria: 'Creatina', precio: 42000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Creatina', descripcion: 'Aumenta la fuerza, potencia y rendimiento en entrenamientos.' },
  { id: 3, nombre: 'Pre-Entreno C4 Original', categoria: 'Pre-Entreno', precio: 55000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Pre-Entreno', descripcion: 'Fórmula energética para maximizar tu enfoque y resistencia.' },
  { id: 4, nombre: 'BCAA 2:1:1 Esencial', categoria: 'Aminoácidos', precio: 38500, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=BCAA', descripcion: 'Reduce la fatiga y mejora la síntesis de proteínas.' },
  { id: 5, nombre: 'Multivitamínico Performance', categoria: 'Vitaminas', precio: 29000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Vitaminas', descripcion: 'Complejo de vitaminas y minerales para la salud del atleta.' },
  { id: 6, nombre: 'Quemador de Grasa Thermo Pro', categoria: 'Quemadores', precio: 61000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Quemador', descripcion: 'Fórmula termogénica para acelerar el metabolismo.' },
  { id: 7, nombre: 'Ganador de Peso Serious Mass', categoria: 'Ganadores de Peso', precio: 89000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Gainer', descripcion: 'Aporte calórico extra para un aumento de masa efectivo.' },
  { id: 8, nombre: 'Intra-Workout EAA+ Hydration', categoria: 'Intra-Entreno', precio: 45000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Intra', descripcion: 'Mantiene la hidratación y energía durante el entrenamiento.' },
  { id: 9, nombre: 'Colágeno Hidrolizado + Magnesio', categoria: 'Salud Articular', precio: 35000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Colágeno', descripcion: 'Fortalece articulaciones, tendones y ligamentos.' },
  { id: 10, nombre: 'Proteína Vegana Plant-Based', categoria: 'Proteína', precio: 78000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Proteína', descripcion: 'Proteína completa a base de guisante y arroz.' },
  { id: 11, nombre: 'Creatina HCL Pro', categoria: 'Creatina', precio: 48000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Creatina', descripcion: 'Máxima absorción sin fase de carga.' },
  { id: 12, nombre: 'Pre-Entreno The Curse!', categoria: 'Pre-Entreno', precio: 58000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Pre-Entreno', descripcion: 'Energía extrema, enfoque mental y congestiones masivas.' },
  { id: 13, nombre: 'Glutamina Micronizada', categoria: 'Aminoácidos', precio: 33000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Glutamina', descripcion: 'Aminoácido clave para la recuperación muscular y sistema inmune.' },
  { id: 14, nombre: 'Omega 3 Fish Oil', categoria: 'Vitaminas', precio: 25000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Omega+3', descripcion: 'Soporte cardiovascular y antiinflamatorio natural.' },
  { id: 15, nombre: 'L-Carnitina Líquida', categoria: 'Quemadores', precio: 40000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Carnitina', descripcion: 'Ayuda a convertir la grasa en energía de forma eficiente.' },
  { id: 16, nombre: 'Ganador de Peso Mutant Mass', categoria: 'Ganadores de Peso', precio: 92000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Gainer', descripcion: 'Diseñado para los que les cuesta ganar peso.' },
  { id: 17, nombre: 'Carbohidratos Dextrosa', categoria: 'Intra-Entreno', precio: 22000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Carbs', descripcion: 'Fuente de energía rápida para reponer glucógeno.' },
  { id: 18, nombre: 'Glucosamina y Condroitina', categoria: 'Salud Articular', precio: 39000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Articular', descripcion: 'Combinación clásica para la salud del cartílago.' },
  { id: 19, nombre: 'Proteína Isolate ISO-100', categoria: 'Proteína', precio: 95000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Proteína', descripcion: 'Máxima pureza, rápida absorción, cero carbos y grasas.' },
  { id: 20, nombre: 'Citrulina Malato', categoria: 'Pre-Entreno', precio: 31000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Citrulina', descripcion: 'Mejora el bombeo sanguíneo y reduce la fatiga.' },
  { id: 21, nombre: 'Arginina AAKG', categoria: 'Aminoácidos', precio: 28000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Arginina', descripcion: 'Precursor del óxido nítrico para una mejor vascularización.' },
  { id: 22, nombre: 'Vitamina D3 + K2', categoria: 'Vitaminas', precio: 26000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Vitaminas', descripcion: 'Esencial para la salud ósea y el sistema inmune.' },
  { id: 23, nombre: 'CLA (Ácido Linoleico Conjugado)', categoria: 'Quemadores', precio: 43000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=CLA', descripcion: 'Ayuda a reducir la grasa corporal y aumentar la masa magra.' },
  { id: 24, nombre: 'Proteína de Caseína', categoria: 'Proteína', precio: 82000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Caseína', descripcion: 'Proteína de digestión lenta, ideal para tomar antes de dormir.' },
  { id: 25, nombre: 'Beta-Alanina', categoria: 'Pre-Entreno', precio: 29500, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Beta-Alanina', descripcion: 'Aumenta la resistencia muscular y retrasa la fatiga.' },
  { id: 26, nombre: 'MSM (Metilsulfonilmetano)', categoria: 'Salud Articular', precio: 27000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=MSM', descripcion: 'Compuesto de azufre con propiedades antiinflamatorias.' },
  { id: 27, nombre: 'ZMA (Zinc, Magnesio, B6)', categoria: 'Vitaminas', precio: 31000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=ZMA', descripcion: 'Mejora la recuperación, el sueño y la producción hormonal.' },
  { id: 28, nombre: 'Ganador de Peso Anabolic', categoria: 'Ganadores de Peso', precio: 99000, imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Gainer', descripcion: 'Fórmula avanzada con creatina para máximas ganancias.' },
  { id: 29, 'nombre': 'HMB', 'categoria': 'Aminoácidos', 'precio': 41000, 'imagen': 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=HMB', 'descripcion': 'Metabolito de la leucina que previene el catabolismo muscular.' },
  { id: 30, 'nombre': 'Cluster Dextrin', 'categoria': 'Intra-Entreno', 'precio': 52000, 'imagen': 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Dextrin', 'descripcion': 'Carbohidrato de última generación para energía sostenida.' }
];

const categorias = [
  'Todos', 'Proteína', 'Creatina', 'Pre-Entreno', 'Aminoácidos',
  'Vitaminas', 'Quemadores', 'Ganadores de Peso', 'Intra-Entreno', 'Salud Articular'
];

const Suplementos = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  const productosFiltrados = suplementos
    .filter((producto) => categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada)
    .filter((producto) => producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()));

  return (
    <div className="bg-black min-h-screen">
      <EncabezadoSuplementos />
      <BarraDeFiltros
        terminoBusqueda={terminoBusqueda}
        onBusquedaChange={setTerminoBusqueda}
        categoriaSeleccionada={categoriaSeleccionada}
        onCategoriaChange={setCategoriaSeleccionada}
        categorias={categorias}
      />
      <main className="mx-auto pb-12 px-4 sm:px-6 lg:px-30">
        {productosFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {productosFiltrados.map((producto) => (
              <TarjetaProducto key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-xl">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Suplementos;