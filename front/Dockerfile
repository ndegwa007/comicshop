# Use Node.js as the base image
FROM node:18

# Set the working directory in the container 
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json /app

RUN npm config set fetch-retry-maxtimeout 600000

# Install dependencies
RUN npm ci

# Copy the rest of your app's source code
COPY . /app


# Build your Astro app
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=4321
# Expose the port Astro will run on
EXPOSE 4321



# Start the Astro app
CMD ["npm", "run", "preview", "--", "--host"]
