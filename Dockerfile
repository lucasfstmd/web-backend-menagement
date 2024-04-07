FROM node:14

# Provide CSDK Files
RUN cd /opt && wget --load-cookies /tmp/cookies.txt "https://docs.google.com/uc?export=download&confirm=$(wget --quiet --save-cookies /tmp/cookies.txt --keep-session-cookies --no-check-certificate 'https://docs.google.com/uc?export=download&id=1NFtER7-IWFP8KnmieVWpS6cmeuLkxJE3' -O- | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1\n/p')&id=1NFtER7-IWFP8KnmieVWpS6cmeuLkxJE3" -O IBM.tar.xz && rm -rf /tmp/cookies.txt

# Prepare env for install CSDK
ENV INFORMIXDIR=/opt/IBM/Informix_Client-SDK
ENV CSDK_HOME=$INFORMIXDIR
ENV LIBPATH=$INFORMIXDIR/lib:$INFORMIXDIR/lib/cli:$INFORMIXDIR/lib/esql:$INFORMIXDIR/lib:$INFORMIXDIR/bin:$INFORMIXDIR/etc:$LIBPATH
ENV ODBCSYSINI=$INFORMIXDIR/etc
ENV ODBCINI=$INFORMIXDIR/etc/odbc.ini
ENV LD_LIBRARY_PATH=$INFORMIXDIR/lib:$INFORMIXDIR/lib/esql:$INFORMIXDIR/lib/tools:$INFORMIXDIR/lib/cli
ENV INFORMIXSQLHOSTS=$INFORMIXDIR/etc/sqlhosts
ENV PATH=$INFORMIXDIR/bin:$PATH

# Install CSDK
RUN cd /opt && tar -xvf IBM.tar.xz

# Create app directory
RUN mkdir -p /usr/src/dc
WORKDIR /usr/src/dc

# Install app dependencies
COPY package.json package-lock.json /usr/src/dc/
RUN npm install

# Copy app source
COPY . /usr/src/dc

# Build app
RUN npm run build

EXPOSE 3000
EXPOSE 3001

CMD ["npm", "start"]