# Carta interactiva 💌

Una carta web con un sobre animado que se abre al tocarlo, con corazones y pétalos cayendo. Ideal para compartir por GitHub Pages.

## ¿Cómo usar?

1. Personaliza el mensaje en `index.html` dentro del elemento `.letter__paper`.
2. Personaliza el fondo:
   - Coloca tu imagen en `assets/background.jpg` y asegúrate que el nombre coincida.
   - O cambia la variable CSS `--bg-image` en `styles.css` a la ruta de tu imagen.

## Publicación en GitHub Pages

1. Crea un repositorio en GitHub, por ejemplo: `carta`.
2. Desde tu PC (Windows PowerShell), inicializa Git y sube los archivos:

```powershell
cd e:\carta
git init
git add .
git commit -m "Carta interactiva inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/carta.git
git push -u origin main
```

3. En GitHub, ve a Settings > Pages > Source y elige `Deploy from a branch` y la rama `main` en la carpeta `/ (root)`.
4. Espera a que se publique. La URL será algo como `https://TU_USUARIO.github.io/carta/`.

## Accesibilidad y dispositivos

- Se puede abrir el sobre con teclas Enter o Espacio cuando está enfocado.
- El lienzo de efectos está optimizado para pantallas retina con límite de DPR a 2 para rendimiento.

## Créditos

- Tipografías de Google Fonts.
- Efectos y animaciones implementados con Canvas y CSS puro, sin dependencias.
