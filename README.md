```bash
sudo mysql
```

```bash
   >CREATE USER 'app'@'localhost' IDENTIFIED BY 'hashed_password';
```

(Don't forget to change the credentials as needed)

```bash
    >GRANT ALL PRIVILEGES ON database_carniceria.\* TO 'app'@'localhost';
    >FLUSH PRIVILEGES;
```

From the root of the project, copy `env.example` and create a `.env`` file, replace the values with yours.

```bash
npm run build
```

```bash
npm run bd:create
```

to create the database

```bash
npm run bd:seed
```

to add some mockup data

# NOW START WORKING
