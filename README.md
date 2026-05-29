# Gestor de Eventos y Participantes

Proyecto de Programación Web desarrollado con HTML, CSS y JavaScript.

La aplicación permite administrar eventos, registrar participantes e inscribir usuarios a distintos eventos mediante operaciones CRUD completas utilizando Axios y json-server.

---

## Tecnologías Utilizadas

* HTML5
* CSS3
* JavaScript
* Axios
* json-server

---

## Funcionalidades

### Gestión de Eventos

* Crear eventos
* Editar eventos
* Eliminar eventos
* Visualizar eventos registrados

### Gestión de Participantes

* Registrar participantes
* Editar participantes
* Eliminar participantes
* Visualizar participantes registrados

### Gestión de Inscripciones

* Inscribir participantes en eventos
* Actualizar estado de asistencia
* Cancelar inscripciones
* Visualizar inscripciones por evento

---

## Instalación y Ejecución

### Clonar el repositorio

```bash
git clone https://github.com/SheylaAstorga/Gestor-eventos-participantes.git
```

### Instalar json-server

```bash
npm install -g json-server
```

### Ejecutar el servidor

```bash
json-server --watch db.json --port 3000
```

### Abrir el proyecto

Abrir el archivo `index.html` en el navegador.

---

## API Local

La API Fake se ejecuta en:

```text
http://localhost:3000
```

Endpoints disponibles:

```text
/eventos
/participantes
/inscripciones
```

---

## Integrantes

* Sheyla Astorga
* Facundo Boixados
* Juan David Lobo
* Sebastián Uncos
* Ignacio Valverde

---

## Materia

Programación III

---

## Objetivo del Proyecto

Aplicar conceptos de:

* CRUD
* Manipulación del DOM
* Consumo de APIs
* Axios
* Async/Await
* json-server
* Trabajo colaborativo con GitHub y Trello
