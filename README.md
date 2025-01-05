# Elevation App

## Project Setup Notes

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

There's no need to install the following dependencies when working within the Dev Container. All you need is Docker Desktop.

If you already have the following dependencies installed, then you can start using the App without the Dev Container. However, it is highly recommended to use the Dev Container for various reasons, such as isolation, cross-platform compatibility, and serving as a source of trust in case of conflicts.

```
$ node --version
v22.12.0

$ npm --version
10.9.0
```

## Prerequisites

### When using Dev Containers

#### All operating systems

The following steps are optional, but necessary if you want to perform GPG-signed commits and enable HTTPS traffic.

1. Create the following Docker named volumes within Docker

```
docker volume create gpg_files
docker volume create ca_certificates
```

2. Copy `rootCA.crt` into the `ca_certificates` Docker volume to enable encrypted communication (HTTPS) with GitLab (e.g., for performing a `git push`). The path to the `ca_certificates` on Windows is `\\wsl.localhost\docker-desktop-data\data\docker\volumes\ca_certificates\_data`.

3. Copy your `gpg` key into your local `WSL 2` instance and import it into `gpg`. Then, copy the `~/.gnupg` folder from this `WSL 2` instance into the `gpg_files` Docker volume. The path to the `gpg_files` on Windows is `\\wsl.localhost\docker-desktop-data\data\docker\volumes\gpg_files\_data`. This is required to perform signed commits within the Dev Container, as there is currently no better bug-free method.

The `postStartCommand` within `.devcontainer/devcontainer.json` handles the remaining setup to ensure everything works smoothly.

Please also review and follow the OS-specific requirements below.

#### Windows

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

## Launch Instructions

### Start via Dev Container (highly recommended)

1. Open Visual Studio Code
2. Start the Dev Container

```
Ctrl + P
> Dev Containers: Rebuild and Reopen in Container
```

### Start via Docker

```
docker build .
docker run -it --rm -p 5173:5173 <id>
npm run dev -- --host
```

## End-to-End (E2E) Tests

### Overview

Cypress is used for end-to-end (E2E) testing.

Please note, hot reloading with Cypress is only supported in WSL2 on Windows. Therefore, it is recommended to use WSL.

### Run E2E Tests locally

#### Running the tests from within the Dev Container against the App running within the Dev Container

Generally this will be the approach you will use most often during development.

1. Open two `bash` terminals within Visual Studio Code wich is running the Dev Container
2. First terminal: `npm run dev -- --host 0.0.0.0`
3. Specify `REMOTE_URL="<network-ip>"` within `.env.e2e-test.local`. For `<network-ip>` use the Network IP address which Vite does show at step 2. For example: `REMOTE_URL="172.17.0.2"`
4. Specify `PORT="5173"` within `.env.e2e-test.local`
5. Second terminal: Run the E2E test via `npm run test` or `npm run cy:open`

#### Running the tests from within the Dev Container against the App running in a Docker container

##### Test against development build

This approach may not be frequently used, but it's important to document it for future reference

1. WSL terminal: `docker build --target development -t elevation-app .`
2. WSL terminal: `docker run -it --rm -p 5173:5173 <image-id>`
3. WSL terminal: Execute `npm run dev -- --host 0.0.0.0` within the Docker Container
4. Specify `REMOTE_URL="<network-ip>"` within `.env.e2e-test.local`. For `<network-ip>` use the Network IP address which Vite does show at step 3. For example: `REMOTE_URL="172.17.0.3"`
5. Specify `PORT="5173"` within `.env.e2e-test.local`
6. Dev Container bash terminal: Run the E2E test via `npm run test` or `npm run cy:open`

##### Test again production build

This can be helpful for debugging why tests are failing in the CI/CD pipeline on the production branch.

1. First WSL terminal: `docker build --target production -t elevation-app .`
2. First WSL terminal: `docker run -it --rm -p 80:80 <image-id>`
3. Second WSL terminal: `docker ps`
4. Second WSL terminal: `docker inspect <container_id_or_name> | grep "IPAddress"`
5. Specify `REMOTE_URL="<network-ip>"` within `.env.e2e-test.local`. For `<network-ip>` use the Network IP address from the last step.
6. Specify `PORT="80"` within `.env.e2e-test.local`
7. Dev Container bash terminal: Run the E2E test via `npm run test` or `npm run cy:open`

#### Running the tests from within one Docker container against the App running in another Docker container, similar to a CI/CD pipeline.

##### Using custom networks

###### Development build

This approach may not be frequently used, but it's important to document it for future reference

1. Open two WSL terminals and `cd` into the root of the project in both terminals.
2. First WSL terminal: `docker network create elevation-app-network`
3. First WSL terminal: `docker build --target development -t elevation-app .`
4. Specify `REMOTE_URL="elevation-app-server"` within `.env.e2e-test.local`
5. Specify `PORT="5173"` within `.env.e2e-test.local`
6. Second WSL terminal: `docker build --target development -t elevation-app-e2e-test .`
7. First WSL terminal: `docker run -t --rm --network=elevation-app-network --name=elevation-app-server <image-id-from-step-2> npm run dev -- --host 0.0.0.0`. Note: In CI/CD this has to be detached, but in development it makes sense to be able to see output.
8. Second WSL terminal: `docker run -t --rm --network=elevation-app-network <image-id-from-step-4> npm run test`

###### Production build

This might be uselful to debug something locally exactly as it happens in CI/CD production branch.

1. Open two WSL terminals and `cd` into the root of the project in both terminals.
2. First WSL terminal: `docker network create elevation-app-network`
3. First WSL terminal: `docker build --target production -t elevation-app .`
4. Specify `REMOTE_URL="elevation-app-server"` within `.env.e2e-test.local`
5. Specify `PORT="80"` within `.env.e2e-test.local`
6. Second WSL terminal: `docker build --target development -t elevation-app-e2e-test .`
7. First WSL terminal: `docker run -t --rm --network=elevation-app-network --name=elevation-app-server <image-id-from-step-2>`. Note: In CI/CD this has to be detached, but in development it makes sense to be able to see output.
8. Second WSL terminal: `docker run -t --rm --network=elevation-app-network <image-id-from-step-4> npm run test`

## Debugging

Use the launch configurations.

## Legal disclaimer

Please note that I do not take any responsibility for any damage caused by executing these instructions or any code provided here. You are solely responsible for any potential damage. By executing anything from here, you agree to these terms.
