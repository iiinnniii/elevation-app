# Elevation App

## Bootstrap

This project was created via `npm create vite@latest . -- --template react-ts`

## Version Control

**IMPORTANT:** Only commit Unix-style line endings!!!

During the installation of Git select

> Checkout as-is, commit Unix-style line endings

or configure it later via

```
git config --global core.autocrlf input
```

if Git is already installed.

## Dependencies

There's no need to install these dependencies when you're working within the Dev Container.

If you already have these dependencies installed, you can start using the app without the Dev Container. Otherwise, it is highly recommended to use the Dev Container.

```
$ node --version
v22.12.0

$ npm --version
10.9.0
```

## Initial setup

### Dev Container

### On Windows

If you are using Windows, it's strongly recommended to start the Dev Container within a WSL 2 distro. This avoids performance problems in general and hot reloading issues with cypress when using Dev Containers on Windows.

Do not use `/mnt/...` paths. Instead, place your project somewhere within the `~` directory. Hot reloading will not work correctly if you use `/mnt/...` paths.

Here's an example of how to move your folder into WSL:

```bash
# Create necessary directories
mkdir -p ~/playground/data-science-service-gmbh

# Copy the folder from Windows to WSL
sudo cp -r /mnt/c/Home/playground/data-science-service-gmbh/elevation-app ~/playground/data-science-service-gmbh

# Change ownership of the copied folder to the current user
sudo chown -R $(whoami):$(whoami) ~/playground/data-science-service-gmbh/elevation-app

# Remove the potentially already existing node_modules folder
sudo rm -rf ~/playground/data-science-service-gmbh/elevation-app/node_modules

# Open the project in Visual Studio Code
code ~/playground/data-science-service-gmbh/elevation-app
```

### General

1. Create the following volumes

```
docker volume create gpg_files
docker volume create ca_certificates
```

2. Copy `rootCA.crt` into `\\wsl.localhost\docker-desktop-data\data\docker\volumes\ca_certificates\_data` in order to be able to communicate with Gitlab (for example to perform a `git push`).

3. Import your gpg key into your local `wsl` instance and then copy the `.gnupg` folder from this wsl instance into `\\wsl.localhost\docker-desktop-data\data\docker\volumes\gpg_files\_data`. This is required in order to perform signed commits within the Dev Container, also see `C:\Home\documentation\vscode\dev-container.txt` in regards to what the `gpg_files` volume is for.

## Start via Dev Container (highly recommended)

1. Open Visual Studio Code
2. Start the Dev Container

```
Ctrl + P
> Dev Containers: Rebuild and Reopen in Container
```

## Start via Docker

```
docker build .
docker run -it --rm -p 5173:5173 <id>
npm run dev -- --host
```

## Cypress

Hot loading is only supported in WSL2 on Windows.
