# Carpentree Framework

## Getting started

### Ambiente di sviluppo - Docker

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

### Installazione dipendenze

#### NPM

> **ATTENZIONE!** Questo comando si consiglia di eseguirlo nella console della macchina locale per questioni di performace. Se si eseguissero gli script `npm` all'interno del container Docker infatti, la velocità di esecuzione sarebbe gravemente compromessa.

``` bash
$ npm install
```

#### Composer

Accedere alla bash del container come spiegato [qui](#markdown-header-accesso-alla-bash).

``` bash
$ composer install
```

### Inizializzazione Laravel

#### File ENV

Copiare il file `.env.carpentree.example` e rinominarlo in `.env`, quindi modificarne i parametri in base alle necessità.

---

Accedere alla bash del container come spiegato [qui](#markdown-header-accesso-alla-bash).

#### Migrazioni e seeding del database

``` bash
$ php artisan migrate --seed
```

#### Inizializzazione Passport

Passport è la componente che si occupa dell'autenticazione, questo comando inizializza i dati nel database:

``` bash
$ php artisan passport:install
```

#### Inizializzazione permessi

I permessi in Carpentree sono impostati in un file di configurazione, per trasferire le informazione nel database, eseguire:

``` bash
$ php artisan carpentree:refresh-permissions
```

#### Link simbolico allo storage pubblico

``` bash
php artisan storage:link
```

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
