FROM node:13.8.0

RUN apt-get update && apt-get install -y --no-install-recommends apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get install apt-transport-https && \
    apt update && apt install -y --no-install-recommends yarn && \
    rm -rf /var/lib/apt/lists/* && \
    yarn global add serve && \
    mkdir /opt/bookings-client

# https://www.aptible.com/documentation/faq/deploy/dockerfile-caching/npm-dockerfile-caching.html
ADD package.json /opt/bookings-client
ADD yarn.lock /opt/bookings-client
WORKDIR /opt/bookings-client
RUN yarn install

ADD . /opt/bookings-client/

RUN yarn build

EXPOSE 5000

CMD serve -s build