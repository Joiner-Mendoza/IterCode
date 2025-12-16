# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

### Frontend
- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
- [React Router DOM](https://reactrouter.com/)
- [SweetAlert2](https://sweetalert2.github.io/)
### Backend
- [Django 5+](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Python 3.11+](https://www.python.org/)

el projecto esta hecho con react + vite(Frontend) y django(backend)
clona el repo git clone https://github.com/Joiner-Mendoza/IterCode.git
para iniciarlo se accede a itercode 
cd itercode
se instalan las dependecias
npm install
luego de que todo este instalado se inicia la app
npm run dev

ahora se accede en una terminal diferente al backend
cd backend
se debe crear un entorno virtual 
python -m venv .env
y luego s eejecuta el entordo
.env\Scripts\activate
dentro del entorno se instala el  requiremen
pip install -r requirements.txt
ademas se debe instalar pillow para  las imagenes
python -m pip install Pillow
y se ejecuta el bakend
python manage.py runserver

la ruta del login se /#/login
