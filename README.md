# Apptonomo-PI
Apptónomo es una aplicación web, por ahora a modo de proyecto de fin de curso, que consiste en realizar trabajos rápidos cerca de tu ubicación para ganar dinero o simplemente solicitar que te hagan alguna tarea a cambio de dinero. (Por ahora servidor en docker, una apirest local y HTML/CSS/JS en una SPA con distintos servicios) 

Al descargar la aplicación debemos correr el comando npm i, para instalar las dependencias necesarias, i correr el comando npm run docker 
donde nos levantará un servidor local con mysql y adminer en el puerto a configurar, establecido en 8080.
Debemos configurar el archivo init.sql para que nos inicie una base de datos especifica, tambien los parametros de el archivo docker-compose.yml,
como username y password, tras esto podras administrar los datos del cliente

Para escuchar las peticiones del cliente debemos levantar apiRest.js con el comando npm run server-up, y poner las credenciales necesarias para la conexion con mysql.

Tras esto tenemos la página funcional, podiendo movernos entre los distintos módulos y opciones que ofrece.
