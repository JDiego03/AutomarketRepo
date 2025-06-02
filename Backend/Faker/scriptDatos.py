from faker import Faker
import random
from datetime import datetime

fake = Faker('es_ES')

MAX_TIPO_ID = 7
coches_por_modelo = 1  # Solo uno por modelo
BASE_URL_IMG = 'https://localhost:3002/imagenes/imagenes_coches'

print("-- Insertar datos generados con Faker\n")

# Insertar marcas
marcas = [
    ('Toyota', 'Japón'),
    ('Ford', 'EE.UU.'),
    ('Volkswagen', 'Alemania'),
    ('Nissan', 'Japón'),
    ('BMW', 'Alemania'),
    ('Mercedes-Benz', 'Alemania'),
    ('Audi', 'Alemania'),
    ('Honda', 'Japón'),
    ('Chevrolet', 'EE.UU.'),
    ('Hyundai', 'Corea del Sur'),
    ('Kia', 'Corea del Sur'),
    ('Peugeot', 'Francia'),
    ('Renault', 'Francia'),
    ('Mazda', 'Japón'),
    ('Subaru', 'Japón')
]

for marca in marcas:
    print(f"INSERT INTO Marca (marca, pais) VALUES ('{marca[0]}', '{marca[1]}');")

# Insertar modelos
modelos = [
    ('Corolla', 1),
    ('Focus', 2),
    ('Golf', 3),
    ('Altima', 4),
    ('Serie 3', 5),
    ('Clase C', 6),
    ('A4', 7),
    ('Civic', 8),
    ('Malibu', 9),
    ('Elantra', 10),
    ('Yaris', 1),
    ('F-150', 2),
    ('Tiguan', 3),
    ('Maxima', 4),
    ('Serie 7', 5)
]

for modelo in modelos:
    print(f"INSERT INTO Modelo (marca_id, modelo) VALUES ({modelo[1]}, '{modelo[0]}');")

# Insertar tipos
tipos = ['Sedán', 'SUV', 'Hatchback', 'Coupé', 'Pick-up', 'Monovolumen', 'Deportivo']
for tipo in tipos:
    print(f"INSERT INTO TipoVehiculo (nombre) VALUES ('{tipo}');")

# Mapear modelo_id a carpetas reales de imágenes
modelo_id_to_folder = {
    1: 'Toyota_Corolla',
    2: 'Ford_Focus',
    3: 'Volkswagen_Golf',
    4: 'Nissan_Maxima',
    5: 'BMW_Serie_3',
    6: 'Mercedes-Benz_Clase_C',
    7: 'Audi_A4',
    8: 'Honda_Civic',
    9: 'Chevrolet_Malibu',
    10: 'Hyundai_Elantra',
    11: 'Toyota_Yaris',
    12: 'Ford_F-150',
    13: 'Volkswagen_Tiguan',
    14: 'Nissan_Maxima',  # Asumimos reutilización
    15: 'BMW_Serie_7'
}

# Descripciones posibles
descripciones_posibles = [
    'Vehículo en excelente estado, único dueño.',
    'Coche usado, bien mantenido y sin accidentes.',
    'Motor potente y consumo eficiente.',
    'Interior impecable, ideal para familias.',
    'Revisión recién pasada y neumáticos nuevos.',
    'Perfecto para ciudad y carretera.',
    'Coche con pocos kilómetros y garantía.',
    'Asientos de cuero y climatizador bizona.',
    'Muy económico en consumo y mantenimiento.',
    'Vehículo ideal para viajes largos, muy cómodo.'
]

# Insertar coches, características, tipos, favoritos, imágenes
coche_id = 1
for modelo_id in range(1, len(modelos) + 1):
    for _ in range(coches_por_modelo):
        anio = random.randint(2015, 2024)
        precio = random.randint(10000, 60000)
        descripcion = random.choice(descripciones_posibles).replace("'", "''")
        km = 0 if random.random() < 0.2 else random.randint(10000, 150000)
        ubicacion = fake.city()
        garantia = random.choice([6, 12, 24, 36])
        now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        print(f"INSERT INTO Coche (modelo_id, user_id, anio_fabricacion, precio, descripcion, km, ubicacion, garantia, created_at, updated_at) "
              f"VALUES ({modelo_id}, 1, {anio}, {precio}, '{descripcion}', {km}, '{ubicacion}', {garantia}, '{now}', '{now}');")

        # Características
        motor = random.choice(['1.6L', '2.0L Turbo', '1.8L', '2.5L', '3.0L'])
        puertas = random.choice([3, 4, 5])
        transmision = random.choice(['Manual', 'Automática'])
        combustible = random.choice(['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico'])
        color = fake.color_name()
        traccion = random.choice(['Delantera', 'Trasera', 'Integral'])
        cilindrada = random.choice([1600, 1800, 2000, 2500, 3000])
        potencia = random.randint(100, 300)
        plazas = random.choice([4, 5, 7])
        consumo = round(random.uniform(3.5, 9.5), 2)

        print(f"INSERT INTO Caracteristica (coche_id, motor, puertas, transmision, combustible, color, traccion, cilindrada, potencia, plazas, consumo) "
              f"VALUES ({coche_id}, '{motor}', {puertas}, '{transmision}', '{combustible}', '{color}', '{traccion}', {cilindrada}, {potencia}, {plazas}, {consumo});")

        # Tipos de coche (1 o 2)
        tipos_asignados = random.sample(range(1, MAX_TIPO_ID + 1), random.randint(1, 2))
        for tipo_id in tipos_asignados:
            print(f"INSERT INTO CocheTipo (coche_id, tipo_id) VALUES ({coche_id}, {tipo_id});")

        # Imágenes (3 por coche)
        folder = modelo_id_to_folder.get(modelo_id, 'Unknown')
        for num in ['01', '02', '03']:
            url = f"{BASE_URL_IMG}/{folder}/{num}.jpg"
            print(f"INSERT INTO Imagen (coche_id, url) VALUES ({coche_id}, '{url}');")

        # Favoritos aleatorios
        if random.random() < 0.1:
            fecha = fake.date_time_between(start_date='-1y', end_date='now').strftime('%Y-%m-%d %H:%M:%S')
            print(f"INSERT INTO Favorito (user_id, coche_id, fecha) VALUES (1, {coche_id}, '{fecha}');")

        coche_id += 1
