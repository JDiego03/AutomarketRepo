import os
import requests

API_KEY = "Nts1SAbnWZMlRHTYyMZyyJDje6Gjtg64k0jthDcIzaiy5SqM9wc4BMuW"  # Sustituye con tu clave real
headers = {'Authorization': API_KEY}
save_folder = 'imagenes_coches'
os.makedirs(save_folder, exist_ok=True)

coches_para_imagen = [
    ("Toyota", "Corolla"),
    ("Ford", "Focus"),
    ("Volkswagen", "Golf"),
    ("Nissan", "Altima"),
    ("BMW", "Serie 3"),
    ("Mercedes-Benz", "Clase C"),
    ("Audi", "A4"),
    ("Honda", "Civic"),
    ("Chevrolet", "Malibu"),
    ("Hyundai", "Elantra"),
    ("Toyota", "Yaris"),
    ("Ford", "F-150"),
    ("Volkswagen", "Tiguan"),
    ("Nissan", "Maxima"),
    ("BMW", "Serie 7"),
]

imagenes_por_modelo = 3  
contador = 1

for marca, modelo in coches_para_imagen:
    query = f"{marca} {modelo}"
    print(f"🔍 Buscando imágenes para: {query}")

    url = f"https://api.pexels.com/v1/search?query={query}&per_page={imagenes_por_modelo}&page=1"
    response = requests.get(url, headers=headers)
    data = response.json()

    carpeta_modelo = os.path.join(save_folder, f"{marca}_{modelo}".replace(" ", "_"))
    os.makedirs(carpeta_modelo, exist_ok=True)

    for photo in data.get('photos', []):
        image_url = photo['src']['large']
        imagen_data = requests.get(image_url).content
        filename = os.path.join(carpeta_modelo, f"{contador:03}.jpg")

        with open(filename, 'wb') as f:
            f.write(imagen_data)

        print(f"✅ Imagen {contador} guardada en: {filename}")
        contador += 1

print("\n📁 Descarga de imágenes finalizada.")
