FROM node:22.12.0 AS base

# Set the working directory inside the container
WORKDIR /usr/src/app

# Define where pnpm should be installed. The install script respects this environment variable.
ENV PNPM_HOME=".pnpm-store"

# Add pnpm to the system PATH so it can be used globally
ENV PATH="$PNPM_HOME:$PATH"

# Install pnpm using the official installation script
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

# Disable npm to enforce pnpm usage for package management
RUN mv "$(which npm)" "$(which npm)-disabled"

# Install necessary system packages for Cypress to run
RUN apt-get update && apt-get install -y \
	libgtk2.0-0 \
	libgtk-3-0 \
	libgbm-dev \
	libnotify-dev \
	libnss3 \
	libxss1 \
	libasound2 \
	libxtst6 \
	xauth \
	xvfb

# Install Google Chrome browser for end-to-end testing (Cypress)
RUN apt-get install -y wget
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb

# Install Firefox browser for end-to-end testing (Cypress)
RUN echo "deb http://deb.debian.org/debian/ unstable main contrib non-free" >> /etc/apt/sources.list.d/debian.list
RUN apt-get update
RUN apt-get install -y --no-install-recommends firefox

# Clean up the downloaded Chrome .deb file to reduce the image size
RUN rm -rf ./google-chrome-stable_current_amd64.deb

# Copy package files (package.json, lock files) to the container
COPY ["package.json", "package-lock.json*", "pnpm-lock.yaml", "./"]

# Install project dependencies using pnpm
RUN pnpm install

# Copy the rest of the application source code into the container
COPY . .

# Expose the port that the application will use
EXPOSE 5173

#----------------------------------------------------------------

FROM base AS development

# Set the container to run in an interactive Bash shell
# This is useful for development purposes, allowing developers to interact with the container
CMD ["/bin/bash"]

#----------------------------------------------------------------

FROM base AS build

# Install dependencies specified in the lockfile using pnpm
# The --frozen-lockfile flag ensures exact versions from pnpm-lock.yaml are installed
RUN pnpm install --frozen-lockfile

# Build the application
# This step compiles the application source code into production-ready files
RUN pnpm run build

#----------------------------------------------------------------

FROM nginx AS production

# Copy the custom NGINX configuration file to the container
# This configuration controls how NGINX serves the application
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built application files from the build stage into NGINX's default serving directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 to allow traffic to the NGINX server
EXPOSE 80

# Run NGINX in the foreground to handle incoming requests
CMD ["nginx", "-g", "daemon off;"]