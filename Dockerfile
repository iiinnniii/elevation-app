FROM node:22.12.0 AS base
# Define where pnpm should be installed. The install script below respects this environment variable.
ENV PNPM_HOME="/usr/src/app/.pnpm-store"
# Add pnpm to the PATH
ENV PATH="$PNPM_HOME:$PATH"
# Install pnpm
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
# Use the `which npm` command to find the npm path and disable it 
RUN mv "$(which npm)" "$(which npm)-disabled"
# Install necessary packages for cypress
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
# Install Chrome
RUN apt-get install -y wget
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
# Install Firefox
RUN echo "deb http://deb.debian.org/debian/ unstable main contrib non-free" >> /etc/apt/sources.list.d/debian.list
RUN apt-get update
RUN apt-get install -y --no-install-recommends firefox
# Clean up to reduce image size
RUN rm -rf ./google-chrome-stable_current_amd64.deb
# Set working directory	
WORKDIR /usr/src/app
# Copy package files to install dependencies
COPY ["package.json", "package-lock.json*", "pnpm-lock.yaml", "./"]
# Copy the rest of the application source code
COPY . .
# Expose the application port
EXPOSE 5173

FROM base AS development
# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile
CMD ["/bin/bash"]

FROM base AS dev_container
# It makes no sense to execute `pnpm install` here or in `base`, because symlinks cannot points to different volumes
# https://stackoverflow.com/questions/77099690/how-do-i-make-pnpm-work-as-intended-in-a-vscode-dev-container#answer-78019974
CMD ["/bin/bash"]

FROM base AS build
# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile
# Build
RUN pnpm run build

FROM nginx AS production
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]