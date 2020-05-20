# on importe d'abord l'image utilisee pour supporter le serveur qui est une image basique pour un serveur web simple
FROM httpd:2.4
# on copie ensuite tous les fichiers situes a l'emplacement du Dockerfile vers l'emplacement des fichiers du serveur apache
COPY . /usr/local/apache2/htdocs/
