# Carpentree Framework

## Installazione

### Docker

#### Inizializzazione

Copiare il file `env-example` dentro la cartella `laradock` e nominarlo `.env`.

Aprire il file `.env`, cercare la seguente riga ed inserire il nome del proprio progetto (deve essere univoco):

``` text
DATA_PATH_HOST=~/.laradock/{nome-del-progetto}/data
```

Analogamente, modificare la seguente riga. Al posto di `laradock` inserire il nome del proprio progetto.

``` text
COMPOSE_PROJECT_NAME=laradock
```

#### Avvio dei container

Avviare i container Docker come spiegato [qui](#markdown-header-avvio-dei-container).

## Docker

L'infrasttruttura Docker è basata su [Laradock](https://laradock.io/).

In questo boilerplate, i file di Docker sono nella directory `laradock`.

### Avvio dei container

Con il seguente comando vengono avviati solamente i container indispensabili per far girare Carpentree.

Dalla cartella `laradock`:

``` bash
$ docker-compose up -d nginx mysql workspace redis
```

Se dovessero servire altri servizi, fare riferimento alla documentazione di [Laradock](https://laradock.io/documentation/) per maggiori informazioni.

### Accesso alla bash

Dalla cartella `laradock`:

``` bash
$ docker-compose exec --user=laradock workspace bash
```

### Stop dei container

Dalla cartella `laradock`:

``` bash
$ docker-compose stop
```
