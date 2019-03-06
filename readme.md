# Carpentree Framework

**Boilerplate a scopo di sviluppo**

Questo repository è un software minimale per contribuire allo sviluppo di pacchetti Carpentree.

1. [Installazione](#markdown-header-installazione)
2. [Uso](#markdown-header-uso)
3. [Deploy](#markdown-header-deploy)
4. [Docker](#markdown-header-docker)

## Installazione

### Inizializzazione repository

Clonazione del repository boilerplate.

``` bash
$ git clone https://bitbucket.org/codificio/carpentree-boilerplate-dev
```

Per clonare i vari **moduli** di Carpentree, creare la cartella `packages\Carpentree` se ancora non esiste:

``` bash
$ mkdir packages\Carpentree
```

quindi **spostarcisi all'interno**:

``` bash
$ cd packages\Carpentree
```

ed eseguire i comandi:

``` bash
$ git clone https://github.com/codificio/carpentree-core Core
```

``` bash
$ git clone https://github.com/codificio/carpentree-blog Blog
```

> Eseguire questo tipo di comando per ogni modulo di Carpentree.

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

---

## Uso

In generale le modifiche attuate nei moduli, vanno "committate" e "pushate" nei rispettivi repository Github di riferimento.

### Sviluppo Backend

Per lo sviluppo dei moduli si fa affidamento sul pacchetto [Laravel Packager](#https://github.com/Jeroen-G/laravel-packager).
Per inizializzare un nuovo modulo seguire la sua documentazione.

### Sviluppo Frontend

I moduli Carpentree sono nella cartella `packages\Carpentree`.

Per convenzione, tutte le componenti React (e JS, CSS vari) vanno inserite nelle directory `packages\Carpentree\NomeModulo\resources\assets`.

Nel file `resources\js\app.js`, vanno inclusi i vari moduli come di seguito:

``` javascript
require('../../packages/Carpentree/Core/resources/assets/index.js');
```

#### Compilazione

> **ATTENZIONE!** Questo comando si consiglia di eseguirlo nella console della macchina locale per questioni di performace. Se si eseguissero gli script `npm` all'interno del container Docker infatti, la velocità di esecuzione sarebbe gravemente compromessa.

Per il watching de file:

``` bash
$ npm run watch
```

Oppure, per la compilazione secca:

``` bash
$ npm run dev
```

in produzione:

``` bash
$ npm run prod
```

---

## Deploy

Eseguire il `pull` per aggiornare il repository del boilerplate e **per ogni modulo** (dalle rispettive directory in `packages\Carpentree\`):

``` bash
$ git pull
```

Accedere alla bash come spiegato [qui](#markdown-header-accesso-alla-bash) ed eseguire, in ordine:

``` bash
$ composer install
```

``` bash
$ php artisan migrate
```

``` bash
$ php artisan carpentree:refresh-permissions
```

---

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
