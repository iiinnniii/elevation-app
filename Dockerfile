FROM node:22.12.0 AS base
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci
COPY . .
# RUN chown -R node .
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
# Install ncessary packages for cypress headless
RUN sudo apt install -y
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
# Expose the application port
EXPOSE 5173

FROM base AS development
CMD ["/bin/bash"]

FROM base AS build
RUN npm run ci:build

FROM node:22.12.0 AS production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/package-lock.json .
COPY --from=build /usr/src/app/build ./build
RUN npm ci --omit=dev
EXPOSE 5173
RUN chown -R node .
CMD ["node", "./build/index.js"]