Commandes � utiliser pour lancer un docker avec le ce serveur web (Linux) :
sudo docker build --tag monserveur .
sudo docker run -d --name monappli -p 80:80 monserveur

La premi�re commande cr��e une image du serveur avec comme nom "monserveur" avec le Dockerfile situ� � cet emplacement.
La seconde commande lance un container d�tach� depuis l'image "monserveur" avec comme nom "monappli" et en forwardant le port 80 du container vers le port 80 de la VM.

On peut ensuite acc�der au site depuis le lien : http://localhost:80