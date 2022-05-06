FROM node:16
RUN apt update -y
RUN apt-get install -y ffmpeg
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && apt install -y ./google-chrome-stable_current_amd64.deb
RUN apt install -y neofetch
# Create the bot's directory
WORKDIR /root/kinny

COPY package.json /root/kinny
RUN yarn install

COPY . /root/kinny
EXPOSE 25685

# Start the bot.
CMD ["node", "shard.js"]